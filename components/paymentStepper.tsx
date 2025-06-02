import { useState } from "react";
import BankTransferForm from "./bankTransferForm";
import CardPaymentForm from "./cardPaymentForm";
import GooglePayForm from "./googlePayForm";
import PaymentMethodSelector from "./paymentMethodSelector";
import ConfirmationPage from "./confirmation"


export default function PaymentStepper() {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<"google" | "card" | "bank" | null>(null);

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  return (
    <div className="w-full mx-auto p-4 rounded-lg shadow-lg bg-white">
      {step === 1 && (
        <PaymentMethodSelector
          onSelect={(selected) => {
            setMethod(selected);
            handleNext();
          }}
        />
      )}

      {step === 2 && method === "google" && (
        <GooglePayForm onNext={handleNext} onBack={handleBack} />
      )}
      {step === 2 && method === "card" && (
        <CardPaymentForm  onNext={handleNext} onBack={handleBack} />
      )}
      {step === 2 && method === "bank" && (
        <BankTransferForm  onNext={handleNext} onBack={handleBack} />
      )}
      {step === 3 && method === "bank" && (
        <ConfirmationPage onBack={handleBack} />
      )}
    </div>
  );
}
