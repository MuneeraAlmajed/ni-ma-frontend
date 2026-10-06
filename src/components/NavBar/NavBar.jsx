import { useContext } from "react";
import { Link } from "react-router";
import { UserContext } from "../../contexts/UserContext";
import { removeToken } from "../../lib/helpers/jwt-helpers";

import "./NavBar.css";
import logo from "../../../assets/NI'MA LOGO.png";

const NavBar = () => {
  const { user, setUser } = useContext(UserContext);

  const handleSignOut = () => {
    removeToken();
    setUser(null);
  };

  const handleSectionClick = (sectionId) => {
    if (window.location.pathname !== "/") {
      window.location.href = `/#${sectionId}`;
      return;
    }

    const section = document.getElementById(sectionId);

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link className="navbar-logo" to="/">
          <img className="navbar-logo-image" src={logo} alt="NI'MA logo" />
        </Link>

        <div className="navbar-links">
          {!user ? (
            <>
              <button
                className="navbar-section-link"
                type="button"
                onClick={() => handleSectionClick("who-we-are")}
              >
                Who We Are
              </button>

              <button
                className="navbar-section-link"
                type="button"
                onClick={() => handleSectionClick("our-story")}
              >
                Our Story
              </button>

              <button
                className="navbar-section-link"
                type="button"
                onClick={() => handleSectionClick("how-it-works")}
              >
                How It Works
              </button>

              <button
              className="navbar-section-link"
              type='button'
              onClick={() => handleSectionClick('donate')}
              >
                Donate
              </button>

              <Link className="navbar-login" to="/login">
                Login
              </Link>
            </>
          ) : (
            <>
              <Link
                className="navbar-link"
                to={
                  user.role === "admin"
                    ? "/admin/dashboard"
                    : user.role === "collector"
                      ? "/collector/dashboard"
                      : "/client/dashboard"
                }
              >
                Dashboard
              </Link>

              {user.role === "admin" && (
                <>
                  <Link className="navbar-link" to="/admin/collectors">
                    Collectors
                  </Link>

                  <Link className="navbar-link" to="/admin/donations">
                    Donations
                  </Link>
                </>
              )}

              <Link className="navbar-link" to="/profile">
                Profile
              </Link>

              <button
                className="navbar-signout"
                type="button"
                onClick={handleSignOut}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
