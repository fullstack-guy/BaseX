import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import UserProfileForm from "../settings/UserProfileForm";

export default async function Account() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return <UserProfileForm session={session} />;
}
