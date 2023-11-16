import AuthButton from "./AuthButton";
import Brand from "./Brand";
import Menu from "./Menu";

export default function Header({ user }: any) {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl flex justify-between items-center p-3 text-sm">
        <Brand />
        <Menu user={user} />
        <AuthButton />
      </div>
    </nav>
  );
}
