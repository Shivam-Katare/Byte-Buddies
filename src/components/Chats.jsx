import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";

const Chats = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = async () => {
      const docRef = doc(db, "userChats", currentUser.uid);
      const unsub = onSnapshot(docRef, (doc) => {
        setChats(doc.data());
      });

      return unsub;
    };

    if (currentUser.uid) {
      getChats();
    }
  }, [currentUser.uid]);

  const handleSelect = (user) => {
    dispatch({ type: "CHANGE_USER", payload: user });
  };

  return (
    <div className="chats">
      {Object.entries(chats)
        .sort((a, b) => b[1].date - a[1].date)
        .map(([id, chat]) => (
          <div
            className="userChat"
            key={id}
            onClick={() => handleSelect(chat.userInfo)}
          >
            <img src={chat.userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat.userInfo?.displayName && chat.userInfo.displayName.charAt(0).toUpperCase() + chat.userInfo.displayName.slice(1)}</span>
              <p>
                {chat.lastMessage?.text.trim().length > 20
                  ? chat.lastMessage?.text.trim().substring(0, 20) + "..."
                  : chat.lastMessage?.text.trim()}
              </p>
            </div>
          </div>
        ))}
    </div>
  );
};

export default Chats;
