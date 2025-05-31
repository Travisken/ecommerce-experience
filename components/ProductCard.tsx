// "use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus, X } from "lucide-react";
import StarRating from "./starRating";
import type { Product, ProductImageVariants } from "../types/ProductType";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const navigate = useNavigate();
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
    const [showModal, setShowModal] = useState(false);
    const [selectedColor, setSelectedColor] = useState<keyof ProductImageVariants | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const handleCardClick = () => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    
    const cartItem = cartItems.find((item) => item.product.id === product.id);
    const quantity = cartItem?.quantity || 0;

    // Open modal instead of directly adding
    const handleAddClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowModal(true);
    };

    // Confirm add with selected options
    const handleConfirmAdd = () => {
        if (selectedSize && selectedColor) {
            const updatedProduct: Product = {
                ...product,
                selectedSize,
                selectedColor,
            };
            addToCart(updatedProduct);
            setShowModal(false);
            setSelectedSize(null);
            setSelectedColor(null);
            toast.success("Product added successfully")
        } else {
            toast.warn("Please select size and color");
        }
    };

    const handleIncrement = () => updateQuantity(product.id, quantity + 1);

    const handleDecrement = () => {
        if (quantity > 1) updateQuantity(product.id, quantity - 1);
        else removeFromCart(product.id);
    };

    const productRating = product.rating || 4;

    // Get first available image from first ProductImageVariants object
    function getFirstImage(images: ProductImageVariants): string {
        for (const color of Object.keys(images) as Array<keyof ProductImageVariants>) {
            if (images[color] && images[color][0]) return images[color][0];
        }
        return "/placeholder.jpeg";
    }

    const imageMap = product.itemImages[0];
    const displayImage = getFirstImage(imageMap);

    // Colors from first image variant keys
    const availableColors = Object.keys(imageMap) as (keyof ProductImageVariants)[];


    return (
        <>
            <div
                onClick={handleCardClick}
                className="flex relative flex-1 z-0 hover:z-100 flex-col md:group-hover:h-102 h-105 md:h-90 gap-4 cursor-pointer group"
            >
                <div className="absolute -z-10 group-hover:z-100 w-full top-0 left-0 md:group-hover:h-102 h-105 md:h-90 duration-300 transition-all ease-in-out overflow-hidden rounded-xl group-hover:shadow-2xl shadow flex flex-col bg-white">
                    <div className="flex w-full h-52 md:h-46 bg-gray-400 rounded-t-xl overflow-hidden transition-all ease-in-out duration-300">
                        <img src={displayImage} alt={product.name} className="w-full h-full object-cover " />
                    </div>

                    <div className="p-2 md:p-4 flex flex-col gap-2">
                        <h4 className="text-xl capitalize font-semibold">{product.name}</h4>
                        <p className="text-sm text-gray-400 italic">{product.description}</p>
                        <div>
                            <div className="flex justify-between items-center">
                                <StarRating rating={productRating} />
                                <span className="flex px-4 group-hover:text-[#59546c] text-sm font-semibold py-2 bg-gray-100 rounded-xl">
                                    {product.sales} sold
                                </span>
                            </div>
                            <h5 className="text-xl text-[#59546c] font-semibold">${product.price}</h5>
                        </div>
                    </div>

                    <div className="w-full md:opacity-0 md:group-hover:opacity-100 transition-all ease-in-out duration-400 md:h-0 overflow-hidden group-hover:h-fit p-2">
                        {quantity === 0 ? (
                            <button
                                onClick={handleAddClick}
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

            {showModal && (
                <div
                    className="fixed inset-0 z-5000 flex items-center justify-center bg-black/50"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-xl w-full max-w-md p-6 
              transform transition-transform duration-300
              md:mx-auto md:my-auto
              fixed bottom-0 md:static
              md:rounded-xl
              md:translate-y-0
              animate-slide-up md:animate-fade-in"
                    >
                        {/* Close button */}
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                            aria-label="Close modal"
                        >
                            <X size={24} />
                        </button>

                        <h3 className="text-lg font-semibold mb-4">Select size and color</h3>

                        {/* Color selection */}
                        <div className="mb-4">
                            <label className="block mb-1 font-medium">Color</label>
                            <div className="flex gap-3 flex-wrap">
                                {availableColors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`px-6 py-2 rounded-full border ${selectedColor === color
                                                ? "bg-[#59546c] text-white border-transparent"
                                                : "bg-gray-100 border-gray-300"
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Size selection */}
                        <div className="mb-6">
                            <label className="block mb-1 font-medium">Size</label>
                            <div className="flex gap-3 flex-wrap">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`px-4 py-2 rounded-full border ${selectedSize === size
                                                ? "bg-[#59546c] text-white border-transparent"
                                                : "bg-gray-100 border-gray-300"
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleConfirmAdd}
                            className="w-full bg-[#59546c] text-white py-3 rounded-xl font-semibold hover:bg-[#4a4355] transition"
                        >
                            Add to cart
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
