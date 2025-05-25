"use client";

import { ShoppingCart, Plus, Minus } from "lucide-react";
import StarRating from "./starRating";
import type { Product, ProductImageVariants } from "../types/ProductType";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

    const handleCardClick = () => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    const cartItem = cartItems.find(item => item.product.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleAdd = () => addToCart(product);
    const handleIncrement = () => updateQuantity(product.id, quantity + 1);
    const handleDecrement = () => {
        if (quantity > 1) updateQuantity(product.id, quantity - 1);
        else removeFromCart(product.id);
    };

    const productRating = 4;

    function getFirstImage(images: ProductImageVariants): string {
        for (const color of Object.keys(images) as Array<keyof ProductImageVariants>) {
            if (images[color][0]) return images[color][0];
        }
        return "/placeholder.jpg";
    }

    // Usage
    const imageMap = product.itemImages[0];
    const displayImage = getFirstImage(imageMap);


    return (
        <div onClick={handleCardClick} className="flex relative z-0 hover:z-100 flex-col md:group-hover:h-102 h-105 md:h-90 gap-4 cursor-pointer group">
            <div className="absolute -z-10 group-hover:z-100 w-full top-0 left-0 md:group-hover:h-102 h-105 md:h-90 duration-300 transition-all ease-in-out overflow-hidden rounded-xl group-hover:shadow-2xl shadow flex flex-col bg-white">
                <div className="flex w-full h-52 md:h-46 bg-gray-400 rounded-t-xl overflow-hidden transition-all ease-in-out duration-300">
                    <img src={displayImage} alt={product.name} className="w-full h-full object-cover " />
                </div>

                <div className="p-2 md:p-4 flex flex-col gap-2">
                    <h4 className="text-xl capitalize font-semibold">{product.name}</h4>
                    <p className="text-sm text-gray-400 italic">
                        {product.description}
                    </p>
                    <div>
                        <div className="flex justify-between items-center">
                            <StarRating rating={productRating} />
                            <span className="flex px-4 group-hover:text-[#59546c] text-sm font-semibold py-2 bg-gray-100 rounded-xl">
                                {product.sales} sold
                            </span>
                        </div>
                        <h5 className="text-xl text-[#59546c] font-semibold">
                            ₦{product.price}
                        </h5>
                    </div>
                </div>

                <div className="w-full md:opacity-0 md:group-hover:opacity-100 transition-all ease-in-out duration-400 md:h-0 overflow-hidden group-hover:h-fit p-2">
                    {quantity === 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAdd();
                            }}
                            className="flex transition-all duration-300 ease-in-out items-center justify-center gap-4 bg-black/90 hover:bg-black w-full text-white py-3 rounded-xl"
                        >
                            <ShoppingCart />
                            Add to cart
                        </button>
                    ) : (
                        <div className="flex items-center justify-between bg-gray-100 rounded-xl p-2">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecrement();
                                }}
                                className="p-2 rounded-xl bg-black/70 hover:bg-[#59546c] transition-all ease-in-out duration-300 text-white"
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-lg font-semibold">{quantity}</span>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleIncrement();
                                }}
                                className="p-2 rounded-xl bg-black/70 hover:bg-[#59546c] transition-all ease-in-out duration-300 text-white"
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
