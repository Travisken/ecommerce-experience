/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import type { Product, ProductImageVariants } from "../../types/ProductType";
import StarRating from "../../components/starRating";
import { Heart, Minus, Plus, Search, Share, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";

export default function ProductDetails() {
    const { state } = useLocation();
    const { id } = useParams();
    const product: Product | undefined = state?.product;

    // Show fallback if no product found
    if (!product) {
        return <p>Product not found. Try reloading from the product list.</p>;
    }

    // Extract color keys from first image object, fallback to empty array
    const colors = Object.keys(product.itemImages?.[0] || {}) as (keyof ProductImageVariants)[];

    // Determine the first available color with images
    const firstColor =
        colors.length > 0 && colors[0] in product.itemImages[0] ? colors[0] : "";

    // Check if product has valid images for given color
    const hasImages = (color: keyof ProductImageVariants) => {
        if (!product.itemImages || !Array.isArray(product.itemImages)) return false;

        return product.itemImages.some(
            (obj) =>
                Array.isArray(obj[color]) &&
                obj[color].some((img) => typeof img === "string" && img.trim() !== "")
        );
    };

    // State for selected color and size
    const [selectedColor, setSelectedColor] = useState<keyof ProductImageVariants | "">(firstColor);
    const [selectedSize, setSelectedSize] = useState("");
    const [mainImage, setMainImage] = useState("");
    const [zoomActive, setZoomActive] = useState(false);
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});

    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();

    // Update main image when selectedColor or product changes
    useEffect(() => {
        if (selectedColor && hasImages(selectedColor)) {
            setMainImage(product.itemImages[0][selectedColor][0]);
        } else {
            setMainImage("/placeholder-image.png");
        }
    }, [selectedColor, product]);

    // Color selection handler
    const handleColorSelect = (color: keyof ProductImageVariants) => {
        if (!hasImages(color)) return;
        setSelectedColor(color);
    };

    // Thumbnail click changes main image
    const handleThumbnailClick = (imgSrc: string) => {
        setMainImage(imgSrc);
    };

    // Zoom handlers for mouse & touch

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoomActive) return;

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(2)",
        });
    };

    const handleMouseLeave = () => {
        if (!zoomActive) return;
        setZoomStyle({ transform: "scale(1)" });
    };

    const handleTouchStart = () => {
        setZoomActive(true);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!zoomActive) return;

        e.preventDefault();

        const touch = e.touches[0];
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((touch.clientX - left) / width) * 100;
        const y = ((touch.clientY - top) / height) * 100;

        setZoomStyle({
            transformOrigin: `${x}% ${y}%`,
            transform: "scale(2)",
        });
    };

    const handleTouchEnd = () => {
        setZoomActive(false);
        setZoomStyle({ transform: "scale(1)" });
    };

    // Thumbnails limited to 3 images of selected color
    const thumbnails =
        selectedColor && product.itemImages[0][selectedColor]?.some((img) => img.trim() !== "")
            ? product.itemImages[0][selectedColor].slice(0, 3)
            : [];

    // Cart handlers
    const cartItem = cartItems.find((item) => item.product.id === product.id);
    const quantity = cartItem?.quantity ?? 0;

    const handleIncrement = () => updateQuantity(product.id, quantity + 1);
    const handleDecrement = () => {
        if (quantity > 1) updateQuantity(product.id, quantity - 1);
        else removeFromCart(product.id);
    };

    // Add to cart with size validation and toast
    const handleAddToCart = () => {
        if (!selectedSize) {
            toast.error("Please select a size before adding to cart.");
            return;
        }
        if (!selectedColor) {
            toast.error("Please select a color before adding to cart.");
            return;
        }

        // Create updated product with selected size and color
        const updatedProduct: Product = {
            ...product,
            selectedSize,
            selectedColor,
        };

        toast.success(`Added to cart: ${product.name}, Color: ${selectedColor}, Size: ${selectedSize}`);
        addToCart(updatedProduct);
    };

    // Wishlist toggle
    const [wishlistAdded, setWishlistAdded] = useState(false);

    const handleAddToWishlist = () => {
        setWishlistAdded((prev) => {
            if (!prev) {
                toast.success(`${product.name} added to your wishlist!`);
            } else {
                toast.info(`${product.name} removed from your wishlist.`);
            }
            return !prev;
        });
    };

    // Share product using Web Share API or fallback to clipboard
    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: product.description,
            url: window.location.href,
        };

        if (navigator.share) {
            try {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } catch (err) {
                console.error("Share API error:", err);
                toast.error("Sharing canceled or failed");
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied to clipboard!");
            } catch (err) {
                console.error("Clipboard write error:", err);
                toast.error("Failed to copy product link.");
            }
        }
    };

    return (
        <div
            key={id}
            className="md:p-8 p-4 w-full flex max-md:flex-col gap-10 justify-between"
        >
            {/* Images Section */}
            <div className="flex max-md:flex-col-reverse gap-4 md:w-[60%] w-full">
                <div className="md:w-[15%] w-full max-md:h-[20%] flex md:flex-col flex-row gap-4">
                    {thumbnails.map((imgSrc: string, index: number) => (
                        <div
                            key={index}
                            className={`w-full aspect-square bg-gray-100 rounded-xl overflow-hidden cursor-pointer ${mainImage === imgSrc ? "ring-2 ring-black" : ""
                                }`}
                            onClick={() => handleThumbnailClick(imgSrc)}
                        >
                            <img
                                src={imgSrc}
                                alt={`Thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
                <div
                    className={`flex-1 bg-gray-200 transition-transform duration-300 ease-in-out rounded-xl min-h-[20rem] md:max-h-[35rem] relative overflow-hidden ${zoomActive ? "cursor-zoom-in" : ""
                        }`}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onTouchCancel={handleTouchEnd}
                    style={{ touchAction: "none" }}
                >
                    <img
                        src={mainImage}
                        alt="Main Product"
                        className="w-full h-full object-cover transition-transform duration-200"
                        style={zoomActive ? zoomStyle : {}}
                    />
                    <div
                        className="bg-white p-3 rounded-xl absolute bottom-4 right-4 cursor-pointer"
                        onClick={() => setZoomActive((prev) => !prev)}
                        aria-label="Toggle zoom"
                    >
                        <Search />
                    </div>
                </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col max-md:gap-10 gap-8 flex-1 md:justify-between">
                <div>
                    <h2 className="md:text-2xl font-semibold text-xl">{product.name}</h2>
                    <p className="text-gray-500 italic line-clamp-2">{product.description}</p>
                    <div className="font-semibold flex gap-4 text-sm">
                        <p>{product.sales} Sold</p>
                        <StarRating rating={product.rating} />
                        <p>{product.review.length} Reviews</p>
                    </div>
                </div>

                <div>
                    <h1 className="text-2xl font-bold">${product.price}</h1>
                    {product.discount !== 0 && (
                        <p className="text-green-500 font-semibold text-sm">{product.discount}% off</p>
                    )}
                </div>

                {/* Color Selector */}
                <div className="flex flex-col gap-4">
                    <h4 className="text-xl font-semibold">Select Color</h4>
                    <div className="flex gap-3">
                        {colors.map((color, index) => {
                            const colorHasImages = hasImages(color);
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleColorSelect(color)}
                                    className={`aspect-square h-16 rounded-xl border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                                        } ${!colorHasImages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                    disabled={!colorHasImages}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Size Selector */}
                <div>
                    <h4 className="text-xl font-semibold">Select Size</h4>
                    <div className="flex gap-3 flex-wrap">
                        {product.sizes.map((size, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedSize(size)}
                                className={`w-20 h-12 flex items-center justify-center font-semibold uppercase rounded-xl border-2 ${selectedSize === size ? "border-black" : "border-gray-100"
                                    }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Add to Cart Button and Quantity Controls */}
                <div className="flex flex-col gap-4">
                    {quantity === 0 ? (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleAddToCart();
                            }}
                            className="flex transition-all duration-300 ease-in-out items-center justify-center gap-4 bg-black/90 text-white font-semibold rounded-xl px-6 py-3"
                        >
                            <ShoppingCart />
                            Add to cart
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 w-full  justify-between">
                            <button
                                aria-label="Decrease quantity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDecrement();
                                }}
                                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl"
                            >
                                <Minus />
                            </button>
                            <div>{quantity}</div>
                            <button
                                aria-label="Increase quantity"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleIncrement();
                                }}
                                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl"
                            >
                                <Plus />
                            </button>
                        </div>
                    )}
                </div>

                {/* Wishlist and Share Buttons */}
                <div className="w-full flex text-sm">
                    <div
                        onClick={handleShare}
                        className="border-r flex-1 flex gap-4 items-center py-2 justify-center border-gray-200 cursor-pointer select-none"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleShare();
                        }}
                        aria-label="Share product"
                    >
                        <Share />
                        Share
                    </div>
                    <div
                        onClick={handleAddToWishlist}
                        className="flex gap-4 items-center py-2 justify-center flex-1 cursor-pointer select-none"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleAddToWishlist();
                        }}
                        aria-label={wishlistAdded ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            className={wishlistAdded ? "text-red-600 fill-red-600" : ""}
                            strokeWidth={1.5}
                        />
                        {wishlistAdded ? "Remove from Wishlist" : "Add to Wishlist"}
                    </div>
                </div>
            </div>
        </div>
    );
}
