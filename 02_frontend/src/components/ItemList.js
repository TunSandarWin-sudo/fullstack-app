import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL; // 从环境变量读取

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/items`)
      .then(res => res.json())
      .then(setItems)
      .catch(err => setError(err.message));
  }, []);

  function addItem() {
    fetch(`${API_BASE}/api/items`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price) })
    })
      .then(res => res.json())
      .then(newItem => {
        setItems([...items, newItem]);
        setName("");
        setPrice("");
      })
      .catch(err => setError(err.message));
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div style={{ padding: "12px" }}>
      <ul>
        {items.map(i => (
          <li key={i.id}>
            {i.name} — ${Number(i.price).toFixed(2)}
          </li>
        ))}
      </ul>

      <input
        type="text"
        placeholder="Item name"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ marginRight: "8px" }}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(e.target.value)}
        style={{ marginRight: "8px" }}
      />

      <button onClick={addItem}>Add Item</button>
    </div>
  );
}
