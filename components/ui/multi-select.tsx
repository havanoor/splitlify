import { cn } from "~/lib/utils";

import { CommandList } from "cmdk";
import { Check, X } from "lucide-react";
import { Button } from "components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { Badge } from "./badge";
import { useState } from "react";

export type OptionType = {
  label: string;
  value: string;
};

export type User = {
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  id: number;
};

interface MultiSelectProps {
  options: User[] | undefined;
  selected: User[];
  onChange: React.Dispatch<React.SetStateAction<User[]>>;
  className?: string;
  name?: string;
}

function MultiSelect({
  options,
  selected,
  onChange,
  className,
  name,
  ...props
}: MultiSelectProps) {
  const [open, setOpen] = useState(false);

  const handleUnselect = (item: User) => {
    onChange(selected.filter((i) => i.id !== item.id));
  };

  return (
    <Popover open={open} onOpenChange={setOpen} {...props}>
      <PopoverTrigger className="col-span-2 h-8 text-black" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={` w-full p-2 h-full flex flex-wrap  items-center  gap-2 justify-normal`}
          onClick={() => setOpen(!open)}
        >
          {selected.length > 0 ? (
            selected.map((option, id) => (
              <div key={id}>
                <Badge
                  variant="secondary"
                  key={id}
                  // className="w-24"
                  onClick={() => handleUnselect(option)}
                >
                  {option.username
                    ? option.username
                    : option.first_name + option.last_name}
                  <button
                    className="ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleUnselect(option);
                      }
                    }}
                    onClick={() => handleUnselect(option)}
                  >
                    <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                  </button>
                </Badge>
              </div>
            ))
          ) : (
            <div className="w-full text-muted-foreground">
              Click to add Payees
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0 z-[999]">
        <Command className={className}>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandGroup className="max-h-64 overflow-auto">
            <CommandList>
              {options?.map((option, id) => (
                <div
                  onClick={() => {
                    onChange(
                      selected.includes(option)
                        ? selected.filter((item) => item.id !== option.id)
                        : [...selected, option]
                    );
                    setOpen(true);
                  }}
                  key={id}
                >
                  <CommandItem
                    onSelect={() => {
                      onChange(
                        selected.includes(option)
                          ? selected.filter((item) => item.id !== option.id)
                          : [...selected, option]
                      );
                      setOpen(true);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.includes(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.username
                      ? option.username
                      : option.first_name + option.last_name}
                  </CommandItem>
                </div>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
