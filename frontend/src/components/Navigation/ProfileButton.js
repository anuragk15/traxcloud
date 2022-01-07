import { useEffect, useState } from 'react';
import DropdownMenu from './DropdownMenu';
import './ProfileButton.css';

const ProfileButton = ({ user }) => {
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    if (!showMenu) return;
    const closeMenu = () => setShowMenu(false);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const toggleMenu = () => setShowMenu(!showMenu);
  // const openMenu = () => (showMenu ? null : setShowMenu(true));

  return (
    <>
      <div className="profile-button" onClick={toggleMenu}>
        <i className="fas fa-user-circle"></i>
      </div>
      {showMenu && <DropdownMenu user={user} />}
    </>
  );
};

export default ProfileButton;
