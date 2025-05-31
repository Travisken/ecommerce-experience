
import { useState } from "react";
import CartCard from "../../components/cartCard";
import { useCart } from "../../context/CartContext";
import PaymentStepper from "../../components/paymentStepper"

export default function CartPage() {
    const { cartItems } = useCart();
    const [isOpen, SetIsOpen] = useState(false)

    if (cartItems.length === 0) {
        return <p className="p-4 text-center">Your cart is empty.</p>;
    }

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + Number(item.product.price || 0) * (item.quantity || 1),
        0
    );

    function handleOpen() {
        console.log(isOpen)
        SetIsOpen(true)
    }


    const handleCheckout = () => {
        // You can add real checkout logic here
        handleOpen()
        // toast.success("Checkout successful!");
        // Optionally clear cart:
        // setCartItems([]);
    };


    return (

        <>
            <section className="flex gap-10 md:p-10 p-4 max-md:flex-col h-screen p-4 w-full">
                <div className="overflow-scroll md:w-[60%] h-screen ">
                    <div className="flex  w-full flex-col overflow-y-scroll gap-4 p-4">
                        {cartItems.map(({ product }) => (
                            <CartCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>

                <div className="bg-gray-200  rounded-xl h-fit flex-1 p-4">
                    <ul>
                        {cartItems.map((item) => (
                            <li key={item.product.id} className="flex justify-between border-b border-b-gray-200 py-2">
                                <span>{item.product.name} x {item.quantity}</span>
                                <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                            </li>

                        ))}
                    </ul>

                    <div className="flex justify-between font-semibold text-lg mb-6">
                        <span>Total:</span>
                        <span>${totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="w-full bg-black rounded-xl  hover:bg-[#59546c] text-white font-bold py-3 transition"
                    >
                        Checkout
                    </button>
                </div>
            </section >

            {isOpen && (
                <section className="fixed inset-0 bg-black/30 flex items-center justify-center">
                    <div className="flex w-[90%] md:w-[40%]">
                        <PaymentStepper />
                    </div>
                </section>
            )}

        </>

    );
}
