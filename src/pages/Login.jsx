import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import "./Register.css";

const Login = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignIn = async (event) => {
    event.preventDefault();
    const email = event.target[0].value;
    const password = event.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (error) {
      setError(error.code.split("/").pop());
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <h2 className="app-name">Byte-Buddies</h2>
        <div className="login-box">
          <p>Login</p>
          <form onSubmit={handleSignIn}>
            <div className="user-box">
              <input required name="email" type="email" />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input required name="password" type="password" />
              <label>Password</label>
            </div>
            <button className="signup-button">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              Log in
            </button>
            {error && <span>{error}</span>}
          </form>
          <p>
            You don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
