import Spinner from "./Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import axios from "axios";
import { baseUrl, urls } from "../utils/urls.js";
import { useState, useEffect } from "react";
import ErrorBlock from "./ErrorBlock";
import { useNavigate } from "react-router-dom";

export default function ProductList({ updatePublish, role, addToCart }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [skip, setSkip] = useState(0);
  const limitPerPage = 3;
  const [paginationArray, setPaginationArray] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  function getProducts() {
    setError(null);
    setLoading(true);
    axios
      .get(
        urls.getProducts +
          `?limitPerPage=${limitPerPage}&currentPage=${currentPage}&role=${role}`
      )
      .then((res) => {
        if (res.data.success) {
          setTotal(res.data.totalNumberOfProducts);
          setProducts(res.data.products);
          setSkip(res.data.skip);
        }
      })
      .catch((err) => {
        setError(err?.response?.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function updateCourse(e) {
    navigate("/updateProduct", {
      state: e,
    });
  }

  useEffect(() => {
    getProducts();
  }, [currentPage]);

  useEffect(() => {
    let paginationArray = [];
    for (let i = 0; i < total / limitPerPage; i++) {
      paginationArray.push(i + 1);
    }
    setPaginationArray(paginationArray);
  }, [total]);

  return (
    <>
      <Spinner loading={loading} />
      <ErrorBlock
        errorCode={error?.errorCode}
        errorMessage={error?.errorMessage}
      />
      <div className="h4">
        Showing {skip + 1}
        {skip + limitPerPage > total
          ? skip + 1 === total
            ? ""
            : " - " + total
          : " - " + (skip + limitPerPage)}{" "}
        of {total} products.
      </div>

      {products.map((e) => {
        return (
          <div className="col-md-4 mb-4" key={e._id}>
            <Card className="">
              {e.image && (
                <Card.Img
                  variant="top"
                  src={baseUrl + "images/" + e.image}
                  style={{ height: "150px" }}
                />
              )}
              <Card.Body>
                <Card.Title>{e.courseName}</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                  <br />
                  <span>Author - {e.author}</span> <br />
                  <span className="fw-bold currency">
                    <span className="material-symbols-outlined">
                      currency_rupee
                    </span>
                    {e.price}
                  </span>
                  <span>{e.tags.map((e) => e.toUpperCase() + " ")}</span>
                </Card.Text>
                {role === "Admin" && (
                  <>
                    <Button
                      variant="primary"
                      className="form-control mb-2"
                      onClick={() => updateCourse(e)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="primary"
                      className="form-control"
                      onClick={() => {
                        console.log(updatePublish(e));
                      }}
                    >
                      {e.isPublished ? "Un-Publish" : "Publish"}
                    </Button>
                  </>
                )}
                {role === "User" && (
                  <>
                    <Button
                      variant="primary"
                      className="form-control mb-2"
                      onClick={() => addToCart(e)}
                    >
                      Add To Cart
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </div>
        );
      })}
      <div className="col-md-12 pb-4 d-flex justify-content-center">
        {paginationArray.map((e) => {
          return (
            <Button
              key={"pagination-" + e}
              onClick={() => setCurrentPage(e)}
              className={`${
                currentPage === e ? "button-selected" : ""
              } col-md-1 mx-2`}
            >
              {e}
            </Button>
          );
        })}
      </div>
    </>
  );
}
