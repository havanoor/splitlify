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
  const { user, refreshToken } = await getSession(request);
  const headers = new Headers();

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
        const response = await patchData(
          `transactions/update/${data.id}`,
          {
            ...dataToSend,
          },
          user.token,
          refreshToken,
          headers,
          user
        );
        return json(
          {
            ok: true,
            type: "UpdateTransaction",
            id: data.id,
            name: response.desc,
          },
          { headers }
        );
      } else {
        const response = await postData(
          "transactions/new",
          dataToSend,
          user.token,
          refreshToken,
          headers,
          user
        );
        return json(
          {
            ok: "Suceess",
            type: "AddNewTransaction",
            name: response.desc,
            id: response.id,
          },
          { headers }
        );
      }

    case "AddNewUser":
      const responseUser = await postData(
        "books/add_new_user/",
        {
          ...data,
          book_id: params.bookId,
        },
        user.token,
        refreshToken,
        headers,
        user
      );
      return json(
        {
          ok: true,
          type: "AddNewUser",
          id: responseUser.id,
          name: responseUser.firstName,
        },
        { headers }
      );
    case "DeleteTransaction":
      await deleteData(
        `transactions/delete/${data.id}`,
        user.token,
        refreshToken,
        headers,
        user
      );
      return json(
        {
          ok: true,
          id: data.id,
          name: data.name,
          type: "DeleteTransaction",
        },
        { headers }
      );
  }
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("transaction_offset")) {
    url.searchParams.set("transaction_offset", "0");
  }
  const offset = url.searchParams.get("transaction_offset");

  const { user, refreshToken } = await getSession(request);
  const headers = new Headers();
  const [data, transactions] = await Promise.all([
    getData(`book/?book_id=${params.bookId}`, user.token, refreshToken, headers, user),
    getData(
      `book/get_book_transactions/${params.bookId}/?offset=${offset}&limit=5`,
      user.token,
      refreshToken,
      headers,
      user
    ),
  ]);

  return json(
    { bookTransactions: transactions, selectedBook: data[0] as Book },
    { headers }
  );
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
  // const matches = useMatches();

  // const books = (
  //   matches.find((match) => match.id === "routes/books")?.data as {
  //     userBooks: Book[];
  //   }
  // )?.userBooks;

  // const book: Book | undefined = books.find((b) => b.id === Number(bookId));
  const { bookTransactions, selectedBook } = useLoaderData<typeof loader>();
  const book = selectedBook;
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
      setCategories(category.data as unknown as Category[]);
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
      setPayments(spliTrans.data as unknown as Payment[]);
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
    <div className="bg-white rounded-3xl p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Mobile Transactions Header/Trigger */}
      <div className="w-full md:hidden p-4 rounded-xl shadow-sm border border-gray-100 bg-gray-50 flex items-center justify-between mt-2 mb-6">
        <div
          className="text-lg font-bold flex items-center gap-2 cursor-pointer"
          onClick={handleClick}
        >
          {viewTransactions &&
            bookTransactions.transactions?.length &&
            bookTransactions.transactions.length > 0 ? (
            <div className="bg-[#79AC78] text-white rounded-full p-1"><MdKeyboardDoubleArrowUp className="w-5 h-5" /></div>
          ) : (
            <div className="bg-white border border-gray-200 text-gray-400 rounded-full p-1"><MdKeyboardDoubleArrowDown className="w-5 h-5" /></div>
          )}
          <span>Transactions</span>
        </div>

        <div>
          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:text-[#79AC78] hover:border-[#79AC78] px-4 py-2 rounded-full transition-all shadow-sm">
                <IoMdAdd className="w-4 h-4" /> Add Transaction
              </button>
            </SheetTrigger>

            <SheetContent
              className="w-full sm:w-[500px] border-l-0 sm:border-l rounded-l-2xl shadow-2xl overflow-y-auto"
              side="right"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetHeader className="text-left mb-7">
                <SheetTitle className="text-2xl font-bold">Add New Transaction</SheetTitle>
                <SheetDescription>
                  Record a new transaction for {book?.name}.
                </SheetDescription>
              </SheetHeader>
              {book && (
                <AddNewTransactionDialog
                  books={book}
                  title="Add"
                  categories={categories}
                />
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-8">
          {book ? (
            <>
              {/* Stats Overview */}
              <div className="bg-gradient-to-br from-[#79AC78]/5 to-transparent rounded-2xl p-1 border border-[#79AC78]/10">
                <BookStatsBox
                  amount={bookTransactions.total_amount}
                  currency={book?.book_currency}
                  numberFriends={book?.splitters.length}
                  numberTransactions={
                    bookTransactions ? bookTransactions.total_transactions : 0
                  }
                  bookName={book?.name}
                />
              </div>

              {/* Transactions List */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <BookTransactions
                  transactions={bookTransactions.transactions}
                  book={book}
                  offset={Number(searchParams.get("transaction_offset") || 0)}
                  setOffset={updateOffset}
                  open={viewTransactions}
                  setOpen={setViewTransactions}
                  categories={categories}
                />
              </div>
            </>
          ) : null}
        </div>

        {/* Sidebar (Splits/Balances) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="bg-blue-50/50 rounded-2xl p-1 border border-blue-100 shadow-sm sticky top-6">
            <TransactionSplit split={payments} />
          </div>
        </div>
      </div>
    </div>
  );
}
