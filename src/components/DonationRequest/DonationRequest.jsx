import { useState } from "react";
import { useNavigate } from "react-router";
import LocationPicker from "../LocationPicker/LocationPicker";
import "./DonationRequest.css";

import {
  createDonation,
  createItem,
  uploadItemImage
} from "../../services/donationService";

const DonationRequest = () => {
  const navigate = useNavigate();

  const [location, setLocation] = useState(null);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    pickup_house: "",
    pickup_road: "",
    pickup_block: "",
    pickup_area: "",
    preferred_pickup_date: "",
    preferred_pickup_time: ""
  });

  const [items, setItems] = useState([
    {
      name: "",
      category: "",
      condition: "",
      description: "",
      image_url: "",
      imageFile: null
    }
  ]);

  const handleItemChange = (index, field, value) => {
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value
            }
          : item
      )
    );
  };

  const handleImageChange = (index, file) => {
    setItems(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              imageFile: file
            }
          : item
      )
    );
  };

  const addItem = () => {
    setItems([
      ...items,
      {
        name: "",
        category: "",
        condition: "",
        description: "",
        image_url: "",
        imageFile: null
      }
    ]);
  };

  const removeItem = (index) => {
    setItems(
      items.filter((item, itemIndex) => itemIndex !== index)
    );
  };

  const handleSubmit = async () => {
    try {
      setError("");

      if (!location) {
        throw new Error("Please select your pickup location");
      }

      for (const item of items) {
        if (
          !item.name ||
          !item.category ||
          !item.condition ||
          !item.description
        ) {
          throw new Error("Please complete all item information");
        }

        if (!item.imageFile) {
          throw new Error("Please select an image for each item");
        }
      }

      const donationData = {
        ...formData,
        latitude: location.latitude,
        longitude: location.longitude
      };

      const donation = await createDonation(donationData);

      for (const item of items) {
        const image = await uploadItemImage(item.imageFile);

        const itemData = {
          name: item.name,
          category: item.category,
          condition: item.condition,
          description: item.description,
          image_url: image.image_url
        };

        await createItem(donation.id, itemData);
      }

      navigate("/client/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="donation-request">
      <h1 className="donation-request-title">
        Create Donation Request
      </h1>

      <p className="donation-request-description">
        Share items you no longer need and give them a new purpose.
      </p>

      <div className="donation-request-form">
        <h2 className="donation-request-section-title">
          Donation Information
        </h2>

        {items.map((item, index) => (
          <div
            className="donation-item-form"
            key={index}
          >
            <div className="donation-item-header">
              <h3 className="donation-item-form-title">
                Item {index + 1}
              </h3>

            </div>

            <div className="form-group">
              <label className="form-label">
                Item Name
              </label>

              <input
                className="form-input"
                type="text"
                placeholder="Enter item name"
                value={item.name}
                onChange={(event) =>
                  handleItemChange(
                    index,
                    "name",
                    event.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                Category
              </label>

              <select
                className="form-input"
                value={item.category}
                onChange={(event) =>
                  handleItemChange(
                    index,
                    "category",
                    event.target.value
                  )
                }
              >
                <option value="">
                  Select a category
                </option>

                <option value="furniture">
                  Furniture
                </option>

                <option value="electronics">
                  Electronics
                </option>

                <option value="clothing">
                  Clothing
                </option>

                <option value="books">
                  Books
                </option>

                <option value="household">
                  Household
                </option>

                <option value="other">
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
                    name={`condition-${index}`}
                    value="new"
                    checked={item.condition === "new"}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "condition",
                        event.target.value
                      )
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
                    name={`condition-${index}`}
                    value="good"
                    checked={item.condition === "good"}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "condition",
                        event.target.value
                      )
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
                    name={`condition-${index}`}
                    value="fair"
                    checked={item.condition === "fair"}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "condition",
                        event.target.value
                      )
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
                    name={`condition-${index}`}
                    value="used"
                    checked={item.condition === "used"}
                    onChange={(event) =>
                      handleItemChange(
                        index,
                        "condition",
                        event.target.value
                      )
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
                placeholder="Describe the item"
                rows="4"
                value={item.description}
                onChange={(event) =>
                  handleItemChange(
                    index,
                    "description",
                    event.target.value
                  )
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
                  handleImageChange(
                    index,
                    event.target.files[0]
                  )
                }
              />

              {items.length > 1 && (
                <button
                  className="remove-item-button"
                  type="button"
                  onClick={() => removeItem(index)}
                >
                  Remove Item
                </button>
              )}
            </div>
          </div>
        ))}

        <button
          className="add-item-button"
          type="button"
          onClick={addItem}
        >
          + Add Another Item
        </button>

        <div className="pickup-form">
          <h3 className="pickup-form-title">
            Pickup Information
          </h3>

          <div className="form-group">
            <label className="form-label">
              House
            </label>

            <input
              className="form-input"
              type="text"
              value={formData.pickup_house}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  pickup_house: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Road
            </label>

            <input
              className="form-input"
              type="text"
              value={formData.pickup_road}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  pickup_road: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Block
            </label>

            <input
              className="form-input"
              type="text"
              value={formData.pickup_block}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  pickup_block: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Area
            </label>

            <input
              className="form-input"
              type="text"
              value={formData.pickup_area}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  pickup_area: event.target.value
                })
              }
            />
          </div>

          <LocationPicker
            location={location}
            setLocation={setLocation}
          />

          <div className="form-group">
            <label className="form-label">
              Preferred Pickup Date
            </label>

            <input
              className="form-input"
              type="date"
              value={formData.preferred_pickup_date}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  preferred_pickup_date: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Preferred Pickup Time
            </label>

            <input
              className="form-input"
              type="time"
              value={formData.preferred_pickup_time}
              onChange={(event) =>
                setFormData({
                  ...formData,
                  preferred_pickup_time: event.target.value
                })
              }
            />
          </div>
        </div>

        {error && (
          <p className="form-error">
            {error}
          </p>
        )}

        <button
          className="submit-donation-button"
          type="button"
          onClick={handleSubmit}
        >
          Submit Donation Request
        </button>
      </div>
    </div>
  );
};

export default DonationRequest;