type BookStatsBoxProps = {
  currency: string | undefined;
  amount: number;
  numberTransactions: number | undefined;
  numberFriends: number | undefined;
  bookName: string | undefined;
};

export default function BookStatsBox({
  amount,
  currency,
  numberFriends,
  numberTransactions,
  bookName,
}: BookStatsBoxProps) {
  return (
    <>
      <div className="md:hidden mt-2 grid grid-cols-3 gap-2 p-3 bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="col-span-3 text-center mb-2 pb-2 border-b border-gray-100">
          <span className="font-bold text-gray-900">{bookName}</span>
          <span className="text-gray-500 ml-2 text-sm">Summary</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-blue-50/50 rounded-lg">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 text-center">Amount</span>
          <span className="font-bold text-gray-900">{amount} <span className="text-xs font-normal text-gray-600">{currency}</span></span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-green-50/50 rounded-lg">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 text-center">Trans.</span>
          <span className="font-bold text-gray-900">{numberTransactions}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-orange-50/50 rounded-lg">
          <span className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1 text-center">Friends</span>
          <span className="font-bold text-gray-900">{numberFriends}</span>
        </div>
      </div>
    </>
  );
}
