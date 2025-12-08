import React, { useEffect, useState } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

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
    return React.createElement("p", { style: { color: "red" } }, error);
  }

  return React.createElement(
    "div",
    { style: { padding: "12px" } },
    React.createElement(
      "ul",
      null,
      items.map(i =>
        React.createElement(
          "li",
          { key: i.id },
          `${i.name} — $${Number(i.price).toFixed(2)}`
        )
      )
    ),
    React.createElement("input", {
      type: "text",
      placeholder: "Item name",
      value: name,
      onChange: e => setName(e.target.value),
      style: { marginRight: "8px" }
    }),
    React.createElement("input", {
      type: "number",
      placeholder: "Price",
      value: price,
      onChange: e => setPrice(e.target.value),
      style: { marginRight: "8px" }
    }),
    React.createElement("button", { onClick: addItem }, "Add Item")
  );
}
