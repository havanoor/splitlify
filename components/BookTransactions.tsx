import { Form } from "@remix-run/react";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "components/ui/collapsible";
import { TrashIcon, X } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { IoMdAdd } from "react-icons/io";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowUp,
  MdOutlineModeEdit,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "~/components/ui/sheet";
import AddNewTransactionDialog from "./AddNewTransactionDialog";
import EditTransactionView from "./EditTransactionView";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

type BookTransactionsProps = {
  transactions: Transaction[];
  book: Book;
  offset: number;
  setOffset: (offset: string) => void;
  open: boolean;
  title?: string;
  categories?: Category[];
  setOpen: Dispatch<SetStateAction<boolean>>;
};

export default function BookTransactions({
  book,
  transactions,
  offset,
  setOffset,
  open,
  title,
  setOpen,
  categories,
}: BookTransactionsProps) {
  const handleClick = () => {
    setOpen(!open && transactions ? transactions.length > 0 : false);
  };
  return (
    <>
      <div className="hidden md:block w-full">
        <div
          className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 cursor-pointer hover:bg-gray-100/50 transition-colors"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
            <div className="text-gray-400">
              {open ? <MdKeyboardDoubleArrowUp className="w-5 h-5" /> : <MdKeyboardDoubleArrowDown className="w-5 h-5" />}
            </div>
          </div>

          <div onClick={(e) => e.stopPropagation()}>
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
                </SheetHeader>
                <AddNewTransactionDialog
                  books={book}
                  title={title ? title : "Add"}
                  categories={categories}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {open && (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-sm tracking-wider text-gray-500 uppercase">
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Amount paid</th>
                <th className="px-6 py-4 font-medium">Paid By</th>
                <th className="px-6 py-4 font-medium">Paid For</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 bg-white">
              {transactions?.length > 0 ? transactions.map((transaction, index) => (
                <tr key={index} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    {transaction.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-gray-900 group-hover:text-[#79AC78] transition-colors">{transaction.desc}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                      {transaction.category?.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-bold text-gray-900">{book.book_currency} {transaction.amount}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-[#79AC78]/10 text-[#79AC78] flex items-center justify-center text-xs font-bold">
                        {(transaction.payer.username || transaction.payer.first_name).charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm font-medium text-gray-700">
                        {transaction.payer.username
                          ? transaction.payer.username
                          : transaction.payer.first_name + " " + transaction.payer.last_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    <div className="flex -space-x-2 overflow-hidden">
                      {transaction.payee.map((user, i) => (
                        <div key={i} className="inline-block h-6 w-6 rounded-full ring-2 ring-white bg-blue-100 text-blue-700 flex flex-shrink-0 items-center justify-center text-xs font-bold" title={user.first_name + " " + user.last_name}>
                          {user.first_name.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                      <Sheet>
                        <SheetTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full">
                            <MdOutlineModeEdit className="w-4 h-4" />
                          </Button>
                        </SheetTrigger>
                        <SheetContent
                          className="w-full sm:w-[500px] border-l-0 sm:border-l rounded-l-2xl shadow-2xl overflow-y-auto"
                          side="right"
                          onOpenAutoFocus={(e) => e.preventDefault()}
                        >
                          <SheetHeader className="text-left mb-7">
                            <SheetTitle className="text-2xl font-bold">Edit Transaction</SheetTitle>
                          </SheetHeader>
                          <AddNewTransactionDialog
                            books={book}
                            currentTransaction={transaction}
                            categories={categories}
                            title={title ? title : "Update"}
                          />
                        </SheetContent>
                      </Sheet>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full">
                            <RiDeleteBinLine className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl">Delete this transaction?</AlertDialogTitle>
                            <AlertDialogDescription className="text-base text-gray-500">
                              This action cannot be undone. This will permanently delete the transaction: <strong>{transaction.desc}</strong>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-2 sm:gap-0 mt-2">
                            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
                            <Form method="POST">
                              <AlertDialogAction asChild>
                                <Button type="submit" name="_action" value="DeleteTransaction" variant="destructive" className="rounded-full">
                                  Yes, delete
                                </Button>
                              </AlertDialogAction>
                              <input type="hidden" name="transaction_id" value={transaction.id} />
                            </Form>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    No transactions yet. Click the "Add Transaction" button to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
      <div className="md:hidden m-2">
        <Collapsible
          open={open}
          onOpenChange={handleClick}
          className="space-y-2 mt-4"
        >
          <div className="flex items-center justify-between space-x-4 px-4">
            <h4 className="text-sm font-semibold">Page {offset / 5 + 1}</h4>
            <div>
              <Button
                variant="ghost"
                size="sm"
                disabled={
                  !open ||
                  transactions?.length == 0 ||
                  // transactions.length < 5 ||
                  offset <= 0
                }
                onClick={() =>
                  setOffset(offset <= 5 ? "0" : (offset - 5).toString())
                }
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
                disabled={
                  !open || transactions?.length == 0 || transactions.length < 5
                }
                onClick={() => {
                  setOffset((offset + 5).toString());
                }}
              >
                <MdKeyboardDoubleArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div
            className={`rounded-md border px-4 py-2  text-sm shadow-sm block ${open && transactions?.length > 0 ? "hidden" : "block"
              }`}
            onClick={handleClick}
          >
            {transactions?.length > 0
              ? "Click to expand transactions"
              : "No transactions for selected book"}
          </div>
          <CollapsibleContent className="space-y-2">
            {transactions?.map((transaction, index) => (
              <Card className="w-full max-w-md" key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold mb-1">
                        {transaction.desc}
                      </h3>
                      <Badge
                        variant="outline"
                        className="mb-2 text-sm font-medium"
                      >
                        {transaction.category?.category}
                      </Badge>
                      <p className="text-sm text-gray-500">
                        {transaction.date}
                      </p>
                    </div>
                    <p className="text-xl font-bold text-gray-900">
                      <span className="text-sm">{book.book_currency}. </span>
                      {transaction.amount}
                    </p>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <EditTransactionView
                      book={book}
                      transaction={transaction}
                      title={title}
                      categories={categories}
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="shadow"
                          size="sm"
                          className="flex items-center text-red-600 hover:text-red-700 rounded-full"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the Transaction :-
                            {transaction.desc}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction>
                            <Form method="POST">
                              <Button
                                type="submit"
                                name="_action"
                                value="DeleteTransaction"
                              >
                                Continue
                              </Button>
                              <input
                                type="hidden"
                                name="transaction_id"
                                value={transaction.id}
                              />
                            </Form>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>

              // <div
              //   key={index}
              //   className={`${
              //     open ? "relative" : "absolute  top-4 group-hover:top-4 "
              //   }  w-full p-4 bg-white  border border-green-600 rounded-lg shadow `}
              // >
              //   <div className="flex items-center justify-between">
              //     <div>
              //       <div className="w-26 uppercase text-xs  font-medium border-2 green text-[#18513F] bg-[#D0E7D2] bg-opacity-50 rounded-md p-0.5 text-center">
              //         {transaction.category?.category}
              //       </div>

              //       <div className="flex items-center space-x-3">
              //         <div className="text-gray-500 text-xs">
              //           {transaction.date}
              //         </div>
              //         <div className="text-lg font-bold">
              //           {transaction.desc}
              //         </div>
              //       </div>
              //       {/* <div className="flex items-center space-x-3"> */}
              //       {/* <div className="text-gray-500 text-sm">
              //             {transaction.date}
              //           </div> */}
              //       {/* </div> */}
              //     </div>

              //     <div>
              //       <div className="flex items-center  justify-between space-x-1">
              //         <div className="text-xl">{transaction.amount}:</div>
              //         <div className="font-bold text-sm">
              //           {book.book_currency}
              //         </div>
              //       </div>
              //     </div>
              //   </div>
              //   <div className="mt-1 w-full flex justify-center ">
              //     <div>
              //       <div className="mt-2">
              //         <div className="flex items-center space-x-7 justify-center text-xs">
              //           <Popover>
              //             <PopoverTrigger>
              //               <span className="bg-green-800 ">
              //                 <MdOutlineModeEdit className="w-5 h-5 rounded " />
              //               </span>
              //             </PopoverTrigger>
              //             <PopoverContent
              //               className="z-50 grid gap-4 p-10 w-80 bg-white  rounded-md shadow-lg overflow-y-auto"
              //               style={{
              //                 maxHeight:
              //                   "calc(var(--radix-popper-available-height) - 20px)",
              //               }}
              //             >
              //               <AddNewTransactionDialog
              //                 books={book}
              //                 addNewUser={addNewUser}
              //                 currentTransaction={transaction}
              //                 title="Update"
              //               />
              //             </PopoverContent>
              //           </Popover>
              //           <AlertDialog>
              //             <AlertDialogTrigger asChild>
              //               <RiDeleteBinLine className="w-5 h-5" />
              //             </AlertDialogTrigger>
              //             <AlertDialogContent>
              //               <AlertDialogHeader>
              //                 <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              //                 <AlertDialogDescription>
              //                   This action cannot be undone. This will
              //                   permanently delete the Transaction
              //                   {transaction.desc}
              //                 </AlertDialogDescription>
              //               </AlertDialogHeader>
              //               <AlertDialogFooter>
              //                 <AlertDialogCancel>Cancel</AlertDialogCancel>
              //                 <AlertDialogAction
              //                   onClick={() => {
              //                     deleteTransactions(transaction.id);
              //                   }}
              //                 >
              //                   Continue
              //                 </AlertDialogAction>
              //               </AlertDialogFooter>
              //             </AlertDialogContent>
              //           </AlertDialog>
              //         </div>
              //       </div>
              //     </div>
              //   </div>
              // </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      </div>
    </>
  );
}
