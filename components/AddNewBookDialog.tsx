import { ChangeEvent, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { IoIosArrowDown } from "react-icons/io";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "./ui/command";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TrashIcon, X } from "lucide-react";
import { PopoverClose } from "@radix-ui/react-popover";
import { useDebounce } from "~/customHooks/Debounce";
import { useFetcher } from "@remix-run/react";
import { Form } from "@remix-run/react";
import { ResponsiveModalClose } from "~/components/ResponsiveModal";

const currencies = [
  "AFN",
  "EUR",
  "ALL",
  "DZD",
  "USD",
  "AOA",
  "XCD",
  "ARS",
  "AMD",
  "AWG",
  "AUD",
  "AZN",
  "BSD",
  "BHD",
  "BDT",
  "BBD",
  "BYN",
  "BZD",
  "XOF",
  "BMD",
  "BTN",
  "BOB",
  "BOV",
  "BAM",
  "BWP",
  "NOK",
  "BRL",
  "BND",
  "BGN",
  "BIF",
  "CVE",
  "KHR",
  "XAF",
  "CAD",
  "KYD",
  "CLP",
  "CLF",
  "CNY",
  "COP",
  "COU",
  "KMF",
  "CDF",
  "NZD",
  "CRC",
  "CUP",
  "CUC",
  "ANG",
  "CZK",
  "DKK",
  "DJF",
  "DOP",
  "EGP",
  "SVC",
  "ERN",
  "SZL",
  "ETB",
  "FKP",
  "FJD",
  "XPF",
  "GMD",
  "GEL",
  "GHS",
  "GIP",
  "GTQ",
  "GBP",
  "GNF",
  "GYD",
  "HTG",
  "HNL",
  "HKD",
  "HUF",
  "ISK",
  "INR",
  "IDR",
  "XDR",
  "IRR",
  "IQD",
  "ILS",
  "JMD",
  "JPY",
  "JOD",
  "KZT",
  "KES",
  "KPW",
  "KRW",
  "KWD",
  "KGS",
  "LAK",
  "LBP",
  "LSL",
  "ZAR",
  "LRD",
  "LYD",
  "CHF",
  "MOP",
  "MKD",
  "MGA",
  "MWK",
  "MYR",
  "MVR",
  "MRU",
  "MUR",
  "XUA",
  "MXN",
  "MXV",
  "MDL",
  "MNT",
  "MAD",
  "MZN",
  "MMK",
  "NAD",
  "NPR",
  "NIO",
  "NGN",
  "OMR",
  "PKR",
  "PAB",
  "PGK",
  "PYG",
  "PEN",
  "PHP",
  "PLN",
  "QAR",
  "RON",
  "RUB",
  "RWF",
  "SHP",
  "WST",
  "STN",
  "SAR",
  "RSD",
  "SCR",
  "SLE",
  "SGD",
  "XSU",
  "SBD",
  "SOS",
  "SSP",
  "LKR",
  "SDG",
  "SRD",
  "SEK",
  "CHE",
  "CHW",
  "SYP",
  "TWD",
  "TJS",
  "TZS",
  "THB",
  "TOP",
  "TTD",
  "TND",
  "TRY",
  "TMT",
  "UGX",
  "UAH",
  "AED",
  "USN",
  "UYU",
  "UYI",
  "UYW",
  "UZS",
  "VUV",
  "VES",
  "VED",
  "VND",
  "YER",
  "ZMW",
  "ZWG",
  "XBA",
  "XBB",
  "XBC",
  "XBD",
  "XTS",
  "XXX",
  "XAU",
  "XPD",
  "XPT",
  "XAG",
];

type TAddNewBookDialog = {
  editBook?: Book | null;
  existing_books: string[];
};

