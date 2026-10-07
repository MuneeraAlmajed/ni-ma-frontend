import { useEffect, useState } from "react";
import { useLocation } from "react-router";

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}`;
const SERVER_URL = BASE_URL.replace("/api", "");

import {
  getCollectors,
  createCollector,
  updateCollector,
  updateCollectorStatus,
} from "../../services/userService";

import {
  getAdminDonations,
  assignCollector,
  deleteAdminDonation,
} from "../../services/donationService";

import "./AdminDashboard.css";

const AdminDashboard = () => {
  const location = useLocation();

  const isCollectorsPage = location.pathname === "/admin/collectors";
  const isDonationsPage = location.pathname === "/admin/donations";

  const [collectors, setCollectors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [donations, setDonations] = useState([]);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [selectedCollectorId, setSelectedCollectorId] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  const [showItemsPopup, setShowItemsPopup] = useState(false);

  const [activeDonationTab, setActiveDonationTab] = useState("pending");

  const [selectedItemImage, setSelectedItemImage] = useState(null);

  const [collectorData, setCollectorData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: "",
  });

  const [editData, setEditData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCollectors();
    loadDonations();
  }, []);

  const loadCollectors = async () => {
    try {
      setError("");

      const data = await getCollectors();

      setCollectors(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const loadDonations = async () => {
    try {
      setError("");

      const data = await getAdminDonations();

      setDonations(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (event) => {
    setCollectorData({
      ...collectorData,
      [event.target.name]: event.target.value,
    });
  };

  const handleEditChange = (event) => {
    setEditData({
      ...editData,
      [event.target.name]: event.target.value,
    });
  };

  const handleAddCollector = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      const data = await createCollector(collectorData);

      setCollectors([...collectors, data]);

      setCollectorData({
        name: "",
        username: "",
        email: "",
        phone: "",
        password: "",
      });

      setShowAddForm(false);
      setMessage("Collector added successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCollectorClick = (collector) => {
    setSelectedCollector(collector);

    setEditData({
      name: collector.name || "",
      username: collector.username || "",
      email: collector.email || "",
      phone: collector.phone || "",
    });

    setShowEditForm(false);
    setSelectedDonation(null);
    setShowDeletePopup(false);
    setError("");
    setMessage("");
  };

  const handleUpdateCollector = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    try {
      const updatedCollector = await updateCollector(
        selectedCollector.id,
        editData,
      );

      setCollectors(
        collectors.map((collector) =>
          collector.id === updatedCollector.id ? updatedCollector : collector,
        ),
      );

      setSelectedCollector(updatedCollector);
      setShowEditForm(false);

      setMessage("Collector information updated successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = () => {
    setShowStatusPopup(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedCollector) {
      return;
    }

    const newStatus = !selectedCollector.is_active;

    setError("");
    setMessage("");
    setShowStatusPopup(false);

    try {
      const updatedCollector = await updateCollectorStatus(
        selectedCollector.id,
        newStatus,
      );

      setCollectors(
        collectors.map((collector) =>
          collector.id === updatedCollector.id ? updatedCollector : collector,
        ),
      );

      setSelectedCollector(updatedCollector);

      setMessage(
        newStatus
          ? "Collector activated successfully."
          : "Collector made inactive successfully.",
      );
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDonationClick = (donation) => {
    setSelectedDonation(donation);
    setSelectedCollector(null);
    setSelectedCollectorId("");
    setShowDeletePopup(false);
    setError("");
    setMessage("");
  };

  const handleAssignCollector = async () => {
  if (!selectedDonation || !selectedCollectorId) {
    setError("Please select a collector.");
    return;
  }

  if (
    selectedDonation.status === "cancelled" ||
    selectedDonation.status === "failed"
  ) {
    setError("Cannot assign a collector to this donation.");
    return;
  }

  setError("");
  setMessage("");

  try {
    const updatedDonation = await assignCollector(
      selectedDonation.id,
      selectedCollectorId,
    );

    const donationWithItems = {
      ...updatedDonation,
      items: selectedDonation.items,
    };

    setDonations(
      donations.map((donation) =>
        donation.id === updatedDonation.id
          ? donationWithItems
          : donation,
      ),
    );

    setSelectedDonation(donationWithItems);
    setSelectedCollectorId("");

    setMessage("Collector assigned successfully.");
  } catch (err) {
    setError(err.message);
  }
};

  const handleDeleteDonation = async () => {
    if (!selectedDonation) {
      return;
    }

    setError("");
    setMessage("");

    try {
      await deleteAdminDonation(selectedDonation.id);

      setDonations(
        donations.filter((donation) => donation.id !== selectedDonation.id),
      );

      setSelectedDonation(null);
      setShowDeletePopup(false);

      setMessage("Donation deleted successfully.");
    } catch (err) {
      setShowDeletePopup(false);
      setError(err.message);
    }
  };

  const closeCollectorDetails = () => {
    setSelectedCollector(null);
    setShowEditForm(false);
    setShowStatusPopup(false);
    setError("");
    setMessage("");
  };

  const closeDonationDetails = () => {
    setSelectedDonation(null);
    setSelectedCollectorId("");
    setShowDeletePopup(false);
    setError("");
    setMessage("");
  };

  const pendingDonations = donations.filter(
    (donation) => donation.status === "pending",
  );

  const assignedDonations = donations.filter(
    (donation) => donation.status === "assigned",
  );

  const collectedDonations = donations.filter(
    (donation) => donation.status === "collected",
  );

  const failedDonations = donations.filter(
    (donation) => donation.status === "failed",
  );

  const cancelledDonations = donations.filter(
    (donation) => donation.status === "cancelled",
  );

  const donationTabs = [
    {
      name: "pending",
      label: "Pending",
      count: pendingDonations.length,
    },
    {
      name: "assigned",
      label: "Assigned",
      count: assignedDonations.length,
    },
    {
      name: "collected",
      label: "Collected",
      count: collectedDonations.length,
    },
    {
      name: "failed",
      label: "Failed",
      count: failedDonations.length,
    },
    {
      name: "cancelled",
      label: "Cancelled",
      count: cancelledDonations.length,
    },
  ];

  const getActiveDonations = () => {
    if (activeDonationTab === "pending") {
      return pendingDonations;
    }

    if (activeDonationTab === "assigned") {
      return assignedDonations;
    }

    if (activeDonationTab === "collected") {
      return collectedDonations;
    }

    if (activeDonationTab === "failed") {
      return failedDonations;
    }

    return cancelledDonations;
  };

  const activeDonations = getActiveDonations();

  const renderDonationCard = (donation) => (
    <div
      className="admin-donation-card"
      key={donation.id}
      onClick={() => handleDonationClick(donation)}
    >
      <div className="admin-donation-card-information">
        <h3 className="admin-donation-title">Donation #{donation.id}</h3>

        <p className="admin-donation-area">{donation.pickup_area}</p>

        <p className="admin-donation-date">
          Preferred pickup: {donation.preferred_pickup_date}
        </p>
      </div>

      <div className="admin-donation-card-right">
        <span className="admin-donation-status">{donation.status}</span>

        <span className="admin-view-donation">View Details</span>
      </div>
    </div>
  );

  return (
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <div className="admin-dashboard-heading">
          <h1 className="admin-dashboard-title">
            {isCollectorsPage
              ? "Collectors"
              : isDonationsPage
                ? "Donations"
                : "Admin Dashboard"}
          </h1>

          <p className="admin-dashboard-subtitle">
            {isCollectorsPage
              ? "Manage your NI'MA collection team"
              : isDonationsPage
                ? "Review and manage donation requests"
                : "Manage NI'MA collectors and donation requests"}
          </p>
        </div>

        {(isCollectorsPage || !isDonationsPage) && (
          <button
            className="add-collector-button"
            type="button"
            onClick={() => {
              setShowAddForm(!showAddForm);
              setSelectedCollector(null);
              setSelectedDonation(null);
              setShowDeletePopup(false);
              setError("");
              setMessage("");
            }}
          >
            {showAddForm ? "Close" : "Add Collector"}
          </button>
        )}
      </div>

      {message && <p className="admin-success-message">{message}</p>}

      {error && <p className="admin-error-message">{error}</p>}

      {showAddForm && (
        <div className="add-collector-card">
          <h2 className="admin-section-title">Add New Collector</h2>

          <form className="add-collector-form" onSubmit={handleAddCollector}>
            <div className="admin-form-group">
              <label className="admin-form-label">Name</label>

              <input
                className="admin-form-input"
                type="text"
                name="name"
                value={collectorData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Username</label>

              <input
                className="admin-form-input"
                type="text"
                name="username"
                value={collectorData.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Email</label>

              <input
                className="admin-form-input"
                type="email"
                name="email"
                value={collectorData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Phone</label>

              <input
                className="admin-form-input"
                type="text"
                name="phone"
                value={collectorData.phone}
                onChange={handleChange}
                required
              />
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Password</label>

              <input
                className="admin-form-input"
                type="password"
                name="password"
                value={collectorData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button className="save-collector-button" type="submit">
              Add Collector
            </button>
          </form>
        </div>
      )}

      {selectedCollector ? (
        <div className="collector-details-card">
          <div className="collector-details-header">
            <div className="collector-details-heading">
              <h2 className="admin-section-title">Collector Details</h2>

              <p className="collector-details-status">
                {selectedCollector.is_active ? "Active" : "Inactive"}
              </p>
            </div>

            <button
              className="close-details-button"
              type="button"
              onClick={closeCollectorDetails}
            >
              Close
            </button>
          </div>

          {!showEditForm ? (
            <div className="collector-details-content">
              <div className="collector-details-information">
                <div className="collector-detail">
                  <span className="collector-detail-label">Name</span>

                  <p className="collector-detail-value">
                    {selectedCollector.name}
                  </p>
                </div>

                <div className="collector-detail">
                  <span className="collector-detail-label">Username</span>

                  <p className="collector-detail-value">
                    {selectedCollector.username}
                  </p>
                </div>

                <div className="collector-detail">
                  <span className="collector-detail-label">Email</span>

                  <p className="collector-detail-value">
                    {selectedCollector.email}
                  </p>
                </div>

                <div className="collector-detail">
                  <span className="collector-detail-label">Phone</span>

                  <p className="collector-detail-value">
                    {selectedCollector.phone}
                  </p>
                </div>
              </div>

              <div className="collector-details-actions">
                <button
                  className="edit-collector-button"
                  type="button"
                  onClick={() => {
                    setShowEditForm(true);
                    setError("");
                    setMessage("");
                  }}
                >
                  Edit Information
                </button>

                <button
                  className={
                    selectedCollector.is_active
                      ? "deactivate-collector-button"
                      : "activate-collector-button"
                  }
                  type="button"
                  onClick={handleStatusChange}
                >
                  {selectedCollector.is_active
                    ? "Make Inactive"
                    : "Activate Collector"}
                </button>
              </div>
            </div>
          ) : (
            <form
              className="edit-collector-form"
              onSubmit={handleUpdateCollector}
            >
              <div className="admin-form-group">
                <label className="admin-form-label">Name</label>

                <input
                  className="admin-form-input"
                  type="text"
                  name="name"
                  value={editData.name}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Username</label>

                <input
                  className="admin-form-input"
                  type="text"
                  name="username"
                  value={editData.username}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Email</label>

                <input
                  className="admin-form-input"
                  type="email"
                  name="email"
                  value={editData.email}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Phone</label>

                <input
                  className="admin-form-input"
                  type="text"
                  name="phone"
                  value={editData.phone}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="collector-edit-actions">
                <button className="save-collector-button" type="submit">
                  Save Changes
                </button>

                <button
                  className="cancel-profile-button"
                  type="button"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      ) : selectedDonation ? (
        <div className="admin-donation-details-card">
          <div className="admin-donation-details-header">
            <div className="admin-donation-details-heading">
              <h2 className="admin-section-title">
                Donation Request #{selectedDonation.id}
              </h2>

              <p className="admin-donation-details-status">
                {selectedDonation.status}
              </p>
            </div>

            <button
              className="close-details-button"
              type="button"
              onClick={closeDonationDetails}
            >
              Close
            </button>
          </div>

          <div className="admin-donation-information">
            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">Client ID</span>

              <p className="admin-donation-detail-value">
                {selectedDonation.client_id}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">Collector</span>

              <p className="admin-donation-detail-value">
                {selectedDonation.collector_id
                  ? `Collector #${selectedDonation.collector_id}`
                  : "Not assigned"}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">House</span>

              <p className="admin-donation-detail-value">
                {selectedDonation.pickup_house}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">Road</span>

              <p className="admin-donation-detail-value">
                {selectedDonation.pickup_road}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">Block</span>

              <p className="admin-donation-detail-value">
                {selectedDonation.pickup_block}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">Area</span>

              <p className="admin-donation-detail-value">
                {selectedDonation.pickup_area}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">
                Preferred Date
              </span>

              <p className="admin-donation-detail-value">
                {selectedDonation.preferred_pickup_date}
              </p>
            </div>

            <div className="admin-donation-detail">
              <span className="admin-donation-detail-label">
                Preferred Time
              </span>

              <p className="admin-donation-detail-value">
                {selectedDonation.preferred_pickup_time}
              </p>
            </div>
          </div>

          <div className="admin-items-section">
            <h3 className="admin-subtitle">Donation Items</h3>

            {selectedDonation.items && selectedDonation.items.length > 0 ? (
              <div className="admin-items-summary">
                <p className="admin-items-count">
                  {selectedDonation.items.length} item
                  {selectedDonation.items.length !== 1 ? "s" : ""} in this
                  donation
                </p>

                <button
                  className="admin-view-items-button"
                  onClick={() => setShowItemsPopup(true)}
                >
                  View Details
                </button>
              </div>
            ) : (
              <p className="admin-no-items">
                No items found for this donation.
              </p>
            )}
          </div>

          {selectedDonation.proof_photo_url && (
            <div className="admin-proof-section">
              <h3 className="admin-subtitle">Collection Proof</h3>

              <div className="admin-proof-content">
                <img
                  className="admin-proof-image"
                  src={`http://localhost:8000/${selectedDonation.proof_photo_url}`}
                  alt="Collection proof"
                />

                <p className="admin-proof-message">
                  Proof photo uploaded by the collector.
                </p>
              </div>
            </div>
          )}

          {selectedDonation.status !== "cancelled" &&
            selectedDonation.status !== "failed" && (
              <div className="admin-assignment-section">
                <h3 className="admin-subtitle">Assign Collector</h3>

                {selectedDonation.collector_id ? (
                  <p className="admin-assigned-collector">
                    Collector #{selectedDonation.collector_id} is assigned
                  </p>
                ) : (
                  <div className="admin-assignment-controls">
                    <select
                      className="admin-collector-select"
                      value={selectedCollectorId}
                      onChange={(event) =>
                        setSelectedCollectorId(event.target.value)
                      }
                    >
                      <option className="admin-collector-option" value="">
                        Select a collector
                      </option>

                      {collectors
                        .filter((collector) => collector.is_active)
                        .map((collector) => (
                          <option
                            className="admin-collector-option"
                            key={collector.id}
                            value={collector.id}
                          >
                            {collector.name}
                          </option>
                        ))}
                    </select>

                    <button
                      className="admin-assign-button"
                      type="button"
                      onClick={handleAssignCollector}
                    >
                      Assign Collector
                    </button>
                  </div>
                )}
              </div>
            )}

          {(selectedDonation.status === "cancelled" ||
            selectedDonation.status === "failed") && (
            <div className="admin-delete-donation-section">
              <button
                className="admin-delete-donation-button"
                type="button"
                onClick={() => setShowDeletePopup(true)}
              >
                Delete Donation
              </button>
            </div>
          )}

          {selectedDonation.status === "failed" &&
            selectedDonation.failed_reason && (
              <div className="admin-failed-section">
                <span className="admin-info-label">Pickup Failed Reason</span>

                <p className="admin-failed-reason">
                  {selectedDonation.failed_reason}
                </p>
              </div>
            )}

          {selectedDonation.status === "cancelled" && (
            <div className="admin-cancelled-message">
              <p className="admin-cancelled-text">
                This donation request was cancelled by the client.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="admin-content">
          {/* COLLECTORS */}

          {!isDonationsPage && (
            <section className="collectors-section">
              <div className="admin-section-header">
                <div>
                  <h2 className="admin-section-title">Collectors</h2>

                  <p className="admin-section-description">
                    Manage your NI'MA collection team
                  </p>
                </div>

                <span className="admin-section-count">{collectors.length}</span>
              </div>

              {collectors.length === 0 ? (
                <p className="no-collectors-message">
                  No collectors to display.
                </p>
              ) : (
                <div className="collectors-list">
                  {collectors.map((collector) => (
                    <div className="collector-card" key={collector.id}>
                      <div className="collector-information">
                        <h3 className="collector-name">{collector.name}</h3>

                        <p className="collector-username">
                          @{collector.username}
                        </p>
                      </div>

                      <div className="collector-card-actions">
                        <span
                          className={
                            collector.is_active
                              ? "collector-status"
                              : "collector-status inactive"
                          }
                        >
                          {collector.is_active ? "Active" : "Inactive"}
                        </span>

                        <button
                          className="view-collector-button"
                          type="button"
                          onClick={() => handleCollectorClick(collector)}
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* DONATIONS */}

          {!isCollectorsPage && (
            <section className="admin-donations-section">
              <div className="admin-section-header">
                <div>
                  <h2 className="admin-section-title">Donation Requests</h2>

                  <p className="admin-section-description">
                    Review and manage pickup requests
                  </p>
                </div>

                <span className="admin-section-count">{donations.length}</span>
              </div>

              <div className="admin-donation-tabs">
                {donationTabs.map((tab) => (
                  <button
                    className={
                      activeDonationTab === tab.name
                        ? "admin-donation-tab active"
                        : "admin-donation-tab"
                    }
                    type="button"
                    key={tab.name}
                    onClick={() => setActiveDonationTab(tab.name)}
                  >
                    <span className="admin-tab-label">{tab.label}</span>

                    <span className="admin-tab-count">{tab.count}</span>
                  </button>
                ))}
              </div>

              <div className="admin-active-donations">
                {activeDonations.length === 0 ? (
                  <div className="admin-empty-donations">
                    <p className="admin-no-donations">
                      No {activeDonationTab} donations.
                    </p>
                  </div>
                ) : (
                  <div className="admin-donations-list">
                    {activeDonations.map(renderDonationCard)}
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      )}

      {showStatusPopup && (
        <div className="admin-popup-overlay">
          <div className="admin-popup">
            <h2 className="admin-popup-title">
              {selectedCollector?.is_active
                ? "Make Collector Inactive?"
                : "Activate Collector?"}
            </h2>

            <p className="admin-popup-message">
              {selectedCollector?.is_active
                ? `Are you sure you want to make ${selectedCollector?.name} inactive?`
                : `Are you sure you want to activate ${selectedCollector?.name}?`}
            </p>

            <div className="admin-popup-actions">
              <button
                type="button"
                className="admin-popup-cancel"
                onClick={() => setShowStatusPopup(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-popup-confirm"
                onClick={confirmStatusChange}
              >
                {selectedCollector?.is_active ? "Make Inactive" : "Activate"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showItemsPopup && (
        <div className="admin-items-popup-overlay">
          <div className="admin-items-popup">
            <div className="admin-items-popup-header">
              <h3 className="admin-subtitle">Donation Items</h3>

              <button
                className="admin-close-items-button"
                onClick={() => setShowItemsPopup(false)}
              >
                ×
              </button>
            </div>

            <div className="admin-items-list">
              {selectedDonation.items.map((item) => (
                <div className="admin-item-card" key={item.id}>
                  <div className="admin-item-information">
                    <h4 className="admin-item-name">{item.name}</h4>

                    <p className="admin-item-category">
                      Category: {item.category}
                    </p>

                    <p className="admin-item-condition">
                      Condition: {item.condition}
                    </p>

                    <p className="admin-item-description">{item.description}</p>
                  </div>

                  {item.image_url && (
                    <img
                      className="admin-item-image"
                      src={`${SERVER_URL}${item.image_url}`}
                      alt={item.name}
                      onClick={() =>
                        setSelectedItemImage(`${SERVER_URL}${item.image_url}`)
                      }
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedItemImage && (
        <div
          className="admin-image-popup-overlay"
          onClick={() => setSelectedItemImage(null)}
        >
          <div
            className="admin-image-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="admin-close-image-button"
              onClick={() => setSelectedItemImage(null)}
            >
              ×
            </button>

            <img
              className="admin-large-item-image"
              src={selectedItemImage}
              alt="Item"
            />
          </div>
        </div>
      )}

      {showDeletePopup && (
        <div className="admin-popup-overlay">
          <div className="admin-popup">
            <h2 className="admin-popup-title">Delete Donation?</h2>

            <p className="admin-popup-message">
              Are you sure you want to permanently delete Donation #
              {selectedDonation?.id}?
            </p>

            <div className="admin-popup-actions">
              <button
                type="button"
                className="admin-popup-cancel"
                onClick={() => setShowDeletePopup(false)}
              >
                Cancel
              </button>

              <button
                type="button"
                className="admin-popup-confirm"
                onClick={handleDeleteDonation}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
