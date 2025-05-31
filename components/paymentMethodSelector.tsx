interface Props {
  onSelect: (method: "google" | "card" | "bank") => void;
}

export default function PaymentMethodSelector({ onSelect }: Props) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Choose Payment Method</h2>
      <div className="grid gap-4">
        <button
          onClick={() => onSelect("google")}
          className="bg-black text-white p-3 rounded-md"
        >
          Pay with Google Pay
        </button>
        <button
          onClick={() => onSelect("card")}
          className="bg-blue-600 text-white p-3 rounded-md"
        >
          Pay with Bank Card
        </button>
        <button
          onClick={() => onSelect("bank")}
          className="bg-green-600 text-white p-3 rounded-md"
        >
          Bank Transfer
        </button>
      </div>
    </div>
  );
}
