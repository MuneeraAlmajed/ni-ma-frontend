import { useState } from "react";
import { useNavigate } from "react-router";
import LocationPicker from "../LocationPicker/LocationPicker";
import "./DonationRequest.css";

import { createDonation, createItem } from "../../services/donationService";

const DonationRequest = () => {
    const [location, setLocation] = useState(null)
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        pickup_house: '',
        pickup_road: '',
        pickup_block: '',
        pickup_area: '',
        preferred_pickup_date: '',
        preferred_pickup_time: ''
    })

    const [itemData, setItemData] = useState({
        name: '',
        category: '',
        condition: '',
        description: '',
        image_url: ''
    })

    const handleSubmit = async () => {
  try {
    setError('');

    if (!location) {
      throw new Error('Please select your pickup location');
    }

    const donationData = {
      ...formData,
      latitude: location.latitude,
      longitude: location.longitude
    };

    const donation = await createDonation(donationData);

    const item = {
      ...itemData,
      image_url: 'https://via.placeholder.com/300'
    };

    await createItem(donation.id, item);

    navigate('/client/dashboard');
  } catch (err) {
    setError(err.message);
  }
}


  return (
    <div className="donation-request">
      <h1 className="donation-request-title">Create Donation Request</h1>

      <p className="donation-request-description">
        Share items you no longer need and give them a new purpose.
      </p>

      <div className="donation-request-form">
        <h2 className="donation-request-section-title">Donation Information</h2>

        <div className="donation-item-form">
          <h3 className="donation-item-form-title">Item Information</h3>

          <div className="form-group">
            <label className="form-label">Item Name</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter item name"
              value={itemData.name}
              onChange={(event) => 
                setItemData({
                    ...itemData,
                    name: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Category</label>

            <select 
            className="form-input"
            value={itemData.category}
            onChange={(event) =>
                setItemData({
                    ...itemData,
                    category: event.target.value
                })
            }
            >
              <option value="">Select a category</option>
              <option value="furniture">Furniture</option>
              <option value="electronics">Electronics</option>
              <option value="clothing">Clothing</option>
              <option value="books">Books</option>
              <option value="household">Household</option>
              <option value="other">Other</option>
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
                  value="new"
                  checked={itemData.condition == 'new'}
                  onChange={(event) =>
                    setItemData({
                        ...itemData,
                        condition: event.target.value
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
                  value="good"
                  checked={itemData.condition == 'good'}
                  onChange={(event) =>
                    setItemData({
                        ...itemData,
                        condition: event.target.value
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
                  value="fair"
                  checked={itemData.condition == 'fair'}
                  onChange={(event) =>
                    setItemData({
                        ...itemData,
                        condition: event.target.value
                    })
                  }
                />
                <span className="condition-option-text">Fair</span>
              </label>

              <label className="condition-option">
                <input
                  className="condition-radio"
                  type="radio"
                  name="condition"
                  value="used"
                  checked={itemData.condition == 'used'}
                  onChange={(event) =>
                    setItemData({
                        ...itemData,
                        condition: event.target.value
                    })
                  }
                />
                <span className="condition-option-text">Used</span>
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>

            <textarea
              className="form-textarea"
              placeholder="Describe the item"
              rows="4"
              value={itemData.description}
              onChange={(event) =>
                setItemData({
                    ...itemData,
                    description: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <label className="form-label">Item Photo</label>

            <input className="form-input" type="file" accept="image/*" />
          </div>

          <button className="add-item-button" type="button">
            + Add Another Item
          </button>
        </div>

        <div className="pickup-form">
          <h3 className="pickup-form-title">Pickup Information</h3>

          <div className="form-group">
            <label className="form-label">House Number</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter house number"
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
            <label className="form-label">Road Number</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter road number"
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
            <label className="form-label">Block Number</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter block number"
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
            <label className="form-label">Area</label>

            <input
              className="form-input"
              type="text"
              placeholder="Enter area"
              value={formData.pickup_area}
              onChange={(event) =>
                setFormData({
                    ...formData,
                    pickup_area: event.target.value
                })
              }
            />
          </div>

          <div className="form-group">
            <LocationPicker
            location={location}
            setLocation={setLocation}
             />

             {location && (
                <p className="location-picker-value">
                    Latitude: {location.latitude}, Longitude: {location.longitude}
                </p>
             )}
          </div>

          <div className="form-group">
            <label className="form-label">Preferred Pickup Date</label>

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
            <label className="form-label">Preferred Pickup Time</label>

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
            <p className="form-error">{error}</p>
        )}
        <button className="submit-donation-button" type="button" onClick={handleSubmit}>
          Submit Donation Request
        </button>
      </div>
    </div>
  );
};




export default DonationRequest;
