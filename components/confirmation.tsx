import { CheckCircle } from "lucide-react";
// import { useNavigate } from "react-router-dom";

interface Props {
  onBack: () => void;
}

export default function ConfirmationPage({ onBack }: Props) {
//   const navigate = useNavigate();

//   const handleReturn = () => {
//     navigate("/"); // Change to your homepage or dashboard route
//   };

  return (
    <div className="w-full h-fit flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
        <CheckCircle className="mx-auto text-green-500" size={64} />

        <h1 className="text-2xl font-bold mt-4 text-gray-800">Payment Successful</h1>
        <p className="mt-2 text-gray-600">
          Thank you for your payment. Your transaction has been processed successfully.
        </p>

        <button
          onClick={onBack}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full transition"
        >
          Return Home
        </button>
      </div>
    </div>
  );
}
