"use client";
// import {  cookies } from "next/headers";
import { createClient } from "@/utils/supabase/client";

function GoogleAuth() {
  const handleSignIn = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div>
      <button
        onClick={handleSignIn}
        className="w-full inline-flex items-center justify-center px-14 py-3 font-medium text-center text-md bg-gray-800 text-white rounded-md hover:bg-gray-700 hover:text-white focus:ring-4 focus:ring-gray-300"
      >
        {/* <FaGoogle /> */}
        <span className="ml-2 whitespace-nowrap">Sign in with Google</span>
      </button>
    </div>
  );
}
export default GoogleAuth;
