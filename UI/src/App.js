import { Route, Routes, useNavigate } from "react-router-dom";
import Header from "./components/Header";
import Signup from "./components/Signup";
import Login from "./components/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import Products from "./components/User/Products";
import { useEffect, useState } from "react";
import Cart from "./components/User/Cart";
import Orders from "./components/User/Orders";
import Logout from "./components/Logout";
import UpdateProducts from "./components/Admin/UpdateProducts";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      setRole(sessionStorage.getItem("role"));
      setIsLoggedIn(true);
    } else {
      navigate("/");
    }
  }, []);

  return (
    <div className="container">
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <Login
              setIsLoggedIn={(val) => setIsLoggedIn(val)}
              setRole={(val) => setRole(val)}
            />
          }
        />
        <Route path="signup" element={<Signup />} />
        <Route path="logout" element={<Logout />} />
        {isLoggedIn && (
          <>
            {role === "Admin" && (
              <>
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/updateProduct" element={<UpdateProducts />} />
              </>
            )}
            {role === "User" && (
              <>
                <Route path="/products" element={<Products />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/orders" element={<Orders />} />
              </>
            )}
          </>
        )}
        {/* <Route
          path="*"
          element={
            <Login
              setIsLoggedIn={(val) => setIsLoggedIn(val)}
              setRole={(val) => setRole(val)}
            />
          }
        /> */}
      </Routes>
    </div>
  );
}

export default App;
