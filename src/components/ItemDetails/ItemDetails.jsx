import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { getItemById } from "../../services/donationService";
import "./ItemDetails.css";

const ItemDetails = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getItemById(id)
      .then((data) => {
        setItem(data);
      })
      .catch(() => {
        setItem(null);
      });
  }, [id]);

  if (!item) {
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
        onClick={() => navigate(`/client/donations/${item.donation_id}`)}
      >
        Back to Donation
      </button>
      <h1 className="item-details-title">{item.name}</h1>

      <p className="item-details-category">Category: {item.category}</p>

      <p className="item-details-condition">Condition: {item.condition}</p>

      <p className="item-details-description">{item.description}</p>

      <img
        className="item-details-image"
        src={item.image_url}
        alt={item.name}
      />
    </div>
  );
};

export default ItemDetails;
