import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import ErrorBlock from "./ErrorBlock";
import { urls } from "../utils/urls";

export default function Login({ setIsLoggedIn, setRole }) {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      sessionStorage.getItem("role") === "Admin"
        ? navigate("/admin-dashboard")
        : navigate("/products");
    }
  }, []);

  function login() {
    setLoading(true);
    setError(null);

    axios
      .post(urls.login, {
        username: userName,
        password: password,
      })
      .then((res) => {
        if (res.data.success) {
          sessionStorage.setItem("token", res.data.token);
          sessionStorage.setItem("refreshToken", res.data.refreshToken);
          sessionStorage.setItem("user", res.data.id);
          sessionStorage.setItem("role", res.data.role);
          sessionStorage.setItem("sessionId", res.data.sessionId);
          setIsLoggedIn(true);
          setRole(res?.data?.role);
          if (res.data?.role === "Admin") {
            navigate("/admin-dashboard");
          } else {
            navigate("/products");
          }
        }
      })
      .catch((err) => {
        setError(err.response.data);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <>
      <Spinner show={loading} />
      <section className="signup row justify-content-center mt-5 ">
        <h2 className="text-center mb-4">Login into your account</h2>
        <div className="mb-3 col-md-4">
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            onChange={(e) => setUserName(e.target.value)}
          />
        </div>
        <div className="col-md-12"></div>
        <div className="col-md-4 mb-3">
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="col-md-12 mb-2 d-flex justify-content-center">
          <ErrorBlock
            errorCode={error?.errorCode}
            errorMessage={error?.errorMessage}
          />
        </div>
        <div className="col-md-2 mb-4">
          <button className="w-100 py-2" onClick={login}>
            Login
          </button>
        </div>
        <div className="col-md-12 text-center">
          New User - <Link to="/signup">Click Here</Link> to Signup
        </div>
      </section>
    </>
  );
}
