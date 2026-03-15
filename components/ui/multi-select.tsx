import { cn } from "~/lib/utils";

import { CommandList } from "cmdk";
import { Check, MousePointerClick, X } from "lucide-react";
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
  onChange: (a: User[]) => void;
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
    <Popover open={open} onOpenChange={setOpen} {...props} modal={true}>
      <PopoverTrigger className="col-span-2 text-foreground w-full" asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full min-h-[48px] h-auto p-2 flex flex-wrap items-center gap-2 justify-normal rounded-xl border-input text-foreground/80 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:outline-none focus:border-transparent transition-all bg-card font-normal"
          onClick={() => setOpen(!open)}
        >
          {selected.length > 0 ? (
            selected.map((option, id) => (
              <div key={id}>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20 border-0 rounded-lg flex items-center gap-1.5 px-2.5 py-1 transition-colors group cursor-default"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <span className="text-sm font-medium">
                    {option.username
                      ? option.username
                      : `${option.first_name || ""} ${option.last_name || ""}`.trim()}
                  </span>
                  <button
                    className="rounded-full outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 opacity-50 group-hover:opacity-100 transition-opacity p-0.5 hover:bg-primary/20"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.stopPropagation();
                        onChange([option]);
                      }
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      onChange([option]);
                    }}
                  >
                    <X className="h-3.5 w-3.5" />
                    <span className="sr-only">Remove {option.username}</span>
                  </button>
                </Badge>
              </div>
            ))
          ) : (
            <div className="flex justify-between items-center w-full font-normal text-muted-foreground text-left px-2">
              <span>Click to add Payees</span>
              <MousePointerClick className="h-4 w-4 opacity-50" />
            </div>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0 rounded-xl border-border shadow-xl z-[9999]"
        side="bottom"
        align="start"
        avoidCollisions={true}
      >
        <Command
          className={cn(
            className,
            "rounded-xl overflow-hidden"
          )}
        >
          <div className="p-2 border-b border-border/50 bg-gray-50/50">
            <Button
              onClick={() => {
                const unselectedOptions = options?.filter(
                  (option) => !selected.some((item) => item.id === option.id)
                );
                onChange(
                  unselectedOptions?.length ? unselectedOptions : options || []
                );
                setOpen(false)
              }}
              variant="outline"
              size="sm"
              className="w-full h-8 text-xs font-semibold text-primary border-primary/20 bg-primary/5 hover:bg-primary/10 hover:text-primary/90 transition-colors rounded-lg"
            >
              Select All / Deselect All
            </Button>
          </div>

          <CommandInput placeholder="Search people..." className="h-11 border-none focus:ring-0 text-sm" />
          <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">No people found.</CommandEmpty>
          <CommandGroup className="max-h-60 overflow-y-auto p-1">
            <CommandList>
              {options?.map((option, id) => (
                <CommandItem
                  key={option.id.toString()}
                  value={option.username ? option.username : (option.first_name || "") + (option.last_name || "")}
                  onSelect={() => {
                    onChange([option]);
                  }}
                  className="rounded-lg cursor-pointer aria-selected:bg-gray-50 aria-selected:text-foreground my-0.5"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4 text-primary transition-all",
                      selected.some((item) => item.id === option.id)
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-50"
                    )}
                  />
                  <span className="font-medium">
                    {option.username
                      ? option.username
                      : `${option.first_name || ""} ${option.last_name || ""}`.trim()}
                  </span>
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { MultiSelect };
