import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";
import addAvatarImg from "../img/addAvatar.png";

const Register = () => {
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageSelected, setImageSelected] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, file);

      const downloadURL = await getDownloadURL(storageRef);

      await updateProfile(userCredential.user, {
        displayName,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        displayName,
        email,
        photoURL: downloadURL,
      });

      await setDoc(doc(db, "userChats", userCredential.user.uid), {});

      navigate("/");
    } catch (err) {
      setErr(err.code.split("/").pop());
      // setErr(true);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelected = (e) => {
    const file = e.target.files[0];
    const fileSize = file.size / 1024;

    if (!["image/jpeg", "image/png"].includes(file.type) || fileSize > 300) {
      alert("Please upload a valid image file (less than 300KB)");
      e.target.value = null;
      return;
    }

    setImageSelected(true);
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <h2 className="app-name">Byte-Buddies</h2>
        <div className="login-box">
          <p>Register</p>
          <form onSubmit={handleSubmit}>
            <div className="user-box">
              <input required name="displayName" type="text" />
              <label>User Name</label>
            </div>
            <div className="user-box">
              <input required name="email" type="email" />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input required name="password" type="password" />
              <label>Password</label>
            </div>
            <input
              style={{ display: "none" }}
              type="file"
              id="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleImageSelected}
            />
            {imageSelected ? (
              <label htmlFor="file" className="add-avatar">
                <span>Avatar added</span>
              </label>
            ) : (
              <label htmlFor="file" className="add-avatar">
                <img src={addAvatarImg} alt="" />
                <span>Add an avatar</span>
              </label>
            )}
            <button disabled={loading} className="signup-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Sign up
            </button>
            {loading && <div style={{ color: "white" }}>Creating...😊 Please wait...</div>}
            {err && <div style={{ color: "white" }}>{err}</div>}
          </form>
          <p>
            You do have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
