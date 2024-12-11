import { imageLinks } from "../../../utils/constants";
import "./CombinedStudy.scss";

const CombinedStudy = () => {
  return (
    <section className="landing-hero">
      <div className="container">
        <div className="content">
          <h1>Ignite Your Potential, Forge Your Path.</h1>
          <p>
            Explore our cutting-edge learning platforms and unlock your true
            potential.
          </p>
          <button className="cta-button">Join Now</button>
        </div>
        <div className="image">
          <img src={imageLinks.COMBINED_STUDY} alt="Learning Platforms" />
        </div>
      </div>
    </section>
  );
};

export default CombinedStudy;
