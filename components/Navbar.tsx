import { useState } from "react";
import { RxCross2, RxHamburgerMenu } from "react-icons/rx";
import NavBarUserDropDown from "./NavBarUserDropDown";
import { Link } from "@remix-run/react";

export default function NavBar({ username }: { username: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#79AC78] text-white ">
      <div className="max-w-screen-xl flex flex-wrap justify-between md:items-center p-4 mx-auto">
        <div>Logo </div>
        <div className="hidden w-full md:block md:w-auto ">
          <ul className="w-full flex flex-col md:flex-row md:mt-0 font-medium mt-4 md:border-0 ">
            <li className="py-2 px-3">
              <Link to="/">Home</Link>
            </li>
            <li className="py-2 px-3">
              <Link to="#">About</Link>
            </li>
            <li className="py-2 px-3">
              <Link to="#">Explore</Link>
            </li>
            <li className="py-2 px-3 ">
              <NavBarUserDropDown username={username} />
            </li>
          </ul>
        </div>
        <button
          className="md:hidden text-3xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <RxCross2 /> : <RxHamburgerMenu />}
        </button>
      </div>
      {isOpen && (
        <div className="w-full md:hidden mt-4 space-y-2">
          <ul className="w-full flex flex-col font-medium justify-between items-center gap-2">
            <li className="hover:underline">
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="#">About</Link>
            </li>
            <li>
              <Link to="#">Explore</Link>
            </li>
            <li>
              <NavBarUserDropDown username={username} />
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
