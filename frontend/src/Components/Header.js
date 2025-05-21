import { useNavigate } from "react-router-dom";
function Header() {
  const user_name = localStorage.getItem("userName");
  const handleClick = () => {
    alert("You have been logged out");
    navigate("/");
  };
  const navigate = useNavigate();
  return (
    <div className="container-fluid nav-bar">
      <div className="container">
        <nav className="navbar navbar-light navbar-expand-lg py-3">
          <a href="index.html" className="navbar-brand">
            <h1 className="text-primary fw-bold mb-0">
              Savory<span className="text-dark">Serve</span>{" "}
            </h1>
          </a>
          <button
            className="navbar-toggler py-2 px-3"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarCollapse"
          >
            <span className="fa fa-bars text-primary" />
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <div className="navbar-nav mx-auto">
              <a href="Home" className="nav-item nav-link active">
                Home
              </a>
              <a href="About" className="nav-item nav-link">
                About
              </a>
              <a href="Menu" className="nav-item nav-link">
                Menu
              </a>
              <a href="Cart" className="nav-item nav-link">
                Cart
              </a>
              <a href="Orders" className="nav-item nav-link">
                Orders
              </a>
              <a href="Profile" className="nav-item nav-link">
                Profile
              </a>
              {/* <a href="contact.html" className="nav-item nav-link">
                Contact
              </a> */}
            </div>
            {/* <button
              className="btn-search btn btn-primary btn-md-square me-4 rounded-circle d-none d-lg-inline-flex"
              data-bs-toggle="modal"
              data-bs-target="#searchModal"
            >
              <i className="fas fa-search" />
            </button> */}
            <h2 className="alert alert-primary">Welcome, {user_name}</h2>
            <button
              className="btn btn-primary border-0 rounded-pill py-3 px-4 px-md-5 me-4 mx-auto animated bounceInLeft"
              onClick={handleClick}
            >
              Log out
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Header;