export default function AddNewBookDialog({
  existing_books,
  editBook,
}: TAddNewBookDialog) {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [newBook, setNewBook] = useState<NewBook>({
    name: editBook?.name ?? "",
    type_of_book: editBook?.type_of_book ? editBook?.type_of_book : "PUBLIC",
    book_currency: editBook?.book_currency ?? "",
    user_id: "",
  });

  const debounceUsername = useDebounce(newBook.name);

  useEffect(() => {
    if (
      existing_books.includes(debounceUsername) &&
      debounceUsername != editBook?.name
    ) {
      setAvailable(false);
    } else {
      setAvailable(true);
    }
  }, [debounceUsername]);

  const handleNewBook = (e: ChangeEvent<HTMLInputElement>) => {
    setNewBook({
      ...newBook,
      [e.target.name]: e.target.value,
    });
  };

  // Participants (new books only)
  const [pendingUsers, setPendingUsers] = useState<{ value: string; isReal: boolean }[]>(() => {
    if (!editBook) return [];

    // Using splitters array to get actual users
    return editBook.splitters?.map((u: any) => ({
      value: u.username || u.first_name || u.id, // Fallback if username is null
      isReal: true // All existing users coming through editBook are treated as real
    })) || [];
  });

  const [currentUsername, setCurrentUsername] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "found" | "not_found">("idle");
  const debounceParticipant = useDebounce(currentUsername);
  const validParticipant = useFetcher();

  useEffect(() => {
    if (debounceParticipant.trim()) {
      validParticipant.load(`/valid-username/${debounceParticipant}`);
      setUsernameStatus("checking");
    } else {
      setUsernameStatus("idle");
    }
  }, [debounceParticipant]);

  useEffect(() => {
    if (!debounceParticipant.trim()) return;
    if (validParticipant.state === "loading") {
      setUsernameStatus("checking");
    } else if (validParticipant.data === false) {
      setUsernameStatus("found");      // false = taken = user exists ✓
    } else if (validParticipant.data === true) {
      setUsernameStatus("not_found");  // true = available = doesn't exist (placeholder)
    }
  }, [validParticipant.data, validParticipant.state]);

  const addParticipant = () => {
    const val = currentUsername.trim();
    if (!val || pendingUsers.some(p => p.value === val) || usernameStatus === "checking") return;
    setPendingUsers([...pendingUsers, { value: val, isReal: usernameStatus === "found" }]);
    setCurrentUsername("");
    setUsernameStatus("idle");
  };

  return (
    <div className="px-1 pb-6">
      <Form method="POST" className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-semibold text-foreground/80">
            Book Name
          </Label>
          <Input
            id="name"
            defaultValue={editBook?.name ?? ""}
            placeholder="e.g. Summer Trip 2026"
            className="h-12 rounded-xl border-input focus-visible:ring-primary focus-visible:border-transparent transition-all w-full"
            name="name"
            onChange={handleNewBook}
            required
          />
          {!available && (
            <p className="text-xs text-destructive mt-1">
              {"The Book Name is not available"}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currency" className="text-sm font-semibold text-foreground/80">
            Currency
          </Label>
          <Popover open={open} onOpenChange={setOpen} modal={true}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full h-12 rounded-xl bg-white border-input hover:bg-gray-50 text-foreground/80 font-normal justify-between transition-all focus-visible:ring-primary focus-visible:border-transparent"
              >
                <span className={!editBook?.book_currency && !newBook.book_currency ? "text-muted-foreground/70" : ""}>
                  {editBook?.book_currency ? (
                    editBook?.book_currency
                  ) : newBook.book_currency ? (
                    newBook.book_currency
                  ) : (
                    "Select a currency"
                  )}
                </span>
                <IoIosArrowDown className="text-muted-foreground/70" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-[9999] w-[--radix-popover-trigger-width] p-0 rounded-xl shadow-lg border-border"
              side="bottom"
              align="start"
            >
              <Command className="rounded-xl">
                <CommandInput
                  name="currency"
                  placeholder="Search currency..."
                  className="h-11 border-none focus:ring-0 text-sm"
                />
                <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No results found.</CommandEmpty>
                <CommandGroup className="p-1">
                  <CommandList className="max-h-60 overflow-y-auto overscroll-contain touch-pan-y">
                    {currencies.map((currency, id) => (
                      <CommandItem
                        key={id}
                        onSelect={() => {
                          setNewBook({
                            ...newBook,
                            book_currency: currency,
                          });
                          setOpen(false);
                        }}
                        className="cursor-pointer font-medium"
                      >
                        {currency}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <input
            type="hidden"
            name="book_currency"
            value={newBook.book_currency}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="btype" className="text-sm font-semibold text-foreground/80">
            Book Type
          </Label>
          <Select
            name="type_of_book"
            defaultValue={editBook?.type_of_book ?? "PUBLIC"}
            onValueChange={(v) => {
              setNewBook({ ...newBook, type_of_book: v });
            }}
          >
            <SelectTrigger className="w-full h-12 rounded-xl text-foreground/80 border-input focus:ring-primary transition-all bg-white">
              <SelectValue
                placeholder={editBook?.type_of_book ?? "Select Book Type"}
              />
            </SelectTrigger>
            <SelectContent className="z-[9999] rounded-xl border-border shadow-lg">
              <SelectGroup>
                <SelectItem value="PUBLIC" className="cursor-pointer">Public</SelectItem>
                <SelectItem value="PRIVATE" className="cursor-pointer">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Participants — only for new books */}
        <div className="space-y-2">
          <Label className="text-sm font-semibold text-foreground/80">Participants <span className="text-muted-foreground/70 font-normal">(Optional)</span></Label>
          <div className="flex gap-2">
            <Input
              value={currentUsername}
              onChange={(e) => setCurrentUsername(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addParticipant())}
              placeholder="Enter username"
              className={`h-10 rounded-xl focus-visible:ring-primary transition-colors ${usernameStatus === "found" ? "border-primary" :
                usernameStatus === "not_found" ? "border-red-400" : "border-input"
                }`}
            />
            <Button
              type="button"
              onClick={addParticipant}
              disabled={!currentUsername.trim() || usernameStatus === "checking" || pendingUsers.some(p => p.value === currentUsername.trim())}
              className="h-10 px-4 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold disabled:opacity-40"
            >
              Add
            </Button>
          </div>
          {currentUsername && usernameStatus !== "idle" && (
            <p className={`text-xs font-medium ${usernameStatus === "found" ? "text-primary" :
              usernameStatus === "checking" ? "text-info" : "text-amber-500"
              }`}>
              {usernameStatus === "checking" && `Checking "${debounceParticipant}"...`}
              {usernameStatus === "found" && `✓ User "${debounceParticipant}" found`}
              {usernameStatus === "not_found" && `"${debounceParticipant}" will be added as a placeholder`}
            </p>
          )}
          {pendingUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-1">
              {pendingUsers.map((u) => (
                <span key={u.value} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border ${u.isReal
                  ? "bg-primary/10 text-primary border-primary/20"
                  : "bg-amber-50 text-warning border-amber-200"
                  }`}>
                  {u.value}
                  {!u.isReal && <span className="font-normal opacity-60 ml-0.5"> </span>}
                  <button type="button" onClick={() => setPendingUsers(pendingUsers.filter(x => x.value !== u.value))} className="ml-0.5 hover:text-destructive transition-colors">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          )}
          <input type="hidden" name="user_usernames" value={pendingUsers.filter(p => p.isReal).map(p => p.value).join(",")} />
          <input type="hidden" name="placeholder_names" value={pendingUsers.filter(p => !p.isReal).map(p => p.value).join(",")} />
        </div>
        <div className="pt-4 pb-8 flex flex-col gap-3">
          {editBook && <input type="hidden" name="book_id" value={editBook.id} />}
          <ResponsiveModalClose>
            <Button
              className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold transition-all shadow-sm"
              type="submit"
              disabled={!available}
              name="_action"
              value={editBook ? "EditBook" : "AddNewBook"}
            >
              {editBook ? "Update Book" : "Create Book"}
            </Button>
          </ResponsiveModalClose>
        </div>
      </Form>
    </div>
  );
}
