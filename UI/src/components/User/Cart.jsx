import Button from "react-bootstrap/Button";
import { useEffect, useState } from "react";
import ErrorBlock from "../ErrorBlock";
import ModalPopup from "../Modal";
import { useNavigate } from "react-router-dom";
import {
  clearCartAPI,
  getCartAPI,
  placeOrderAPI,
  removeFromCartAPI,
} from "./ApiCalls";
import { useDispatch, useSelector } from "react-redux";
import { getCart, getCartLength } from "../../redux/cartReducer";

export default function Cart() {
  const [total, setTotal] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState("");
  const navigate = useNavigate();
  const products = useSelector((state) => state.getCartReducer.cart);
  const dispatch = useDispatch();

  function placeOrder() {
    let items = products.map((e) => e._id);
    setError(null);
    placeOrderAPI(items)
      .then((res) => {
        if (res?.data?.success) {
          clearCartAPI();
          dispatch(getCart([]));
          dispatch(getCartLength(0));
          setShowModal(res?.data?.orderId);
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  function getCartproducts() {
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

  function removeCartItem(id) {
    removeFromCartAPI(id)
      .then((res) => {
        if (res?.data?.success) {
          getCartproducts();
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  useEffect(() => {
    getCartproducts();
  }, []);

  useEffect(() => {
    let sum = 0;
    products.forEach((e) => {
      sum += e.price;
    });
    setTotal(products.length);
    setTotalPrice(sum);
  }, [products]);

  return (
    <>
      <div className="row p-2 pt-4">
        <ModalPopup
          show={showModal}
          setShow={(val) => setShowModal(val)}
          showClose={false}
          title="Order Placed Successfully!"
          body={`Your order id is - ${showModal}`}
          primaryBtnText="Shop More"
          primaryBtnHandler={() => navigate("/products")}
        />
        <ErrorBlock
          className="col-md-12"
          errorCode={error?.errorCode}
          errorMessage={error?.errorMessage}
        />

        {products.length ? (
          <>
            <div className="col-md-7">
              {products.map((e) => {
                return (
                  <div className="col-md-11 mb-3 p-3 cartProduct" key={e._id}>
                    <div className="d-flex justify-content-between align-items-center">
                      {e.courseName}
                      <span
                        className="material-symbols-outlined cursor-pointer"
                        onClick={() => removeCartItem(e._id)}
                      >
                        delete
                      </span>
                    </div>
                    <div>Author - {e.author}</div>
                    <div className="d-flex">
                      Price -{"  "}
                      <span className="fw-bold currency">
                        <span className="material-symbols-outlined">
                          currency_rupee
                        </span>
                        {e.price}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="col-md-4 mb-3 p-3 priceDetails">
              <div className="fw-bold">PRICE DETAILS</div>
              <div className="d-flex justify-content-between">
                <span>Price ({total} Items)</span>
                <span className="fw-bold currency">
                  <span className="material-symbols-outlined">
                    currency_rupee
                  </span>
                  {totalPrice}
                </span>
              </div>
              <div className="text-center pt-4">
                <Button
                  variant="primary"
                  className="form-control"
                  onClick={placeOrder}
                >
                  Place Order
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="h3 text-center">No Items Added to Cart</div>
        )}
      </div>
    </>
  );
}
