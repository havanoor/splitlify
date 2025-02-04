import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { PopoverClose } from "@radix-ui/react-popover";

import { Popover, PopoverContent, PopoverTrigger } from "components/ui/popover";
import { ChangeEvent, useState } from "react";
import { Form } from "@remix-run/react";

type userProps = {
  // addNewUser: (newUser: NewUser) => void;
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

  return (
    <>
      <Popover>
        <PopoverTrigger asChild>
          <Button>Add new Person</Button>
        </PopoverTrigger>
        <PopoverContent className="bg-white p-9 shadow-lg">
          <Form method="POST">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="font-medium leading-none">New User</h4>
                <p className="text-sm text-muted-foreground">
                  Add details for the new user
                </p>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
                  <Label htmlFor="width">First Name</Label>
                  <Input
                    id="fname"
                    name="first_name"
                    onChange={handleNewUser}
                    placeholder="First Name"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
                  <Label htmlFor="width">Last Name</Label>
                  <Input
                    id="lname"
                    name="last_name"
                    onChange={handleNewUser}
                    placeholder="Last Name"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <div className="grid grid-cols-1 items-center gap-4 lg:grid-cols-3">
                  <Label htmlFor="width">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    onChange={handleNewUser}
                    placeholder="Username"
                    className="col-span-2 h-8"
                  />
                </div>
              </div>
            </div>
            <PopoverClose asChild>
              <Button
                type="submit"
                className="mt-4"
                name="_action"
                value="AddNewUser"
              >
                Add User
              </Button>
            </PopoverClose>
          </Form>
        </PopoverContent>
      </Popover>
    </>
  );
}
