const express = require('express');
const asyncHandler = require('express-async-handler');
const { User, Track, Comment } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const validateTrack = require('../../validations/validateTrack');
const validateTrackPUT = require('../../validations/validateTrackPUT');
const getObjectKey = require('../../utils/getObjectKey');
const {
  singleMulterUpload,
  singlePublicFileUpload,
  singlePublicFileDelete,
  multerFieldsUpload,
  multiplePublicFileUpload,
} = require('../../awsS3');

const router = express.Router();

const trackNotFoundError = () => {
  const trackError = new Error('Track not found.');
  trackError.status = 404;
  trackError.title = 'Track not found.';
  trackError.errors = {
    trackId: `The requested track could not be found.`,
  };

  return trackError;
};

const dataLimitError = () => {
  const error = new Error('You have reached your data limit.');
  error.status = 400;
  error.title = 'Data Limit Error';
  error.errors = { trackFile: `${dataLimitError.message}` };

  return error;
};

router.get(
  '/:trackId(\\d+)',
  asyncHandler(async (req, res, next) => {
    const trackId = +req.params.trackId;
    const track = await Track.fetchSingleTrackWithUser(trackId);

    if (!track) {
      return next(trackNotFoundError());
    }

    return res.json({
      track,
    });
  })
);

// for /stream
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const tracks = await Track.fetchTracks();
    return res.json({ tracks });
  })
);

router.post(
  '/',
  requireAuth,
  multerFieldsUpload(),
  validateTrack,
  asyncHandler(async (req, res, next) => {
    // req.files = {
    //   trackFile: [
    //     {
    //       fieldname: 'trackFile',
    //       originalName: '...',
    //       mimetype: '...',
    //       buffer: <Buffer ...>,
    //       size: 1231421412,
    //     },
    //   ],
    //   imageFile: [
    //     {
    //       fieldName: 'imageFile',
    //       ...
    //     }
    //   ]
    // }

    const { user, body, files } = req;

    const trackFile = files.trackFile[0];

    const isImageUpload = 'imageFile' in files;
    const imageSize = isImageUpload ? files.imageFile[0].size : 0;
    const uploadSize = trackFile.size + imageSize;

    // Check if upload will push user over data limit of 50mb;
    if (user.dataSpent + uploadSize >= 52428800) {
      return next(dataLimitError());
    }

    /**
     * Image isn't a required field, so we'll upload the track,
     * and then create a new track with artworkUrl set to
     * user.profilePictureUrl
     */

    if (!isImageUpload) {
      const trackUrl = await singlePublicFileUpload(trackFile);
      console.log('test@@@@@@', trackUrl);
      const track = await Track.create({
        ...body,
        trackUrl,
        artworkUrl: user.profilePictureUrl,
      });
      await user.setDataSpent(uploadSize, 'post');
      return res.json({ track });
    }

    const imageFile = files.imageFile[0];
    const [trackUrl, artworkUrl] = await multiplePublicFileUpload([
      trackFile,
      imageFile,
    ]);

    const track = await Track.create({
      ...body,
      trackUrl,
      artworkUrl
    });

    await user.setDataSpent(uploadSize, 'post');

    return res.json({ track });
  })
);

router.put(
  '/:trackId(\\d+)',
  requireAuth,
  validateTrackPUT,
  asyncHandler(async (req, res, next) => {
    const trackId = +req.params.trackId;
    const track = await Track.getTrackById(trackId);

    if (track) {
      const pairs = Object.entries(req.body);
      pairs.forEach(([key, value]) => track.set(key, value));
      await track.save();
      const updatedTrack = await Track.fetchSingleTrackWithUser(track.id);
      res.status(200).json({ updatedTrack });
    } else {
      res
        .status(404)
        .json({ message: 'The requested track could not be found.' });
    }
  })
);

router.delete(
  '/:trackId(\\d+)',
  requireAuth,
  asyncHandler(async (req, res) => {
    const trackId = +req.params.trackId;
    const track = await Track.getTrackById(trackId);

    if (track) {
      const key = getObjectKey(track.trackUrl);
      const userId = +req.body.userId;
      const currentUser = await User.getCurrentUserById(userId);
      await singlePublicFileDelete(key);
      await currentUser.setDataSpent(track.fileSize, 'delete');
      await track.destroy();
      res.status(204).json({ message: 'You have deleted your track.' });
    } else {
      res.status(404).json({ message: 'Track does not exist.' });
    }
  })
);

router.get(
  '/:trackId(\\d+)/comments',
  asyncHandler(async (req, res, next) => {
    const trackId = +req.params.trackId;
    const track = await Track.findOne({
      where: { id: trackId },
      include: {
        model: Comment,
        as: 'comments',
        // include: {
        //   model: User,
        //   as: 'user',
        // },
      },
    });

    if (!track) {
      return next(trackNotFoundError());
    }

    const { comments } = track;

    return res.json({
      comments,
    });
  })
);

module.exports = router;
