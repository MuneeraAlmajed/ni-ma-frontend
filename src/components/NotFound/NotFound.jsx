import { Link } from "react-router";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="not-found-number">
          <span className="not-found-four">4</span>
          <span className="not-found-zero">0</span>
          <span className="not-found-four">4</span>
        </div>

        <h1 className="not-found-title">Page Not Found</h1>

        <p className="not-found-text">
          The page you are looking for does not exist or may have been moved.
        </p>

        <Link className="not-found-button" to="/">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;