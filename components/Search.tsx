import { BarsArrowUpIcon, UsersIcon } from "@heroicons/react/20/solid";

import { LuSearch } from "react-icons/lu";

export default function Search() {
  return (
    <div>
      <div className="mt-2 flex rounded-md shadow-sm">
        <div className="relative flex flex-grow items-stretch focus-within:z-10">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <LuSearch className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </div>
          <input
            type="email"
            name="email"
            id="email"
            className="block w-full rounded-md border-0 py-1.5 pl-10 text-gray-700 ring-1 ring-inset ring-gray-100 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            placeholder="Search"
          />
        </div>
      </div>
    </div>
  );
}
