import { useContext, useEffect, useState } from 'react';
import { getDonations } from '../../services/donationService';
import { UserContext } from '../../contexts/UserContext';
import { useNavigate } from 'react-router';
import './ClientDashboard.css';

const ClientDashboard = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    getDonations()
      .then((data) => {
        setDonations(data);
      })
      .catch(() => {
        setDonations([]);
      });
  }, []);

  const getStatusText = (status) => {
    const statusTexts = {
      pending: 'Pending',
      assigned: 'Collector Assigned',
      completed: 'Completed',
      failed: 'Pickup Failed',
      cancelled: 'Cancelled'
    };

    return statusTexts[status] || status;
  };

  const filteredDonations = donations.filter(
    (donation) => donation.status === activeTab
  );

  return (
    <div className="client-dashboard">

      <div className="dashboard-welcome">
        <div className="dashboard-welcome-content">

          <h1 className="dashboard-welcome-title">
            Welcome back, {user?.name}
          </h1>

          <p className="dashboard-welcome-text">
            Here you can view and manage your donation requests.
          </p>

        </div>

        <button
          className="new-donation-button"
          type="button"
          onClick={() => navigate('/client/donations/new')}
        >
          + New Donation
        </button>
      </div>

      <div className="client-donations-section">

        <div className="client-donations-header">

          <h2 className="client-dashboard-title">
            My Donations
          </h2>

        </div>

        <div className="donation-tabs">

          <button
            className={`donation-tab ${
              activeTab === 'pending'
                ? 'donation-tab-active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveTab('pending')}
          >
            Pending
          </button>

          <button
            className={`donation-tab ${
              activeTab === 'assigned'
                ? 'donation-tab-active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveTab('assigned')}
          >
            Assigned
          </button>

          <button
            className={`donation-tab ${
              activeTab === 'completed'
                ? 'donation-tab-active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveTab('completed')}
          >
            Collected
          </button>

          <button
            className={`donation-tab ${
              activeTab === 'failed'
                ? 'donation-tab-active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveTab('failed')}
          >
            Failed
          </button>

          <button
            className={`donation-tab ${
              activeTab === 'cancelled'
                ? 'donation-tab-active'
                : ''
            }`}
            type="button"
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled
          </button>

        </div>

        {filteredDonations.length > 0 ? (

          <div className="donations-list">

            {filteredDonations.map((donation) => (

              <div
                className="donation-card"
                key={donation.id}
                onClick={() =>
                  navigate(`/client/donations/${donation.id}`)
                }
              >

                <div className="donation-card-header">

                  <h2 className="donation-card-title">
                    Donation #{donation.id}
                  </h2>

                  <span
                    className={`donation-status donation-status-${donation.status}`}
                  >
                    {getStatusText(donation.status)}
                  </span>

                </div>

                <p className="donation-card-date">
                  Pickup Date: {donation.preferred_pickup_date}
                </p>

                {donation.status === 'failed' &&
                  donation.failed_reason && (
                    <p className="donation-card-reason">
                      Reason: {donation.failed_reason}
                    </p>
                  )}

                <span className="donation-card-link">
                  View Details →
                </span>

              </div>

            ))}

          </div>

        ) : (

          <div className="empty-donations">

            <p className="empty-donations-text">
              No {activeTab} donations.
            </p>

          </div>

        )}

      </div>

    </div>
  );
};

export default ClientDashboard;