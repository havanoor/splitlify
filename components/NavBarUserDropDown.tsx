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
      {username && username !== "Guest" ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-input text-foreground/80 font-medium px-4 py-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{username}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-border mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-foreground">{username}</p>
                <p className="text-xs leading-none text-muted-foreground">Logged in user</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/books">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 hover:text-primary transition-colors rounded-md py-2.5">
                  My Books
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 hover:text-primary transition-colors rounded-md py-2.5">
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form method="POST" action="/logout" className="w-full">
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full cursor-pointer text-left px-2 py-2.5 text-sm text-destructive hover:bg-destructive/10 hover:text-red-700 rounded-md transition-colors">
                    Sign Out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <a
          href="/login"
          className="inline-flex items-center justify-center bg-primary hover:bg-primary/90 text-white text-sm font-semibold px-6 py-2 rounded-full transition-all shadow-sm"
        >
          Log in
        </a>
      )}
    </>
  );
}
