import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";
import Header from "@/components/Hero";
import AuthButton from "@/components/AuthButton";
import Brand from "@/components/Brand";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();

  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
        <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
          <Brand />
          <AuthButton />
        </div>
      </nav>

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 px-96 w-full">
        {/* <Header /> */}
        <main className="flex-1 flex flex-col gap-6 w-full">{children}</main>
      </div>

      <footer className="w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
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
  );
}
