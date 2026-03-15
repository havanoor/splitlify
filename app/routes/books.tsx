import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  json,
  Outlet,
  ShouldRevalidateFunction,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams
} from "@remix-run/react";
import AddNewBookDialog from "components/AddNewBookDialog";
import ShareBookPanel from "components/ShareBookPanel";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "components/ui/alert-dialog";
import { Button } from "components/ui/button";
import { Lock, LockOpen } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { GrCheckmark } from "react-icons/gr";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowUp,
  MdOutlineModeEdit,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { ResponsiveModal } from "~/components/ResponsiveModal";
import { deleteData, getData, patchData, postData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  if (!url.searchParams.get("offset")) {
    url.searchParams.set("offset", "0");
  }
  const offset = url.searchParams.get("offset") || "0";
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;

  if (!user) {
    throw redirect("/login");
  }

  const headers = new Headers();
  const data = await getData(
    `book/?user_id=${user.user_id}&limit=5&offset=${offset}`,
    user.token,
    refreshToken,
    headers,
    user
  );

  return json({ userBooks: data, baseURL: process.env.BASE_URL }, { headers });
}

export const shouldRevalidate: ShouldRevalidateFunction = (args) => {
  const prevOffset = args.currentUrl.searchParams.get("offset") || "0";
  const nextOffset = args.nextUrl.searchParams.get("offset") || "0";

  if (
    args.currentParams.bookId === args.nextParams.bookId &&
    args.formMethod === undefined &&
    prevOffset === nextOffset
  ) {
    return false;
  }

  return args.defaultShouldRevalidate;
};

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const session = await getSession(request);
  const user = session?.user;
  const refreshToken = session?.refreshToken;

  if (!user) {
    throw redirect("/login");
  }
  const { _action, ...data } = Object.fromEntries(formData);
  const headers = new Headers();

  switch (_action) {
    case "AddNewBook": {
      const { user_usernames, placeholder_names, ...bookData } = data;

      const response: Book = await postData(
        "books/new",
        {
          ...bookData,
          user_id: user.user_id,
          user_usernames: user_usernames
            ? (user_usernames as string).split(",").filter(Boolean)
            : [],
          placeholder_names: placeholder_names
            ? (placeholder_names as string).split(",").filter(Boolean)
            : [],
        },
        user.token,
        refreshToken,
        headers,
        user
      );

      return json(
        {
          ok: true,
          type: "AddNewBook",
          id: response.id,
          name: bookData.name,
        },
        { headers }
      );
    }

    case "DeleteBook": {
      await deleteData(
        `books/delete/${data.book_id}`,
        user.token,
        refreshToken,
        headers,
        user
      );
      return json(
        {
          ok: true,
          type: "DeleteBook",
          id: data.book_id,
          name: data.name,
        },
        { headers }
      );
    }
    case "AddNewCategory": {
      const categoryResponse = await postData(
        "category/add",
        {
          ...data,
          user_id: user.user_id,
        },
        user.token,
        refreshToken,
        headers,
        user
      );

      return json(
        {
          ok: true,
          type: "AddNewCategory",
          name: data.category,
          id: "",
        },
        { headers }
      );
    }
    case "EditBook": {
      const { user_usernames, placeholder_names, book_id, ...bookData } = data;
      console.log({
        ...bookData,
        user_id: user.user_id,
        user_usernames: user_usernames
          ? (user_usernames as string).split(",").filter(Boolean)
          : [],
        placeholder_names: placeholder_names
          ? (placeholder_names as string).split(",").filter(Boolean)
          : [],
      })

      const response: Book = await patchData(
        `books/update/${book_id}`,
        {
          ...bookData,
          user_id: user.user_id,
          user_usernames: user_usernames
            ? (user_usernames as string).split(",").filter(Boolean)
            : [],
          placeholder_names: placeholder_names
            ? (placeholder_names as string).split(",").filter(Boolean)
            : [],
        },
        user.token,
        refreshToken,
        headers,
        user
      );

      return json(
        {
          ok: true,
          type: "EditBook",
          id: response.id,
          name: bookData.name,
        },
        { headers }
      );
    }

  }
}

