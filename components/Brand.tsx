import site from "@/site.config.json";

export default function Brand() {
  return (
    <a
      className="py-2 px-3 flex rounded-md no-underline hover:bg-btn-background-hover border"
      href="/"
      target="_self"
      rel="noreferrer"
    >
      <div className="font-medium uppercase"> {site.name}</div>
    </a>
  );
}
