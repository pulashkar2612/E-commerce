import axios from "axios";
import { useEffect, useState } from "react";
import { urls } from "../../utils/urls";

export default function AddEditUsers() {
  const [users, setUsers] = useState([]);

  function getAllUsers() {
    axios.get(urls.getAllUsers).then((res) => {
      setUsers(res.data);
    });
  }

  useEffect(() => {
    getAllUsers();
  }, []);
  return (
    <>
      <div>
        <ul>
          {users.map((e) => {
            return (
              <li>
                {e.username} - {e.role}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
}
