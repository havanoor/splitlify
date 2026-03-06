import { MdOutlineModeEdit } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import AddNewTransactionDialog from "./AddNewTransactionDialog";
import { Button } from "./ui/button";

export default function EditTransactionView({
  book,
  transaction,
  categories,
  title,
}: {
  book: Book;
  transaction: Transaction;
  categories?: Category[];
  title?: string;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors border border-blue-100 bg-white shadow-sm"
        >
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
          <SheetDescription>
            Edit details for "{transaction?.desc}"
          </SheetDescription>
        </SheetHeader>
        <AddNewTransactionDialog
          books={book}
          currentTransaction={transaction}
          categories={categories}
          title={title ? title : "Update"}
        />
      </SheetContent>
    </Sheet>
  );
}
