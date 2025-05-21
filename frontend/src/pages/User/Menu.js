import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
export default function Menu() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [items, setItems] = useState([]);
  function getOrderNumber() {
    let orderNumber = localStorage.getItem("order_number");
    if (!orderNumber) {
      orderNumber = Math.random().toString(36).substring(2, 10).toUpperCase();
      localStorage.setItem("order_number", orderNumber);
    }
    return orderNumber;
  }

  useEffect(() => {
    axios
      .get("http://localhost:3003/api/cat/category-all")
      .then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    const url = selectedCategory
      ? `http://localhost:3003/api/item/?category_id=${selectedCategory}`
      : "http://localhost:3003/api/item/item-all";

    axios.get(url).then((res) => setItems(res.data));
  }, [selectedCategory]);

  const handleAddToCart = async (item) => {
    const order_number = getOrderNumber();

    try {
      await axios.post("http://localhost:3003/api/order/add", {
        order_number,
        item_id: item.item_id,
        item_quantity: 1,
      });

      alert("Item added to cart!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Failed to add to cart.");
    }
  };

  return (
    <div>
      <Header />
      {/* Book Us Start */}
      <div
        className="container-fluid contact py-6 wow bounceInUp"
        data-wow-delay="0.1s"
      >
        {/* <div className="container">
          <div className="row g-0">
            <div className="col-12">
              <div className="border-bottom border-top border-primary bg-light py-5 px-4">
                <div className="text-center">
                  <small className="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3">
                    Menu
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div> */}
        <div className="container">
          <div className="text-center mb-4">
            <small className="d-inline-block fw-bold text-dark text-uppercase bg-light border border-primary rounded-pill px-4 py-1 mb-3">
              Menu
            </small>
            <h2 className="fw-bold">Our Dishes</h2>
          </div>

          {/* Category Filter */}
          <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
            <button
              className={`btn ${
                selectedCategory === null
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.category_id}
                className={`btn ${
                  selectedCategory === cat.category_id
                    ? "btn-primary"
                    : "btn-outline-primary"
                }`}
                onClick={() => setSelectedCategory(cat.category_id)}
              >
                {cat.category_name}
              </button>
            ))}
          </div>

          {/* Item Grid */}
          <div className="row g-4">
            {items.map((item) => (
              <div key={item.item_id} className="col-sm-6 col-md-4 col-lg-3">
                <div className="card h-100 shadow-sm">
                  {/* <img
                    src={item.item_image}
                    className="card-img-top"
                    alt={item.item_name}
                    style={{ height: "180px", objectFit: "cover" }}
                  /> */}
                  <img
                    src={`http://localhost:3003/uploads/${item.item_image}`}
                    className="card-img-top"
                    alt={item.item_name}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{item.item_name}</h5>
                    <p className="card-text text-muted mb-2">
                      ₹{item.item_price}
                    </p>
                    <button
                      className="btn btn-outline-success mt-auto"
                      onClick={() => handleAddToCart(item)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Book Us End */}
      <a
        href="#"
        className="btn btn-md-square btn-primary rounded-circle back-to-top"
      >
        <i className="fa fa-arrow-up" />
      </a>
    </div>
  );
}
