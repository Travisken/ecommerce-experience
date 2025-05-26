import { Minus, Plus, Trash } from "lucide-react";
import { useCart } from "../context/CartContext";
import type { Product, ProductImageVariants } from "../types/ProductType";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
    product: Product;
}

export default function CartCard({ product }: ProductCardProps) {
    const { cartItems, removeFromCart, updateQuantity } = useCart();
    const navigate = useNavigate();

    const cartItem = cartItems.find((item) => item.product.id === product.id);
    const quantity = cartItem?.quantity || 0;

    const handleIncrement = () => updateQuantity(product.id, quantity + 1);

    const handleDecrement = () => {
        if (quantity > 1) updateQuantity(product.id, quantity - 1);
        else removeFromCart(product.id);
    };

    const handleRemove = () => removeFromCart(product.id);

    // Assuming product.price is a number or string; format as needed
    const formattedPrice =
        typeof product.price === "number"
            ? product.price.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
            })
            : product.price;





    function getImageBySelectedColor(
        images: ProductImageVariants,
        selectedColor?: keyof ProductImageVariants
    ): string {
        if (selectedColor && images[selectedColor] && images[selectedColor][0]) {
            return images[selectedColor][0];
        }

        // Fallback to first available image
        for (const color of Object.keys(images) as Array<keyof ProductImageVariants>) {
            if (images[color] && images[color][0]) return images[color][0];
        }

        return "/placeholder.jpg";
    }



    const imageMap = product.itemImages[0];
    const selectedColorKey = product.selectedColor || undefined;
    const displayImage = getImageBySelectedColor(imageMap, selectedColorKey);



    const handleCardClick = () => {
        navigate(`/product/${product.id}`, { state: { product } });
    };

    return (
        <div className="border-b-2  flex max-md:flex-col gap-6 border-gray-100 p-4 relative">
            <div className="bg-gray-100 aspect-square max-md:w-full h-60 flex items-center justify-center">
                <img src={displayImage} alt={product.name} className="w-full h-full object-cover " />
            </div>
            <div className="w-full flex flex-col gap-6">
                <div>
                    <h3 className="text-2xl font-semibold">{product.name}</h3>
                    <h4 className="text-xl font-medium text-[#59546c]">{formattedPrice}</h4>
                </div>

                <div className="flex  overflow-hidden text-center text-sm max-w-[300px]">
                    <div className="border-r border-gray-300 flex-1 py-1">
                        {product.selectedColor || "No Color"}
                    </div>
                    <div className="flex-1 py-1">{product.selectedSize || "No Size"}</div>
                </div>

                <div>
                    <div className="flex items-center justify-between max-w-[40%] rounded-xl">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDecrement();
                            }}
                            className="p-2 rounded-xl bg-black/70 hover:bg-[#59546c] transition-all ease-in-out duration-300 text-white"
                            aria-label="Decrease quantity"
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
                            aria-label="Increase quantity"
                        >
                            <Plus size={20} />
                        </button>
                    </div>
                </div>

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleRemove();
                    }}
                    className="text-red-500 p-2 bg-gray-300 rounded absolute top-4 right-4 hover:bg-red-100 transition-colors"
                    aria-label={`Remove ${product.name} from cart`}
                >
                    <Trash />
                </button>

                <button onClick={handleCardClick} className="rounded-xl bg-black/90 text-center text-white py-3 md:w-[50%]">
                    View item
                </button>
            </div>
        </div>
    );
}
