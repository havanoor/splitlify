type BookStatsBoxProps = {
  currency: string | undefined;
  amount: number;
  numberTransactions: number | undefined;
  numberFriends?: number | undefined;
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
      <div className="mt-2 grid grid-cols-3 gap-2 p-3 bg-white border border-border rounded-xl shadow-sm">
        <div className="col-span-3 text-center mb-2 pb-2 border-b border-border">
          <span className="font-bold text-foreground">{bookName}</span>
          <span className="text-muted-foreground ml-2 text-sm">Summary</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-info/10 rounded-lg">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 text-center">Amount</span>
          <span className="font-bold text-foreground">{amount} <span className="text-xs font-normal text-muted-foreground">{currency}</span></span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-success/10 rounded-lg">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 text-center">Trans.</span>
          <span className="font-bold text-foreground">{numberTransactions}</span>
        </div>

        <div className="flex flex-col items-center justify-center p-2 bg-orange-50/50 rounded-lg">
          <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider mb-1 text-center">Friends</span>
          <span className="font-bold text-foreground">{numberFriends}</span>
        </div>
      </div>
    </>
  );
}
