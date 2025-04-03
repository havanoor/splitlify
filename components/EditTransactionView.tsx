import { PencilIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "~/components/ui/sheet";
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
        side="left"
      >
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
