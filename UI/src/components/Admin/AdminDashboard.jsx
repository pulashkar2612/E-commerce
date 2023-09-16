import { useState } from "react";
import Button from "react-bootstrap/Button";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import AddEditProducts from "./AddEditProducts";
import AddEditUsers from "./AddEditUsers";

export default function AdminDashboard() {
  const [selected, setSelected] = useState("products");
  const list = [
    {
      name: "PRODUCTS",
      id: "products",
    },
    {
      name: "USERS",
      id: "users",
    },
    {
      name: "OTHER",
      id: "other",
    },
  ];
  return (
    <>
      <ButtonGroup className="form-control p-0 mb-4">
        {list.map((e) => {
          return (
            <Button
              key={e.name}
              className={`form-control ${
                selected === e.id ? "button-selected" : ""
              }`}
              onClick={() => setSelected(e.id)}
            >
              {e.name}
            </Button>
          );
        })}
      </ButtonGroup>

      {selected === "products" ? (
        <AddEditProducts />
      ) : selected === "users" ? (
        <AddEditUsers />
      ) : (
        <>Other</>
      )}
    </>
  );
}
