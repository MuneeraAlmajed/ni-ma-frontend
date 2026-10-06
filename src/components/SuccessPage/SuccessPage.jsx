import { Link } from "react-router";
import "./SuccessPage.css";

const SuccessPage = ({
  title = "Donation Submitted",
  message = "Thank you for giving something a second life. Your donation request has been submitted successfully.",
  buttonText = "Back to Dashboard",
  buttonLink = "/client/dashboard",
}) => {
  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">
          ✓
        </div>

        <h1 className="success-title">{title}</h1>

        <p className="success-message">{message}</p>

        <Link className="success-button" to={buttonLink}>
          {buttonText}
        </Link>
      </div>
    </div>
  );
};

export default SuccessPage;