import { Link } from "react-router";
import "./Landing.css";

const Landing = () => {
  return (
    <main className="landing-page">

      <section className="hero-section">

        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
        >
          <source
            src="/hero-video.mp4"
            type="video/mp4"
          />
        </video>

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <h1 className="hero-title">
            Give what you have
            <br />
            a second life.
          </h1>

          <p className="hero-text">
            NI’MA makes it simple to share useful items you no longer
            need through an organized pickup service in Bahrain.
          </p>

          <div className="hero-actions">

            <Link
              className="hero-primary-button"
              to="/client/donations/new"
            >
              Share Something Good
              <span className="button-arrow">
                →
              </span>
            </Link>

            <a
              className="hero-secondary-button"
              href="#who-we-are"
            >
              Discover NI’MA
            </a>

          </div>

        </div>

        <div className="hero-floating-card">

          <div className="floating-card-icon">
            ♻
          </div>

          <div className="floating-card-content">

            <span className="floating-card-label">
              THE NI’MA IDEA
            </span>

            <span className="floating-card-text">
              One item can make a difference.
            </span>

          </div>

        </div>

        <div className="hero-scroll">

          <span className="hero-scroll-line"></span>

          <span className="hero-scroll-text">
            Explore
          </span>

        </div>

      </section>

      <section
        className="who-we-are"
        id="who-we-are"
      >

        <div className="who-we-are-content">

          <span className="section-label">
            WHO WE ARE
          </span>

          <h2 className="who-we-are-title">
            A simple way to give useful things another purpose.
          </h2>

          <p className="who-we-are-text">
            NI’MA is a Bahrain-focused platform created to make
            giving and reusing easier. Instead of letting useful
            items sit unused, NI’MA helps connect them with people
            who can benefit from them.
          </p>

        </div>

        <div className="who-we-are-cards">

          <article className="who-we-are-card">

            <div className="who-we-are-card-number">
              01
            </div>

            <div className="who-we-are-icon">
              ↗
            </div>

            <h3 className="who-we-are-card-title">
              Share
            </h3>

            <p className="who-we-are-card-text">
              List useful items that you no longer need and
              give them an opportunity to be used again.
            </p>

          </article>

          <article className="who-we-are-card">

            <div className="who-we-are-card-number">
              02
            </div>

            <div className="who-we-are-icon">
              ◌
            </div>

            <h3 className="who-we-are-card-title">
              Connect
            </h3>

            <p className="who-we-are-card-text">
              Our organized pickup process makes giving
              simple and convenient.
            </p>

          </article>

          <article className="who-we-are-card">

            <div className="who-we-are-card-number">
              03
            </div>

            <div className="who-we-are-icon">
              ✓
            </div>

            <h3 className="who-we-are-card-title">
              Reuse
            </h3>

            <p className="who-we-are-card-text">
              Keep useful items in circulation and help
              build a more conscious community.
            </p>

          </article>

        </div>

      </section>

      <section className="our-story" id='our-story'>

        <div className="our-story-content">

          <span className="section-label">
            OUR STORY
          </span>

          <h2 className="our-story-title">
            What is no longer useful to you can still mean
            something to someone else.
          </h2>

          <p className="our-story-text">
            NI’MA was created with a simple idea: useful things
            should not lose their value just because they are no
            longer needed by their current owner.
          </p>

          <p className="our-story-text">
            We wanted to create a simple way for people in Bahrain
            to share items they no longer need, arrange a convenient
            pickup, and give those items another chance to be useful.
          </p>

        </div>

        <div className="our-story-highlight">

<div className="our-story-logo">
  <img
    className="our-story-logo-image"
    src="../../../assets/NI'MA LOGO.png"
    alt="NI'MA logo"
  />

  <span className="our-story-highlight-text">
    Something of value, shared with purpose.
  </span>
</div>

        </div>

      </section>

      <section className="how-it-works" id='how-it-works'>

        <div className="how-it-works-header">

          <span className="section-label">
            HOW IT WORKS
          </span>

          <h2 className="how-it-works-title">
            Giving should be simple.
          </h2>

        </div>

        <div className="steps-grid">

          <article className="step-card">

            <span className="step-number">
              01
            </span>

            <h3 className="step-title">
              Share
            </h3>

            <p className="step-text">
              Tell us about the item you would like to give
              and provide its pickup details.
            </p>

          </article>

          <article className="step-card">

            <span className="step-number">
              02
            </span>

            <h3 className="step-title">
              Arrange
            </h3>

            <p className="step-text">
              Choose a preferred date and time and let NI’MA
              handle the collection process.
            </p>

          </article>

          <article className="step-card">

            <span className="step-number">
              03
            </span>

            <h3 className="step-title">
              Give Again
            </h3>

            <p className="step-text">
              Your item gets another opportunity to be useful
              to someone else.
            </p>

          </article>

        </div>

      </section>

      <section className="join-section" id='donate'>

        <div className="join-content">

          <span className="section-label">
            MAKE A DIFFERENCE
          </span>

          <h2 className="join-title">
            Have something useful
            <br />
            sitting at home?
          </h2>

          <p className="join-text">
            Give it a second life with NI’MA.
          </p>

          <Link
            className="join-button"
            to="/client/donations/new"
          >
            Share Something Good
            <span className="button-arrow">
              →
            </span>
          </Link>

        </div>

      </section>

      <footer className="landing-footer">

        <div className="footer-content">

          <div className="footer-brand">

            <span className="footer-logo">
              NI’MA
            </span>

            <span className="footer-arabic">
              نِعمة
            </span>

            <p className="footer-tagline">
              What no longer serves you may still have value
              for someone else.
            </p>

          </div>


        </div>

        <div className="footer-bottom">

          <span className="footer-copyright">
            © 2026 NI’MA. All rights reserved.
          </span>

          <span className="footer-location">
            Made in Bahrain 🇧🇭
          </span>

        </div>

      </footer>

    </main>
  );
};

export default Landing;