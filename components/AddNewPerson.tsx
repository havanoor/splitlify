import { PopoverClose } from "@radix-ui/react-popover";
import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";

import { useFetcher } from "@remix-run/react";
import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { ChangeEvent, useState, useEffect } from "react";

type userProps = {
  bookId: string;
};

export default function AddNewPerson({ bookId }: userProps) {
  const user: NewUser = {
    first_name: "",
    last_name: null,
    username: null,
    book_id: bookId,
  };

  const [newUser, setNewUser] = useState<NewUser>(user);
  const handleNewUser = (e: ChangeEvent<HTMLInputElement>) => {
    setNewUser({
      ...newUser,
      [e.target.name]: e.target.value,
    });
  };

  const [open, setOpen] = useState(false);
  const fetcher = useFetcher();

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data && (fetcher.data as any).ok) {
      setOpen(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full text-[#79AC78] border-[#79AC78]/20 bg-[#79AC78]/5 hover:bg-[#79AC78]/10 hover:text-[#79AC78] border-dashed rounded-xl h-12"
          >
            + Add New Person.
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="bg-white p-6 shadow-xl w-80 rounded-2xl border-gray-100"
          side="top"
          align="center"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <fetcher.Form method="POST">
            <div className="grid gap-5">
              <div className="space-y-1.5 pb-2 border-b border-gray-100">
                <h4 className="font-bold text-lg text-gray-900 leading-none">New Participant</h4>
                <p className="text-sm text-gray-500">
                  Add someone to split expenses with. Enter the username for an existing user or enter the details for a new user.
                </p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="fname" className="text-sm font-semibold text-gray-700">First Name</Label>
                <Input
                  id="fname"
                  name="first_name"
                  onChange={handleNewUser}
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-[#79AC78]"

                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="lname" className="text-sm font-semibold text-gray-700">Last Name <span className="text-gray-400 font-normal">(Optional)</span></Label>
                <Input
                  id="lname"
                  name="last_name"
                  onChange={handleNewUser}
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-[#79AC78]"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-semibold text-gray-700">Username</Label>
                <Input
                  id="username"
                  name="username"
                  onChange={handleNewUser}
                  placeholder="e.g. username123"
                  className="h-10 rounded-xl border-gray-200 focus-visible:ring-[#79AC78]"
                />
              </div>
            </div>
            <Button
              type="submit"
              className="mt-6 w-full h-10 rounded-xl bg-[#79AC78] hover:bg-[#639362] text-white font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              name="_action"
              value="AddNewUser"
              disabled={fetcher.state === "submitting" || (!newUser.first_name?.trim() && !newUser.username?.trim())}
            >
              {fetcher.state === "submitting" ? "Adding..." : "Add Person"}
            </Button>
          </fetcher.Form>
        </PopoverContent>
      </Popover>
    </>
  );
}
