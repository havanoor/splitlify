import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  useFetcher,
  useLoaderData,
  useMatches,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import AddNewTransactionDialog from "components/AddNewTransactionDialog";
import BookStatsBox from "components/BookStatsBox";
import BookTransactions from "components/BookTransactions";
import TransactionSplit from "components/BookTransSplit";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import {
  deleteData,
  getData,
  patchData,
  postData,
  putData,
} from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getSession(request);
  const { _action, ...data } = Object.fromEntries(formData);
  switch (_action) {
    case "AddNewCategory":
      await postData("category/add", { ...data, user_id: user.user_id });
      return json({
        ok: "Suceess",
      });
    case "AddNewTransaction":
      const dataToSend = {
        ...data,
        user_id: user.user_id,
        book_id: params.bookId,
        payee_ids: (data.payee_ids as string).split(","),
      };

      if ("id" in data) {
        const response = await patchData(`transactions/update/${data.id}`, {
          ...dataToSend,
        });
      } else {
        const response = await postData("transactions/new", dataToSend);
      }
      return json({
        ok: "Suceess",
      });

    case "AddNewUser":
      await postData("books/add_new_user/", {
        ...data,
        book_id: params.bookId,
      });
      return json({
        ok: "Suceess",
      });
    case "DeleteTransaction":
      await deleteData(`transactions/delete/${data.id}`);
      return json({
        ok: "Suceess",
      });
  }
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("transaction_offset")) {
    url.searchParams.set("transaction_offset", "0");
  }
  const offset = url.searchParams.get("transaction_offset");
  const transactions = await getData(
    `book/get_book_transactions/${params.bookId}/?offset=${offset}&limit=5`
  );
  return json(transactions);
}

export default function IndividualBook() {
  const [searchParams, setSearchParams] = useSearchParams();

  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("transaction_offset", newOffset);
    setSearchParams(params);
  };

  const [viewTransactions, setViewTransactions] = useState(false);
  const { bookId } = useParams();
  const matches = useMatches();

  const books = matches.find((match) => match.id === "routes/books")
    ?.data as Book[];
  const book: Book | undefined = books.find((b) => b.id === Number(bookId));

  const bookTransactions: Transaction[] = useLoaderData<typeof loader>();
  const totalAmount = bookTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const spliTrans = useFetcher();
  useEffect(() => {
    if (spliTrans.state === "idle" && !spliTrans.data) {
      spliTrans.load(`/split-fetcher/${bookId}`);
    }
  }, [spliTrans.state, spliTrans.data, bookId]);

  const handleClick = () => {
    setViewTransactions(
      !viewTransactions && bookTransactions
        ? bookTransactions.length > 0
        : false
    );
  };
  return (
    <div>
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
          <Popover>
            <PopoverTrigger>
              <IoMdAdd
                color="white"
                fill="white"
                className="w-6 h-6 border-2 rounded"
              />
            </PopoverTrigger>
            <PopoverContent
              className=" z-50 grid gap-4 p-10  mt-10 mr-2 w-80 bg-white border-2 border-green-800   rounded-md shadow-lg overflow-y-auto"
              side="left"
              style={{
                maxHeight: "calc(var(--radix-popper-available-height) - 20px)",
              }}
              align="end"
            >
              <AddNewTransactionDialog books={book} title="Add" />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {/* {bookTransactions.length > 0 ? ( */}
      <div>
        {book ? (
          <BookStatsBox
            amount={totalAmount}
            currency={book?.book_currency}
            numberFriends={book?.splitters.length}
            numberTransactions={bookTransactions ? bookTransactions.length : 0}
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
        />
      </div>
      {/* ) : null} */}
      <TransactionSplit split={spliTrans.data?.splits as Payment[]} />
    </div>
  );
}
