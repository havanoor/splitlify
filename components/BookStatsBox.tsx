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
      <table className=" table-fixed border-2 border-t-0 border-[#bdc7db] w-full md:hidden">
        <tbody>
          <tr className="border-2 border-[#bdc7db]   border-t-0">
            <td colSpan={3} className="pl-3   ">
              <div className="flex justify-center space-x-2">
                <div className="font-bold">{bookName}</div>
                <div>Summary</div>
              </div>
            </td>
          </tr>
          <tr className="border-2  border-[#bdc7db]">
            <th className="w-1/3 border-2 border-[#bdc7db]">Total Amount</th>
            <th className="w-1/3 border-2 border-[#bdc7db]">
              Total Transactions
            </th>
            <th className="w-1/3 border-2 border-[#bdc7db]">Total Friends</th>
          </tr>
          <tr>
            <td className="border-2 border-[#bdc7db] text-center">
              {amount} <span className="text-sm">{currency}</span>
            </td>
            <td className="border-2 border-[#bdc7db] text-center">
              {numberTransactions}
            </td>
            <td className="border-2 border-[#bdc7db] text-center">
              {numberFriends}
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
