import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
} from "@remix-run/node";
import {
  Form,
  json,
  Link,
  Outlet,
  ShouldRevalidateFunction,
  useActionData,
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useEffect, useState } from "react";
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
import { twMerge } from "tailwind-merge";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/ui/collapsible";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { getData, deleteData, postData } from "~/lib/ApiRequests";
import { getSession } from "~/lib/helperFunctions";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { toast } from "sonner";
import { CircleX } from "lucide-react";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);

  if (!url.searchParams.get("offset")) {
    url.searchParams.set("offset", "0");
  }
  const offset = url.searchParams.get("offset") || "0";
  const { user, refreshToken } = await getSession(request);

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
  const { user, refreshToken } = await getSession(request);
  const { _action, ...data } = Object.fromEntries(formData);
  const headers = new Headers();

  switch (_action) {
    case "AddNewBook":
      const response: Book = await postData(
        "books/new",
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
          type: "AddNewBook",
          id: response.id,
          name: data.name,
        },
        { headers }
      );

    case "DeleteBook":
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
    case "AddNewCategory":
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
}

export default function Books() {
  const navigate = useNavigate();
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

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Your Books</h1>
            <p className="text-gray-500 mt-1">Manage all your financial books in one place.</p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <button className="flex items-center gap-2 text-sm font-semibold bg-white border border-gray-200 text-gray-700 hover:text-[#79AC78] hover:border-[#79AC78] px-4 py-2 rounded-full transition-all shadow-sm">
                <IoMdAdd className="w-4 h-4" />
                Add New Book
              </button>
            </SheetTrigger>
            <SheetContent
              className="h-[450px] w-full sm:w-[500px] border-l-0 sm:border-l rounded-l-2xl shadow-2xl"
              side="right"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <SheetHeader className="text-left mb-7">
                <SheetTitle className="text-2xl font-bold text-gray-800">Add New Book</SheetTitle>
                <SheetDescription>
                  Create a new book to start organizing your finances.
                </SheetDescription>
              </SheetHeader>
              <AddNewBookDialog
                existing_books={
                  userBooks ? userBooks.map((book: any) => book.name) : []
                }
              />
            </SheetContent>
          </Sheet>
        </div>

        {/* Books Grid View */}
        {userBooks && userBooks.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-10">
              {userBooks.map((book: any) => {
                const isSelected = selectedBook?.id === book.id;
                return (
                  <div
                    key={book.id}
                    className={twMerge(
                      "group relative flex flex-col bg-white rounded-2xl border p-0 transition-all duration-300 cursor-pointer overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1",
                      isSelected
                        ? "border-[#79AC78] ring-2 ring-[#79AC78]/20 bg-[#79AC78]/[0.02]"
                        : "border-gray-100"
                    )}
                    onClick={() => {
                      setSelected(book);
                      navigate(`/books/${book.id}?${searchParams.toString()}`);
                    }}
                  >
                    {/* Decorative Header Background */}
                    <div className={twMerge(
                      "absolute top-0 left-0 w-full h-24 opacity-20 pointer-events-none transition-colors",
                      isSelected ? "bg-[#79AC78]" : "bg-gradient-to-br from-gray-100 to-transparent group-hover:from-blue-50 group-hover:to-transparent"
                    )} />

                    <div className="p-6 flex-1 flex flex-col relative z-10">
                      {/* Selected Indicator */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 bg-[#79AC78] text-white rounded-bl-2xl rounded-tr-xl p-2.5 shadow-md z-10 animate-in zoom-in duration-200">
                          <GrCheckmark className="w-5 h-5" />
                        </div>
                      )}

                      {/* Card Content */}
                      <div className="flex-1 mb-6 mt-2">
                        <div className="flex items-center gap-3 mb-4">
                          {/* Visual Icon Box */}
                          <div className={twMerge(
                            "w-12 h-12 rounded-xl flex items-center justify-center text-xl shadow-sm",
                            book.type_of_book.toLowerCase().includes("business") ? "bg-blue-100 text-blue-600" :
                              book.type_of_book.toLowerCase().includes("personal") ? "bg-green-100 text-[#79AC78]" :
                                "bg-orange-100 text-orange-600"
                          )}>
                            {book.type_of_book.toLowerCase().includes("business") ? "💼" :
                              book.type_of_book.toLowerCase().includes("personal") ? "👤" : "🏷️"}
                          </div>
                          <span className="inline-flex items-center rounded-full bg-gray-50 px-3 py-1.5 text-xs font-semibold text-gray-600 ring-1 ring-inset ring-gray-500/10 uppercase tracking-widest">
                            {book.type_of_book}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-[#79AC78] transition-colors pr-8">
                          {book.name}
                        </h3>
                      </div>

                      {/* Card Footer Actions */}
                      <div
                        className="flex items-center gap-2 pt-5 border-t border-gray-100/80 mt-auto"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center hover:scale-105 transition-transform bg-gray-50 rounded-full px-2 py-1 flex-1">
                          <ShareBookPanel
                            typeOfBook={book.type_of_book}
                            bookUrl={`${baseURL}/public-book/${book.id}`}
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Sheet>
                            <SheetTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors border border-transparent hover:border-blue-100 bg-white shadow-sm">
                                <MdOutlineModeEdit className="w-5 h-5" />
                              </Button>
                            </SheetTrigger>
                            <SheetContent
                              className="h-[450px] w-full sm:w-[500px] border-l-0 sm:border-l rounded-l-2xl shadow-2xl"
                              side="right"
                              onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                              <SheetHeader className="text-left mb-7">
                                <SheetTitle className="text-2xl font-bold">Edit Book</SheetTitle>
                              </SheetHeader>
                              <AddNewBookDialog
                                existing_books={
                                  userBooks ? userBooks.map((b: any) => b.name) : []
                                }
                                editBook={book}
                              />
                            </SheetContent>
                          </Sheet>

                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors border border-transparent hover:border-red-100 bg-white shadow-sm">
                                <RiDeleteBinLine className="w-5 h-5" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-xl">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-xl">Delete this book?</AlertDialogTitle>
                                <AlertDialogDescription className="text-base text-gray-500">
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
            <div className="flex items-center justify-center gap-4 bg-white p-2 rounded-full border border-gray-200 shadow-sm w-max mx-auto">
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
                <MdKeyboardDoubleArrowLeft className="w-5 h-5 text-gray-600" />
              </Button>
              <span className="text-sm font-medium text-gray-600 px-4">
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
                <MdKeyboardDoubleArrowRight className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border-2 border-dashed border-gray-200">
            <div className="w-20 h-20 bg-[#d3f2d5] rounded-full flex items-center justify-center mb-6">
              <IoMdAdd className="w-10 h-10 text-[#79AC78]" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No books yet</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              You haven't created any books. Get started by adding a new book to track your finances.
            </p>
            <Sheet>
              <SheetTrigger asChild>
                <Button className="flex items-center gap-2 bg-[#79AC78] hover:bg-[#639362] text-white rounded-full px-8 py-6 text-lg transition-all shadow-md hover:shadow-xl">
                  <IoMdAdd className="w-6 h-6" />
                  Create Your First Book
                </Button>
              </SheetTrigger>
              <SheetContent
                className="h-[450px] w-full sm:w-[500px] border-l-0 sm:border-l rounded-l-2xl shadow-2xl"
                side="right"
                onOpenAutoFocus={(e) => e.preventDefault()}
              >
                <SheetHeader className="text-left mb-7">
                  <SheetTitle className="text-2xl font-bold">Add New Book</SheetTitle>
                  <SheetDescription>
                    Create a new book to start organizing your finances.
                  </SheetDescription>
                </SheetHeader>
                <AddNewBookDialog existing_books={[]} />
              </SheetContent>
            </Sheet>
          </div>
        )}

        {/* Outlet section for rendering selected book content (like transactions) */}
        <div className={twMerge("mt-12 transition-all duration-500", selectedBook ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 hidden")}>
          <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent mb-12"></div>
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
