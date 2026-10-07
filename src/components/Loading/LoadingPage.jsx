import "./LoadingPage.css";

function LoadingPage() {
  return (
    <div className="loading-page">
      <div className="loading-content">
        <div className="loading-logo">
          <img
            className="loading-logo-image"
            src="/NI'MA LOGO.png"
            alt="NI'MA Logo"
          />
        </div>

        <p className="loading-text">Loading...</p>

        <div className="loading-dots">
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
          <span className="loading-dot"></span>
        </div>
      </div>
    </div>
  );
}

export default LoadingPage;