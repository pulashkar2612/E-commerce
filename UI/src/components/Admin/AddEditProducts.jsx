import axios from "axios";
import { useState } from "react";
import ErrorBlock from "../ErrorBlock";
import ProductList from "../ProductList";
import Spinner from "../Spinner";
import { urls } from "../../utils/urls";

export default function AddEditProducts() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  function updatePublish(data) {
    setLoading(true);
    setError(null);
    axios
      .patch(urls.updateProduct, {
        id: data?._id,
        isPublished: !data?.isPublished,
      })
      .then((res) => {
        if (res.data.success) {
          data.isPublished = !data?.isPublished;
        }
      })
      .catch((err) => {
        setError(err?.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <div className="row px-3 ">
        <Spinner loading={loading} />
        <ErrorBlock
          className="col-md-12"
          errorCode={error?.errorCode}
          errorMessage={error?.errorMessage}
        />
        <ProductList updatePublish={(val) => updatePublish(val)} role="Admin" />
      </div>
    </>
  );
}
