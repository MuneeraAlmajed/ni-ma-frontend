import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import {
  getItemById,
  getDonationById,
  updateItem,
  deleteItem,
  uploadItemImage,
} from "../../services/donationService";
import "./ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [donation, setDonation] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [imageFile, setImageFile] = useState(null);

  const [error, setError] = useState("");
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  useEffect(() => {
    getItemById(id)
      .then((data) => {
        setItem(data);

        return getDonationById(data.donation_id);
      })
      .then((data) => {
        setDonation(data);
      })
      .catch(() => {
        setItem(null);
      });
  }, [id]);

  const handleSaveChanges = async () => {
    try {
      setError("");

      if (
        !editData.name ||
        !editData.category ||
        !editData.condition ||
        !editData.description
      ) {
        throw new Error("Please complete all item information");
      }

      let imageUrl = item.image_url;

      if (imageFile) {
        const image = await uploadItemImage(imageFile);
        imageUrl = image.image_url;
      }

      const updatedItem = await updateItem(id, {
        name: editData.name,
        category: editData.category,
        condition: editData.condition,
        description: editData.description,
        image_url: imageUrl,
      });

      setItem(updatedItem);
      setIsEditing(false);
      setImageFile(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteItem = async () => {
    try {
      setError("");

      await deleteItem(id);

      navigate(`/client/donations/${item.donation_id}`);
    } catch (err) {
      setError(err.message);
      setShowDeletePopup(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    setImageFile(null);
  };

  if (!item || !donation) {
    return (
      <div className="item-details">
        <p className="item-details-message">Loading item...</p>
      </div>
    );
  }

  return (
    <div className="item-details">
      <button
        className="back-to-donation-button"
        type="button"
        onClick={() => navigate(`/client/donations/${item.donation_id}`)}
      >
        ← Back to Donation
      </button>

      <div className="item-details-header">
        <div className="item-details-heading">
          <h1 className="item-details-title">
            {isEditing ? "Edit Item" : item.name}
          </h1>

          {!isEditing && (
            <div className="item-details-meta">
              <span className="item-details-category">{item.category}</span>

              <span className="item-details-condition">{item.condition}</span>
            </div>
          )}
        </div>

        {donation.status === "pending" && !isEditing && (
          <div className="item-details-actions">
            <button
              className="add-item-button"
              type="button"
              onClick={() =>
                navigate(`/client/donations/${item.donation_id}/items/new`)
              }
            >
              + Add Another Item
            </button>

            <button
              className="edit-item-button"
              type="button"
              onClick={() => {
                setEditData({
                  name: item.name,
                  category: item.category,
                  condition: item.condition,
                  description: item.description,
                });

                setError("");
                setIsEditing(true);
              }}
            >
              Edit Item
            </button>

            <button
              className="delete-item-button"
              type="button"
              onClick={() => setShowDeletePopup(true)}
            >
              Delete Item
            </button>

          </div>
        )}
      </div>

      {isEditing ? (
        <div className="item-edit-form">
          <div className="form-group">
            <label className="form-label">Item Name</label>

            <input
              className="form-input"
              type="text"
              value={editData.name || ""}
              onChange={(event) =>
                setEditData({
                  ...editData,
                  name: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>

            <select
              className="form-input"
              value={editData.category || ""}
              onChange={(event) =>
                setEditData({
                  ...editData,
                  category: event.target.value,
                })
              }
            >
              <option value="">Select a category</option>

              <option value="Furniture">Furniture</option>

              <option value="Clothing">Clothing</option>

              <option value="Electronics">Electronics</option>

              <option value="Books">Books</option>

              <option value="Toys">Toys</option>

              <option value="Kitchen">Kitchen</option>

              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Condition</label>

            <div className="condition-options">
              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="New"
                  checked={editData.condition === "New"}
                  onChange={(event) =>
                    setEditData({
                      ...editData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">New</span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="Like New"
                  checked={editData.condition === "Like New"}
                  onChange={(event) =>
                    setEditData({
                      ...editData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">Like New</span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="Good"
                  checked={editData.condition === "Good"}
                  onChange={(event) =>
                    setEditData({
                      ...editData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">Good</span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="Fair"
                  checked={editData.condition === "Fair"}
                  onChange={(event) =>
                    setEditData({
                      ...editData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">Fair</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>

            <textarea
              className="form-textarea"
              value={editData.description || ""}
              onChange={(event) =>
                setEditData({
                  ...editData,
                  description: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Replace Image</label>

            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files[0])}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="item-edit-actions">
            <button
              className="save-item-button"
              type="button"
              onClick={handleSaveChanges}
            >
              Save Changes
            </button>

            <button
              className="cancel-item-edit-button"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="item-display">
          <div className="item-image-section">
            <img
              className="item-details-image"
              src={`http://localhost:8000${item.image_url}`}
              alt={item.name}
            />
          </div>

          <div className="item-description-section">
            <h2 className="item-description-title">Description</h2>

            <p className="item-details-description">{item.description}</p>
          </div>
        </div>
      )}

      {error && !isEditing && <p className="form-error">{error}</p>}

      {showDeletePopup && (
        <div className="delete-popup-overlay">
          <div className="delete-popup">
            <h2 className="delete-popup-title">Delete Item?</h2>

            <p className="delete-popup-message">
              Are you sure you want to delete this item?
            </p>

            <div className="delete-popup-actions">
              <button
                className="keep-item-button"
                type="button"
                onClick={() => setShowDeletePopup(false)}
              >
                Keep Item
              </button>

              <button
                className="confirm-delete-item-button"
                type="button"
                onClick={handleDeleteItem}
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetails;
