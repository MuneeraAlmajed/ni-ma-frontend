import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { data, useParams } from "react-router";
import { getDonationById } from "../../services/donationService";
import { getDonationItems } from "../../services/donationService";
import "./DonationDetails.css";

const DonationDetails = () => {
  const { id } = useParams();
  const [donation, setDonation] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

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
        onClick={() => navigate("/client/dashboard")}
      >
        Back to Dashboard
      </button>
      <h1 className="donation-details-title">Donation #{donation.id}</h1>

      <div className="donation-info">
        <div className="donation-info-item">
          <span className="donation-info-label">Status</span>

          <span
            className={`donation-status donation-status-${donation.status}`}
          >
            {donation.status}
          </span>
        </div>

        <div className="donation-info-item">
          <span className="donation-info-label">Pickup Date</span>

          <span className="donation-info-value">
            {donation.preferred_pickup_date}
          </span>
        </div>

        <div className="donation-info-item">
          <span className="donation-info-label">Pickup Time</span>

          <span className="donation-info-value">
            {donation.preferred_pickup_time}
          </span>
        </div>
      </div>

      <div className="donation-address">
        <h2 className="donation-address-title">Pickup Address</h2>

        <p className="donation-address-text">
          House {donation.pickup_house}, Road {donation.pickup_road}, Block{" "}
          {donation.pickup_block}, {donation.pickup_area}
        </p>

        <p className="donation-address-location">{donation.location}</p>
      </div>

      <div className="donation-items">
        <h2 className="donation-items-title">Items</h2>

        {items.map((item) => (
          <div
            className="donation-item"
            key={item.id}
            onClick={() => navigate(`/client/items/${item.id}`)}
          >
            <p className="donation-item-name">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonationDetails;
