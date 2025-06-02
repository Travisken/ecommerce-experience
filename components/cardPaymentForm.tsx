import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {
  onBack: () => void;
  onNext: () => void;
}

interface CardFormData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

export default function CardPaymentForm({ onBack, onNext }: Props) {
  const { register, handleSubmit, setValue } = useForm<CardFormData>();
  const [expiryInput, setExpiryInput] = useState("");
  // const navigate = useNavigate();

  const onSubmit = (data: CardFormData) => {
    onNext()
    console.log("Card Payment Submitted", data);
    // navigate("/confirmation"); // ✅ Change this route to your target page
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // Only digits
    if (value.length > 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4);
    }
    setExpiryInput(value);
    setValue("expiry", value);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h2 className="text-lg font-semibold">Enter Card Details</h2>

      <input
        {...register("cardNumber")}
        placeholder="Card Number"
        className="border p-2 w-full rounded"
      />

      <input
        placeholder="MM/YY"
        value={expiryInput}
        onChange={handleExpiryChange}
        className="border p-2 w-full rounded"
      />

      <input
        {...register("cvv")}
        placeholder="CVV"
        className="border p-2 w-full rounded"
      />

      <input
        {...register("cardName")}
        placeholder="Cardholder Name"
        className="border p-2 w-full rounded"
      />

      <div className="flex gap-2">
        <button type="button" onClick={onBack} className="text-gray-500">
          ← Back
        </button>
        <button
          type="submit"
          className="ml-auto bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Submit
        </button>
      </div>
    </form>
  );
}
