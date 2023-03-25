import React, { useContext, useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Search = () => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);
  const { currentUser } = useContext(AuthContext);

  const handleSearch = async () => {
    const q = query(collection(db, "users"), where("displayName", "==", username));

    try {
      const querySnapshot = await getDocs(q);
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    } catch (err) {
      console.error(err);
      setUsers([]);
    }
  };

  const handleKey = (e) => {
    setUsername(e.target.value);
  };

  useEffect(() => {
    if (username) {
      handleSearch();
    } else {
      setUsers([]);
    }
  }, [username]);

  const handleSelect = async (user) => {
    const combinedId = currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        const userChatsUpdate = {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        };
        const currentUserChatsUpdate = {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
        };

        await Promise.all([
          updateDoc(doc(db, "userChats", currentUser.uid), userChatsUpdate),
          updateDoc(doc(db, "userChats", user.uid), currentUserChatsUpdate),
        ]);
      }
    } catch (err) {
      console.error(err);
    }

    setUsers([]);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="Find a user"
          onChange={handleKey}
          value={username}
        />
      </div>
      {users.length === 0 && username.length > 0 && (
        <span>No users found!</span>
      )}
      {users.map((user) => (
        <div
          key={user.uid}
          className="userChat"
          onClick={() => handleSelect(user)}
        >
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Search;
