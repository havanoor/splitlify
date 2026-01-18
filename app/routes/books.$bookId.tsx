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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
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
          ok: true,
          type: "UpdateTransaction",
          id: data.id,
          name: response.desc,
        });
      } else {
        const response = await postData("transactions/new", dataToSend);
        return json({
          ok: "Suceess",
          type: "AddNewTransaction",
          name: response.desc,
          id: response.id,
        });
      }

    case "AddNewUser":
      const responseUser = await postData("books/add_new_user/", {
        ...data,
        book_id: params.bookId,
      });
      return json({
        ok: true,
        type: "AddNewUser",
        id: responseUser.id,
        name: responseUser.firstName,
      });
    case "DeleteTransaction":
      await deleteData(`transactions/delete/${data.id}`);
      return json({
        ok: true,
        id: data.id,
        name: data.name,
        type: "DeleteTransaction",
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
    `book/get_book_transactions/${params.bookId}/?offset=${offset}&limit=5`,
  );
  return json(transactions);
}

export default function IndividualBook() {
  const [searchParams, setSearchParams] = useSearchParams();
  const category = useFetcher();
  const [categories, setCategories] = useState<Category[]>([]);

  const [payments, setPayments] = useState<Payment[]>([]);
  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("transaction_offset", newOffset);
    setSearchParams(params, { replace: true });
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
  const bookTransactions: TransactionSummary = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      switch (actionData.type) {
        case "DeleteTransaction":
          if (actionData.ok) {
            toast.success(
              `Deleted Transaction ${actionData.name} with id ${actionData.id}`,
            );
          } else {
            toast.error("Failed to add the book. Please try again");
          }
        case "AddNewTransaction":
          if (actionData.ok) {
            toast.success(`Added New transaction ${actionData.name} to Book`);
          } else {
            toast.error(`Failed to add transaction. Please try again`);
          }
          break;
        case "UpdateTransaction":
          if (actionData.ok) {
            toast.success(`Updated transaction ${actionData.name}`);
          } else {
            toast.error("Failed to update transaction. Please try again");
          }
          break;
      }
    }
  }, [actionData]);

  useEffect(() => {
    if (!category.data) {
      category.load(`/query-category`);
    }
  }, []);

  useEffect(() => {
    if (category.data) {
      setCategories(category.data);
    }
  }, [category.data]);

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
        ? bookTransactions.transactions.length > 0
        : false,
    );
  };
  return (
    <div>
      <div className="w-full md:hidden p-1.5 border-2 rounded-tl-lg rounded-tr-lg  border-[#bdc7db] bg-[#79AC78] flex items-center justify-between mt-2">
        <div
          className="text-xl font-bold flex items-center"
          onClick={handleClick}
        >
          {viewTransactions &&
          bookTransactions.transactions?.length &&
          bookTransactions.transactions.length > 0 ? (
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
              className="p-10 mr-2 w-80 bg-white overflow-y-scroll rounded-lg"
              side="left"
              // style={{
              //   maxHeight: "calc(var(--radix-popper-available-height) - 20px)",
              // }}
            >
              <SheetHeader className="text-left mb-7">
                <SheetTitle>Add New Transaction</SheetTitle>
                <SheetDescription>
                  Add details for a new transaction.
                </SheetDescription>
              </SheetHeader>
              <AddNewTransactionDialog
                books={book}
                title="Add"
                categories={categories}
              />
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* {bookTransactions.length > 0 ? ( */}
      <div>
        {book ? (
          <>
            <BookStatsBox
              amount={bookTransactions.total_amount}
              currency={book?.book_currency}
              numberFriends={book?.splitters.length}
              numberTransactions={
                bookTransactions ? bookTransactions.total_transactions : 0
              }
              bookName={book?.name}
            />
            <BookTransactions
              transactions={bookTransactions.transactions}
              book={book}
              offset={Number(searchParams.get("transaction_offset") || 0)}
              setOffset={updateOffset}
              open={viewTransactions}
              setOpen={setViewTransactions}
              categories={categories}
            />
          </>
        ) : null}
      </div>
      <TransactionSplit split={payments} />
    </div>
  );
}
