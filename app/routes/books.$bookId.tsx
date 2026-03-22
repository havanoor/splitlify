import { ActionFunctionArgs, LoaderFunctionArgs, redirect } from "@remix-run/node";
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
import { ResponsiveModal } from "~/components/ResponsiveModal";
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
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;
  const headers = new Headers();

  if (!user) {
    throw redirect("/login");
  }
  const { _action, ...data } = Object.fromEntries(formData);

  switch (_action) {
    case "AddNewTransaction":
      const dataToSend = {
        ...data,
        user_id: user.user_id,
        book_id: params.bookId,
        payer_id: data.payer_id || user.user_id,
        payee_ids: data.payee_ids ? (data.payee_ids as string).split(",") : [],
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
      console.log({
        ...data,
        book_id: params.bookId,
      },);
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

  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;
  const headers = new Headers();

  if (!user) {
    throw redirect("/login");
  }
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
    { bookTransactions: transactions || { transactions: [], total_amount: 0, total_transactions: 0 }, selectedBook: data && data.length > 0 ? data[0] as Book : null },
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
    setSearchParams(params, { replace: true, preventScrollReset: true });
  };

  const [viewTransactions, setViewTransactions] = useState(false);
  const { bookId } = useParams();
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
            toast.error("Failed to delete the transaction. Please try again");
          }
          break;
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
    if (category.data && Array.isArray(category.data)) {
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
    } else if (spliTrans.data && (spliTrans.data as any).splits) {
      setPayments((spliTrans.data as any).splits);
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
    <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-8 duration-500">
      {/* Stats Summary */}
      {book && (
        <BookStatsBox
          amount={bookTransactions.total_amount}
          currency={book?.book_currency}
          numberFriends={book?.splitters?.length}
          numberTransactions={
            bookTransactions ? bookTransactions.total_transactions : 0
          }
          bookName={book?.name}
        />
      )}

      {/* Transactions Section — toggle + list in one white card */}
      {book && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          {/* Mobile Transactions Header/Trigger */}
          <div className="w-full md:hidden p-4 bg-gray-50 border-b border-border flex items-center justify-between">
            <div
              className="text-lg font-bold flex items-center gap-2 cursor-pointer"
              onClick={handleClick}
            >
              {viewTransactions &&
                bookTransactions.transactions?.length &&
                bookTransactions.transactions.length > 0 ? (
                <div className="bg-primary text-white rounded-full p-1"><MdKeyboardDoubleArrowUp className="w-5 h-5" /></div>
              ) : (
                <div className="bg-card border border-input text-muted-foreground/70 rounded-full p-1"><MdKeyboardDoubleArrowDown className="w-5 h-5" /></div>
              )}
              <span>Transactions</span>
            </div>

            <div>
              <ResponsiveModal
                title="Add New Transaction"
                description={`Record a new transaction for ${book?.name}.`}
                trigger={
                  <button className="flex items-center justify-center bg-card border border-input text-foreground/80 hover:text-primary hover:border-primary p-2 rounded-full transition-all shadow-sm">
                    <IoMdAdd className="w-6 h-6" />
                  </button>
                }
              >
                {book && (
                  <AddNewTransactionDialog
                    books={book}
                    title="Add"
                    categories={categories}
                  />
                )}
              </ResponsiveModal>
            </div>
          </div>

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
      )}

      {/* Pending Dues Section */}
      {book && !book.type_of_book.toLowerCase().includes("private") && (
        <TransactionSplit split={payments} />
      )}
    </div>
  );
}
