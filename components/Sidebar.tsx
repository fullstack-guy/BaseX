"use client";
// import "../globals.css";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Brand from "@/components/Brand";

import {
  LuLayoutDashboard,
  LuSettings,
  LuLayoutList,
  LuMenu,
  LuX,
  LuUserSquare2,
  LuHome,
  LuBell,
} from "react-icons/lu";
import Search from "@/components/Search";

const navigation = [
  {
    name: "Dashboard Home",
    href: "/dashboard",
    icon: LuHome,
    current: true,
  },
  { name: "Passes", href: "#", icon: LuUserSquare2, current: false },
  { name: "Visits", href: "#", icon: LuLayoutList, current: false },
];

const admin = [
  {
    name: "Admin Dashboard",
    href: "#",
    icon: LuLayoutDashboard,
    current: false,
  },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <LuX
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  {/* Sidebar component, swap this element with another sidebar if you like */}
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-2">
                    <div className="flex h-16 shrink-0 items-center">
                      <Brand />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  href={item.href}
                                  className={classNames(
                                    item.current
                                      ? "bg-gray-50 text-accent"
                                      : "text-gray-700 hover:text-accent hover:bg-gray-50",
                                    "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-accent"
                                        : "text-gray-400 group-hover:text-accent",
                                      "h-5 w-5 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                            <li>
                              <Search />
                            </li>
                          </ul>
                        </li>
                        <li>
                          <div className="text-xs font-semibold leading-6 text-gray-400">
                            Admin
                          </div>
                          <li>
                            <ul role="list" className="-mx-2 space-y-1">
                              {admin.map((item) => (
                                <li key={item.name}>
                                  <a
                                    href={item.href}
                                    className={classNames(
                                      item.current
                                        ? "bg-gray-50 text-accent"
                                        : "text-gray-700 hover:text-accent hover:bg-gray-50",
                                      "group flex items-center gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                    )}
                                  >
                                    <item.icon
                                      className={classNames(
                                        item.current
                                          ? "text-accent"
                                          : "text-gray-400 group-hover:text-accent",
                                        "h-5 w-5 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </li>
                        </li>
                        <li className="mt-auto">
                          <a
                            href="/dashboard/account"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-accent"
                          >
                            <LuSettings
                              className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-accent"
                              aria-hidden="true"
                            />
                            Account Settings
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-60 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
            <div className="flex h-16 shrink-0 items-center">
              <Brand />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-accent"
                              : "text-gray-700 hover:text-accent hover:bg-gray-50",
                            "group flex gap-x-3 items-center rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-accent"
                                : "text-gray-400 group-hover:text-accent",
                              "h-5 w-5 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                    <li>
                      <Search />
                    </li>
                  </ul>
                </li>
                <li>
                  <div className="text-xs font-semibold leading-6 text-gray-400">
                    Admin
                  </div>
                  <ul role="list" className="-mx-2 mt-2 space-y-1">
                    {admin.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={classNames(
                            item.current
                              ? "bg-gray-50 text-accent"
                              : "text-gray-700 hover:text-accent hover:bg-gray-50",
                            "group flex gap-x-3 items-center rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-accent"
                                : "text-gray-400 group-hover:text-accent",
                              "h-5 w-5 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li className="-mx-6 mt-auto p-2">
                  <a
                    href="/dashboard/settings"
                    className="flex items-center gap-x-3 p-2 rounded-md justify-between text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
                  >
                    <div className="flex items-center gap-x-4">
                      Account Settings
                    </div>
                    <LuSettings
                      className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-accent"
                      aria-hidden="true"
                    />
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="sticky top-0 z-40 flex items-center justify-between gap-x-6 bg-white px-4 py-4 shadow-sm sm:px-6 lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <LuMenu className="h-6 w-6" aria-hidden="true" />
          </button>
          <a href="/dashboard/account">
            <span className="sr-only">Your profile</span>
            <img
              className="h-8 w-8 rounded-full bg-gray-50"
              src="/images/avatar.jpg"
              alt=""
            />
          </a>
        </div>
      </div>
    </>
  );
}
