import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "./ui/dropdown-menu";
import { Link } from "lucide-react";
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
              <DropdownMenuItem
              // onClick={() => signOut({ callbackUrl: "/", redirect: true })}
              >
                Sign Out
              </DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <Link href="/singleBook">
                <DropdownMenuItem>My Books</DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link href="/authentication/login">Login </Link>
      )}
    </>
  );
}
