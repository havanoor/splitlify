import { json, LoaderFunctionArgs } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import AddNewTransactionDialog from "components/AddNewTransactionDialog";
import BookStatsBox from "components/BookStatsBox";
import BookTransactions from "components/BookTransactions";
import TransactionSplit from "components/BookTransSplit";
import ShareBookPanel from "components/ShareBookPanel";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { getData } from "~/lib/ApiRequests";

import { getSession } from "~/lib/helperFunctions";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("transaction_offset")) {
    url.searchParams.set("transaction_offset", "0");
  }

  const offset = url.searchParams.get("transaction_offset");
  const { user, refreshToken } = await getSession(request);
  const headers = new Headers();

  const transactions = await getData(
    `book/get_book_transactions/${params.bookId}/?offset=${offset}&limit=5`,
    user?.token,
    refreshToken,
    headers,
    user
  );

  return json(
    {
      bookTransactions: transactions,
      baseURL: process.env.BASE_URL,
    },
    { headers }
  );
}

export default function PublicBook() {
  const { bookTransactions, baseURL } = useLoaderData<typeof loader>();
  const bookTrans = useFetcher<Book>();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [book, setBook] = useState<Book | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewTransactions, setViewTransactions] = useState(false);

  const spliTrans = useFetcher();
  const { bookId } = useParams();

  const handleClick = () => {
    setViewTransactions(
      !viewTransactions && bookTransactions
        ? bookTransactions.transactions?.length > 0
        : false
    );
  };

  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("transaction_offset", newOffset);
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  const totalAmount = bookTransactions?.total_amount || 0;
  const numTransactions = bookTransactions?.total_transactions || 0;

  useEffect(() => {
    spliTrans.load(`/split-fetcher/${bookId}`);
    bookTrans.load(`/public-book-trans/?book_id=${bookId}`);
  }, [bookId]);

  useEffect(() => {
    if (bookTrans.data) {
      setBook(bookTrans.data as Book);
    }
  }, [bookTrans.data, bookTrans.state]);

  useEffect(() => {
    if (spliTrans.state === "loading") {
      setPayments([]);
    } else if (spliTrans.data) {
      setPayments((spliTrans.data as any).splits as Payment[]);
    }
  }, [spliTrans.data, spliTrans.state]);
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {book ? (
        <>
          {/* Mobile Transactions Header/Trigger */}
          <div className="w-full md:hidden p-4 rounded-xl shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-between mt-2 mb-6">
            <div
              className="text-lg font-bold flex items-center gap-2 cursor-pointer"
              onClick={handleClick}
            >
              {viewTransactions &&
                bookTransactions.transactions?.length > 0 ? (
                <div className="bg-[#79AC78] text-white rounded-full p-1"><MdKeyboardDoubleArrowUp className="w-5 h-5" /></div>
              ) : (
                <div className="bg-white border border-gray-200 text-gray-400 rounded-full p-1"><MdKeyboardDoubleArrowDown className="w-5 h-5" /></div>
              )}
              <span>Transactions</span>
            </div>
          </div>

          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{book.name}</h1>
              <div className="mt-2 flex items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10 uppercase tracking-widest">
                  {book.type_of_book}
                </span>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <ShareBookPanel
                typeOfBook={book.type_of_book}
                bookUrl={`${baseURL}/public-book/${book.id}`}
              />
            </div>
          </div>


          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 flex flex-col gap-8">
              {/* Stats Overview */}
              <div className="bg-gradient-to-br from-[#79AC78]/5 to-transparent rounded-2xl p-1 border border-[#79AC78]/10">
                <BookStatsBox
                  amount={totalAmount}
                  currency={book?.book_currency}
                  numberFriends={book?.splitters?.length || 0}
                  numberTransactions={numTransactions}
                  bookName={book?.name}
                />
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <BookTransactions
                  transactions={bookTransactions.transactions || []}
                  book={book}
                  offset={Number(searchParams.get("transaction_offset") || 0)}
                  setOffset={updateOffset}
                  open={viewTransactions}
                  setOpen={setViewTransactions}
                  title="View"
                />
              </div>
            </div>

            {/* Sidebar (Splits/Balances) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              <div className="bg-blue-50/50 rounded-2xl p-1 border border-blue-100 shadow-sm sticky top-6">
                <TransactionSplit split={payments} />
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="flex h-40 items-center justify-center text-gray-500 font-medium">Looking up book details...</div>
      )}
    </div>
  );
}
