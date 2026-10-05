import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../contexts/UserContext";
import {
  currentUser,
  updateProfile,
  updatePassword
} from "../../services/userService";
import "./Profile.css";

const Profile = () => {
  const { user, setUser } = useContext(UserContext);

  const [profileData, setProfileData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    avatar: ""
  });

  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  useEffect(() => {
    currentUser()
      .then((data) => {
        setUser(data);

        setProfileData({
          name: data.name || "",
          username: data.username || "",
          email: data.email || "",
          phone: data.phone || "",
          avatar: data.avatar || ""
        });
      })
      .catch(() => {
        setProfileError("Unable to load profile");
      });
  }, [setUser]);

  const handleProfileChange = (event) => {
    setProfileData({
      ...profileData,
      [event.target.name]: event.target.value
    });
  };

  const handlePasswordChange = (event) => {
    setPasswordData({
      ...passwordData,
      [event.target.name]: event.target.value
    });
  };

  const handleSaveProfile = async () => {
    try {
      setProfileError("");

      const updatedUser = await updateProfile(profileData);

      setUser(updatedUser);

      setProfileData({
        name: updatedUser.name || "",
        username: updatedUser.username || "",
        email: updatedUser.email || "",
        phone: updatedUser.phone || "",
        avatar: updatedUser.avatar || ""
      });

      setIsEditing(false);

      setPopupMessage("Your profile has been updated successfully.");
      setShowPopup(true);
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const handleChangePassword = async () => {
    try {
      setPasswordError("");

      if (
        !passwordData.current_password ||
        !passwordData.new_password
      ) {
        throw new Error("Please complete both password fields");
      }

      const data = await updatePassword(passwordData);

      setPasswordData({
        current_password: "",
        new_password: ""
      });

      setPopupMessage(data.message);
      setShowPopup(true);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setProfileData({
      name: user?.name || "",
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: user?.avatar || ""
    });

    setIsEditing(false);
    setProfileError("");
  };

  return (
    <div className="profile-page">

      <h1 className="profile-title">
        My Profile
      </h1>

      <div className="profile-card">

        <div className="profile-avatar-section">

          <div className="profile-avatar">
            {profileData.avatar || "👤"}
          </div>

          {isEditing && (
            <div className="avatar-options">

              <button
                className="avatar-option"
                type="button"
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    avatar: "👤"
                  })
                }
              >
                👤
              </button>

              <button
                className="avatar-option"
                type="button"
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    avatar: "😊"
                  })
                }
              >
                😊
              </button>

              <button
                className="avatar-option"
                type="button"
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    avatar: "🌸"
                  })
                }
              >
                🌸
              </button>

              <button
                className="avatar-option"
                type="button"
                onClick={() =>
                  setProfileData({
                    ...profileData,
                    avatar: "🌿"
                  })
                }
              >
                🌿
              </button>

            </div>
          )}

        </div>

        <div className="profile-information">

          <h2 className="profile-section-title">
            Personal Information
          </h2>

          <div className="profile-field">
            <span className="profile-field-label">
              Name
            </span>

            {isEditing ? (
              <input
                className="profile-input"
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
              />
            ) : (
              <span className="profile-field-value">
                {user?.name}
              </span>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              Username
            </span>

            {isEditing ? (
              <input
                className="profile-input"
                type="text"
                name="username"
                value={profileData.username}
                onChange={handleProfileChange}
              />
            ) : (
              <span className="profile-field-value">
                {user?.username}
              </span>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              Email
            </span>

            {isEditing ? (
              <input
                className="profile-input"
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
              />
            ) : (
              <span className="profile-field-value">
                {user?.email}
              </span>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              Phone
            </span>

            {isEditing ? (
              <input
                className="profile-input"
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            ) : (
              <span className="profile-field-value">
                {user?.phone}
              </span>
            )}
          </div>

          <div className="profile-field">
            <span className="profile-field-label">
              Role
            </span>

            <span className="profile-role">
              {user?.role}
            </span>
          </div>

          {profileError && (
            <p className="profile-error">
              {profileError}
            </p>
          )}

          <div className="profile-actions">

            {!isEditing ? (
              <button
                className="edit-profile-button"
                type="button"
                onClick={() => {
                  setProfileError("");
                  setIsEditing(true);
                }}
              >
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  className="save-profile-button"
                  type="button"
                  onClick={handleSaveProfile}
                >
                  Save Changes
                </button>

                <button
                  className="cancel-profile-button"
                  type="button"
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            )}

          </div>

        </div>

      </div>

      <div className="password-card">

        <h2 className="profile-section-title">
          Change Password
        </h2>

        <div className="profile-field">

          <label className="profile-field-label">
            Current Password
          </label>

          <input
            className="profile-input"
            type="password"
            name="current_password"
            value={passwordData.current_password}
            onChange={handlePasswordChange}
          />

        </div>

        <div className="profile-field">

          <label className="profile-field-label">
            New Password
          </label>

          <input
            className="profile-input"
            type="password"
            name="new_password"
            value={passwordData.new_password}
            onChange={handlePasswordChange}
          />

        </div>

        {passwordError && (
          <p className="profile-error">
            {passwordError}
          </p>
        )}

        <button
          className="change-password-button"
          type="button"
          onClick={handleChangePassword}
        >
          Change Password
        </button>

      </div>

      {showPopup && (
        <div className="profile-popup-overlay">

          <div className="profile-popup">

            <div className="profile-popup-icon">
              ✓
            </div>

            <h2 className="profile-popup-title">
              Success
            </h2>

            <p className="profile-popup-message">
              {popupMessage}
            </p>

            <button
              className="profile-popup-button"
              type="button"
              onClick={() => setShowPopup(false)}
            >
              Done
            </button>

          </div>

        </div>
      )}

    </div>
  );
};

export default Profile;