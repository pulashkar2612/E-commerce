import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutAPI } from "./User/ApiCalls";

export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    logoutAPI().then((res) => {
      if (res.data.success) {
        sessionStorage.clear();
        navigate("/");
      }
    });
  }, []);
  return <h1>Logout Page</h1>;
}
