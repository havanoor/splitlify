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
import { twMerge } from "tailwind-merge";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { getData } from "~/lib/ApiRequests";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("transaction_offset")) {
    url.searchParams.set("transaction_offset", "0");
  }

  const offset = url.searchParams.get("transaction_offset");
  // const bookId = url.searchParams.get("book_id");

  const transactions = await getData(
    `book/get_book_transactions/${params.bookId}/?offset=${offset}&limit=5`
  );

  //   const data = await getData(`book/?book_id=${params.bookId}`);

  return json({
    bookTransactions: transactions,
    baseURL: process.env.BASE_URL,
  });
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
        ? bookTransactions.length > 0
        : false
    );
  };

  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("transaction_offset", newOffset);
    setSearchParams(params);
  };

  const totalAmount = bookTransactions?.reduce(
    (total: number, transaction: Transaction) => total + transaction.amount,
    0
  );

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
      setPayments(spliTrans.data.splits as Payment[]);
    }
  }, [spliTrans.data, spliTrans.state]);

  return (
    <div>
      {book ? (
        <>
          <div className="m-2 md:m-16">
            <div
              className="w-full p-4 bg-white  border-2  rounded-lg shadow"
              // className={`${
              //   isFlex ? "relative" : "absolute  top-4 group-hover:top-4 "
              // }  w-full p-4 bg-white  border-2  rounded-lg shadow  ${twMerge(
              //   "hover:bg-green-100 cursor-pointer",
              //   selectedBook?.id == book.id && "bg-[#d3f2d5]"
              // )}`}
            >
              <div className="flex justify-between items-center space-x-4">
                <div className="w-48">
                  Name: {book.name}
                  <div className="text-xs text-gray-500">
                    Book Type:{book.type_of_book.toLowerCase()}
                  </div>
                </div>

                <div className="flex gap-8 justify-center align-middle">
                  {/* Share Icon */}
                  <ShareBookPanel
                    typeOfBook={book.type_of_book}
                    bookUrl={`${baseURL}/public-book/${book.id}`}
                  />

                  {/* Share Icon Content Ends */}
                  {/* Update Book Icon */}
                </div>
              </div>
            </div>
            <div className="w-full md:hidden p-1.5 border-2 border-[#bdc7db] bg-[#79AC78] flex items-center justify-between mt-2">
              <div
                className="text-xl font-bold flex items-center"
                onClick={handleClick}
              >
                {viewTransactions &&
                bookTransactions?.length &&
                bookTransactions.length > 0 ? (
                  <MdKeyboardDoubleArrowUp className="w-6 h-6" />
                ) : (
                  <MdKeyboardDoubleArrowDown className="w-6 h-6" />
                )}
                Transactions
              </div>

              <div>
                <Sheet>
                  <SheetTrigger asChild>
                    <IoMdAdd
                      color="white"
                      fill="white"
                      className="w-6 h-6 border-2 rounded"
                    />
                  </SheetTrigger>
                  <SheetContent
                    className="p-10  mt-10 mr-2 w-80 bg-white "
                    side="left"
                  >
                    <AddNewTransactionDialog books={book} title="View" />
                  </SheetContent>
                </Sheet>
              </div>
            </div>
            {/* {bookTransactions.length > 0 ? ( */}
            <div>
              {book ? (
                <BookStatsBox
                  amount={totalAmount}
                  currency={book?.book_currency}
                  numberFriends={book?.splitters.length}
                  numberTransactions={
                    bookTransactions ? bookTransactions.length : 0
                  }
                  bookName={book?.name}
                />
              ) : null}
              <BookTransactions
                transactions={bookTransactions}
                book={book}
                offset={Number(searchParams.get("transaction_offset") || 0)}
                setOffset={updateOffset}
                open={viewTransactions}
                setOpen={setViewTransactions}
                title="View"
              />
            </div>
            <TransactionSplit split={payments} />
          </div>
        </>
      ) : (
        <>No book found</>
      )}
    </div>
  );
}
