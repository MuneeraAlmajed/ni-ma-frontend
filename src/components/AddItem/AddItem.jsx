import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
  createItem,
  uploadItemImage,
} from "../../services/donationService";
import "./AddItem.css";

const AddItem = () => {
  const { donationId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    condition: "",
    description: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setError("");

      if (
        !formData.name ||
        !formData.category ||
        !formData.condition ||
        !formData.description ||
        !imageFile
      ) {
        throw new Error("Please complete all item information");
      }

      const image = await uploadItemImage(imageFile);

      await createItem(donationId, {
        ...formData,
        image_url: image.image_url,
      });

      navigate(`/client/donations/${donationId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="add-item">

      <button
        className="back-to-donation-button"
        type="button"
        onClick={() =>
          navigate(`/client/donations/${donationId}`)
        }
      >
        ← Back to Donation
      </button>

      <div className="add-item-card">

        <h1 className="add-item-title">
          Add Another Item
        </h1>

        <p className="add-item-text">
          Add another item to this donation.
        </p>

        <form
          className="add-item-form"
          onSubmit={handleSubmit}
        >

          <div className="form-group">
            <label className="form-label">
              Item Name
            </label>

            <input
              className="form-input"
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  name: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Category
            </label>

            <select
              className="form-input"
              value={formData.category}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  category: event.target.value,
                })
              }
            >
              <option value="">
                Select a category
              </option>

              <option value="Furniture">
                Furniture
              </option>

              <option value="Clothing">
                Clothing
              </option>

              <option value="Electronics">
                Electronics
              </option>

              <option value="Books">
                Books
              </option>

              <option value="Toys">
                Toys
              </option>

              <option value="Kitchen">
                Kitchen
              </option>

              <option value="Other">
                Other
              </option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">
              Condition
            </label>

            <div className="condition-options">

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="New"
                  checked={formData.condition === "New"}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">
                  New
                </span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="Good"
                  checked={formData.condition === "Good"}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">
                  Good
                </span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="Fair"
                  checked={formData.condition === "Fair"}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">
                  Fair
                </span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="Used"
                  checked={formData.condition === "Used"}
                  onChange={(event) =>
                    setFormData({
                      ...formData,
                      condition: event.target.value,
                    })
                  }
                />

                <span className="condition-option-text">
                  Used
                </span>
              </label>

            </div>
          </div>

          <div className="form-group">
            <label className="form-label">
              Description
            </label>

            <textarea
              className="form-textarea"
              value={formData.description}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  description: event.target.value,
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Item Photo
            </label>

            <input
              className="form-input"
              type="file"
              accept="image/*"
              onChange={(event) =>
                setImageFile(event.target.files[0])
              }
            />
          </div>

          {error && (
            <p className="form-error">
              {error}
            </p>
          )}

          <div className="add-item-actions">

            <button
              className="add-item-submit-button"
              type="submit"
            >
              Add Item
            </button>

            <button
              className="add-item-cancel-button"
              type="button"
              onClick={() =>
                navigate(`/client/donations/${donationId}`)
              }
            >
              Cancel
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default AddItem;