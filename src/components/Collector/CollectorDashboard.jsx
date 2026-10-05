import { useEffect, useState } from "react";
import {
  getCollectorDonations,
  updateCollectorDonationStatus
} from "../../services/donationService";
import "./CollectorDashboard.css";

const CollectorDashboard = () => {
  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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
    setError("");
    setMessage("");
  };

  const handleStatusChange = async (status) => {
    try {
      setError("");
      setMessage("");

      const updatedDonation =
        await updateCollectorDonationStatus(
          selectedDonation.id,
          status
        );

      setDonations(
        donations.map((donation) =>
          donation.id === updatedDonation.id
            ? updatedDonation
            : donation
        )
      );

      setSelectedDonation(updatedDonation);

      setMessage("Donation status updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const closeDonation = () => {
    setSelectedDonation(null);
    setError("");
    setMessage("");
  };

  return (
    <div className="collector-dashboard">

      <div className="collector-dashboard-header">

        <div className="collector-dashboard-heading">

          <h1 className="collector-dashboard-title">
            Collector Dashboard
          </h1>

          <p className="collector-dashboard-subtitle">
            Manage your assigned donation pickups
          </p>

        </div>

      </div>

      {message && (
        <p className="collector-success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="collector-error-message">
          {error}
        </p>
      )}

      {selectedDonation ? (
        <div className="collector-donation-details">

          <div className="collector-donation-header">

            <div className="collector-donation-heading">

              <h2 className="collector-section-title">
                Donation #{selectedDonation.id}
              </h2>

              <p className="collector-donation-status">
                {selectedDonation.status}
              </p>

            </div>

            <button
              className="collector-close-button"
              type="button"
              onClick={closeDonation}
            >
              Close
            </button>

          </div>

          <div className="collector-pickup-information">

            <h3 className="collector-subtitle">
              Pickup Information
            </h3>

            <p className="collector-pickup-detail">
              House: {selectedDonation.pickup_house}
            </p>

            <p className="collector-pickup-detail">
              Road: {selectedDonation.pickup_road}
            </p>

            <p className="collector-pickup-detail">
              Block: {selectedDonation.pickup_block}
            </p>

            <p className="collector-pickup-detail">
              Area: {selectedDonation.pickup_area}
            </p>

            <p className="collector-pickup-detail">
              Preferred Date: {selectedDonation.preferred_pickup_date}
            </p>

            <p className="collector-pickup-detail">
              Preferred Time: {selectedDonation.preferred_pickup_time}
            </p>

          </div>

          {selectedDonation.status === "assigned" && (
            <div className="collector-status-actions">

              <button
                className="collector-action-button"
                type="button"
                onClick={() => handleStatusChange("collected")}
              >
                Mark Collected
              </button>

              <button
                className="collector-failed-button"
                type="button"
                onClick={() => handleStatusChange("failed")}
              >
                Mark Failed
              </button>

            </div>
          )}

        </div>
      ) : (
        <div className="collector-donations-section">

          <h2 className="collector-section-title">
            Assigned Donations
          </h2>

          {donations.length === 0 ? (
            <p className="no-donations-message">
              No assigned donations.
            </p>
          ) : (
            <div className="collector-donations-list">

              {donations.map((donation) => (
                <div
                  className="collector-donation-card"
                  key={donation.id}
                  onClick={() => handleDonationClick(donation)}
                >

                  <div className="collector-donation-information">

                    <h3 className="collector-donation-title">
                      Donation #{donation.id}
                    </h3>

                    <p className="collector-donation-date">
                      {donation.preferred_pickup_date}
                    </p>

                    <p className="collector-donation-area">
                      {donation.pickup_area}
                    </p>

                  </div>

                  <span className="collector-donation-status">
                    {donation.status}
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default CollectorDashboard;