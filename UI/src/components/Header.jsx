import { useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Badge from "react-bootstrap/Badge";
import { useEffect, useState } from "react";
import { getCartAPI } from "./User/ApiCalls";
import { getCart, getCartLength } from "../redux/cartReducer";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const cartLength = useSelector((state) => state.getCartReducer.cartLength);
  const dispatch = useDispatch();
  const [error, setError] = useState(null);

  useEffect(() => {
    if (["/cart", "/", "/logout"].indexOf(location.pathname) < 0) {
      getCartAPI()
        .then((res) => {
          if (res?.data?.success) {
            dispatch(getCart(res.data.cart));
            dispatch(getCartLength(res.data.cart.length));
          }
        })
        .catch((err) => {
          setError(err);
        });
    }
  }, []);

  function redirectToHome() {
    navigate("/");
  }

  function logout() {
    navigate("/logout");
  }

  function homepage() {
    let val = ["/", "/signup"].indexOf(location.pathname) > -1;
    return !val;
  }

  function navigateToCart() {
    navigate("/cart");
  }

  function redirectToOrders() {
    navigate("/orders");
  }

  useEffect(() => {
    // window.addEventListener(
    //   "beforeunload",
    //   function (e) {
    //     // Do something
    //     console.log(e);
    //   },
    //   false
    // );
  });

  return (
    <nav className="header d-flex align-items-center justify-content-between">
      <h1 onClick={redirectToHome}>
        <span>Ecommerce App</span>
      </h1>
      {homepage() && (
        <div className="d-flex align-items-end">
          {!location.pathname.includes("/admin-dashboard") && (
            <>
              <div className="me-3" onClick={redirectToOrders}>
                <span className="material-symbols-outlined icon">person</span>
              </div>
              <div
                className="position-relative text-center me-4"
                onClick={navigateToCart}
              >
                <Badge text="dark" className="cart-badge">
                  {cartLength ? cartLength : ""}
                </Badge>
                <span className="material-symbols-outlined icon">
                  shopping_cart
                </span>
              </div>
            </>
          )}

          <div>
            <span className="material-symbols-outlined icon" onClick={logout}>
              logout
            </span>
          </div>
        </div>
      )}
    </nav>
  );
}
