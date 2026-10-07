import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  getDonationById,
  getDonationItems,
  updateDonation,
  cancelDonation,
} from "../../services/donationService";
import LocationPicker from "../LocationPicker/LocationPicker";
import "./DonationDetails.css";

const DonationDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donation, setDonation] = useState(null);
  const [items, setItems] = useState([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [editLocation, setEditLocation] = useState(null);
  const [editError, setEditError] = useState("");

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Pending",
      assigned: "Collector Assigned",
      collected: "Collected",
      completed: "Completed",
      failed: "Pickup Failed",
      cancelled: "Cancelled",
    };

    return statusTexts[status] || status;
  };

  const [showCancelPopup, setShowCancelPopup] = useState(false);

  useEffect(() => {
    getDonationById(id)
      .then((data) => {
        setDonation(data);
      })
      .catch(() => {
        setDonation(null);
      });

    getDonationItems(id)
      .then((data) => {
        setItems(data);
      })
      .catch(() => {
        setItems([]);
      });
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      setEditError("");

      if (!editLocation) {
        throw new Error("Please select a pickup location");
      }

      const updatedDonation = await updateDonation(id, {
        ...editData,
        latitude: editLocation.latitude,
        longitude: editLocation.longitude,
      });

      setDonation(updatedDonation);
      setIsEditing(false);
      setEditLocation(null);
    } catch (err) {
      setEditError(err.message);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditError("");
    setEditLocation(null);
  };

  const handleCancelDonation = async () => {
    try {
      setEditError("");

      const cancelledDonation = await cancelDonation(id);

      setDonation(cancelledDonation);
      setShowCancelPopup(false);
    } catch (err) {
      setEditError(err.message);
      setShowCancelPopup(false);
    }
  };

  if (!donation) {
    return (
      <div className="donation-details">
        <p className="donation-details-message">Loading donation...</p>
      </div>
    );
  }

  return (
    <div className="donation-details">
      <button
        className="back-to-dashboard-button"
        type="button"
        onClick={() => navigate("/client/dashboard")}
      >
        ← Back to Dashboard
      </button>

      <div className="donation-details-header">
        <div className="donation-details-heading">
          <h1 className="donation-details-title">Donation #{donation.id}</h1>

          <span
            className={`donation-status donation-status-${donation.status}`}
          >
            {getStatusText(donation.status)}
          </span>
        </div>

        {donation.status === "pending" && !isEditing && (
          <div className="donation-details-actions">
            <button
              className="edit-donation-button"
              type="button"
              onClick={() => {
                setEditData({
                  pickup_house: donation.pickup_house,
                  pickup_road: donation.pickup_road,
                  pickup_block: donation.pickup_block,
                  pickup_area: donation.pickup_area,
                  preferred_pickup_date: donation.preferred_pickup_date,
                  preferred_pickup_time: donation.preferred_pickup_time,
                });

                setEditLocation({
                  latitude: donation.latitude,
                  longitude: donation.longitude,
                });

                setEditError("");
                setIsEditing(true);
              }}
            >
              Update Pickup
            </button>

            <button
              className="cancel-donation-button"
              type="button"
              onClick={() => setShowCancelPopup(true)}
            >
              Cancel Donation
            </button>
          </div>
        )}
      </div>

      {donation.status === "failed" && donation.failed_reason && (
        <div className="donation-failed-section">
          <span className="donation-info-label">Pickup Failed Reason</span>

          <p className="donation-failed-reason">{donation.failed_reason}</p>
        </div>
      )}

      <div className="donation-info">
        <h2 className="donation-section-title">Pickup Information</h2>

        <div className="donation-info-item">
          <span className="donation-info-label">Pickup Date</span>

          {isEditing ? (
            <input
              className="form-input"
              type="date"
              value={editData.preferred_pickup_date || ""}
              onChange={(event) =>
                setEditData({
                  ...editData,
                  preferred_pickup_date: event.target.value,
                })
              }
            />
          ) : (
            <span className="donation-info-value">
              {donation.preferred_pickup_date}
            </span>
          )}
        </div>

        <div className="donation-info-item">
          <span className="donation-info-label">Pickup Time</span>

          {isEditing ? (
            <input
              className="form-input"
              type="time"
              value={editData.preferred_pickup_time || ""}
              onChange={(event) =>
                setEditData({
                  ...editData,
                  preferred_pickup_time: event.target.value,
                })
              }
            />
          ) : (
            <span className="donation-info-value">
              {donation.preferred_pickup_time}
            </span>
          )}
        </div>
      </div>

      <div className="donation-address">
        <h2 className="donation-address-title">Pickup Address</h2>

        {isEditing ? (
          <div className="donation-edit-form">
            <div className="form-group">
              <label className="form-label">House</label>

              <input
                className="form-input"
                type="text"
                value={editData.pickup_house || ""}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    pickup_house: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Road</label>

              <input
                className="form-input"
                type="text"
                value={editData.pickup_road || ""}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    pickup_road: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Block</label>

              <input
                className="form-input"
                type="text"
                value={editData.pickup_block || ""}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    pickup_block: event.target.value,
                  })
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">Area</label>

              <input
                className="form-input"
                type="text"
                value={editData.pickup_area || ""}
                onChange={(event) =>
                  setEditData({
                    ...editData,
                    pickup_area: event.target.value,
                  })
                }
              />
            </div>

            <LocationPicker
              location={editLocation}
              setLocation={setEditLocation}
            />

            {editError && <p className="form-error">{editError}</p>}

            <div className="donation-edit-actions">
              <button
                className="save-donation-button"
                type="button"
                onClick={handleSaveChanges}
              >
                Save Changes
              </button>

              <button
                className="cancel-edit-button"
                type="button"
                onClick={handleCancelEdit}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="donation-address-text">
            House {donation.pickup_house}, Road {donation.pickup_road}, Block{" "}
            {donation.pickup_block}, {donation.pickup_area}
          </p>
        )}
      </div>

      <div className="donation-items">
        <h2 className="donation-items-title">Items</h2>

        {items.map((item) => (
          <div
            className="donation-item"
            key={item.id}
            onClick={() => navigate(`/client/items/${item.id}`)}
          >
            {item.image_url && (
              <img
                className="donation-item-image"
                src={item.image_url}
                alt={item.name}
              />
            )}

            <p className="donation-item-name">{item.name}</p>
          </div>
        ))}
      </div>

      {showCancelPopup && (
        <div className="cancel-popup-overlay">
          <div className="cancel-popup">
            <h2 className="cancel-popup-title">Cancel Donation?</h2>

            <p className="cancel-popup-message">
              Are you sure you want to cancel this donation?
            </p>

            <div className="cancel-popup-actions">
              <button
                className="keep-donation-button"
                type="button"
                onClick={() => setShowCancelPopup(false)}
              >
                Keep Donation
              </button>

              <button
                className="confirm-cancel-button"
                type="button"
                onClick={handleCancelDonation}
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationDetails;
