// import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CartButton from "../components/cartButton";
import { CartProvider } from "../context/CartContext";
import ProductDetails from "./pages/ProductDetails";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CartPage from "./pages/Cart";

function App() {
  return (
    <>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/product/:id" element={<ProductDetails />} />
        </Routes>
        <CartButton />
         <ToastContainer position="top-right" />
      </CartProvider>
    </>

  );
}

export default App;
