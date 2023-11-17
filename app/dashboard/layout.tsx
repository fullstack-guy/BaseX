import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
// import Header from "@/components/Hero";
import AuthButton from "@/components/AuthButton";
import Brand from "@/components/Brand";
import { redirect } from "next/navigation";
// import { Dialog, Transition } from "@headlessui/react";
// import { Fragment, useState } from "react";

import {
  LuPackageSearch,
  LuPackagePlus,
  LuLayoutDashboard,
  LuSettings,
  LuLayoutList,
  LuMenu,
  LuX,
  LuBell,
} from "react-icons/lu";
import Search from "@/components/Search";
import Sidebar from "@/components/Sidebar";
// import { useState } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // const [sidebarOpen, setSidebarOpen] = useState(false);

  if (user?.id) {
    let { data, error } = await supabase.rpc("check_if_org_exist_for_user", {
      u_id: user.id,
    });

    if (error) console.error(error);
    else {
      if (!data) {
        return redirect("/dashboard/settings");
      }
    }
  }

  return (
    <>
      <div className="flex-1 w-full flex flex-col">
        {/* <nav className="w-full hidden lg:flex justify-end border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-end items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav> */}

        {/* <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 px-96 w-full">
        <Header />
        <main className="flex-1 flex flex-col gap-6 w-full">{children}</main>
      </div> */}

        <Sidebar>
          <AuthButton />
        </Sidebar>

        <main className="py-10 lg:pl-60">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

        {/* FOOTER */}
        <footer className="mt-auto w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
          <p>
            Powered by
            <a
              href="https://supabase.com/?utm_source=create-next-app&utm_medium=template&utm_term=nextjs"
              target="_blank"
              className="font-bold hover:underline"
              rel="noreferrer"
            >
              Supabase
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}
