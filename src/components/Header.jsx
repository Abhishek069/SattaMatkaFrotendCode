import React from "react";

const Header = () => {
  return (
    <header className="bg-warning m-1 border border-white py-3 text-center d-flex justify-content-between">
      <h1 className="m-0 text-danger fw-bold" style={{ fontFamily: "cursive", fontSize: "2rem" }}>
        <span className="text-pink">Satta Matka </span>Aajj Tak
      </h1>
      <button className="btn btn-primary">Login</button>
    </header>
  );
};

export default Header;
