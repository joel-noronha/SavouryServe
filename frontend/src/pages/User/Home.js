import Footer from "../../Components/Footer";
import Header from "../../Components/Header";

export default function Home() {
  return (
    <div>
      {/* Navbar start */}
      <Header />
      {/* Navbar End */}
      {/* Hero Start */}
      <div className="container-fluid bg-light py-6 mt-0">
        <div className="container">
          <div className="row g-5 align-items-center">
            <div className="col-lg-7 col-md-12">
              <small className="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-4 animated bounceInDown">
                Welcome to SavoryServe
              </small>
              <h1 className="display-1 mb-4 animated bounceInDown">
                Book <span className="text-primary">Savory</span>Serve For Your
                Dream Event
              </h1>
              <a
                href
                className="btn btn-primary border-0 rounded-pill py-3 px-4 px-md-5 me-4 animated bounceInLeft"
              >
                Book Now
              </a>
            </div>
            <div className="col-lg-5 col-md-12">
              <img
                src="img/hero.png"
                className="img-fluid rounded animated zoomIn"
                alt
              />
            </div>
          </div>
        </div>
      </div>
      {/* Hero End */}
    </div>
  );
}
