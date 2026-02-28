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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-4 lg:mt-0">
      <div
        className="p-4 bg-gray-50 flex items-center justify-between border-b border-gray-100 cursor-pointer hover:bg-gray-100 transition-colors"
        onClick={() => setViewDues(!viewDues)}
      >
        <div className="text-lg font-bold text-gray-900 flex items-center gap-2">
          Pending Dues
        </div>
        <div className="text-gray-400">
          {viewDues ? <MdKeyboardDoubleArrowUp className="w-5 h-5" /> : <MdKeyboardDoubleArrowDown className="w-5 h-5" />}
        </div>
      </div>

      {viewDues && (
        <div className="p-0">
          {split.length > 0 ? (
            <div className="divide-y divide-gray-50">
              <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50/50 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                <div>From</div>
                <div>To</div>
                <div className="text-right">Amount</div>
              </div>
              {split.map((spl, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm items-center hover:bg-gray-50/50 transition-colors">
                  <div className="font-medium text-gray-900">{spl.payer}</div>
                  <div className="text-gray-600 flex items-center gap-1">
                    <span className="text-gray-300">→</span> {spl.payee}
                  </div>
                  <div className="text-right font-bold text-gray-900">
                    {Number(spl.amount).toFixed(3)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-500 text-sm">
              All settled up! No pending dues.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
