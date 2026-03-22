import { Form, useFetcher } from "@remix-run/react";
import { Calendar } from "components/ui/calendar";
import { ChangeEvent, useEffect, useState } from "react";
import { ResponsiveModalClose } from "~/components/ResponsiveModal";
import { cn } from "~/lib/utils";
import AddNewPerson from "./AddNewPerson";
import { useDebounce } from "~/customHooks/Debounce";
import { Badge } from "./ui/badge";
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

import { toast } from "sonner";


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
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryType, setNewCategoryType] = useState("");
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const debouncedCategory = useDebounce(newCategoryName);
  const [categoryError, setCategoryError] = useState("");

  useEffect(() => {
    if (debouncedCategory.trim() !== "") {
      const exists = categories?.some(
        (c) => c.category.toLowerCase() === debouncedCategory.trim().toLowerCase()
      );
      if (exists) {
        setCategoryError(`Category "${debouncedCategory.trim()}" already exists`);
      } else {
        setCategoryError("");
      }
    } else {
      setCategoryError("");
    }
  }, [debouncedCategory, categories]);

  const [selected, setSelected] = useState<User[]>(
    currentTransaction?.payee || []
  );
  const [date, setDate] = useState<Date | undefined>(
    currentTransaction?.date ? new Date(currentTransaction?.date) : new Date()
  );

  useEffect(() => {
    if (categoryUpdater.state === "idle" && categoryUpdater.data) {
      if ((categoryUpdater.data as any).ok) {
        toast.success("Category added successfully!");
        setShowCategoryForm(false);
        setNewCategoryName("");
        setNewCategoryType("");
      } else {
        toast.error((categoryUpdater.data as any).error || "Failed to add category");
      }
    }
  }, [categoryUpdater.data, categoryUpdater.state]);

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

  const [transaction, setTransaction] = useState<NewTransaction | null>(null);

  const handleNewTransaction = (e: ChangeEvent<HTMLInputElement>) => {
    setTransaction({
      ...(transaction ?? {}),
      [e.target.name]: e.target.value,
    } as NewTransaction);
  };

  return (
    <div className="bg-card px-1 pb-6">
      <Form className="flex flex-col gap-5" method="POST">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">Transaction Name</Label>
          <Input
            defaultValue={currentTransaction?.desc || ""}
            id="name"
            placeholder="e.g. Dinner at Luigi's"
            className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all w-full"
            name="desc"
            onChange={handleNewTransaction}
            readOnly={!!currentTransaction && title === "View"}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount" className="text-sm font-semibold text-foreground/80">Amount</Label>
          <Input
            defaultValue={currentTransaction?.amount}
            id="amount"
            type="number"
            placeholder="0.00"
            onChange={handleNewTransaction}
            className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all w-full text-foreground"
            name="amount"
            step="0.01"
            readOnly={!!currentTransaction && title === "View"}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="category_id" className="text-sm font-semibold text-foreground/80">Category</Label>

          {currentTransaction?.category && title === "View" ? (
            <Input
              readOnly
              className="h-12 rounded-xl border-input w-full"
              defaultValue={currentTransaction?.category?.category.toString()}
            />
          ) : (
            <>
              <div className="flex items-center gap-2">
                <div className="flex-grow">
                  <Select
                    name="category_id"
                    defaultValue={currentTransaction?.category?.id.toString()}
                    onValueChange={(v) => {
                      setTransaction({ ...(transaction ?? {}), category_id: v } as NewTransaction);
                    }}
                  >
                    <SelectTrigger className="w-full h-12 rounded-xl text-foreground/80 border-input focus:ring-primary transition-all bg-card">
                      <SelectValue
                        placeholder={
                          currentTransaction?.category?.category ||
                          "Select a Category"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="z-[9999] rounded-xl border-border shadow-lg">
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
                <div className="flex-shrink-0">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowCategoryForm((v) => !v)}
                    className="w-12 h-12 rounded-xl border-input text-muted-foreground hover:text-primary transition-colors focus-visible:ring-primary"
                  >
                    {showCategoryForm ? "×" : "+"}
                  </Button>
                </div>
              </div>

              {showCategoryForm && (
                <div className="mt-3 p-4 rounded-xl border border-border bg-muted/30 flex flex-col space-y-3">
                  <div>
                    <Label htmlFor="type_of_category" className="text-sm font-semibold text-foreground/80">
                      Type
                    </Label>
                    <Select
                      name="type_of_category"
                      value={newCategoryType}
                      onValueChange={setNewCategoryType}
                      required
                    >
                      <SelectTrigger
                        id="type_of_category"
                        className="mt-1.5 w-full h-10 rounded-lg text-foreground/80 border-input focus:ring-primary bg-card"
                      >
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="z-[9999] rounded-xl border-border shadow-lg">
                        <SelectItem value="income" className="cursor-pointer">Income</SelectItem>
                        <SelectItem value="expense" className="cursor-pointer">Expense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="category" className="text-sm font-semibold text-foreground/80">
                      New Category Name
                    </Label>
                    <div className="flex gap-2 mt-1.5">
                      <Input
                        name="category"
                        id="category"
                        placeholder="e.g. Groceries"
                        className={cn("h-10 rounded-lg border-input focus-visible:ring-primary", categoryError && "border-red-500 focus-visible:ring-red-500")}
                        disabled={categoryUpdater.state !== "idle"}
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        onClick={() => {
                          if (!newCategoryName.trim() || !newCategoryType) return;
                          const formattedCategory = newCategoryName.trim().charAt(0).toUpperCase() + newCategoryName.trim().slice(1).toLowerCase();
                          categoryUpdater.submit(
                            { category: formattedCategory, type_of_category: newCategoryType },
                            { method: "POST", action: "/new-category" }
                          );
                        }}
                        disabled={categoryUpdater.state !== "idle" || !!categoryError || !newCategoryName.trim() || !newCategoryType}
                        className="h-10 rounded-lg bg-primary hover:bg-primary/90 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {categoryUpdater.state !== "idle" ? "Adding..." : "Add"}
                      </Button>
                    </div>
                    {categoryError && (
                      <p className="text-xs text-destructive mt-1">{categoryError}</p>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date" className="text-sm font-semibold text-foreground/80">Date</Label>
          {currentTransaction?.date && title === "View" ? (
            <Input
              value={date ? date.toDateString() : "Pick a date"}
              readOnly
              className={cn(
                "w-full h-12 rounded-xl border-input text-foreground justify-start text-left font-normal",
                !date && "text-muted-foreground/70"
              )}
            />
          ) : (
            <Popover modal={true}>
              <PopoverTrigger asChild>
                <Button
                  name="date"
                  id="date"
                  type="button"
                  variant={"outline"}
                  value={date ? date.toDateString() : "Pick a date"}
                  className={cn(
                    "w-full h-12 rounded-xl bg-card border-input hover:bg-muted text-foreground justify-start text-left font-normal transition-all focus-visible:ring-primary",
                    !date && "text-muted-foreground/70"
                  )}
                >
                  {date ? date.toDateString() : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="z-[999999] w-auto bg-card rounded-xl shadow-xl border-border p-0"
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

        {!books.type_of_book.toLowerCase().includes("private") && (
          <>
            <div className="w-full flex justify-center mb-3">
              <AddNewPerson bookId={books.id.toString()} splitters={books.splitters} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payer_id" className="text-sm font-semibold text-foreground/80">Paid By</Label>
              {currentTransaction && title === "View" ? (
                <Input
                  readOnly
                  className="w-full h-12 rounded-xl border-input text-foreground"
                  defaultValue={
                    currentTransaction?.payer.username ||
                    `${currentTransaction?.payer.first_name || ""} ${currentTransaction?.payer.last_name || ""}`.trim()
                  }
                />
              ) : (
                <Select
                  name="payer_id"
                  defaultValue={currentTransaction?.payer.id.toString()}
                  onValueChange={(v) => {
                    setTransaction({ ...(transaction ?? {}), payer_id: v } as NewTransaction);
                  }}
                >
                  <SelectTrigger className="w-full h-12 rounded-xl text-foreground/80 border-input focus:ring-primary transition-all bg-card">
                    <SelectValue
                      placeholder={
                        currentTransaction?.payer.username || "Select a payer"
                      }
                    />
                  </SelectTrigger>
                  <SelectContent className="z-[9999] rounded-xl border-border shadow-lg">
                    <SelectGroup>
                      {books?.splitters.map((val, id) => (
                        <SelectItem key={id} value={val.id.toString()} className="cursor-pointer">
                          {val.username
                            ? val.username
                            : `${val.first_name || ""} ${val.last_name || ""}`.trim()}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="payee" className="text-sm font-semibold text-foreground/80">Paid For</Label>
              {currentTransaction?.payee && title === "View" ? (
                <div className="rounded-xl border border-input bg-gray-50/50 w-full min-h-[3rem] p-2 flex flex-wrap items-center gap-2">
                  {selected.map((e: User) => (
                    <Badge key={e.id} variant="secondary" className="rounded-md px-2 py-1 font-medium bg-card border-input">
                      {e.username ? e.username : `${e.first_name || ""} ${e.last_name || ""}`.trim()}
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
          </>
        )}

        <div className="pt-4 pb-8 flex flex-col gap-3">
          {currentTransaction?.id && title === "View" ? null : (
            <>
              <ResponsiveModalClose>
                <Button
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-sm"
                  type="submit"
                  name="_action"
                  value="AddNewTransaction"
                >
                  {title === "Add" ? "Create Transaction" : `${title} Transaction`}
                </Button>
              </ResponsiveModalClose>
            </>
          )}
        </div>
      </Form>
    </div>
  );
}
