import React, { useContext, useState } from "react";
import Img from "../img/img.png";
import { AuthContext } from "../context/AuthContext";
import { ChatContext } from "../context/ChatContext";
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const isEnterKeyPressed = (event) => event.type === "keydown" && event.key === "Enter";
  const isTextEmpty = () => !text.trim();
  const isImageSizeTooLarge = () => img && img.size > 200 * 1024;
  const showImageSizeError = () => alert("Size too large. Make it under 200kb");
  const handleImageUpload = async () => {
    const storageRef = ref(storage, uuid());
    const uploadTask = uploadBytesResumable(storageRef, img);
    uploadTask.on((error) => {
      // TODO: Handle error
    }, async () => {
      const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
          img: downloadURL,
        }),
      });
    });
  };
  const handleTextSend = async () => {
    await updateDoc(doc(db, "chats", data.chatId), {
      messages: arrayUnion({
        id: uuid(),
        text,
        senderId: currentUser.uid,
        date: Timestamp.now(),
      }),
    });
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [`${data.chatId}.lastMessage`]: { text },
      [`${data.chatId}.date`]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [`${data.chatId}.lastMessage`]: { text },
      [`${data.chatId}.date`]: serverTimestamp(),
    });
    setText("");
  };
  const handleSend = (event) => {
    if (isEnterKeyPressed(event) || event.type === "click") {
      if (isTextEmpty() && !img) {
        event.preventDefault();
        return;
      }
      if (isImageSizeTooLarge()) {
        showImageSizeError();
        return;
      }
      img ? handleImageUpload() : handleTextSend();
      setImg(null);
    }
  };
  

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type something..."
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyDown={handleSend}
      />

      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          accept="image/*,.gif" // <-- set the accept attribute to "image/*"
          onChange={(e) => setImg(e.target.files[0])}
        />
                {!img ? (
          <label htmlFor="file">
            <img src={Img} alt="" />
          </label>
        ) : (
          <label htmlFor="file">
            ✅ 👉Added
          </label>
        )}
        <button class="btn-shine" onClick={handleSend} disabled={!text && !img}>
          <span>Send</span>
        </button>
      </div>
    </div>
  );
};

export default Input;
