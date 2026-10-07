import { useEffect, useState } from "react";

import {
  getCollectorDonations,
  updatePickupResult,
  uploadProofPhoto,
} from "../../services/donationService";

import "./CollectorDashboard.css";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;
const SERVER_URL = BASE_URL.replace("/api", "");

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const CollectorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);

  const [selectedStatus, setSelectedStatus] = useState("");
  const [failedReason, setFailedReason] = useState("");
  const [proofPhoto, setProofPhoto] = useState(null);

  const [showResultForm, setShowResultForm] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const getStatusText = (status) => {
    const statusTexts = {
      assigned: "Assigned",
      collected: "Collected",
      completed: "Completed",
      failed: "Failed",
    };

    return statusTexts[status] || status;
  };

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = async () => {
    try {
      setError("");

      const data = await getCollectorDonations();

      setDonations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDonationClick = (donation) => {
    setSelectedDonation(donation);
    setSelectedStatus(donation.status);
    setFailedReason(donation.failed_reason || "");
    setProofPhoto(null);
    setShowResultForm(false);
    setError("");
    setMessage("");
  };

  const closeDonationDetails = () => {
    setSelectedDonation(null);
    setSelectedStatus("");
    setFailedReason("");
    setProofPhoto(null);
    setShowResultForm(false);
    setError("");
    setMessage("");
  };

  const handleProofPhotoChange = (event) => {
    setProofPhoto(event.target.files[0] || null);
  };

  const handlePickupResult = async (event) => {
    event.preventDefault();

    if (!selectedDonation) {
      return;
    }

    if (selectedStatus === "failed" && !failedReason.trim()) {
      setError("Please provide a reason for the failed pickup.");
      return;
    }

    if (selectedStatus === "collected" && !proofPhoto) {
      setError("Please upload a proof photo for the successful pickup.");
      return;
    }

    setError("");
    setMessage("");

    try {
      const result = await updatePickupResult(selectedDonation.id, {
        pickup_successful: selectedStatus === "collected",
        failed_reason: selectedStatus === "failed" ? failedReason : null,
      });

      let updatedDonation = result;

      if (selectedStatus === "collected") {
        updatedDonation = await uploadProofPhoto(
          selectedDonation.id,
          proofPhoto,
        );
      }

      setDonations(
        donations.map((donation) =>
          donation.id === updatedDonation.id ? updatedDonation : donation,
        ),
      );

      setSelectedDonation(updatedDonation);
      setShowResultForm(false);
      setFailedReason("");
      setProofPhoto(null);

      setMessage(
        selectedStatus === "collected"
          ? "Pickup completed and proof photo uploaded successfully."
          : "Pickup marked as failed.",
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const assignedDonations = donations.filter(
    (donation) => donation.status === "assigned",
  );

  const collectedDonations = donations.filter(
    (donation) => donation.status === "collected",
  );

  const completedDonations = donations.filter(
    (donation) => donation.status === "completed",
  );

  const failedDonations = donations.filter(
    (donation) => donation.status === "failed",
  );

  const renderDonationCard = (donation) => (
    <div
      className="collector-donation-card"
      key={donation.id}
      onClick={() => handleDonationClick(donation)}
      role="button"
      tabIndex="0"
    >
      <div className="collector-donation-information">
        <h3 className="collector-donation-title">Donation #{donation.id}</h3>

        <p className="collector-donation-area">{donation.pickup_area}</p>

        <p className="collector-donation-date">
          {donation.preferred_pickup_date}
        </p>
      </div>

      <div className="collector-donation-card-right">
        <span
          className={`collector-donation-status collector-donation-status-${donation.status}`}
        >
          {getStatusText(donation.status)}
        </span>

        <span className="collector-view-details">View Details</span>
      </div>
    </div>
  );

  return (
    <div className="collector-dashboard">
      <div className="collector-dashboard-header">
        <div className="collector-dashboard-heading">
          <h1 className="collector-dashboard-title">Collector Dashboard</h1>

          <p className="collector-dashboard-subtitle">
            Manage your assigned NI'MA pickup requests
          </p>
        </div>

        <span className="collector-dashboard-count">
          {completedDonations.length + failedDonations.length}
        </span>
      </div>

      {message && <p className="collector-success-message">{message}</p>}

      {error && <p className="collector-error-message">{error}</p>}

      {selectedDonation ? (
        <div className="collector-donation-details-card">
          <div className="collector-details-header">
            <div className="collector-details-heading">
              <h2 className="collector-section-title">
                Donation #{selectedDonation.id}
              </h2>

              <span
                className={`collector-details-status collector-details-status-${selectedDonation.status}`}
              >
                {getStatusText(selectedDonation.status)}
              </span>
            </div>

            <button
              className="collector-close-button"
              type="button"
              onClick={closeDonationDetails}
            >
              Close
            </button>
          </div>

          <div className="collector-pickup-information">
            <h3 className="collector-subtitle">Pickup Information</h3>

            <div className="collector-information-grid">
              <div className="collector-information-item">
                <span className="collector-information-label">House</span>

                <p className="collector-information-value">
                  {selectedDonation.pickup_house}
                </p>
              </div>

              <div className="collector-information-item">
                <span className="collector-information-label">Road</span>

                <p className="collector-information-value">
                  {selectedDonation.pickup_road}
                </p>
              </div>

              <div className="collector-information-item">
                <span className="collector-information-label">Block</span>

                <p className="collector-information-value">
                  {selectedDonation.pickup_block}
                </p>
              </div>

              <div className="collector-information-item">
                <span className="collector-information-label">Area</span>

                <p className="collector-information-value">
                  {selectedDonation.pickup_area}
                </p>
              </div>

              <div className="collector-information-item">
                <span className="collector-information-label">
                  Preferred Date
                </span>

                <p className="collector-information-value">
                  {selectedDonation.preferred_pickup_date}
                </p>
              </div>

              <div className="collector-information-item">
                <span className="collector-information-label">
                  Preferred Time
                </span>

                <p className="collector-information-value">
                  {selectedDonation.preferred_pickup_time}
                </p>
              </div>
            </div>
          </div>

          <div className="collector-client-section">
            <h3 className="collector-subtitle">Client Information</h3>

            <div className="collector-client-info">
              <p>
                <strong>Name:</strong>
                {selectedDonation.client_name}
              </p>

              <p>
                <strong>Phone:</strong>
                {selectedDonation.client_phone}
              </p>
            </div>
          </div>

          <div className="collector-map-section">
            <h3 className="collector-subtitle">Pickup Location</h3>

            <MapContainer
              className="collector-map"
              center={[selectedDonation.latitude, selectedDonation.longitude]}
              zoom={15}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              <Marker
                position={[
                  selectedDonation.latitude,
                  selectedDonation.longitude,
                ]}
                icon={defaultIcon}
              >
                <Popup>
                  <div className="collector-map-popup">
                    <strong>Donation #{selectedDonation.id}</strong>

                    <p>
                      <strong>Area:</strong> {selectedDonation.pickup_area}
                    </p>

                    <p>
                      <strong>House:</strong> {selectedDonation.pickup_house}
                    </p>

                    <p>
                      <strong>Road:</strong> {selectedDonation.pickup_road}
                    </p>

                    <p>
                      <strong>Block:</strong> {selectedDonation.pickup_block}
                    </p>
                  </div>
                </Popup>
              </Marker>
            </MapContainer>
          </div>

          <div className="collector-items-section">
            <h3 className="collector-subtitle">Donation Items</h3>

            {selectedDonation.items && selectedDonation.items.length > 0 ? (
              <div className="collector-items-list">
                {selectedDonation.items.map((item) => (
                  <div className="collector-item-card" key={item.id}>
                    <div className="collector-item-information">
                      <h4 className="collector-item-name">{item.name}</h4>

                      <p className="collector-item-category">
                        Category: {item.category}
                      </p>

                      <p className="collector-item-condition">
                        Condition: {item.condition}
                      </p>

                      <p className="collector-item-description">
                        {item.description}
                      </p>
                    </div>

                    {item.image_url && (
                      <img
                        className="collector-item-image"
                        src={`${SERVER_URL}${item.image_url}`}
                        alt={item.name}
                      />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="collector-no-items">
                No items found for this donation.
              </p>
            )}
          </div>

          {selectedDonation.status === "assigned" && (
            <div className="collector-result-section">
              <h3 className="collector-subtitle">Pickup Result</h3>

              {!showResultForm ? (
                <button
                  className="collector-result-button"
                  type="button"
                  onClick={() => setShowResultForm(true)}
                >
                  Record Pickup Result
                </button>
              ) : (
                <form
                  className="collector-result-form"
                  onSubmit={handlePickupResult}
                >
                  <div className="collector-result-options">
                    <label className="collector-radio-label">
                      <input
                        className="collector-radio-input"
                        type="radio"
                        name="pickup-result"
                        value="collected"
                        checked={selectedStatus === "collected"}
                        onChange={(event) =>
                          setSelectedStatus(event.target.value)
                        }
                      />
                      Pickup Successful
                    </label>

                    <label className="collector-radio-label">
                      <input
                        className="collector-radio-input"
                        type="radio"
                        name="pickup-result"
                        value="failed"
                        checked={selectedStatus === "failed"}
                        onChange={(event) =>
                          setSelectedStatus(event.target.value)
                        }
                      />
                      Pickup Failed
                    </label>
                  </div>

                  {selectedStatus === "collected" && (
                    <div className="collector-proof-required">
                      <p className="collector-proof-required-message">
                        Please upload a photo showing the completed collection.
                      </p>

                      <input
                        className="collector-proof-input"
                        type="file"
                        accept="image/*"
                        onChange={handleProofPhotoChange}
                      />
                    </div>
                  )}

                  {selectedStatus === "failed" && (
                    <textarea
                      className="collector-failed-reason"
                      placeholder="Enter the reason for the failed pickup"
                      value={failedReason}
                      onChange={(event) => setFailedReason(event.target.value)}
                      rows="4"
                    />
                  )}

                  <div className="collector-result-actions">
                    <button
                      className="collector-submit-result-button"
                      type="submit"
                    >
                      Save Result
                    </button>

                    <button
                      className="collector-cancel-result-button"
                      type="button"
                      onClick={() => {
                        setShowResultForm(false);
                        setSelectedStatus(selectedDonation.status);
                        setFailedReason("");
                        setProofPhoto(null);
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {selectedDonation.status === "completed" && (
            <div className="collector-proof-section">
              <h3 className="collector-subtitle">Collection Proof</h3>

              {selectedDonation.proof_photo_url ? (
                <div className="collector-proof-preview">
                  <img
                    className="collector-proof-image"
                    src={`http://localhost:8000/${selectedDonation.proof_photo_url}`}
                    alt="Collection proof"
                  />

                  <p className="collector-proof-message">
                    Collection completed and proof uploaded successfully.
                  </p>
                </div>
              ) : (
                <p className="collector-proof-message">Collection completed.</p>
              )}
            </div>
          )}

          {selectedDonation.status === "failed" &&
            selectedDonation.failed_reason && (
              <div className="collector-failed-section">
                <h3 className="collector-subtitle">Failed Pickup Reason</h3>

                <p className="collector-failed-message">
                  {selectedDonation.failed_reason}
                </p>
              </div>
            )}
        </div>
      ) : (
        <div className="collector-main-content">
          <section className="collector-donations-section">
            <div className="collector-section-header">
              <div>
                <h2 className="collector-section-title">Assigned Pickups</h2>

                <p className="collector-section-description">
                  Pickups currently assigned to you
                </p>
              </div>

              <span className="collector-section-count">
                {assignedDonations.length}
              </span>
            </div>

            {assignedDonations.length === 0 ? (
              <div className="collector-empty-state">
                <p className="collector-empty-message">
                  You currently have no assigned pickups.
                </p>
              </div>
            ) : (
              <div className="collector-donations-list">
                {assignedDonations.map(renderDonationCard)}
              </div>
            )}
          </section>

          <section className="collector-history-section">
            <div className="collector-section-header">
              <div>
                <h2 className="collector-section-title">Pickup History</h2>

                <p className="collector-section-description">
                  Your completed and failed pickups
                </p>
              </div>

              <span className="collector-section-count">
                {completedDonations.length + failedDonations.length}
              </span>
            </div>

            <div className="collector-history-list">
              {completedDonations.map((donation) =>
                renderDonationCard(donation),
              )}

              {failedDonations.map((donation) => renderDonationCard(donation))}
            </div>

            {completedDonations.length === 0 &&
              failedDonations.length === 0 && (
                <div className="collector-empty-state">
                  <p className="collector-empty-message">
                    No pickup history yet.
                  </p>
                </div>
              )}
          </section>
        </div>
      )}
    </div>
  );
};

export default CollectorDashboard;
