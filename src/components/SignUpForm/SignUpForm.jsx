import { useContext, useState } from "react";
import { useNavigate } from "react-router";

import * as authService from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

import "./SignUpForm.css";


const SignUpForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    passwordConf: "",
  });

  const { name, username, email, phone, password, passwordConf } = formData;

  const handleChange = (evt) => {
    setMessage("");

    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value,
    });
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();

    try {
      const payload = {
        name,
        username,
        email,
        phone,
        password,
      };

      const user = await authService.signUp(payload);

      setUser(user);
      navigate("/client/dashboard");
    } catch (error) {
      setMessage(
        error?.response?.data?.detail ||
          "Something went wrong. Please try again.",
      );
    }
  };

  const isFormInvalid = () => {
    return !(
      name &&
      username &&
      email &&
      phone &&
      password &&
      password === passwordConf
    );
  };

  return (
    <main className="signup-page">
      <section className="signup-section">
        <div className="signup-branding">
          <div className="signup-branding-content">
            <span className="signup-label">JOIN NI’MA</span>

            <h1 className="signup-title">
              Give something
              <br />a second life.
            </h1>

            <p className="signup-description">
              Create your NI’MA account and start sharing useful items with
              people who can give them another purpose.
            </p>

            <div className="signup-message">
              <span className="signup-message-mark">“</span>

              <p className="signup-message-text">
                What is no longer useful to you may still have value for someone
                else.
              </p>
            </div>
          </div>
        </div>

        <div className="signup-form-area">
          <div className="signup-form-card">
            <div className="signup-form-header">
              <span className="signup-form-label">CREATE ACCOUNT</span>

              <h2 className="signup-form-title">Welcome to NI’MA</h2>

              <p className="signup-form-description">
                Create your account to start sharing.
              </p>
            </div>

            {message && <p className="signup-error">{message}</p>}

            <form className="signup-form" onSubmit={handleSubmit}>
              <div className="signup-field">
                <label className="signup-label-text" htmlFor="name">
                  Full Name
                </label>

                <input
                  className="signup-input"
                  type="text"
                  id="name"
                  value={name}
                  name="name"
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  required
                />

                <label className="signup-label-text" htmlFor="phone">
                  Phone
                </label>

                <input
                  className="signup-input"
                  type="tel"
                  id="phone"
                  value={phone}
                  name="phone"
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  required
                />

                <label className="signup-label-text" htmlFor="username">
                  Username
                </label>

                <input
                  className="signup-input"
                  type="text"
                  id="username"
                  value={username}
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />
              </div>

              <div className="signup-field">
                <label className="signup-label-text" htmlFor="email">
                  Email
                </label>

                <input
                  className="signup-input"
                  type="email"
                  id="email"
                  value={email}
                  name="email"
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="signup-field">
                <label className="signup-label-text" htmlFor="password">
                  Password
                </label>

                <input
                  className="signup-input"
                  type="password"
                  id="password"
                  value={password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Create a password"
                  required
                />
              </div>

              <div className="signup-field">
                <label className="signup-label-text" htmlFor="confirm">
                  Confirm Password
                </label>

                <input
                  className="signup-input"
                  type="password"
                  id="confirm"
                  value={passwordConf}
                  name="passwordConf"
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  required
                />

                {password && passwordConf && password !== passwordConf && (
                  <span className="signup-password-error">
                    Passwords do not match.
                  </span>
                )}
              </div>

              <button
                className="signup-submit-button"
                type="submit"
                disabled={isFormInvalid()}
              >
                Create Account
                <span className="signup-button-arrow">→</span>
              </button>
            </form>

            <div className="signup-footer">
              <span className="signup-footer-text">
                Already have an account?
              </span>

              <button
                className="signup-login-link"
                type="button"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>

            <button
              className="signup-cancel-button"
              type="button"
              onClick={() => navigate("/")}
            >
              Back to NI’MA
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default SignUpForm;
