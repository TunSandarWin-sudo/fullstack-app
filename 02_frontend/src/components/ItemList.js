import React, { useEffect, useState } from "react";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");

  // 初始加载菜单数据
  useEffect(() => {
    fetch("http://localhost:4000/api/items")
      .then(res => res.json())
      .then(setItems)
      .catch(err => setError(err.message));
  }, []);

  // 新增菜单项
  function addItem() {
    fetch("http://localhost:4000/api/items", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price: parseFloat(price) })
    })
      .then(res => res.json())
      .then(newItem => {
        setItems([...items, newItem]); // 更新前端列表
        setName(""); // 清空输入框
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
    // 列表
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
    // 输入框：名字
    React.createElement("input", {
      type: "text",
      placeholder: "Item name",
      value: name,
      onChange: e => setName(e.target.value),
      style: { marginRight: "8px" }
    }),
    // 输入框：价格
    React.createElement("input", {
      type: "number",
      placeholder: "Price",
      value: price,
      onChange: e => setPrice(e.target.value),
      style: { marginRight: "8px" }
    }),
    // Create 按钮
    React.createElement(
      "button",
      { onClick: addItem },
      "Add Item"
    )
  );
}
