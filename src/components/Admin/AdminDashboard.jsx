import { useEffect, useState } from "react";
import {
  getCollectors,
  createCollector,
  updateCollector,
  updateCollectorStatus
} from "../../services/userService";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [collectors, setCollectors] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedCollector, setSelectedCollector] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showStatusPopup, setShowStatusPopup] = useState(false);

  const [collectorData, setCollectorData] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    password: ""
  });

  const [editData, setEditData] = useState({
    name: "",
    username: "",
    email: "",
    phone: ""
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadCollectors();
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

  const handleChange = (event) => {
    setCollectorData({
      ...collectorData,
      [event.target.name]: event.target.value
    });
  };

  const handleEditChange = (event) => {
    setEditData({
      ...editData,
      [event.target.name]: event.target.value
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
        password: ""
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
      phone: collector.phone || ""
    });

    setShowEditForm(false);
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
        editData
      );

      setCollectors(
        collectors.map((collector) =>
          collector.id === updatedCollector.id
            ? updatedCollector
            : collector
        )
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
    if (!selectedCollector) return;

    const newStatus = !selectedCollector.is_active;

    setError("");
    setMessage("");
    setShowStatusPopup(false);

    try {
      const updatedCollector = await updateCollectorStatus(
        selectedCollector.id,
        newStatus
      );

      setCollectors(
        collectors.map((collector) =>
          collector.id === updatedCollector.id
            ? updatedCollector
            : collector
        )
      );

      setSelectedCollector(updatedCollector);

      setMessage(
        newStatus
          ? "Collector activated successfully."
          : "Collector made inactive successfully."
      );
    } catch (err) {
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

  return (
    <div className="admin-dashboard">

      <div className="admin-dashboard-header">

        <div className="admin-dashboard-heading">
          <h1 className="admin-dashboard-title">
            Admin Dashboard
          </h1>

          <p className="admin-dashboard-subtitle">
            Manage NI'MA collectors
          </p>
        </div>

        <button
          className="add-collector-button"
          type="button"
          onClick={() => {
            setShowAddForm(!showAddForm);
            setSelectedCollector(null);
            setError("");
            setMessage("");
          }}
        >
          {showAddForm ? "Close" : "Add Collector"}
        </button>

      </div>

      {message && (
        <p className="admin-success-message">
          {message}
        </p>
      )}

      {error && (
        <p className="admin-error-message">
          {error}
        </p>
      )}

      {showAddForm && (
        <div className="add-collector-card">

          <h2 className="admin-section-title">
            Add New Collector
          </h2>

          <form
            className="add-collector-form"
            onSubmit={handleAddCollector}
          >

            <div className="admin-form-group">
              <label className="admin-form-label">
                Name
              </label>

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
              <label className="admin-form-label">
                Username
              </label>

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
              <label className="admin-form-label">
                Email
              </label>

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
              <label className="admin-form-label">
                Phone
              </label>

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
              <label className="admin-form-label">
                Password
              </label>

              <input
                className="admin-form-input"
                type="password"
                name="password"
                value={collectorData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="save-collector-button"
              type="submit"
            >
              Add Collector
            </button>

          </form>

        </div>
      )}

      {selectedCollector ? (
        <div className="collector-details-card">

          <div className="collector-details-header">

            <div>
              <h2 className="admin-section-title">
                Collector Details
              </h2>

              <p className="collector-details-status">
                {selectedCollector.is_active
                  ? "Active"
                  : "Inactive"}
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
            <>
              <div className="collector-details-information">

                <div className="collector-detail">
                  <span>Name</span>
                  <p>{selectedCollector.name}</p>
                </div>

                <div className="collector-detail">
                  <span>Username</span>
                  <p>{selectedCollector.username}</p>
                </div>

                <div className="collector-detail">
                  <span>Email</span>
                  <p>{selectedCollector.email}</p>
                </div>

                <div className="collector-detail">
                  <span>Phone</span>
                  <p>{selectedCollector.phone}</p>
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
            </>
          ) : (
            <form
              className="edit-collector-form"
              onSubmit={handleUpdateCollector}
            >

              <div className="admin-form-group">
                <label className="admin-form-label">
                  Name
                </label>

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
                <label className="admin-form-label">
                  Username
                </label>

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
                <label className="admin-form-label">
                  Email
                </label>

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
                <label className="admin-form-label">
                  Phone
                </label>

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

                <button
                  className="save-collector-button"
                  type="submit"
                >
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
      ) : (
        <div className="collectors-section">

          <h2 className="admin-section-title">
            Collectors
          </h2>

          {collectors.length === 0 ? (
            <p className="no-collectors-message">
              No collectors to display.
            </p>
          ) : (
            <div className="collectors-list">

              {collectors.map((collector) => (
                <div
                  className="collector-card"
                  key={collector.id}
                  onClick={() => handleCollectorClick(collector)}
                >

                  <div className="collector-information">

                    <h3 className="collector-name">
                      {collector.name}
                    </h3>

                    <p className="collector-username">
                      @{collector.username}
                    </p>

                    <p className="collector-email">
                      {collector.email}
                    </p>

                    <p className="collector-phone">
                      {collector.phone}
                    </p>

                  </div>

                  <span
                    className={
                      collector.is_active
                        ? "collector-status"
                        : "collector-status inactive"
                    }
                  >
                    {collector.is_active
                      ? "Active"
                      : "Inactive"}
                  </span>

                </div>
              ))}

            </div>
          )}

        </div>
      )}

      {showStatusPopup && (
        <div className="admin-popup-overlay">
          <div className="admin-popup">

            <h2>
              {selectedCollector?.is_active
                ? "Make Collector Inactive?"
                : "Activate Collector?"}
            </h2>

            <p>
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
                {selectedCollector?.is_active
                  ? "Make Inactive"
                  : "Activate"}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;