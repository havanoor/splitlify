import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  json,
  useFetcher,
  useLoaderData,
  useMatches,
  useParams,
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
import { getData, postData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function action({ request, params }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getSession(request);
  const { _action, ...data } = Object.fromEntries(formData);
  console.log("data", data);
  switch (_action) {
    case "AddNewCategory":
      await postData("category/add", { ...data, user_id: "8" });
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
        const response = await postData(`/transactions/update/${data.id}`, {
          ...dataToSend,
          id: data.id,
        });
      } else {
        const response = await postData("transactions/new", dataToSend);
      }

      // console.log("response", response);
      return json({
        ok: "Suceess",
      });
  }
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  // const user = await getSession(request);
  const transactions = await getData(
    `book/get_book_transactions/${params.bookId}/?offset=0&limit=5`
  );
  return json(transactions);
}

export default function IndividualBook() {
  const [viewTransactions, setViewTransactions] = useState(false);
  const { bookId } = useParams();
  const matches = useMatches();

  const books = matches.find((match) => match.id === "routes/books")?.data;
  const book: Book = books.find((b) => b.id == bookId);

  const bookTransactions: Transaction[] = useLoaderData<typeof loader>();
  const totalAmount = bookTransactions.reduce(
    (total, transaction) => total + transaction.amount,
    0
  );

  const [offset, setOffset] = useState(0);

  const spliTrans = useFetcher();
  useEffect(() => {
    if (spliTrans.state === "idle" && !spliTrans.data) {
      spliTrans.load(`/split-fetcher/${bookId}`);
    }
  }, [spliTrans.state, spliTrans.data]);

  function addNewUser(newUser: NewUser): void {
    throw new Error("Function not implemented.");
  }

  function deleteTransactions(transaction_id: number): void {
    throw new Error("Function not implemented.");
  }

  const handleClick = () => {
    setViewTransactions(
      !viewTransactions && bookTransactions
        ? bookTransactions.length > 0
        : false
    );
  };
  return (
    <div>
      {bookTransactions.length > 0 ? (
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
                    maxHeight:
                      "calc(var(--radix-popper-available-height) - 20px)",
                  }}
                  align="end"
                >
                  <AddNewTransactionDialog
                    books={book}
                    addNewUser={addNewUser}
                    title="Add"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
            addNewUser={addNewUser}
            book={book}
            offset={offset}
            setOffset={setOffset}
            deleteTransactions={deleteTransactions}
            open={viewTransactions}
            setOpen={setViewTransactions}
          />
        </div>
      ) : null}
      <TransactionSplit split={spliTrans.data?.splits as Payment[]} />
    </div>
  );
}
