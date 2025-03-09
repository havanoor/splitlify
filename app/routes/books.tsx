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
  useLoaderData,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { useState } from "react";
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
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export async function loader({ request }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  if (!url.searchParams.get("offset")) {
    url.searchParams.set("offset", "0");
  }
  const offset = url.searchParams.get("offset") || "0";
  const user = await getSession(request);

  if (!user) {
    throw redirect("/login");
  }

  const data = await getData(
    `book/?user_id=${user.user_id}&limit=5&offset=${offset}`
  );

  return json(data);
}


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const user = await getSession(request);
  const { _action, ...data } = Object.fromEntries(formData);
  switch (_action) {
    case "AddNewBook":
      await postData("books/new", { ...data, user_id: user.user_id });
      return json({
        ok: "Suceess",
      });

    case "DeleteBook":
      await deleteData(`books/delete/${data.book_id}`);
      return json({
        ok: "Suceess",
      });
    case "AddNewCategory":
      await postData("category/add", { ...data, user_id: user.user_id });
      return json({
        ok: "Suceess",
      });
  }
}

export default function Books() {
  const navigate = useNavigate();

  const { bookId } = useParams();
  const userBooks: Book[] = useLoaderData<typeof loader>();
  const [isFlex, setIsFlex] = useState(false);
  const [selectedBook, setSelected] = useState<Book | undefined>(
    userBooks.find((book) => book.id === Number(bookId))
  );
  const [viewTransactions, setViewTransactions] = useState(false);
  const handleClick = () => {
    const bookCount = userBooks != null && userBooks.length > 0;
    setViewTransactions(true);
    setIsFlex(!isFlex && bookCount);
  };

  const [searchParams, setSearchParams] = useSearchParams();

  const updateOffset = (newOffset: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("offset", newOffset);
    setSearchParams(params);
  };

  return (
    <div className="m-2 md:m-16">
      <div>
        <div>
          <div className="w-full  md:hidden p-1.5  border-2 border-[#c4d1eb] bg-[#79AC78] flex items-center justify-between">
            <div className="text-xl font-bold flex items-center">
              {isFlex && userBooks != null && userBooks?.length > 0 ? (
                <MdKeyboardDoubleArrowUp className="w-6 h-6" />
              ) : (
                <MdKeyboardDoubleArrowDown className="w-6 h-6" />
              )}
              All Books
            </div>
            <div>
              <Sheet>
                <SheetTrigger asChild>
                  <div className="text-right">
                    <IoMdAdd
                      color="white"
                      fill="white"
                      className="w-6 h-6 border-2 rounded"
                    />
                  </div>
                </SheetTrigger>
                <SheetContent
                  className="h-[450px]"
                  side="left"
                  // align="start"
                >
                  <AddNewBookDialog
                    //   TODO: Fix here
                    existing_books={
                      userBooks
                        ? userBooks.map((book: Book) => {
                            return book.name;
                          })
                        : []
                    }
                  />
                </SheetContent>
              </Sheet>
            </div>
          </div>

          <div className="md:hidden">
            <Collapsible
              open={isFlex}
              onOpenChange={handleClick}
              className="space-y-2 mt-4"
            >
              <div className="flex items-center justify-between space-x-3 px-4">
                <h4 className="text-sm underline font-semibold">
                  {selectedBook
                    ? `Selected: ${selectedBook.name}`
                    : "No Book Selected"}
                </h4>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!isFlex}
                    onClick={() => {
                      let number = parseInt(searchParams.get("offset") || "5");
                      updateOffset(number <= 5 ? "0" : (number - 5).toString());
                    }}
                  >
                    <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
                  </Button>
                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      disabled={userBooks != null && userBooks?.length == 0}
                    >
                      {isFlex && userBooks != null && userBooks?.length > 0 ? (
                        <MdKeyboardDoubleArrowUp className="w-5 h-5" />
                      ) : (
                        <MdKeyboardDoubleArrowDown className="w-5 h-5" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!isFlex}
                    onClick={() => {
                      let number = parseInt(searchParams.get("offset") || "0");
                      updateOffset((number + 5).toString());
                    }}
                  >
                    <MdKeyboardDoubleArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
              <div
                className={`rounded-md border px-4 py-2  text-sm shadow-sm block ${
                  isFlex && userBooks && userBooks.length > 0
                    ? "hidden"
                    : "block"
                }`}
                onClick={handleClick}
              >
                {userBooks != null && userBooks.length > 0
                  ? "Click to display your Books"
                  : "No books. Start by creating one"}
              </div>
              <CollapsibleContent className="space-y-2">
                {userBooks?.map((book: Book, index: number) => (
                  <Link to={`/books/${book.id}`} key={index} className="block">
                    <div
                      key={index}
                      className={`${
                        isFlex
                          ? "relative"
                          : "absolute  top-4 group-hover:top-4 "
                      }  w-full p-4 bg-white  border-2  rounded-lg shadow  ${twMerge(
                        "hover:bg-green-100 cursor-pointer",
                        selectedBook?.id == book.id && "bg-[#d3f2d5]"
                      )}`}
                    >
                      <div className="flex justify-between items-center space-x-4">
                        <div>
                          {selectedBook?.id == book.id ? (
                            <GrCheckmark className="w-5 h-5" />
                          ) : (
                            <div>{index + 1}</div>
                          )}
                        </div>
                        <div
                          className="w-48"
                          onClick={() => {
                            setSelected(book);
                            handleClick();
                          }}
                        >
                          Name: {book.name}
                          <div className="text-xs text-gray-500">
                            Book Type:{book.type_of_book.toLowerCase()}
                          </div>
                        </div>

                        <div className="flex gap-8 justify-center align-middle">
                          {/* Share Icon */}
                          <ShareBookPanel
                            typeOfBook={book.type_of_book}
                            bookUrl={`http://localhost:3000/singleBook/publicBook/${book.id}`}
                          />

                          {/* Share Icon Content Ends */}
                          {/* Update Book Icon */}
                          <div>
                            <Sheet>
                              <SheetTrigger asChild>
                                <div className="text-right">
                                  {/* <Button
                                  variant="outline"
                                  className="text-xs md:text-base"
                                > */}
                                  <MdOutlineModeEdit className="w-4 h-4" />
                                  {/* </Button> */}
                                </div>
                              </SheetTrigger>
                              <SheetContent className="h-[450px]" side="left">
                                <AddNewBookDialog
                                  existing_books={
                                    userBooks
                                      ? userBooks.map((book: Book) => {
                                          return book.name;
                                        })
                                      : []
                                  }
                                  editBook={book}
                                />
                              </SheetContent>
                            </Sheet>
                          </div>
                          {/* Delete Book */}
                          <div>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <RiDeleteBinLine
                                  className="w-4 h-4"
                                  // onClick={() => deleteBook(book.id)}
                                />
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure?
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will
                                    permanently delete the Book {book.name}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <Form method="POST" className="w-full ">
                                    {" "}
                                    <AlertDialogAction
                                    //   onClick={() => deleteBook(book.id)}
                                    >
                                      <input
                                        type="hidden"
                                        name="book_id"
                                        value={book.id}
                                      />
                                      <Button
                                        type="submit"
                                        name="_action"
                                        value="DeleteBook"
                                      >
                                        Continue
                                      </Button>
                                    </AlertDialogAction>
                                  </Form>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                          {/* Delete Book Icon Ends */}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>

          <table className="hidden md:table w-full border-2 border-[#c4d1eb]">
            <thead className="bg-[#79AC78]">
              <tr>
                <th colSpan={3} className="px-4 text-2xl text-left">
                  All Books
                </th>
                <th className="p-2">
                  <Sheet>
                    <SheetTrigger asChild>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          className="text-xs md:text-base"
                        >
                          Add New Book
                        </Button>
                      </div>
                    </SheetTrigger>
                    <SheetContent
                      className="grid gap-2 m-10 w-80 md:w-450  bg-white  rounded-md shadow-lg"
                      side="bottom"
                    >
                      <AddNewBookDialog
                        existing_books={
                          userBooks
                            ? userBooks.map((book: Book) => {
                                return book.name;
                              })
                            : []
                        }
                      />
                    </SheetContent>
                  </Sheet>
                </th>
              </tr>
            </thead>
            <thead className=" bg-[#79AC78]">
              <tr>
                <th scope="col" className="px-6 py-4"></th>
                <th scope="col" className="px-6 py-4">
                  Book Name
                </th>
                <th scope="col" className="px-6 py-4 hidden sm:table-cell">
                  Book Type
                </th>
                <th scope="col" className="px-6 py-4">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="text-center">
              {userBooks?.map((book: Book, index: number) => (
                <tr
                  key={index}
                  onClick={() => {
                    setSelected(book);
                    navigate(`/books/${book.id}`);
                  }}
                  className={twMerge(
                    "hover:bg-gray-300 cursor-pointer",
                    selectedBook?.id == book.id && "bg-gray-200"
                  )}
                >
                  <td className="p-2">
                    {selectedBook?.id == book.id && (
                      <GrCheckmark className="w-5 h-5" />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {book.name}
                    <dl className="sm:hidden">
                      <dd className="sm:hidden text-xs text-gray-500">
                        Book Type:{book.type_of_book.toLowerCase()}
                      </dd>
                    </dl>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-2">
                    {book.type_of_book.toLowerCase()}
                  </td>
                  <td>
                    <div className="flex gap-8 justify-center align-middle">
                      {/* Share Icon */}
                      <ShareBookPanel
                        typeOfBook={book.type_of_book}
                        // TODO: Fix this URL
                        bookUrl={`http://localhost:3000/singleBook/publicBook/${book.id}`}
                      />

                      {/* Share Icon Content Ends */}
                      {/* Update Book Icon */}
                      <div>
                        <MdOutlineModeEdit className="w-4 h-4" />
                      </div>
                      {/* Delete Book */}
                      <div>
                        <RiDeleteBinLine className="w-4 h-4" />
                      </div>
                      {/* Delete Book Icon Ends */}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div></div>
      <Outlet />

      <div className="m-2 md:m-16 ">
        <div className="w-full md:hidden p-1.5  border-2 border-[#c4d1eb] bg-[#79AC78] flex items-center justify-between">
          <div className="text-xl font-bold flex items-center">Reports</div>
        </div>
      </div>
    </div>
  );
}
