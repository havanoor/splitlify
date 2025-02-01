import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import {
  Form,
  json,
  Link,
  Outlet,
  useLoaderData,
  useParams,
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

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getSession(request);
  const data = await getData(`book/?user_id=${user.user_id}&limit=5&offset=0`);

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
  const { bookId } = useParams();
  const userBooks = useLoaderData<typeof loader>();
  const [isFlex, setIsFlex] = useState(false);
  const [selectedBook, setSelected] = useState<Book | undefined>(
    userBooks.find((book) => book.id == bookId)
  );
  const [viewTransactions, setViewTransactions] = useState(false);
  const [bookOffset, setBookOffset] = useState(0);
  const handleClick = () => {
    const bookCount = userBooks != null && userBooks.length > 0;
    setViewTransactions(true);
    setIsFlex(!isFlex && bookCount);
  };

  return (
    <div className="m-2 md:m-16">
      <div>
        <div>
          <div className="w-full  md:hidden p-1.5  border-2 border-[#c4d1eb] bg-[#79AC78] flex items-center justify-between">
            <div
              className="text-xl font-bold flex items-center"
              //   onClick={handleClick}
            >
              {isFlex && userBooks != null && userBooks?.length > 0 ? (
                <MdKeyboardDoubleArrowUp className="w-6 h-6" />
              ) : (
                <MdKeyboardDoubleArrowDown className="w-6 h-6" />
              )}
              All Books
            </div>
            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <div className="text-right">
                    <IoMdAdd
                      color="white"
                      fill="white"
                      className="w-6 h-6 border-2 rounded"
                    />
                  </div>
                </PopoverTrigger>
                <PopoverContent
                  className="z-10 p-0"
                  side="bottom"
                  align="start"
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
                </PopoverContent>
              </Popover>
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
                    onClick={() =>
                      setBookOffset(bookOffset == 5 ? 0 : bookOffset - 5)
                    }
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
                    onClick={() => setBookOffset(bookOffset + 5)}
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
                  <div
                    key={index}
                    className={`${
                      isFlex ? "relative" : "absolute  top-4 group-hover:top-4 "
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
                          <Popover>
                            <PopoverTrigger asChild>
                              <div className="text-right">
                                {/* <Button
                                  variant="outline"
                                  className="text-xs md:text-base"
                                > */}
                                <MdOutlineModeEdit className="w-4 h-4" />
                                {/* </Button> */}
                              </div>
                            </PopoverTrigger>
                            <PopoverContent className="z-10 ">
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
                            </PopoverContent>
                          </Popover>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="text-right">
                        <Button
                          variant="outline"
                          className="text-xs md:text-base"
                        >
                          Add New Book
                        </Button>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <AddNewBookDialog
                        existing_books={
                          userBooks
                            ? userBooks.map((book: Book) => {
                                return book.name;
                              })
                            : []
                        }
                      />
                    </PopoverContent>
                  </Popover>
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
                    <Link to={`/books/${book.id}`}>{book.name}</Link>
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
      <div>
        {/* <h1 className="text-center font-bold text-2xl mt-16 underline underline-offset-8">
          {state.books?.name}
        </h1> */}
      </div>
      <Outlet />

      <div className="m-2 md:m-16 ">
        <div className="w-full md:hidden p-1.5  border-2 border-[#c4d1eb] bg-[#79AC78] flex items-center justify-between">
          <div className="text-xl font-bold flex items-center">Reports</div>
        </div>
      </div>
    </div>
  );
}
