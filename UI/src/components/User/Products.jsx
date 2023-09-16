import ProductList from "../ProductList";
import { useDispatch } from "react-redux";
import { getCartLength } from "../../redux/cartReducer";
import { addToCartAPI } from "./ApiCalls";
import { useState } from "react";
import ErrorBlock from "../ErrorBlock";

export default function Products() {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();

  function addToCart(data) {
    setError(null);
    addToCartAPI(data._id)
      .then((res) => {
        if (res?.data?.success) {
          dispatch(getCartLength(res?.data?.cartLength));
        } else {
          setError(res);
        }
      })
      .catch((err) => {
        setError(err);
      });
  }

  return (
    <div className="row px-3 py-3">
      <ErrorBlock
        className="col-md-12"
        errorCode={error?.errorCode}
        errorMessage={error?.errorMessage}
      />
      <ProductList role="User" addToCart={addToCart} />
    </div>
  );
}
