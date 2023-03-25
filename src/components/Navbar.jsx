import React, { useContext } from 'react';
import { signOut } from "firebase/auth";
import { auth } from '../firebase';
import { AuthContext } from '../context/AuthContext';
import { CiLogout } from "react-icons/ci";

const Navbar = () => {
  const { currentUser } = useContext(AuthContext);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const displayName = currentUser.displayName
    ? currentUser.displayName.charAt(0).toUpperCase() + currentUser.displayName.slice(1)
    : "";

  return (
    <div className="navbar">
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span
          style={{
            fontFamily: "fangsong",
          }}
          className="current-user"
        >
          {displayName}
        </span>
      </div>
      <CiLogout className="logout-icon" onClick={handleSignOut} />
    </div>
  );
};

export default Navbar;
