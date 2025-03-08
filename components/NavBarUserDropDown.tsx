import { Link } from "@remix-run/react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { FiUser } from "react-icons/fi";

export default function NavBarUserDropDown({
  username,
}: {
  username: string | undefined;
}) {
  return (
    <>
      {username ? (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <p className="flex items-center gap-2">
              <FiUser /> {username}
            </p>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>{username}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <form method="POST" action="/logout">
                  <button>Sign Out</button>
                </form>
              </DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <Link to="/books">
                <DropdownMenuItem>My Books</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <a href="/login">Login </a>
      )}
    </>
  );
}
