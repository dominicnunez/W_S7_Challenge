import React from "react";
import Home from "./Home";
import Form from "./Form";
import { NavLink, Routes, Route } from "react-router-dom";

function App() {
  const getActiveProps = ({ isActive }) => ({
    className: isActive ? "active" : undefined, "aria-current": isActive ? "page" : undefined,
  });

  return (
    <div id="app">
      <nav>
        <NavLink to="/" className={getActiveProps}>
          Home
        </NavLink>
        <NavLink to="/order" className={getActiveProps}>
          Order
        </NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/order" element={<Form />} />
      </Routes>
    </div>
  );
}

export default App;
