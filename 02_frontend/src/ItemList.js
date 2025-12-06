import React, { useEffect, useState } from "react";

function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:4000/api/items")
      .then(res => res.json())
      .then(setItems)
      .catch(err => setError(err.message));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <ul>
      {items.map(i => (
        <li key={i.id}>
          {i.name} — ${Number(i.price).toFixed(2)}
        </li>
      ))}
    </ul>
  );
}

export default ItemList;
