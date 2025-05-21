import React, { useEffect, useState } from "react";
import axios from "axios";
import Footer from "../../Components/Footer";
import Header from "../../Components/Header";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [places, setPlaces] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderNumber, setConfirmedOrderNumber] = useState(null);

  // Form fields
  const [program, setProgram] = useState("");
  const [program_date, setProgramDate] = useState("");
  const [place_id, setPlaceId] = useState("");
  const order_number = localStorage.getItem("order_number");
  const userId = localStorage.getItem("userId");
  const [employeeConfirmed, setEmployeeConfirmed] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (!order_number) return;
    axios
      .get(`http://localhost:3003/api/order/${order_number}`)
      .then((res) => {
        console.log("Cart API response:", res.data);
        setCartItems(res.data.items);
        calculateTotal(res.data.items);
      })
      .catch((err) => console.error("Failed to load cart:", err));
  }, []);

  useEffect(() => {
    const checkEmployeeConfirmation = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3003/api/order/by-customer/${userId}`
        );

        const booking = res.data;
        if (booking && booking.booking_status === "confirmed") {
          setEmployeeConfirmed(true);
          setConfirmedOrder(booking);

          // Clear any queued speech
          window.speechSynthesis.cancel();

          // Spell out the order number for clarity
          const spellOutOrderNumber = (orderNumber) =>
            orderNumber.split("").join(" ");

          const message = `Your order ${spellOutOrderNumber(
            booking.order_number
          )} has been confirmed. Thank you!`;

          const speech = new SpeechSynthesisUtterance(message);
          window.speechSynthesis.speak(speech);
        }
      } catch (err) {
        console.error("Error checking confirmation:", err);
      }
    };

    checkEmployeeConfirmation();
  }, []);

  const calculateTotal = (items) => {
    const sum = items.reduce(
      (acc, item) => acc + item.item_price * item.item_quantity,
      0
    );
    setTotal(sum);
  };

  const handleRemove = (temp_id) => {
    axios
      .delete(`http://localhost:3003/api/order/remove/${temp_id}`)
      .then(() => {
        const updated = cartItems.filter((item) => item.temp_id !== temp_id);
        setCartItems(updated);
        calculateTotal(updated);
      })
      .catch((err) => console.error("Failed to remove:", err));
  };
  useEffect(() => {
    axios
      .get("http://localhost:3003/api/place/place-active")
      .then((res) => setPlaces(res.data))
      .catch((err) => console.error("Failed to load places:", err));
  }, []);

  const handleCheckout = () => {
    const customer_id = localStorage.getItem("userId");
    // hardcoded or from auth/session

    if (!program || !program_date || !place_id) {
      alert("Please fill in all booking details.");
      return;
    }

    axios
      .post("http://localhost:3003/api/order/checkout", {
        order_number,
        customer_id,
        program,
        program_date,
        place_id,
      })
      .then((res) => {
        setConfirmedOrderNumber(order_number);
        setShowConfirmation(true);
        localStorage.removeItem("order_number");
        setCartItems([]); // Clear the UI cart
        setShowModal(false);
        setEmployeeConfirmed(false);
        setConfirmedOrder(null);
      })
      .catch((err) => {
        console.error("Checkout error:", err);
        alert("Checkout failed.");
      });
  };

  const updateQuantity = (temp_id, newQty) => {
    if (newQty < 1) return;

    axios
      .put("http://localhost:3003/api/order/update-quantity", {
        temp_id,
        item_quantity: newQty,
      })
      .then(() => {
        // Reload cart
        axios
          .get(`http://localhost:3003/api/order/${order_number}`)
          .then((res) => {
            setCartItems(res.data.items);
            calculateTotal(res.data.items);
          });
      })
      .catch((err) => console.error("Quantity update failed:", err));
  };

  return (
    <div>
      {/* Navbar start */}
      <Header />
      {/* Navbar End */}
      {/* Cart Start */}

      <div className="container py-5">
        {employeeConfirmed && confirmedOrder && (
          <div className="alert alert-info text-center mt-4" role="alert">
            ✅ <strong>Your order has been confirmed by our team!</strong>
            <br />
            Order No: <strong>{confirmedOrder.order_number}</strong>
            <br />
          </div>
        )}

        {showConfirmation ? (
          <div className="alert alert-success text-center mt-4" role="alert">
            🎉 <strong>Thank you for your order!</strong>
            <br />
            Your order number is <strong>{confirmedOrderNumber}</strong>.
            <br />
            One of our team members will contact you shortly to confirm your
            booking.
          </div>
        ) : !order_number || cartItems.length === 0 ? (
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ minHeight: "300px" }}
          >
            <h3 className="text-center">Your cart is empty 🛒</h3>
          </div>
        ) : (
          <>
            <h3 className="text-center mb-4">Your Cart</h3>
            {showConfirmation && (
              <div
                className="alert alert-success text-center mt-4"
                role="alert"
              >
                🎉 <strong>Thank you for your order!</strong>
                <br />
                Your order number is <strong>{confirmedOrderNumber}</strong>.
                <br />
                One of our team members will contact you shortly to confirm your
                booking.
              </div>
            )}
            <table className="table table-bordered text-center">
              <thead className="table-dark">
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.temp_id}>
                    <td>{item.item_name}</td>
                    <td>₹{item.item_price}</td>
                    <td>
                      <button
                        onClick={() =>
                          updateQuantity(item.temp_id, item.item_quantity - 1)
                        }
                        disabled={item.item_quantity <= 1}
                      >
                        -
                      </button>
                      <span className="mx-2">{item.item_quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.temp_id, item.item_quantity + 1)
                        }
                      >
                        +
                      </button>
                    </td>

                    <td>₹{item.total_price}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemove(item.temp_id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-end">
              <h4>Total: ₹{total}</h4>
              <button
                className="btn btn-primary"
                onClick={() => setShowModal(true)}
              >
                Proceed
              </button>
            </div>
            {showModal && (
              <div className="modal fade show d-block" tabIndex="-1">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Complete Your Booking</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setShowModal(false)}
                      ></button>
                    </div>
                    <div className="modal-body">
                      <form>
                        <div className="mb-3">
                          <label className="form-label">Select Place</label>
                          <select
                            className="form-select"
                            value={place_id}
                            onChange={(e) => setPlaceId(e.target.value)}
                          >
                            <option value="">Select</option>
                            {places.map((place) => (
                              <option
                                key={place.place_id}
                                value={place.place_id}
                              >
                                {place.place_name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="mb-3">
                          <label htmlFor="program" className="form-label">
                            Program Type
                          </label>
                          <select
                            className="form-select"
                            id="program"
                            value={program}
                            onChange={(e) => setProgram(e.target.value)}
                          >
                            <option value="">-- Select Program --</option>
                            <option value="Birthday">Birthday</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Corporate Event">
                              Corporate Event
                            </option>
                            <option value="Anniversary">Anniversary</option>
                            <option value="Festival Celebration">
                              Festival Celebration
                            </option>
                          </select>
                        </div>

                        <div className="mb-3">
                          <label className="form-label">Program Date</label>
                          <input
                            type="date"
                            className="form-control"
                            value={program_date}
                            onChange={(e) => setProgramDate(e.target.value)}
                          />
                        </div>
                      </form>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        className="btn btn-success"
                        onClick={handleCheckout}
                      >
                        Confirm Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {/* Cart End */}
    </div>
  );
};

export default Cart;
