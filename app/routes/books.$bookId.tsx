import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  ShouldRevalidateFunction,
  useActionData,
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
import { useEffect, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowUp,
} from "react-icons/md";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
import { deleteData, getData, patchData, postData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export const shouldRevalidate: ShouldRevalidateFunction = (args) => {
  const prevOffset = args.currentUrl.searchParams.get("transaction_offset");
  const nextOffset = args.nextUrl.searchParams.get("transaction_offset");

  if (
    args.currentParams.bookId === args.nextParams.bookId &&
    args.formMethod === undefined &&
    prevOffset === nextOffset
  ) {
    return false;
  }

  return args.defaultShouldRevalidate;
};

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getSession(request);

  const { _action, ...data } = Object.fromEntries(formData);

  switch (_action) {
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
        return json({
          ok: "Suceess",
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
  const [payments, setPayments] = useState<Payment[]>([]);
  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("transaction_offset", newOffset);
    setSearchParams(params);
  };

  const [viewTransactions, setViewTransactions] = useState(false);
  const { bookId } = useParams();
  const matches = useMatches();

  const books = (
    matches.find((match) => match.id === "routes/books")?.data as {
      userBooks: Book[];
    }
  )?.userBooks;

  const book: Book | undefined = books.find((b) => b.id === Number(bookId));

  const bookTransactions: Transaction[] = useLoaderData<typeof loader>();
  const totalAmount = bookTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      if (actionData.ok) {
        toast.success("Added new Transaction to book");
      } else {
        toast.error("Failed to add transaction to Book");
      }
    }
  }, [actionData]);

  const spliTrans = useFetcher();
  useEffect(() => {
    spliTrans.load(`/split-fetcher/${bookId}`);
  }, [bookId]);

  useEffect(() => {
    if (spliTrans.state === "loading") {
      setPayments([]);
    } else if (spliTrans.data) {
      setPayments(spliTrans.data.splits as Payment[]);
    }
  }, [spliTrans.data, spliTrans.state]);

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
              // style={{
              //   maxHeight: "calc(var(--radix-popper-available-height) - 20px)",
              // }}
              // align="end"
            >
              <AddNewTransactionDialog books={book} title="Add" />
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
      <TransactionSplit split={payments} />
    </div>
  );
}
