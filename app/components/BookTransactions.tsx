import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
import { Dispatch, SetStateAction } from "react";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowUp,
  MdOutlineModeEdit,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
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
} from "~/components/ui/alert-dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import AddNewTransactionDialog from "./AddNewTransactionDialog";
import { Button } from "./ui/button";

type BookTransactionsProps = {
  transactions: Transaction[];
  addNewUser: (newUser: NewUser) => void;
  deleteTransactions: (transaction_id: number) => void;
  book: Book;
  offset: number;
  setOffset: Dispatch<SetStateAction<number>>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function BookTransactions({
  book,
  transactions,
  offset,
  setOffset,
  deleteTransactions,
  addNewUser,
  open,
  setOpen,
}: BookTransactionsProps) {
  const handleClick = () => {
    setOpen(!open && transactions ? transactions.length > 0 : false);
  };
  const bookTransactions = transactions ? transactions : null;
  return (
    <>
      <div className="m-2 md:m-16 hidden md:block">
        <table className="w-full border-2 border-[#c4d1eb]">
          <thead className="bg-[#79AC78]">
            <tr>
              <th colSpan={6} className=" p-4 text-2xl text-left ">
                Transactions
              </th>
              <th className="p-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="text-xs md:text-base">
                      Add Transaction
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className="z-50 grid gap-4 p-10 m-10 w-80 md:w-450  bg-white  rounded-md shadow-lg"
                    side="bottom"
                    align="start"
                  >
                    <AddNewTransactionDialog
                      books={book}
                      addNewUser={addNewUser}
                      title="Add"
                    />
                  </PopoverContent>
                </Popover>
              </th>
            </tr>
          </thead>
          <thead className=" bg-[#79AC78]">
            <tr>
              <th scope="col" className="px-6 py-4">
                Date
              </th>
              <th scope="col" className="px-6 py-4">
                Name
              </th>
              <th scope="col" className="px-6 py-4">
                Category
              </th>
              <th scope="col" className="hidden px-6 py-4 sm:table-cell ">
                Amount paid
              </th>
              <th scope="col" className="hidden px-6 py-4 sm:table-cell">
                Paid By
              </th>
              <th scope="col" className="px-6 py-4">
                Paid For
              </th>
              <th scope="col" className="px-6 py-4">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="text-center">
            {bookTransactions?.map((transaction, index) => (
              <tr key={index}>
                <td className="hidden px-6 py-1 sm:table-cell">
                  {transaction.date}
                </td>
                <td className="px-6 py-2">{transaction.desc}</td>
                <td className="px-6 py-2">{transaction.category?.category}</td>
                <td className=" px-6 py-1">{transaction.amount}</td>
                <td className=" px-6 py-2 ">
                  {transaction.payer.username
                    ? transaction.payer.username
                    : transaction.payer.first_name +
                      " " +
                      transaction.payer.last_name}
                </td>
                <td className="px-6 py-2 text-sm">
                  {transaction.payee
                    .map((user) => user.first_name + " " + user.last_name)
                    .join(", ")}
                </td>
                <td>
                  <div className="flex gap-8 justify-center align-middle">
                    <Popover>
                      <PopoverTrigger asChild>
                        <span>
                          <MdOutlineModeEdit className="w-4 h-4" />
                        </span>
                      </PopoverTrigger>
                      <PopoverContent className="z-50 grid gap-4 p-10 w-450 bg-white  rounded-md shadow-lg ">
                        <AddNewTransactionDialog
                          books={book}
                          addNewUser={addNewUser}
                          currentTransaction={transaction}
                          title="Update"
                        />
                      </PopoverContent>
                    </Popover>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <RiDeleteBinLine className="w-4 h-4" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the transaction
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="md:hidden m-2">
        <Collapsible
          open={open}
          onOpenChange={handleClick}
          className="space-y-2 mt-4"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">Page 1</h4>
            <div>
              <Button
                variant="ghost"
                size="sm"
                disabled={!open || bookTransactions?.length == 0 || offset <= 0}
                onClick={() => setOffset(offset <= 5 ? 0 : offset - 5)}
              >
                <MdKeyboardDoubleArrowLeft className="w-5 h-5" />
              </Button>
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={transactions?.length == 0}
                >
                  {open ? (
                    <MdKeyboardDoubleArrowUp className="w-5 h-5" />
                  ) : (
                    <MdKeyboardDoubleArrowDown className="w-5 h-5" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <Button
                variant="ghost"
                size="sm"
                disabled={!open || bookTransactions?.length == 0}
                onClick={() => setOffset(offset == 5 ? 0 : offset + 5)}
              >
                <MdKeyboardDoubleArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div
            className={`rounded-md border px-4 py-2  text-sm shadow-sm block ${
              open && bookTransactions?.length && bookTransactions?.length > 0
                ? "hidden"
                : "block"
            }`}
            onClick={handleClick}
          >
            {bookTransactions?.length && bookTransactions?.length > 0
              ? "Click to expand transactions"
              : "No transactions for selected book"}
          </div>
          <CollapsibleContent className="space-y-2">
            {bookTransactions?.map((transaction, index) => (
              <div
                key={index}
                className={`${
                  open ? "relative" : "absolute  top-4 group-hover:top-4 "
                }  w-full p-4 bg-white  border border-green-600 rounded-lg shadow `}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="w-26 uppercase text-xs  font-medium border-2 green text-[#18513F] bg-[#D0E7D2] bg-opacity-50 rounded-md p-0.5 text-center">
                      {transaction.category?.category}
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="text-gray-500 text-xs">
                        {transaction.date}
                      </div>
                      <div className="text-lg font-bold">
                        {transaction.desc}
                      </div>
                    </div>
                    {/* <div className="flex items-center space-x-3"> */}
                    {/* <div className="text-gray-500 text-sm">
                          {transaction.date}
                        </div> */}
                    {/* </div> */}
                  </div>

                  <div>
                    <div className="flex items-center  justify-between space-x-1">
                      <div className="text-xl">{transaction.amount}:</div>
                      <div className="font-bold text-sm">
                        {book.book_currency}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-1 w-full flex justify-center ">
                  <div>
                    <div className="mt-2">
                      <div className="flex items-center space-x-7 justify-center text-xs">
                        <Popover>
                          <PopoverTrigger>
                            <span className="bg-green-800 ">
                              <MdOutlineModeEdit className="w-5 h-5 rounded " />
                            </span>
                          </PopoverTrigger>
                          <PopoverContent
                            className="z-50 grid gap-4 p-10 w-80 bg-white  rounded-md shadow-lg overflow-y-auto"
                            style={{
                              maxHeight:
                                "calc(var(--radix-popper-available-height) - 20px)",
                            }}
                          >
                            <AddNewTransactionDialog
                              books={book}
                              addNewUser={addNewUser}
                              currentTransaction={transaction}
                              title="Update"
                            />
                          </PopoverContent>
                        </Popover>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <RiDeleteBinLine className="w-5 h-5" />
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently delete the Transaction
                                {transaction.desc}
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => {
                                  deleteTransactions(transaction.id);
                                }}
                              >
                                Continue
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
