import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "../context/ChatContext";
import { db } from "../firebase";
import Message from "./Message";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "chats", data.chatId), (docSnapshot) => {
      if (docSnapshot.exists()) {
        const messages = docSnapshot.data().messages;
        setMessages(messages);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [data.chatId]);

  return (
    <div className="messages" id="style-4">
      {messages.length === 0 ? (
        <p className="no-message">
          No messages are available. Once you send a message, it will appear here.
        </p>
      ) : (
        messages.map((message) => (
          <Message key={message.id} message={message} />
        ))
      )}
    </div>
  );
};

export default Messages;
