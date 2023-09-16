import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { urls } from "../../utils/urls";

export default function UpdateProducts() {
  const location = useLocation();
  const [file, setFile] = useState({});
  const [price, setPrice] = useState("");

  function getFile(e) {
    setFile(e.target.files[0]);
  }

  useEffect(() => {
    setPrice(location.state.price);
  }, []);

  function updateProduct() {
    axios
      .put(
        urls.updateProduct,
        {
          userId: sessionStorage.getItem("user"),
          image: file,
          id: location.state._id,
          price: price,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {})
      .catch((err) => {});
  }

  return (
    <div className="text-center mt-4">
      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input type="file" name="image" onChange={getFile} />
      <br />
      <button onClick={updateProduct}>Update</button>
    </div>
  );
}