export default function Books() {
  const navigate = useNavigate();
  const outletRef = useRef<HTMLDivElement>(null);
  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (actionData) {
      switch (actionData.type) {
        case "AddNewBook":
          if (actionData.ok) {
            toast.success(`Added new book ${actionData.name}`, {
              action: {
                label: <div className="bg-inherit">X</div>,
                onClick: () => toast.dismiss(),
              },
            });
          } else {
            toast.error("Failed to add new Book");
          }
          break;

        case "AddNewCategory":
          toast.success("Added new Category to Book ");
          break;
        case "DeleteBook":
          toast.success("Deleted book successfully");
          break;
      }
    }
  }, [actionData]);

  const { bookId } = useParams();
  const { userBooks, baseURL } = useLoaderData<typeof loader>();

  const [selectedBook, setSelected] = useState<any | undefined>(
    userBooks?.find((book: any) => book.id === Number(bookId))
  );

  useEffect(() => {
    if (userBooks && bookId) {
      setSelected(userBooks.find((book: any) => book.id === Number(bookId)));
    }
  }, [bookId, userBooks]);

  const [searchParams, setSearchParams] = useSearchParams();

  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", newOffset);
    setSearchParams(params);
  };

  const currentOffset = parseInt(searchParams.get("offset") || "0");
  const [viewBooks, setViewBooks] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Books Section — toggle + grid in one white card */}
        <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden mb-8">
          {/* Header Bar */}
          <div className="w-full p-4 bg-gray-50 border-b border-border flex items-center justify-between">
            <div
              className="text-lg font-bold flex items-center gap-2 cursor-pointer"
              onClick={() => setViewBooks(!viewBooks)}
            >
              {viewBooks ? (
                <div className="bg-primary text-white rounded-full p-1"><MdKeyboardDoubleArrowUp className="w-5 h-5" /></div>
              ) : (
                <div className="bg-white border border-input text-muted-foreground/70 rounded-full p-1"><MdKeyboardDoubleArrowDown className="w-5 h-5" /></div>
              )}
              <span>{!viewBooks && selectedBook ? selectedBook.name : "Books"}</span>
            </div>

            <ResponsiveModal
              title="Add New Book"
              description="Create a new book to start organizing your finances."
              trigger={
                <button className="flex items-center justify-center bg-white border border-input text-foreground/80 hover:text-primary hover:border-primary p-2 rounded-full transition-all shadow-sm">
                  <IoMdAdd className="w-6 h-6" />
                </button>
              }
            >
              <AddNewBookDialog
                existing_books={
                  userBooks ? userBooks.map((book: any) => book.name) : []
                }
              />
            </ResponsiveModal>
          </div>

          {/* Books Grid View */}
          {userBooks && userBooks.length > 0 ? (
            viewBooks ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10 p-6">
                  {userBooks.map((book: any) => {
                    const isSelected = selectedBook?.id === book.id;
                    return (
                      <div
                        key={book.id}
                        className={twMerge(
                          "group relative flex flex-col bg-white rounded-2xl border p-0 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1",
                          isSelected
                            ? "border-primary ring-2 ring-primary/20 bg-primary/[0.02]"
                            : "border-border"
                        )}
                        onClick={() => {
                          setSelected(book);
                          navigate(`/books/${book.id}?${searchParams.toString()}`, { preventScrollReset: true });
                          setTimeout(() => {
                            outletRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
                          }, 150);
                        }}
                      >
                        {/* Decorative Header Background */}
                        <div className={twMerge(
                          "absolute top-0 left-0 w-full h-24 opacity-20 pointer-events-none transition-colors",
                          isSelected ? "bg-primary" : "bg-gradient-to-br from-gray-100 to-transparent group-hover:from-blue-50 group-hover:to-transparent"
                        )} />

                        <div className="p-3 flex-1 flex flex-col relative z-10">
                          {/* Selected Indicator */}
                          {isSelected && (
                            <div className="absolute top-0 right-0 bg-primary text-white rounded-bl-2xl rounded-tr-xl p-2 shadow-md z-10 animate-in zoom-in duration-200">
                              <GrCheckmark className="w-4 h-4" />
                            </div>
                          )}

                          {/* Card Content */}
                          <div className="flex-1 mb-3 mt-1">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {/* Visual Icon Box */}
                                <div className={twMerge(
                                  "w-9 h-9 rounded-xl flex items-center justify-center shadow-sm",
                                  book.type_of_book.toLowerCase().includes("private") ? "bg-warning/20 text-warning" : "bg-success/20 text-primary"
                                )}>
                                  {book.type_of_book.toLowerCase().includes("private")
                                    ? <Lock className="w-4 h-4" />
                                    : <LockOpen className="w-4 h-4" />}
                                </div>
                                <span className="inline-flex items-center rounded-full bg-gray-50 px-2 py-1 text-xs font-semibold text-muted-foreground ring-1 ring-inset ring-muted-foreground/10 uppercase tracking-widest">
                                  {book.type_of_book}
                                </span>
                              </div>
                              {(book.created_by?.username || book.created_by?.first_name) && (
                                <span className={`inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-[10px] sm:text-xs font-medium text-primary ring-1 ring-inset ring-primary/30 shadow-sm truncate max-w-[120px] ${isSelected ? 'mr-6' : ''}`} title={book.created_by?.username || book.created_by?.first_name}>
                                  by {book.created_by?.username || book.created_by?.first_name}
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-bold text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors pr-6">
                              {book.name}
                            </h3>
                          </div>

                          {/* Card Footer Actions */}
                          <div
                            className="flex items-center gap-2 pt-3 border-t border-border/80 mt-auto"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center hover:scale-105 transition-transform bg-gray-50 rounded-full px-2 py-1 flex-1">
                              <ShareBookPanel
                                typeOfBook={book.type_of_book}
                                bookUrl={`${baseURL}/public-book/${book.id}`}
                              />
                              <span className="ml-2 text-xs text-muted-foreground font-medium">
                                Share
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <ResponsiveModal
                                title="Edit Book"
                                trigger={
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-info hover:text-info hover:bg-info/10 rounded-full transition-colors border border-info/20 bg-white shadow-sm">
                                    <MdOutlineModeEdit className="w-4 h-4" />
                                  </Button>
                                }
                              >
                                  <AddNewBookDialog
                                    existing_books={
                                      userBooks ? userBooks.map((b: any) => b.name) : []
                                    }
                                    editBook={book}
                                  />
                              </ResponsiveModal>

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 rounded-full transition-colors border border-destructive/20 bg-white shadow-sm">
                                    <RiDeleteBinLine className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="rounded-xl">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl">Delete this book?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-base text-muted-foreground">
                                      This action cannot be undone. This will permanently delete <strong>{book.name}</strong> and all its associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
                                    <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                                    <Form method="POST">
                                      <AlertDialogAction asChild>
                                        <Button
                                          type="submit"
                                          name="_action"
                                          value="DeleteBook"
                                          variant="destructive"
                                          className="rounded-full w-full sm:w-auto"
                                        >
                                          Yes, delete book
                                        </Button>
                                      </AlertDialogAction>
                                      <input type="hidden" name="book_id" value={book.id} />
                                    </Form>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Pagination Controls */}
                <div className="flex items-center justify-center gap-4 bg-white p-2 rounded-full border border-input shadow-sm w-max mx-auto mb-6">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                    disabled={currentOffset === 0}
                    onClick={() => {
                      updateOffset(
                        currentOffset <= 5 ? "0" : (currentOffset - 5).toString(),
                      );
                    }}
                  >
                    <MdKeyboardDoubleArrowLeft className="w-5 h-5 text-muted-foreground" />
                  </Button>
                  <span className="text-sm font-medium text-muted-foreground px-4">
                    Page {Math.floor(currentOffset / 5) + 1}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100"
                    disabled={userBooks?.length < 5}
                    onClick={() => {
                      updateOffset((currentOffset + 5).toString());
                    }}
                  >
                    <MdKeyboardDoubleArrowRight className="w-5 h-5 text-muted-foreground" />
                  </Button>
                </div>
              </>
            ) : null
          ) : (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 px-4 text-center border-2 border-dashed border-input rounded-2xl m-6">
              <div className="w-20 h-20 bg-success/20 rounded-full flex items-center justify-center mb-6">
                <IoMdAdd className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-2">No books yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8">
                You haven't created any books. Get started by adding a new book to track your finances.
              </p>
              <ResponsiveModal
                title="Add New Book"
                description="Create a new book to start organizing your finances."
                trigger={
                  <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg transition-all shadow-md hover:shadow-xl">
                    <IoMdAdd className="w-6 h-6" />
                    Create Your First Book
                  </Button>
                }
              >
                  <AddNewBookDialog existing_books={[]} />
              </ResponsiveModal>
            </div>
          )}
        </div>

        {/* Outlet section for rendering selected book content (like transactions) */}
        <div ref={outletRef} className={twMerge("mt-1 transition-all duration-500", selectedBook ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 hidden")}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
