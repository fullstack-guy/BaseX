import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LuLogOut, LuSettings } from "react-icons/lu";
import { LuLogIn } from "react-icons/lu";

export default async function AuthButton() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();
  const user = session?.user;

  const signOut = async () => {
    "use server";

    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    await supabase.auth.signOut();
    return redirect("/login");
  };

  return user ? (
    <div className="flex items-center justify-between gap-4 mb-3">
      <img
        className="h-9 w-9 rounded-full bg-gray-50"
        src="/images/avatar.jpg"
        alt="User Profile image"
      />

      <a
        href="/account/settings"
        className="flex items-center gap-x-3 p-2 rounded-md text-sm font-semibold leading-6 text-gray-900 hover:bg-gray-50"
      >
        <LuSettings
          className="h-5 w-5 shrink-0 text-gray-400 group-hover:text-accent"
          aria-hidden="true"
        />
      </a>
      <form action={signOut}>
        <button className="py-2 px-4 rounded-md no-underline bg-btn-background hover:bg-btn-background-hover">
          <LuLogOut />
        </button>
      </form>
    </div>
  ) : (
    <Link
      href="/login"
      className="py-2 px-3 flex rounded-md no-underline bg-btn-background hover:bg-btn-background-hover"
    >
      <LuLogIn />
    </Link>
  );
}
