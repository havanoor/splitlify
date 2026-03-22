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
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mt-4 lg:mt-0">
      <div
        className="p-4 bg-gray-50 flex items-center justify-between border-b border-border cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setViewDues(!viewDues)}
      >
        <div className="text-lg font-bold text-foreground flex items-center gap-2">
          {viewDues ? (
            <div className="bg-primary text-white rounded-full p-1"><MdKeyboardDoubleArrowUp className="w-5 h-5" /></div>
          ) : (
            <div className="bg-card border border-input text-muted-foreground/70 rounded-full p-1"><MdKeyboardDoubleArrowDown className="w-5 h-5" /></div>
          )}
          Pending Dues
        </div>
      </div>

      {viewDues && (
        <div className="p-0">
          {split.length > 0 ? (
            <div className="divide-y divide-border/50">
              <div className="grid grid-cols-3 gap-2 px-4 py-3 bg-gray-50/50 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                <div className="text-center">From</div>
                <div className="text-center">To</div>
                <div className="text-center">Amount</div>
              </div>
              {split.map((spl, index) => (
                <div key={index} className="grid grid-cols-3 gap-2 px-4 py-3 text-sm items-center hover:bg-muted/50 transition-colors">
                  <div className="font-medium text-foreground text-center">{spl.payer}</div>
                  <div className="text-muted-foreground flex items-center justify-center">
                    <div className="relative">
                      <span className="text-muted-foreground/40 absolute right-full mr-2 top-1/2 -translate-y-1/2 text-xs">→</span>
                      {spl.payee}
                    </div>
                  </div>
                  <div className="text-center font-bold text-foreground">
                    {Number(spl.amount).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-muted-foreground text-sm">
              All settled up! No pending dues.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
