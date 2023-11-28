import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import AuthButton from "@/components/AuthButton";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";
import useServerAuth from "@/utils/useServerAuth";
// import { useState } from "react";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const user = await useServerAuth();

  if (user?.id) {
    let { data, error } = await supabase.rpc("check_if_org_exist_for_user", {
      u_id: user.id,
    });

    if (error) console.error(error);
    else {
      if (!data) {
        return redirect("/account/settings");
      }
    }
  }

  return (
    <>
      <div className="flex-1 w-full flex flex-col">
        <Sidebar>
          <AuthButton />
        </Sidebar>

        <main className="py-10 lg:pl-60">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
        <Footer />
      </div>
    </>
  );
}
