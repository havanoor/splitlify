import { PencilIcon } from "lucide-react";
import AddNewTransactionDialog from "./AddNewTransactionDialog";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";

export default function EditTransactionView({
  book,
  transaction,
}: {
  book: Book;
  transaction: Transaction;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="shadow"
          size="sm"
          className="flex items-center rounded-full"
        >
          <PencilIcon className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent
        className="z-50 grid gap-4 p-10 w-80 bg-white  rounded-md shadow-lg overflow-y-auto"
        style={{
          maxHeight: "calc(var(--radix-popper-available-height) - 20px)",
        }}
      >
        <AddNewTransactionDialog
          books={book}
          // addNewUser={addNewUser}
          currentTransaction={transaction}
          title="Update"
        />
      </SheetContent>
    </Sheet>
  );
}
