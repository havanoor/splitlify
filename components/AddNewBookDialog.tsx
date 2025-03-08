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
    <div className="grid gap-2 p-5  bg-white ">
      <h2 className="text-lg underline">Book Detail</h2>
      <Form method="POST" className="grid grid-cols-1 items-center gap-4">
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="name" className="text-left">
            Book Name
          </Label>
          <Input
            id="name"
            defaultValue={editBook?.name ?? ""}
            placeholder="Book Name"
            className="col-span-2"
            name="name"
            onChange={handleNewBook}
          />
        </div>
        {!available ? (
          <div className="grid text-destructive text-xs">
            The Book Name is not available
          </div>
        ) : null}
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="name" className="text-left">
            Book Currency
          </Label>
          <Popover open={open}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                className="col-span-2 p-2 h-full justify-start"
                onClick={() => setOpen(!open)}
              >
                <div className="text-muted-foreground">
                  {editBook?.book_currency ? (
                    editBook?.book_currency
                  ) : newBook.book_currency ? (
                    newBook.book_currency
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>Select a currency</div> <IoIosArrowDown />
                    </div>
                  )}
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="z-50"
              side="bottom"
              align="start"
              style={{
                maxHeight: "calc(var(--radix-popper-available-height) - 50px)",
              }}
            >
              <div className="bg-white  rounded-md">
                <Command>
                  <CommandInput
                    name="currency"
                    placeholder="Type a currency or search..."
                  />
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup>
                    <CommandList>
                      {currencies.map((currency, id) => (
                        <div
                          onClick={() => {
                            setNewBook({
                              ...newBook,
                              book_currency: currency,
                            });
                            setOpen(!open);
                          }}
                          key={id}
                          className="cursor-pointer"
                        >
                          <CommandItem
                            onSelect={() => {
                              setNewBook({
                                ...newBook,
                                book_currency: currency,
                              });
                              setOpen(!open);
                            }}
                          >
                            {currency}
                          </CommandItem>
                        </div>
                      ))}
                    </CommandList>
                  </CommandGroup>
                </Command>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
          <Label htmlFor="btype" className="text-left">
            Book Type
          </Label>
          <Select
            name="type_of_book"
            onValueChange={(v) => {
              setNewBook({ ...newBook, type_of_book: v });
            }}
          >
            <SelectTrigger className="w-auto col-span-2 text-gray-500">
              <SelectValue
                placeholder={editBook?.type_of_book ?? "Select Book Type"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="PUBLIC">Public</SelectItem>
                <SelectItem value="PRIVATE">Private</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <input
            type="hidden"
            name="book_currency"
            value={newBook.book_currency}
          />
        </div>
        <div>
          <SheetClose asChild>
            <Button
              className="mr-2"
              type="submit"
              disabled={!available}
              name="_action"
              value="AddNewBook"
            >
              Add Book
            </Button>
          </SheetClose>
        </div>
      </Form>
    </div>
  );
}
