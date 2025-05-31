interface Props {
  onBack: () => void;
}

export default function BankTransferForm({ onBack }: Props) {
  const accountNumber = "1234567890";
  const bankName = "Example Bank";

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(accountNumber);
    alert("Account number copied!");
  };

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Bank Transfer</h2>
      <p className="mb-2">Transfer to the account below:</p>
      <div className="border p-4 rounded bg-gray-100 mb-4">
        <p><strong>Bank:</strong> {bankName}</p>
        <p><strong>Account Number:</strong> {accountNumber}</p>
        <p><strong>Account Name:</strong> MyApp Services</p>
        <button onClick={copyToClipboard} className="text-sm text-blue-500 mt-2">Copy</button>
      </div>
      <div className="flex gap-2">
        <button onClick={onBack} className="text-gray-500">← Back</button>
        <button className="ml-auto bg-green-600 text-white px-4 py-2 rounded-md">I've Paid</button>
      </div>
    </div>
  );
}
