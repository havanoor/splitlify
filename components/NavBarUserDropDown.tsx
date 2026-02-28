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
            <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 font-medium px-4 py-2 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-[#79AC78] focus:ring-offset-2">
              <div className="w-6 h-6 rounded-full bg-[#79AC78]/10 text-[#79AC78] flex items-center justify-center text-xs font-bold">
                {username.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm">{username}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-gray-100 mt-2">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-gray-900">{username}</p>
                <p className="text-xs leading-none text-gray-500">Logged in user</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/books">
                <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 hover:text-[#79AC78] transition-colors rounded-md py-2.5">
                  My Books
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 hover:text-[#79AC78] transition-colors rounded-md py-2.5">
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <form method="POST" action="/logout" className="w-full">
                <DropdownMenuItem asChild>
                  <button type="submit" className="w-full cursor-pointer text-left px-2 py-2.5 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-md transition-colors">
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
          className="inline-flex items-center justify-center bg-[#79AC78] hover:bg-[#639362] text-white text-sm font-semibold px-6 py-2 rounded-full transition-all shadow-sm"
        >
          Log in
        </a>
      )}
    </>
  );
}
