import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import Brand from "../components/Brand";
import AuthButton from "../components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import ConnectSupabaseSteps from "@/components/ConnectSupabaseSteps";
import Hero from "@/components/Hero";
import { Head } from "next/document";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Index() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <Header user={user} />

      <div className="animate-in flex-1 flex flex-col gap-20 opacity-0 max-w-4xl px-3">
        <Hero />
        <main className="flex-1 flex flex-col gap-6">
          <h2 className="font-bold text-4xl mb-4">Next steps</h2>
          <ConnectSupabaseSteps />
        </main>
      </div>

      <Footer />
    </div>
  );
}

// user_metadata: {
//   avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocJVoepOXjg2M4XAlCthjkNobZ2R8qZR4tymyWAiK7mkAEE=s96-c',
//   custom_claims: { hd: 'sonicloop.net' },
//   email: 'tennyson@sonicloop.net',
//   email_verified: true,
//   full_name: 'Tennyson Preston',
//   iss: 'https://accounts.google.com',
//   name: 'Tennyson Preston',
//   picture: 'https://lh3.googleusercontent.com/a/ACg8ocJVoepOXjg2M4XAlCthjkNobZ2R8qZR4tymyWAiK7mkAEE=s96-c',
//   provider_id: '100371691896886518380',
//   sub: '100371691896886518380'
// },
