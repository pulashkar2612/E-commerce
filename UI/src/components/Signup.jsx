import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorBlock from "./ErrorBlock";
import Spinner from "./Spinner";
import ModalPopup from "./Modal";
import { urls } from "../utils/urls";

export default function Signup() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Admin");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  function callSignup() {
    setError(null);
    setLoading(true);
    axios
      .post(urls.signup, {
        username: userName,
        password: password,
        role: role,
      })
      .then((res) => {
        if (res.data.success) {
          setShowPopup(true);
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
      <ModalPopup
        show={showPopup}
        setShow={(val) => setShowPopup(val)}
        showClose={false}
        title="Signup Successful!"
        body="Click on Login to redirect to Login Page"
        primaryBtnText="Login"
        primaryBtnHandler={() => navigate("/")}
      />
      <Spinner loading={loading} />
      <section className="signup row justify-content-center mt-5 ">
        <h2 className="text-center mb-4">Signup Page</h2>
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
        <div className="col-md-12"></div>
        <div className="col-md-4 mb-3">
          <label>Role</label>
          <select
            className="form-control"
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="Admin">Admin</option>
            <option value="User">User</option>
          </select>
        </div>
        <div className="col-md-12 d-flex justify-content-center">
          <ErrorBlock
            errorCode={error?.errorCode}
            errorMessage={error?.errorMessage}
          />
        </div>
        <div className="col-md-2">
          <button className="w-100 py-2" onClick={callSignup}>
            Signup
          </button>
        </div>
      </section>
    </>
  );
}
