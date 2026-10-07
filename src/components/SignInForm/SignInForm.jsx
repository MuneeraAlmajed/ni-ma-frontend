import { useContext, useState } from "react";
import { useNavigate } from "react-router";

import { signIn } from "../../services/authService";
import { UserContext } from "../../contexts/UserContext";

import "./SignInForm.css";

const SignInForm = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const [message, setMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { username, password } = formData;

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
      const signedInUser = await signIn(formData);

      setUser(signedInUser);

      if (signedInUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (signedInUser.role === "collector") {
        navigate("/collector/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (err) {
      setMessage(
        err?.response?.data?.detail ||
        err?.message ||
        "Unable to sign in. Please check your username and password."
      );
    }
  };

  const isFormInvalid = () => {
    return !(username && password);
  };

  return (
    <main className="signin-page">

      <section className="signin-section">

        <div className="signin-branding">

          <div className="signin-branding-content">

            <span className="signin-label">
              WELCOME BACK
            </span>

            <h1 className="signin-title">
              Continue
              <br />
              your journey.
            </h1>

            <p className="signin-description">
              Sign in to your NI’MA account and continue
              sharing useful items with your community.
            </p>

            <div className="signin-message">

              <span className="signin-message-mark">
                “
              </span>

              <p className="signin-message-text">
                Every useful item deserves another chance
                to make a difference.
              </p>

            </div>

          </div>

        </div>

        <div className="signin-form-area">

          <div className="signin-form-card">

            <div className="signin-form-header">

              <span className="signin-form-label">
                SIGN IN
              </span>

              <h2 className="signin-form-title">
                Welcome back
              </h2>

              <p className="signin-form-description">
                Sign in to access your NI’MA account.
              </p>

            </div>

            {message && (
              <p className="signin-error">
                {message}
              </p>
            )}

            <form
              className="signin-form"
              autoComplete="off"
              onSubmit={handleSubmit}
            >

              <div className="signin-field">

                <label
                  className="signin-label-text"
                  htmlFor="username"
                >
                  Username
                </label>

                <input
                  className="signin-input"
                  type="text"
                  autoComplete="off"
                  id="username"
                  value={username}
                  name="username"
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                />

              </div>

              <div className="signin-field">

                <label
                  className="signin-label-text"
                  htmlFor="password"
                >
                  Password
                </label>

                <input
                  className="signin-input"
                  type="password"
                  autoComplete="off"
                  id="password"
                  value={password}
                  name="password"
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />

              </div>

              <button
                className="signin-submit-button"
                type="submit"
                disabled={isFormInvalid()}
              >
                Sign In

                <span className="signin-button-arrow">
                  →
                </span>

              </button>

            </form>

            <div className="signin-footer">

              <span className="signin-footer-text">
                Don't have an account?
              </span>

              <button
                className="signin-signup-link"
                type="button"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>

            </div>

            <button
              className="signin-cancel-button"
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

export default SignInForm;