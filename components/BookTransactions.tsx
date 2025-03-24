import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@radix-ui/react-popover";
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
import { TrashIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import {
  MdKeyboardDoubleArrowDown,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
  MdKeyboardDoubleArrowUp,
  MdOutlineModeEdit,
} from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import AddNewTransactionDialog from "./AddNewTransactionDialog";
import EditTransactionView from "./EditTransactionView";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

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
      <table className="hidden md:table w-full border-2 border-[#c4d1eb] mt-4">
        <thead className="bg-[#79AC78]">
          <tr>
            <th colSpan={6} className="px-4 text-2xl text-left ">
              Transactions
            </th>
            <th className="p-2">
              <Sheet>
                <SheetTrigger asChild>
                  <div className="text-right">
                    <Button variant="outline" className="text-xs md:text-base">
                      Add Transaction
                    </Button>
                  </div>
                </SheetTrigger>
                <SheetContent
                  className="grid gap-4 p-10 m-10 w-80 md:w-450  bg-white  rounded-md shadow-lg overflow-y-auto"
                  side="bottom"
                  // style={{
                  //   maxHeight:
                  //     "calc(var(--radix-popper-available-height) - 20px)",
                  // }}
                >
                  <AddNewTransactionDialog
                    books={book}
                    title={title ? title : "Add"}
                    categories={categories}
                  />
                </SheetContent>
              </Sheet>
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
          {transactions?.map((transaction, index) => (
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
                  <Sheet>
                    <SheetTrigger asChild>
                      <MdOutlineModeEdit className="w-4 h-4" />
                    </SheetTrigger>
                    <SheetContent
                      className="grid gap-4 p-10 m-10 w-80 md:w-450  bg-white  rounded-md shadow-lg overflow-y-auto"
                      side="bottom"
                      // style={{
                      //   maxHeight:
                      //     "calc(var(--radix-popper-available-height) - 20px)",
                      // }}
                    >
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
                onClick={() => setOffset((offset + 5).toString())}
              >
                <MdKeyboardDoubleArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
          {/* <div
            className={`rounded-md border px-4 py-2  text-sm shadow-sm block ${
              open && transactions?.length > 0 ? "hidden" : "block"
            }`}
            onClick={handleClick}
          >
            {transactions?.length > 0
              ? "Click to expand transactions"
              : "No transactions for selected book"}
          </div> */}
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
                      ${transaction.amount}
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
