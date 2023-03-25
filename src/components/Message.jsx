import React, { useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import Linkify from "react-linkify";

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  const isOwner = message.senderId === currentUser.uid;

  return (
    <div ref={ref} className={`message ${isOwner ? "owner" : ""}`}>
      <div className="messageInfo">
        <img
          src={isOwner ? currentUser.photoURL : data.user.photoURL}
          alt=""
        />
      </div>
      <div className="messageContent" id="style-4">
        <Linkify
          properties={{
            target: "_blank",
            style: { color: "blue", fontWeight: "bold" },
          }}
        >
          <p>{message.text}</p>
          {message.img && <img src={message.img} alt="" />}
        </Linkify>
      </div>
    </div>
  );
};

export default Message;
