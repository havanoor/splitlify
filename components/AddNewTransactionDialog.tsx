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

type AddNewTransactionProps = {
  books: Book;
  currentTransaction?: Transaction | null;
  addNewUser: (newUser: NewUser) => void;
  title: string;
};

export default function AddNewTransactionDialog({
  books,
  addNewUser,
  currentTransaction,
  title,
}: AddNewTransactionProps) {
  const category = useFetcher();

  useEffect(() => {
    if (!category.data) {
      category.load(`/query-category`);
    }
  }, [category]);

  const [selected, setSelected] = useState<User[]>(
    currentTransaction?.payee || []
  );
  const [date, setDate] = useState<Date | undefined>(
    currentTransaction?.date ? new Date(currentTransaction?.date) : new Date()
  );

  const [transaction, setTransaction] = useState<NewTransaction>(null);

  const handleNewTransaction = (e: ChangeEvent<HTMLInputElement>) => {
    setTransaction({
      ...transaction,
      [e.target.name]: e.target.value,
    });
  };

  const addNewTrans = () => {
    const v = selected.map((e: User) => e.id.toString());
    transaction.payee_ids = v;
    transaction.book_id = books.id.toString();
    transaction.date =
      date?.toISOString().slice(0, 10) ?? new Date().toISOString().slice(0, 10);

    // addNewTransaction(transaction);
  };

  return (
    <>
      <div className="space-y-2">
        <h4 className="font-medium leading-none">{title} Transaction</h4>
        <p className="text-sm text-muted-foreground">
          {title} details for the transaction
        </p>
      </div>
      <Form className="grid grid-cols-1 items-center gap-4">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="name">Transaction Name</Label>
          <Input
            defaultValue={currentTransaction?.desc || ""}
            id="name"
            placeholder="New transaction"
            className="col-span-2 h-8"
            name="desc"
            onChange={handleNewTransaction}
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
          />
        </div>
        <div className="grid items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="amount">Category</Label>
          <div className="flex items-center gap-2 ">
            <div className="flex-grow">
              <Select
                name="category_id"
                defaultValue={currentTransaction?.category?.category}
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
                    className=""
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {category.data?.map((val, id) => (
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
                  <Button variant="outline" className="w-4 h-8">
                    +
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="px-2 py-3 mr-3  bg-white border-2 rounded">
                  <Form method="POST">
                    <div className="flex items-center bg-white space-x-2">
                      <Label htmlFor="newcategory" className="mr-4">
                        Category:
                      </Label>
                      <Input name="category_id" className="h-8 text-black" />
                      <Button
                        type="submit"
                        variant="default"
                        name="_action"
                        value="AddNewCategory"
                      >
                        Add
                      </Button>
                    </div>
                  </Form>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="date">Date</Label>
          {/* <Input
            defaultValue={currentTransaction?.date}
            id="amount"
            type="number"
            placeholder="0"
            onChange={handleNewTransaction}
            className="col-span-2 h-8 text-black"
            name="amount"
          /> */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                name="date"
                id="date"
                // defaultValue={currentTransaction?.date}
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
              <PopoverClose>
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverClose>
            </PopoverContent>
          </Popover>
          <input
            type="hidden"
            name="date"
            defaultValue={currentTransaction?.date}
            value={
              date?.toISOString().slice(0, 10) ??
              new Date().toISOString().slice(0, 10)
            }
          />

          {currentTransaction?.id ? (
            <input type="hidden" name="id" value={currentTransaction.id} />
          ) : null}
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="payer_id">Paid By</Label>
          <Select
            name="payer_id"
            defaultValue={currentTransaction?.payer.username}
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
          <MultiSelect
            options={books?.splitters}
            selected={selected}
            onChange={setSelected}
            className="w-80"
            name="payee_ids"
          />
          <input
            type="hidden"
            name="payee_ids"
            value={selected.map((e: User) => e.id.toString())}
          />
        </div>
        <div>
          <PopoverClose asChild>
            <Button
              className="mr-2"
              // onClick={addNewTrans}

              type="submit"
              name="_action"
              value="AddNewTransaction"
            >
              {title}
            </Button>
          </PopoverClose>
          <AddNewPerson bookId={books.id.toString()} addNewUser={addNewUser} />
        </div>
      </Form>
    </>
  );
}
