import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { cn } from "~/lib/utils";

type TransSplit = {
  split: Payment[];
};
export default function TransactionSplit({ split }: TransSplit) {
  const [viewDues, setViewDues] = useState(false);
  return (
    <div>
      <div
        className={cn(
          "w-full md:hidden p-1.5  border-2 border-b-0 border-[#c4d1eb] bg-[#79AC78] flex items-center justify-between",
          viewDues ? "rounded-tl-lg rounded-tr-lg" : "rounded-lg"
        )}
      >
        <div
          className="text-xl font-bold flex items-center"
          onClick={() => setViewDues(!viewDues)}
        >
          {viewDues ? (
            <MdKeyboardDoubleArrowUp className="w-6 h-6" />
          ) : (
            <MdKeyboardDoubleArrowDown className="w-6 h-6" />
          )}
          Pending Dues
        </div>
      </div>

      {viewDues ? (
        <table className="border-2">
          <tr className="border-2">
            <th className="border-2 p-1">Payer</th>
            <th className="border-2 p-1">Receiver</th>
            <th className="border-2 p-1">Amount</th>
          </tr>

          {split.length > 0 &&
            split.map((spl, index) => (
              <tr key={index}>
                <td className="border-2 p-1">{spl.payer}</td>
                <td className="border-2 p-1">{spl.payee}</td>
                <td className="border-2 p-1">{spl.amount}</td>
              </tr>
            ))}
        </table>
      ) : null}
    </div>
  );
}
