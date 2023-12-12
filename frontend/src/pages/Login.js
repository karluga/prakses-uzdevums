// Login.js
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.js";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AuthContext); // Use setAuthUser to update the authenticated user state

  const [isFlipped, setIsFlipped] = useState(false);

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerErrors, setRegisterErrors] = useState({});

  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginErrors, setLoginErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/backend/register.php",
        {
          username: registerUsername,
          password: registerPassword,
          email: registerEmail,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.data.register && response.data.register.errors) {
        setRegisterErrors(response.data.register.errors);
      } else {
        // If registration is successful, navigate to the root route
        setAuthUser(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Registration failed:", error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost/backend/login.php",
        {
          username: loginUsername,
          password: loginPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data);

      if (response.data.login && response.data.login.errors) {
        setLoginErrors(response.data.login.errors);
      } else {
        // If login is successful, update the authenticated user state and navigate to the root route
        setAuthUser(response.data);
        navigate("/");
      }
    } catch (error) {
      console.error("Login failed:", error.message);
    }
  };

  return (
    <div>
      <div className={`flip-container ${isFlipped ? "flip" : ""}`}>
        <div className="flipper">
          <form className="back" onSubmit={handleRegister}>
            <h1>Register</h1>
            <label htmlFor="registerUsername" className="required">
              Username:
            </label>
            <input
              id="registerUsername"
              type="text"
              name="registerUsername"
              value={registerUsername}
              onChange={(e) => setRegisterUsername(e.target.value)}
              required
            />
            {registerErrors && registerErrors.username && (
              <div style={{ color: "red" }}>{registerErrors.username}</div>
            )}
            <br />
            <label htmlFor="registerPassword" className="required">
              Password:
            </label>
            <input
              id="registerPassword"
              type="password"
              name="registerPassword"
              value={registerPassword}
              onChange={(e) => setRegisterPassword(e.target.value)}
              required
            />
            {registerErrors && registerErrors.password && (
              <div style={{ color: "red" }}>{registerErrors.password}</div>
            )}
            <br />
            <label htmlFor="registerEmail">E-mail:</label>
            <input
              id="registerEmail"
              type="email"
              name="registerEmail"
              value={registerEmail}
              onChange={(e) => setRegisterEmail(e.target.value)}
            />
            {registerErrors && registerErrors.email && (
              <div style={{ color: "red" }}>{registerErrors.email}</div>
            )}
            <br />
            <button type="submit" onClick={handleRegister}>
              Register
            </button>
            <p className="account">
              Already have an account?
              <a href="#" onClick={() => setIsFlipped(false)}>
                Login
              </a>
            </p>
          </form>

          <form className="front" onSubmit={handleLogin}>
            <h1>Login</h1>
            <label htmlFor="loginUsername">Username or E-mail:</label>
            <input
              id="loginUsername"
              type="text"
              name="loginUsername"
              value={loginUsername}
              onChange={(e) => setLoginUsername(e.target.value)}
              required
            />
            {loginErrors && loginErrors.username && (
              <div style={{ color: "red" }}>{loginErrors.username}</div>
            )}
            <br />
            <label htmlFor="loginPassword">Password:</label>
            <input
              id="loginPassword"
              type="password"
              name="loginPassword"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            {loginErrors && loginErrors.password && (
              <div style={{ color: "red" }}>{loginErrors.password}</div>
            )}
            <br />
            <button type="submit">Login</button>
            <p className="account">
              Don't have an account?
              <a href="#" onClick={() => setIsFlipped(true)}>
                Register
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;