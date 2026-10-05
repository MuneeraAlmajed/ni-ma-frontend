import { useContext, useEffect, useState } from 'react';
import { getDonations } from '../../services/donationService';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate()
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    getDonations()
      .then((data) => {
        setDonations(data);
      })
      .catch(() => {
        setDonations([]);
      });
  }, []);

  return (
    <div className="client-dashboard">
      <div className="dashboard-welcome">
        <h1 className="dashboard-welcome-title">
          Welcome back, {user?.name}
        </h1>

        <p className="dashboard-welcome-text">
          Here you can view and manage your donation requests.
        </p>
      </div>

      <h2 className="client-dashboard-title">My Donations</h2>

      <div className="donations-list">
        {donations.map((donation) => (
          <div className="donation-card" 
          key={donation.id}
          onClick={() => navigate(`/client/donations/${donation.id}`)}
          >
            <h2 className="donation-card-title">
              Donation #{donation.id}
            </h2>

            <p className="donation-card-status">
              Status: {donation.status}
            </p>

            <p className="donation-card-date">
              Pickup Date: {donation.preferred_pickup_date}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientDashboard;