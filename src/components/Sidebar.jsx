import React, { useContext, useEffect, useState } from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Chats from "./Chats";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { currentUser } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => doc.data());
      setUsers(usersData.filter((user) => user.uid !== currentUser.uid));
    };
    fetchUsers();
  }, [currentUser.uid]);

  const handleSelect = async (user) => {
    const combinedId =
      currentUser.uid > user.uid ? currentUser.uid + user.uid : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
        });
        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
        });
      }
    } catch (err) {}

    setSelectedUser(null);
  };

  return (
    <div className="sidebar">
      <Navbar />
      <Search handleSelect={handleSelect} setSelectedUser={setSelectedUser} />
      <Chats selectedUser={selectedUser} />
      <div className="registered-users">
        <h3 style={{ color: "white", textDecoration: "underline", marginTop: "12px" }}>
          Registered Users
        </h3>
        {users.map((user) => (
          <div key={user.uid} className="userChat" onClick={() => handleSelect(user)}>
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span>
                {user?.displayName && user.displayName.charAt(0).toUpperCase() + user.displayName.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
