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
import { Form } from "@remix-run/react";
import { SheetClose } from "~/components/ui/sheet";

const currencies = [
  "AFN",
  "EUR",
  "ALL",
  "DZD",
  "USD",
  "EUR",
  "AOA",
  "XCD",
  "ARS",
  "AMD",
  "AWG",
  "AUD",
  "EUR",
  "AZN",
  "BSD",
  "BHD",
  "BDT",
  "BBD",
  "BYN",
  "EUR",
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
  "XOF",
  "BIF",
  "CVE",
  "KHR",
  "XAF",
  "CAD",
  "KYD",
  "XAF",
  "XAF",
  "CLP",
  "CLF",
  "CNY",
  "AUD",
  "AUD",
  "COP",
  "COU",
  "KMF",
  "CDF",
  "XAF",
  "NZD",
  "CRC",
  "XOF",
  "EUR",
  "CUP",
  "CUC",
  "ANG",
  "EUR",
  "CZK",
  "DKK",
  "DJF",
  "XCD",
  "DOP",
  "EGP",
  "SVC",
  "XAF",
  "ERN",
  "EUR",
  "SZL",
  "ETB",
  "EUR",
  "FKP",
  "DKK",
  "FJD",
  "EUR",
  "EUR",
  "EUR",
  "XPF",
  "EUR",
  "XAF",
  "GMD",
  "GEL",
  "EUR",
  "GHS",
  "GIP",
  "EUR",
  "DKK",
  "XCD",
  "EUR",
  "GTQ",
  "GBP",
  "GNF",
  "XOF",
  "GYD",
  "HTG",
  "AUD",
  "EUR",
  "HNL",
  "HKD",
  "HUF",
  "ISK",
  "INR",
  "IDR",
  "XDR",
  "IRR",
  "IQD",
  "EUR",
  "GBP",
  "ILS",
  "EUR",
  "JMD",
  "JPY",
  "GBP",
  "JOD",
  "KZT",
  "KES",
  "AUD",
  "KPW",
  "KRW",
  "KWD",
  "KGS",
  "LAK",
  "EUR",
  "LBP",
  "LSL",
  "ZAR",
  "LRD",
  "LYD",
  "CHF",
  "EUR",
  "EUR",
  "MOP",
  "MKD",
  "MGA",
  "MWK",
  "MYR",
  "MVR",
  "XOF",
  "EUR",
  "EUR",
  "MRU",
  "MUR",
  "EUR",
  "XUA",
  "MXN",
  "MXV",
  "MDL",
  "EUR",
  "MNT",
  "EUR",
  "XCD",
  "MAD",
  "MZN",
  "MMK",
  "NAD",
  "ZAR",
  "AUD",
  "NPR",
  "EUR",
  "XPF",
  "NZD",
  "NIO",
  "XOF",
  "NGN",
  "NZD",
  "AUD",
  "NOK",
  "OMR",
  "PKR",
  "PAB",
  "PGK",
  "PYG",
  "PEN",
  "PHP",
  "NZD",
  "PLN",
  "EUR",
  "QAR",
  "EUR",
  "RON",
  "RUB",
  "RWF",
  "EUR",
  "SHP",
  "XCD",
  "XCD",
  "EUR",
  "EUR",
  "XCD",
  "WST",
  "EUR",
  "STN",
  "SAR",
  "XOF",
  "RSD",
  "SCR",
  "SLE",
  "SGD",
  "ANG",
  "XSU",
  "EUR",
  "EUR",
  "SBD",
  "SOS",
  "ZAR",
  "SSP",
  "EUR",
  "LKR",
  "SDG",
  "SRD",
  "NOK",
  "SEK",
  "CHF",
  "CHE",
  "CHW",
  "SYP",
  "TWD",
  "TJS",
  "TZS",
  "THB",
  "XOF",
  "NZD",
  "TOP",
  "TTD",
  "TND",
  "TRY",
  "TMT",
  "AUD",
  "UGX",
  "UAH",
  "AED",
  "GBP",
  "USN",
  "UYU",
  "UYI",
  "UYW",
  "UZS",
  "VUV",
  "VES",
  "VED",
  "VND",
  "XPF",
  "MAD",
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

  return (
    <div className="px-1 pb-6">
      <Form method="POST" className="flex flex-col gap-5">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
            Book Name
          </Label>
          <Input
            id="name"
            defaultValue={editBook?.name ?? ""}
            placeholder="e.g. Summer Trip 2026"
            className="h-12 rounded-xl border-gray-200 focus-visible:ring-[#79AC78] focus-visible:border-transparent transition-all w-full"
            name="name"
            onChange={handleNewBook}
            required
          />
          {!available && (
            <p className="text-xs text-red-500 mt-1">
              {"The Book Name is not available"}
            </p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="currency" className="text-sm font-semibold text-gray-700">
            Currency
          </Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="w-full h-12 rounded-xl bg-white border-gray-200 hover:bg-gray-50 text-gray-700 font-normal justify-between transition-all focus-visible:ring-[#79AC78] focus-visible:border-transparent"
              >
                <span className={!editBook?.book_currency && !newBook.book_currency ? "text-gray-400" : ""}>
                  {editBook?.book_currency ? (
                    editBook?.book_currency
                  ) : newBook.book_currency ? (
                    newBook.book_currency
                  ) : (
                    "Select a currency"
                  )}
                </span>
                <IoIosArrowDown className="text-gray-400" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-[9999] w-[--radix-popover-trigger-width] p-0 rounded-xl shadow-lg border-gray-100"
              side="bottom"
              align="start"
            >
              <Command className="rounded-xl">
                <CommandInput
                  name="currency"
                  placeholder="Search currency..."
                  className="h-11"
                />
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup className="max-h-60 overflow-y-auto">
                  <CommandList>
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
          <Label htmlFor="btype" className="text-sm font-semibold text-gray-700">
            Book Type
          </Label>
          <Select
            name="type_of_book"
            onValueChange={(v) => {
              setNewBook({ ...newBook, type_of_book: v });
            }}
          >
            <SelectTrigger className="w-full h-12 rounded-xl text-gray-700 border-gray-200 focus:ring-[#79AC78] transition-all bg-white">
              <SelectValue
                placeholder={editBook?.type_of_book ?? "Select Book Type"}
              />
            </SelectTrigger>
            <SelectContent className="z-[9999] rounded-xl border-gray-100 shadow-lg">
              <SelectGroup>
                <SelectItem value="PUBLIC" className="cursor-pointer">Public</SelectItem>
                <SelectItem value="PRIVATE" className="cursor-pointer">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="pt-4 pb-8 flex flex-col gap-3">
          <SheetClose asChild>
            <Button
              className="w-full h-12 rounded-xl bg-[#79AC78] hover:bg-[#639362] text-white font-semibold transition-all shadow-sm"
              type="submit"
              disabled={!available}
              name="_action"
              value="AddNewBook"
            >
              {editBook ? "Update Book" : "Create Book"}
            </Button>
          </SheetClose>
        </div>
      </Form>
    </div>
  );
}
