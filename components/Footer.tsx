export default function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-t-foreground/10 p-8 flex justify-center text-center text-xs">
      <p>
        Powered by{" "}
        <a
          href="https://trewlabs.com"
          target="_blank"
          className="font-bold hover:underline"
          rel="noreferrer"
        >
          TrewLabs
        </a>
      </p>
    </footer>
  );
}
