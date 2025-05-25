"use client";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext"; // Adjust the path as needed
import { useEffect, useState } from "react";
import "../src/App.css"; // Import your CSS

export default function CartButton() {
  const { totalItems } = useCart();
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (totalItems > 0) {
      setIsBouncing(true);
      const timer = setTimeout(() => setIsBouncing(false), 500); // Match animation duration
      return () => clearTimeout(timer);
    }
  }, [totalItems]);

  return (
    <a href="/cart"
      className={`text-white border-white border-4 outline-dashed hover:outline-[#59546c] hover:outline-4 outline-0 transition-all duration-400 ease-in-out z-150 bg-black/90 hover:bg-[#59546c] cursor-pointer fixed bottom-10 right-10 flex items-center justify-center rounded-full h-16 w-16 ${isBouncing ? 'bounce' : ''}`}
    >
      <ShoppingCart />
    </a>
  );
}
