import { PopoverClose } from "@radix-ui/react-popover";
import { Form, useFetcher } from "@remix-run/react";
import { ChangeEvent, useEffect, useState } from "react";
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

  const [transaction, setTransaction] = useState<NewTransaction>(null);

  const handleNewTransaction = (e: ChangeEvent<HTMLInputElement>) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
      <Form className="grid grid-cols-1 items-center gap-4" method="POST">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">{title} Transaction</h4>
          <p className="text-sm text-muted-foreground">
            {title} details for the transaction
          </p>
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="name">Transaction Name</Label>
          <Input
            defaultValue={currentTransaction?.desc || ""}
            id="name"
            placeholder="New transaction"
            className="col-span-2 h-8"
            name="desc"
            onChange={handleNewTransaction}
            readOnly={!!currentTransaction && title === "View"}
            required
          />
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="amount">Amount</Label>
          <Input
            defaultValue={currentTransaction?.amount}
            id="amount"
            type="number"
            placeholder="0"
            onChange={handleNewTransaction}
            className="col-span-2 h-8 text-black"
            name="amount"
            readOnly={!!currentTransaction && title === "View"}
            required
          />
        </div>
        <div className="grid items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="amount">Category</Label>

          {currentTransaction?.category && title === "View" ? (
            <Input
              readOnly
              className="col-span-2 h-8"
              defaultValue={currentTransaction?.category?.category.toString()}
            />
          ) : (
            <div className="flex items-center gap-2 ">
              <div className="flex-grow">
                <Select
                  name="category_id"
                  defaultValue={currentTransaction?.category?.id.toString()}
                  onValueChange={(v) => {
                    setTransaction({ ...transaction, category_id: v });
                  }}
                >
                  <SelectTrigger className="col-span-2 h-8">
                    <SelectValue
                      placeholder={
                        currentTransaction?.category?.category ||
                        "Select a Category"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories?.map((val, id) => (
                        <SelectItem key={id} value={val.id.toString()}>
                          {val.category}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="items-center hover:cursor-pointer">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-4 h-8 z-[999]">
                      +
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="px-2 py-3 mr-3  bg-white border-2 rounded">
                    <categoryUpdater.Form method="POST" action="/new-category">
                      <div className="flex items-center bg-white space-x-2">
                        <Label htmlFor="newcategory" className="mr-4">
                          Category:
                        </Label>
                        <Input name="category" className="h-8 text-black" />
                        <Button type="submit" variant="default">
                          Add
                        </Button>
                      </div>
                    </categoryUpdater.Form>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          {/* </div> */}
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="date">Date</Label>
          {currentTransaction?.date && title === "View" ? (
            <Input
              value={date ? date.toDateString() : "Pick a date"}
              readOnly
              className={cn(
                "col-span-2 h-8 text-black justify-start text-left font-normal",
                !date && "text-muted-foreground"
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
                    "col-span-2 h-8 text-black justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto bg-white  rounded-md shadow-lg"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
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
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="payer_id">Paid By</Label>
          <Select
            name="payer_id"
            defaultValue={currentTransaction?.payer.id.toString()}
            onValueChange={(v) => {
              setTransaction({ ...transaction, payer_id: v });
            }}
          >
            <SelectTrigger className="col-span-2 h-8">
              <SelectValue
                placeholder={
                  currentTransaction?.payer.username || "Select a payer"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {books?.splitters.map((val, id) => (
                  <SelectItem key={id} value={val.id.toString()}>
                    {val.username
                      ? val.username
                      : val.first_name + val.last_name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="payee">Paid For</Label>
          {currentTransaction?.payee && title === "View" ? (
            <div className="rounded-md border border-input w-full p-2 h-full flex flex-wrap items-center gap-2 justify-normal">
              {selected.map((e: User) => (
                <Badge key={e.id} variant="secondary">
                  {e.username ? e.username : `${e.first_name} ${e.last_name}`}
                </Badge>
              ))}
            </div>
          ) : (
            <MultiSelect
              options={books?.splitters}
              selected={selected}
              onChange={toggleSelected}
              className="w-80 z-[999]"
              name="payee_ids"
            />
          )}

          <input
            type="hidden"
            name="payee_ids"
            value={selected.map((e: User) => e.id.toString())}
          />
        </div>
        <div>
          {currentTransaction?.id && title === "View" ? null : (
            <>
              <SheetClose asChild>
                <Button
                  className="mr-2"
                  type="submit"
                  name="_action"
                  value="AddNewTransaction"
                >
                  {title}
                </Button>
              </SheetClose>
              <AddNewPerson bookId={books.id.toString()} />
            </>
          )}
        </div>
      </Form>
    </>
  );
}
