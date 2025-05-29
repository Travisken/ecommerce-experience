/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable react-hooks/rules-of-hooks */
import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import type { Product, ProductImageVariants } from "../../types/ProductType";
import StarRating from "../../components/starRating";
import { Heart, Minus, Plus, Search, Share, ShoppingCart } from "lucide-react";
import { toast } from "react-toastify";
import { useCart } from "../../context/CartContext";
import Products from "../../lib/data"

export default function ProductDetails() {
    const { id } = useParams();
    const { state } = useLocation();
    const [product, setProduct] = useState<Product | undefined>(state?.product);
    const [selectedColor, setSelectedColor] = useState<keyof ProductImageVariants | null>(null);
    const [selectedSize, setSelectedSize] = useState("");
    const [mainImage, setMainImage] = useState("/placeholder-image.png");
    const [zoomActive, setZoomActive] = useState(false);
    const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
    const [wishlistAdded, setWishlistAdded] = useState(false);
    const hasSyncedFromCart = useRef(false);

    const { cartItems, addToCart, removeFromCart, updateQuantity, updateCartItemAttributes } = useCart();
    const cartItem = cartItems.find((item) => item.product?.id === product?.id);
    const quantity = cartItem?.quantity ?? 0;

    // Load product from ID, state, or localStorage
    useEffect(() => {
        if (!product && id) {
            const localProduct = Products.find((p) => p.id === Number(id));
            if (localProduct) {
                setProduct(localProduct);
                return;
            }

            const saved = localStorage.getItem("products");
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    const fromStorage = parsed.find((p: Product) => p.id === Number(id));
                    if (fromStorage) setProduct(fromStorage);
                } catch (e) {
                    console.error("Failed to parse localStorage:", e);
                }
            }
        }
    }, [id, product]);

    // Get available colors
    const colors = (product?.itemImages?.[0] ? Object.keys(product.itemImages[0]) : []) as (keyof ProductImageVariants)[];

    // Check if product has valid images for a color
    const hasImages = (color: keyof ProductImageVariants): boolean => {
        return (
            product?.itemImages?.some(
                (variant) =>
                    Array.isArray(variant[color]) &&
                    variant[color].some((img) => typeof img === "string" && img.trim() !== "")
            ) ?? false
        );
    };

    // Find first valid color with images
    const getFirstValidColor = (): keyof ProductImageVariants | null => {
        if (!product?.itemImages?.[0]) return null;
        const availableColors = Object.keys(product.itemImages[0]) as (keyof ProductImageVariants)[];
        return availableColors.find(color => hasImages(color)) || null;
    };

    // Sync main image when product or color changes
    useEffect(() => {
        if (!product?.itemImages?.[0]) {
            setMainImage("/placeholder-image.png");
            return;
        }

        const colorToUse = selectedColor || getFirstValidColor();
        if (!colorToUse) {
            setMainImage("/placeholder-image.png");
            return;
        }

        const images = product.itemImages[0][colorToUse]?.filter(Boolean);
        if (images?.length) {
            setMainImage(images[0]);
        } else {
            setMainImage("/placeholder-image.png");
        }
    }, [product, selectedColor]);

    // Sync selection from cart once
    useEffect(() => {
        if (!hasSyncedFromCart.current && cartItem) {
            if (cartItem.product?.selectedColor && hasImages(cartItem.product.selectedColor)) {
                setSelectedColor(cartItem.product.selectedColor);
            }
            if (cartItem.product?.selectedSize) {
                setSelectedSize(cartItem.product.selectedSize);
            }
            hasSyncedFromCart.current = true;
        }
    }, [cartItem]);

    // Update cart attributes when selection changes
    useEffect(() => {
        if (cartItem && product?.id) {
            updateCartItemAttributes(product.id, {
                selectedColor: selectedColor || undefined,
                selectedSize,
            });
        }
    }, [selectedColor, selectedSize]);

    // Color handler
    const handleColorSelect = (color: keyof ProductImageVariants) => {
        if (!hasImages(color)) return;
        setSelectedColor(color);
    };

    // Replace the thumbnail generation logic with:
    const effectiveColor = selectedColor || getFirstValidColor();
    const thumbnails =
        effectiveColor && product?.itemImages[0][effectiveColor]
            ? product.itemImages[0][effectiveColor].filter(Boolean).slice(0, 3)
            : [];

    // Update the initial state to:
    // const [selectedColor, setSelectedColor] = useState<keyof ProductImageVariants | null>(null);

    // Add this effect to set initial color when product loads:
    useEffect(() => {
        if (product?.itemImages?.[0]) {
            const firstColor = getFirstValidColor();
            if (firstColor && !selectedColor) {
                setSelectedColor(firstColor);
            }
        }
    }, [product]);

    // Zoom handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!zoomActive) return;
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - left) / width) * 100;
        const y = ((e.clientY - top) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
    };

    const handleMouseLeave = () => {
        if (zoomActive) setZoomStyle({ transform: "scale(1)" });
    };

    const handleTouchStart = () => setZoomActive(true);
    const handleTouchEnd = () => {
        setZoomActive(false);
        setZoomStyle({ transform: "scale(1)" });
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!zoomActive) return;
        const touch = e.touches[0];
        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = ((touch.clientX - left) / width) * 100;
        const y = ((touch.clientY - top) / height) * 100;
        setZoomStyle({ transformOrigin: `${x}% ${y}%`, transform: "scale(2)" });
    };

    // Thumbnail click changes main image
    const handleThumbnailClick = (imgSrc: string) => {
        setMainImage(imgSrc);
    };

    // Cart Actions
    const handleIncrement = () => product?.id && updateQuantity(product.id, quantity + 1);
    const handleDecrement = () => {
        if (!product?.id) return;
        quantity > 1 ? updateQuantity(product.id, quantity - 1) : removeFromCart(product.id);
    };

    const handleAddToCart = () => {
        if (!selectedColor) return toast.error("Please select a color.");
        if (!selectedSize) return toast.error("Please select a size.");

        const updatedProduct: Product = { ...product!, selectedColor, selectedSize };
        toast.success(`Added to cart: ${product?.name}, Color: ${selectedColor}, Size: ${selectedSize}`);
        addToCart(updatedProduct);
    };

    const handleAddToWishlist = () => {
        setWishlistAdded((prev) => {
            toast[prev ? "info" : "success"](
                `${product?.name} ${prev ? "removed from" : "added to"} your wishlist!`
            );
            return !prev;
        });
    };

    const handleShare = async () => {
        const shareData = {
            title: product?.name,
            text: product?.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
                toast.success("Shared successfully!");
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Product link copied to clipboard!");
            }
        } catch (err) {
            console.error("Share error:", err);
            toast.error("Sharing failed or canceled.");
        }
    };

    if (!product) {
        return <p>Product not found. Try reloading from the product list.</p>;
    }

    const firstValidColor = getFirstValidColor();

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
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/placeholder-image.png";
                                }}
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
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder-image.png";
                        }}
                    />
                    <button
                        className="bg-white p-3 rounded-xl absolute bottom-4 right-4 cursor-pointer"
                        onClick={() => setZoomActive((prev) => !prev)}
                        aria-label={zoomActive ? "Zoom out" : "Zoom in"}
                    >
                        <Search />
                    </button>
                </div>
            </div>

            {/* Product Info Section */}
            <div className="flex flex-col max-md:gap-10 gap-8 flex-1 md:justify-between">
                <div>
                    <h1 className="md:text-2xl font-semibold text-xl">{product.name}</h1>
                    <p className="text-gray-500 italic line-clamp-2">{product.description}</p>
                    <div className="font-semibold flex gap-4 text-sm">
                        <p>{product.sales} Sold</p>
                        <StarRating rating={product.rating} />
                        <p>{product.review.length} Reviews</p>
                    </div>
                </div>

                <div>
                    <h2 className="text-2xl font-bold">${product.price}</h2>
                    {product.discount !== 0 && (
                        <p className="text-green-500 font-semibold text-sm">{product.discount}% off</p>
                    )}
                </div>

                {/* Color Selector */}
                <div className="flex flex-col gap-4">
                    <h3 className="text-xl font-semibold">Select Color</h3>
                    <div className="flex gap-3">
                        {colors.map((color, index) => {
                            const colorHasImages = hasImages(color);
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleColorSelect(color)}
                                    className={`aspect-square h-16 rounded-xl border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                                        } ${!colorHasImages ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                                        } ${color === firstValidColor && !selectedColor ? "ring-2 ring-blue-500" : ""
                                        }`}
                                    style={{ backgroundColor: color }}
                                    aria-label={`Select color ${color}`}
                                    disabled={!colorHasImages}
                                    title={!colorHasImages ? "No images available for this color" : color}
                                />
                            );
                        })}
                    </div>
                </div>

                {/* Size Selector */}
                <div>
                    <h3 className="text-xl font-semibold">Select Size</h3>
                    <div className="flex gap-3 flex-wrap">
                        {product.sizes.map((size, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedSize(size)}
                                className={`w-20 h-12 flex items-center justify-center font-semibold uppercase rounded-xl border-2 ${selectedSize === size ? "border-black" : "border-gray-100"
                                    }`}
                                aria-label={`Select size ${size}`}
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
                            onClick={handleAddToCart}
                            className="flex transition-all duration-300 ease-in-out items-center justify-center gap-4 bg-black/90 text-white font-semibold rounded-xl px-6 py-3"
                            aria-label="Add to cart"
                        >
                            <ShoppingCart />
                            Add to cart
                        </button>
                    ) : (
                        <div className="flex items-center gap-3 w-full justify-between">
                            <button
                                aria-label="Decrease quantity"
                                onClick={handleDecrement}
                                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl"
                            >
                                <Minus />
                            </button>
                            <span aria-live="polite">{quantity}</span>
                            <button
                                aria-label="Increase quantity"
                                onClick={handleIncrement}
                                className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-xl"
                            >
                                <Plus />
                            </button>
                        </div>
                    )}
                </div>

                {/* Wishlist and Share Buttons */}
                <div className="w-full flex text-sm">
                    <button
                        onClick={handleShare}
                        className="border-r flex-1 flex gap-4 items-center py-2 justify-center border-gray-200 cursor-pointer select-none"
                        aria-label="Share product"
                    >
                        <Share />
                        Share
                    </button>
                    <button
                        onClick={handleAddToWishlist}
                        className="flex gap-4 items-center py-2 justify-center flex-1 cursor-pointer select-none"
                        aria-label={wishlistAdded ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            className={wishlistAdded ? "text-red-600 fill-red-600" : ""}
                            strokeWidth={1.5}
                        />
                        {wishlistAdded ? "Remove from Wishlist" : "Add to Wishlist"}
                    </button>
                </div>
            </div>
        </div>
    );
}