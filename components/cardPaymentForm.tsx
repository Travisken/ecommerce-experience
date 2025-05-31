import { useForm } from "react-hook-form";

interface Props {
  onBack: () => void;
}

// ✅ Define a proper type instead of using `any`
interface CardFormData {
  cardNumber: string;
  expiry: string;
  cvv: string;
  cardName: string;
}

export default function CardPaymentForm({ onBack }: Props) {
  const { register, handleSubmit } = useForm<CardFormData>();

  const onSubmit = (data: CardFormData) => {
    console.log("Card Payment Submitted", data);
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
        {...register("expiry")}
        placeholder="MM/YY"
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
