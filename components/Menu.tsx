function GuestMenu() {
  return (
    <a
      href="/login"
      className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
    >
      Get Started
    </a>
  );
}
function UserMenu() {
  return (
    <>
      <a
        href="/dashboard"
        className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
      >
        Dashboard
      </a>
      <a
        href="/dashboard/settings"
        className="flex items-center px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none transition duration-150 ease-in-out"
      >
        Settings
      </a>
    </>
  );
}

export default function Menu({ user }: any) {
  return <div className="flex">{user ? <UserMenu /> : <GuestMenu />}</div>;
}
