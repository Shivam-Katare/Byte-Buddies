import React, { useContext } from "react";
import Messages from "./Messages";
import Input from "./Input";
import { ChatContext } from "../context/ChatContext";
import { FaGithub } from "react-icons/fa";

const Chat = () => {
  const { data } = useContext(ChatContext);

  const displayName = data.user?.displayName
    ? data.user.displayName.charAt(0).toUpperCase() + data.user.displayName.slice(1)
    : "";

  return (
    <div className="chat" id="style-4">
      <div className="chatInfo">
        <span style={{ color: "black" }}>{displayName}</span>
        <a href="https://github.com/Shivam-Katare/Byte-Buddies" target="_blank" rel="noopener noreferrer" style={{ color: "black" }}>
          <FaGithub />
        </a>
      </div>
      <Messages />
      <Input />
    </div>
  );
};

export default Chat;
