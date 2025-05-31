import { useState, useEffect, useRef } from "react";
import { Home, Search, ShoppingCart, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Products from "../lib/data";
import type { Product, ProductImageVariants } from "../types/ProductType";

export default function Navbar() {
    const [query, setQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (query.trim() === "") {
            setFilteredProducts([]);
            setShowDropdown(false);
            return;
        }

        const results = Products.filter((product) =>
            product.name.toLowerCase().includes(query.toLowerCase())
        );
        setFilteredProducts(results);
        setShowDropdown(true);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    function getImageBySelectedColor(
        images: ProductImageVariants,
        selectedColor?: keyof ProductImageVariants
    ): string {
        if (selectedColor && images[selectedColor] && images[selectedColor][0]) {
            return images[selectedColor][0];
        }

        for (const color of Object.keys(images) as Array<keyof ProductImageVariants>) {
            if (images[color] && images[color][0]) return images[color][0];
        }

        return "/placeholder.jpg";
    }

    return (
        <nav className="bg-white shadow-md md:px-14 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between relative">
            <div
                className="flex items-center border h-14 py-2 border-gray-300 md:w-1/2 rounded-full px-2 w-full sm:w-auto mb-3 sm:mb-0 relative"
                ref={dropdownRef}
            >
                <input
                    type="text"
                    placeholder="Search products..."
                    className="border-none outline-none input px-4 flex-1 h-full"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => {
                        if (filteredProducts.length > 0) {
                            setShowDropdown(true);
                        }
                    }}
                />
                <button
                    aria-label={query ? "Clear search" : "Search"}
                    onClick={() => {
                        setQuery("");
                        setFilteredProducts([]);
                        setShowDropdown(false);
                    }}
                    className="bg-gray-50 rounded-full hover:bg-[#59546c] hover:text-white transition-all ease-in-out duration-300 text-black h-full aspect-square justify-center flex items-center"
                >
                    {query ? <X size={20} /> : <Search size={20} />}
                </button>

                {/* Search Results Dropdown */}
                {showDropdown && (
                    <ul className="absolute top-full left-0 right-0 bg-white border border-gray-200 shadow shadow-gray-200 mt-1 max-h-60 overflow-auto rounded-xl z-50">
                        {filteredProducts.length > 0 ? (
                            filteredProducts.map((product) => {
                                const imageMap = product.itemImages[0];
                                const selectedColorKey = product.selectedColor || undefined;
                                const displayImage = getImageBySelectedColor(imageMap, selectedColorKey);

                                return (
                                    <li
                                        key={product.id}
                                        className="px-4 py-2 hover:bg-gray-50 border-b border-b-gray-100 flex gap-6 cursor-pointer"
                                        onClick={() => {
                                            navigate(`/product/${product.id}`);
                                            setQuery("");
                                            setFilteredProducts([]);
                                            setShowDropdown(false);
                                        }}
                                    >
                                        <div className="rounded-xl h-20 aspect-square overflow-hidden bg-gray-100">
                                            <img
                                                src={displayImage}
                                                alt={product.name}
                                                className="object-cover w-full h-full"
                                            />
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <p className="font-semibold text-base">{product.name}</p>
                                            <div className="flex gap-4 items-center">
                                                <p>${product.price}.00</p>
                                                <p className="text-green-500 font-semibold text-sm">
                                                    {product.discount}% off
                                                </p>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })
                        ) : (
                            <li className="px-4 py-4 text-gray-500 text-center">
                                No product found for "<span className="font-medium">{query}</span>"
                            </li>
                        )}
                    </ul>
                )}

            </div>

            <div className="flex space-x-6 justify-between sm:justify-end">
                <Link
                    to="/"
                    className="text-gray-700 flex gap-2 items-center hover:text-[#59546c] font-medium transition-colors"
                >
                    <Home />
                    Home
                </Link>
                <Link
                    to="/cart"
                    className="text-gray-700 flex gap-2 items-center hover:text-[#59546c] font-medium transition-colors"
                >
                    <ShoppingCart />
                    Cart
                </Link>
            </div>
        </nav>
    );
}
