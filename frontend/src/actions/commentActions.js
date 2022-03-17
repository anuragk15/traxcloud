import { csrfFetch } from '../store/csrf';

/* ----- ACTION TYPES ----- */
export const COMMENTS_LOADED = 'comments/commentsLoaded';
export const COMMENT_ADDED = 'comments/commentAdded';
export const COMMENT_UPDATED = 'comments/commentUpdated';
export const COMMENT_REMOVED = 'comments/commentRemoved';

/* ----- ACTIONS ----- */
const loadComments = (comments, trackId) => ({
  type: COMMENTS_LOADED,
  comments,
  trackId,
});

const addComment = (comment) => ({
  type: COMMENT_ADDED,
  comment,
});

const updateComment = (comment) => ({
  type: COMMENT_UPDATED,
  comment,
});

const removeComment = (commentId, trackId) => ({
  type: COMMENT_REMOVED,
  commentId,
  trackId,
});

/* ----- THUNKS ----- */
export const fetchComments = () => async (dispatch) => {
  const response = await csrfFetch('/api/comments');
  const { comments } = await response.json();
  dispatch(loadComments(comments));

  return comments;
};

export const fetchCommentsByTrackId = (trackId) => async (dispatch) => {
  const response = await csrfFetch(`/api/tracks/${trackId}/comments`);
  const { comments } = await response.json();
  dispatch(loadComments(comments, trackId));

  return comments;
};

export const postComment = (formData) => async (dispatch) => {
  const response = await csrfFetch(`/api/comments`, {
    method: 'POST',
    body: JSON.stringify(formData),
  });
  const { comment } = await response.json();
  dispatch(addComment(comment));

  return comment;
};

export const editComment = (comment) => async (dispatch) => {
  const response = await csrfFetch(`/api/comments/${comment.id}`, {
    method: 'PUT',
    body: JSON.stringify(comment),
  });
  const data = await response.json();
  dispatch(updateComment(data.comment));

  return data.comment;
};

export const deleteComment = (commentId, trackId) => async (dispatch) => {
  const response = await csrfFetch(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
  dispatch(removeComment(commentId, trackId));
  return response;
};
