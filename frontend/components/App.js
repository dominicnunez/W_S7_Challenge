import React from "react";
import Home from "./Home";
import Form from "./Form";
import { NavLink, Routes, Route } from "react-router-dom";
import { useState } from "react";

function App() {
  // const [activePath, setActivePath] = useState("Home");

  return (
    <div id="app">
      <nav>
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Home
        </NavLink>
        <NavLink
          to="/order"
          className={({ isActive }) => (isActive ? "active" : "")}
        >
          Order
        </NavLink>
      </nav>
      {/* Route and Routes here */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="order" element={<Form />} />
      </Routes>
      {/* <Home /> */}
      {/* <Form /> */}
    </div>
  );
}

export default App;
