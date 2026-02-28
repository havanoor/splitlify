import { Form, useFetcher } from "@remix-run/react";
import { ChangeEvent, useState } from "react";
import { Calendar } from "components/ui/calendar";
import { cn } from "~/lib/utils";
import AddNewPerson from "./AddNewPerson";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { MultiSelect } from "./ui/multi-select";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { SheetClose } from "~/components/ui/sheet";
import { Badge } from "./ui/badge";

type AddNewTransactionProps = {
  books: Book;
  currentTransaction?: Transaction | null;
  categories?: Category[];
  title: string;
};

export default function AddNewTransactionDialog({
  books,
  currentTransaction,
  categories,
  title,
}: AddNewTransactionProps) {
  const categoryUpdater = useFetcher();
  const [selected, setSelected] = useState<User[]>(
    currentTransaction?.payee || []
  );
  const [date, setDate] = useState<Date | undefined>(
    currentTransaction?.date ? new Date(currentTransaction?.date) : new Date()
  );

  // useEffect(() => {
  //   if (categoryUpdater.state === "idle" && categoryUpdater.data) {
  //     category.load(`/query-category`);
  //   }
  // }, [categoryUpdater.data, categoryUpdater.state]);

  const toggleSelected = (users: User[]) => {
    const newSelected = [...selected];
    users.forEach((user) => {
      const index = newSelected.findIndex((u) => u.id === user.id);
      if (index === -1) {
        newSelected.push(user); // Add if not already selected
      } else {
        newSelected.splice(index, 1); // Remove if already selected
      }
    });
    setSelected(newSelected);
  };

  const [transaction, setTransaction] = useState<NewTransaction>(null as unknown as NewTransaction);

  const handleNewTransaction = (e: ChangeEvent<HTMLInputElement>) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white px-1 pb-6">
      <Form className="flex flex-col gap-5" method="POST">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">Transaction Name</Label>
          <Input
            defaultValue={currentTransaction?.desc || ""}
            id="name"
            placeholder="e.g. Dinner at Luigi's"
            className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#79AC78] focus-visible:border-transparent transition-all w-full"
            name="desc"
            onChange={handleNewTransaction}
            readOnly={!!currentTransaction && title === "View"}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount" className="text-sm font-semibold text-gray-700">Amount</Label>
          <Input
            defaultValue={currentTransaction?.amount}
            id="amount"
            type="number"
            placeholder="0.00"
            onChange={handleNewTransaction}
            className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#79AC78] focus-visible:border-transparent transition-all w-full text-gray-900"
            name="amount"
            step="0.01"
            readOnly={!!currentTransaction && title === "View"}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id" className="text-sm font-semibold text-gray-700">Category</Label>

          {currentTransaction?.category && title === "View" ? (
            <Input
              readOnly
              className="h-12 rounded-xl border-gray-200 w-full"
              defaultValue={currentTransaction?.category?.category.toString()}
            />
          ) : (
            <div className="flex items-center gap-2">
              <div className="flex-grow">
                <Select
                  name="category_id"
                  defaultValue={currentTransaction?.category?.id.toString()}
                  onValueChange={(v) => {
                    setTransaction({ ...transaction, category_id: v });
                  }}
                >
                  <SelectTrigger className="w-full h-12 rounded-xl text-gray-700 border-gray-200 focus:ring-[#79AC78] transition-all bg-white">
                    <SelectValue
                      placeholder={
                        currentTransaction?.category?.category ||
                        "Select a Category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] rounded-xl border-gray-100 shadow-lg">
                    <SelectGroup>
                      {categories?.map((val, id) => (
                        <SelectItem key={id} value={val.id.toString()} className="cursor-pointer">
                          {val.category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="items-center">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-12 h-12 rounded-xl border-gray-200 text-gray-500 hover:text-[#79AC78] transition-colors focus-visible:ring-[#79AC78]">
                      +
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="z-[9999] px-4 py-4 w-72 bg-white border border-gray-100 shadow-xl rounded-xl mr-4" side="top" align="end">
                    <categoryUpdater.Form method="POST" action="/new-category">
                      <div className="flex flex-col space-y-3">
                        <Label htmlFor="newcategory" className="text-sm font-semibold text-gray-700">
                          New Category Name
                        </Label>
                        <div className="flex gap-2">
                          <Input name="category" placeholder="e.g. Groceries" className="h-10 rounded-lg border-gray-200 focus-visible:ring-[#79AC78]" required />
                          <Button type="submit" className="h-10 rounded-lg bg-[#79AC78] hover:bg-[#639362] text-white">
                            Add
                          </Button>
                        </div>
                      </div>
                    </categoryUpdater.Form>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-sm font-semibold text-gray-700">Date</Label>
          {currentTransaction?.date && title === "View" ? (
            <Input
              value={date ? date.toDateString() : "Pick a date"}
              readOnly
              className={cn(
                "w-full h-12 rounded-xl border-gray-200 text-gray-900 justify-start text-left font-normal",
                !date && "text-gray-400"
              )}
            />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  name="date"
                  id="date"
                  variant={"outline"}
                  value={date ? date.toDateString() : "Pick a date"}
                  className={cn(
                    "w-full h-12 rounded-xl bg-white border-gray-200 hover:bg-gray-50 text-gray-900 justify-start text-left font-normal transition-all focus-visible:ring-[#79AC78]",
                    !date && "text-gray-400"
                  )}
                >
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-[9999] w-auto bg-white rounded-xl shadow-xl border-gray-100 p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="rounded-xl"
                />
              </PopoverContent>
            </Popover>
          )}

          <input
            type="hidden"
            name="date"
            value={
              currentTransaction?.date
                ? currentTransaction?.date
                : date?.toISOString().slice(0, 10) ??
                new Date().toISOString().slice(0, 10)
            }
            readOnly={!!currentTransaction}
          />

          {currentTransaction?.id && title !== "View" ? (
            <input type="hidden" name="id" value={currentTransaction.id} />
          ) : null}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="payer_id" className="text-sm font-semibold text-gray-700">Paid By</Label>
          {currentTransaction && title === "View" ? (
            <Input
              readOnly
              className="w-full h-12 rounded-xl border-gray-200 text-gray-900"
              defaultValue={
                currentTransaction?.payer.username ||
                `${currentTransaction?.payer.first_name} ${currentTransaction?.payer.last_name}`
              }
            />
          ) : (
            <Select
              name="payer_id"
              defaultValue={currentTransaction?.payer.id.toString()}
              onValueChange={(v) => {
                setTransaction({ ...transaction, payer_id: v });
              }}
            >
              <SelectTrigger className="w-full h-12 rounded-xl text-gray-700 border-gray-200 focus:ring-[#79AC78] transition-all bg-white">
                <SelectValue
                  placeholder={
                    currentTransaction?.payer.username || "Select a payer"
                  }
                />
              </SelectTrigger>
              <SelectContent className="z-[9999] rounded-xl border-gray-100 shadow-lg">
                <SelectGroup>
                  {books?.splitters.map((val, id) => (
                    <SelectItem key={id} value={val.id.toString()} className="cursor-pointer">
                      {val.username
                        ? val.username
                        : `${val.first_name} ${val.last_name}`}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="payee" className="text-sm font-semibold text-gray-700">Paid For</Label>
          {currentTransaction?.payee && title === "View" ? (
            <div className="rounded-xl border border-gray-200 bg-gray-50/50 w-full min-h-[3rem] p-2 flex flex-wrap items-center gap-2">
              {selected.map((e: User) => (
                <Badge key={e.id} variant="secondary" className="rounded-md px-2 py-1 font-medium bg-white border-gray-200">
                  {e.username ? e.username : `${e.first_name} ${e.last_name}`}
                </Badge>
              ))}
            </div>
          ) : (
            <MultiSelect
              options={books?.splitters}
              selected={selected}
              onChange={toggleSelected}
              className="w-full z-[9999] rounded-xl"
              name="payee_ids"
            />
          )}

          <input
            type="hidden"
            name="payee_ids"
            value={selected.map((e: User) => e.id.toString())}
          />
        </div>

        <div className="pt-4 pb-8 flex flex-col gap-3">
          {currentTransaction?.id && title === "View" ? null : (
            <>
              <SheetClose asChild>
                <Button
                  className="w-full h-12 rounded-xl bg-[#79AC78] hover:bg-[#639362] text-white font-semibold transition-all shadow-sm"
                  type="submit"
                  name="_action"
                  value="AddNewTransaction"
                >
                  {title === "Add" ? "Create Transaction" : `${title} Transaction`}
                </Button>
              </SheetClose>
              <div className="w-full flex justify-center">
                <AddNewPerson bookId={books.id.toString()} />
              </div>
            </>
          )}
        </div>
      </Form>
    </div>
  );
}
