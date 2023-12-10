import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../AuthContext'; // Import AuthContext

const Login = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useContext(AuthContext); // Use setAuthUser to update the authenticated user state

  const [isFlipped, setIsFlipped] = useState(false);

  const [registerUsername, setRegisterUsername] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerErrors, setRegisterErrors] = useState({});

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginErrors, setLoginErrors] = useState({});

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/backend/register.php', {
        username: registerUsername,
        password: registerPassword,
        email: registerEmail,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);

      if (response.data.register && response.data.register.errors) {
        setRegisterErrors(response.data.register.errors);
      } else {
        // If registration is successful, navigate to the root route
        setAuthUser(response.data);
        navigate('/');
      }
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost/backend/login.php', {
        username: loginUsername,
        password: loginPassword,
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log(response.data);

      if (response.data.login && response.data.login.errors) {
        setLoginErrors(response.data.login.errors);
      } else {
        // If login is successful, update the authenticated user state and navigate to the root route
        // setAuthUser(response.data.user);
        setAuthUser(response.data);
        navigate('/');
      }
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <div>
      {/* Add the flip-container class */}
      <div className={`flip-container ${isFlipped ? 'flip' : ''}`}>

        {/* Add the flipper class */}
        <div className="flipper">
          {/* Back of the card */}
          <form className="back" onSubmit={handleRegister}>
            <h1>Register</h1>
            <label className='required'>
              Username:
            </label>
              <input
                type="text"
                name="registerUsername"
                value={registerUsername}
                onChange={(e) => setRegisterUsername(e.target.value)}
                required
              />
              {registerErrors && registerErrors.username && (
                <div style={{ color: 'red' }}>{registerErrors.username}</div>
              )}
            <br />
            <label className='required'>
              Password:
            </label>
              <input
                type="password"
                name="registerPassword"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                required
              />
              {registerErrors && registerErrors.password && (
                <div style={{ color: 'red' }}>{registerErrors.password}</div>
              )}
            <br />
            <label>
              E-mail:
            </label>
              <input
                type="email"
                name="registerEmail"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
              />
              {registerErrors && registerErrors.email && (
                <div style={{ color: 'red' }}>{registerErrors.email}</div>
              )}
            <br />
            <button type="submit" onClick={handleRegister}>Register</button>
            <div className="account">
              Already have an account?
              <a href="#" onClick={() => setIsFlipped(false)}>Login</a>
            </div>
          </form>

          {/* Front of the card */}
          <form className="front" onSubmit={handleLogin}>
            <h1>Login</h1>
            <label>
              Username:
            </label>
              <input
                type="text"
                name="loginUsername"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                required
              />
              {loginErrors && loginErrors.username && (
                <div style={{ color: 'red' }}>{loginErrors.username}</div>
              )}
            <br />
            <label>
              Password:
            </label>
              <input
                type="password"
                name="loginPassword"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              {loginErrors && loginErrors.password && (
                <div style={{ color: 'red' }}>{loginErrors.password}</div>
              )}
            <br />
            <button type="submit">Login</button>
            <div className="account">
              Don't have an account?
              <a href="#" onClick={() => setIsFlipped(true)}>Register</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;