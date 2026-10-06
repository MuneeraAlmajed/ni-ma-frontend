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

  return (
    <nav className="navbar">
      <div className="navbar-container">

        <Link className="navbar-logo" to="/">
          <img
            className="navbar-logo-image"
            src={logo}
            alt="NI'MA logo"
          />
        </Link>

        <div className="navbar-links">

          {user ? (
            <>
              {user.role === "admin" ? (
                <>
                  <Link
                    className="navbar-link"
                    to="/admin/dashboard"
                  >
                    Home
                  </Link>

                  <Link
                    className="navbar-link"
                    to="/admin/collectors"
                  >
                    Collectors
                  </Link>

                  <Link
                    className="navbar-link"
                    to="/admin/donations"
                  >
                    Donations
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    className="navbar-link"
                    to={
                      user.role === "collector"
                        ? "/collector/dashboard"
                        : "/client/dashboard"
                    }
                  >
                    Home
                  </Link>

                  <Link
                    className="navbar-link"
                    to={
                      user.role === "collector"
                        ? "/collector/dashboard"
                        : "/client/dashboard"
                    }
                  >
                    Dashboard
                  </Link>
                </>
              )}

              <Link
                className="navbar-link"
                to="/profile"
              >
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
          ) : (
            <>
              <Link
                className="navbar-link"
                to="/"
              >
                Home
              </Link>

              <Link
                className="navbar-link"
                to="/register"
              >
                Register
              </Link>

              <Link
                className="navbar-login"
                to="/login"
              >
                Login
              </Link>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default NavBar;