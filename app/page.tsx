import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import Brand from "../components/Brand";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import Hero from "@/components/Hero";
import { Head } from "next/document";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header user={user} />

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Hero />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
        </main>
      </div>

      <Footer />
    </div>
  );
}
