import { useEffect, useRef } from "react";

interface Props {
  onBack: () => void;
}

export default function GooglePayForm({ onBack }: Props) {
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const paymentsClient = new google.payments.api.PaymentsClient({
      environment: "TEST", // Change to 'PRODUCTION' when live
    });

    const isReadyToPayRequest = {
      apiVersion: 2,
      apiVersionMinor: 0,
      allowedPaymentMethods: [
        {
          type: "CARD",
          parameters: {
            allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
            allowedCardNetworks: ["VISA", "MASTERCARD"],
          },
          tokenizationSpecification: {
            type: "PAYMENT_GATEWAY",
            parameters: {
              gateway: "example", // Replace with your actual gateway (e.g., stripe)
              gatewayMerchantId: "exampleMerchantId", // Replace with your actual ID
            },
          },
        },
      ],
    };

    // Define the click handler first
    const onGooglePayClicked = () => {
      const paymentDataRequest = {
  ...isReadyToPayRequest,
  transactionInfo: {
    totalPriceStatus: "FINAL",
    totalPrice: "10.00",
    currencyCode: "USD",
    countryCode: "US",
  },
  merchantInfo: {
    merchantName: "Demo Merchant",
    merchantId: "01234567890123456789", // Replace with your real merchant ID
  },
};


      paymentsClient
        .loadPaymentData(paymentDataRequest)
        .then((paymentData: google.payments.api.PaymentData) => {
          console.log("Payment success:", paymentData);
          const token = paymentData.paymentMethodData.tokenizationData.token;
          // Send this token to your backend for processing
          console.log(token)
          alert("Payment successful!");
        })
        .catch((err: Error) => {
          console.error("Google Pay failed:", err);
        });
    };

    // Then use it in button creation
    paymentsClient
      .isReadyToPay(isReadyToPayRequest)
      .then((response) => {
        if (response.result && buttonRef.current && !buttonRef.current.hasChildNodes()) {
          const button = paymentsClient.createButton({
            onClick: onGooglePayClicked,
            buttonColor: "black",
            buttonType: "buy",
          });
          buttonRef.current.appendChild(button);
        }
      })
      .catch((err) => console.error("isReadyToPay failed:", err));
  }, []);

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Google Pay</h2>
      <div ref={buttonRef} className="mb-4" />
      <div className="flex gap-2">
        <button onClick={onBack} className="text-gray-500">
          ← Back
        </button>
      </div>
    </div>
  );
}
