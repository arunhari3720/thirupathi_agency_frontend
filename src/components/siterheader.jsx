import { useEffect, useState } from "react";

function SiteHeader() {
  const [open, setOpen] = useState(false);

  const links = [
    { name: "What we do", href: "#what" },
    { name: "Brands", href: "#hgal" },
    { name: "Why us", href: "#why" },
  ];

  /* Esc closes the menu */
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-[999] px-4 pt-4 sm:px-6">

      {/* 3-column grid: logo + name | nav (true centre) | actions */}
      <div className="mx-auto grid h-[64px] max-w-[1068px] grid-cols-[1fr_auto] items-center gap-4 rounded-full border border-black/5 bg-white/90 px-5 text-[#111114] shadow-[0_8px_30px_rgba(17,17,20,0.10)] backdrop-blur-xl sm:px-6 md:px-7 lg:grid-cols-[1fr_auto_1fr]">

        {/* Logo + name (left) */}
        <a
          href="#hero"
          onClick={() => setOpen(false)}
          className="flex min-w-0 shrink-0 items-center gap-2.5 justify-self-start"
        >
          <img
            src="https://res.cloudinary.com/gtqzljit/image/upload/v1790821022/pngwing.com.png"
            alt="Thirupathi Agencies logo"
            className="h-9 w-auto max-w-[56px] object-contain sm:h-10"
          />
          <span className="whitespace-nowrap text-[15px] font-extrabold leading-none tracking-tight text-[#111114] sm:text-lg">
            Thirupathi Agencies
          </span>
        </a>

        {/* Desktop Navigation (exact centre) */}
        <nav className="hidden items-center justify-center gap-1 justify-self-center lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="whitespace-nowrap rounded-full px-4 py-2 text-[15px] font-medium text-[#111114]/70 transition-colors duration-200 hover:bg-[#F1F1E9] hover:text-[#111114]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Right side (right) */}
        <div className="flex items-center justify-end gap-3 justify-self-end">

          {/* Login / Register / Enquire (tablet / desktop) */}
          <div className="hidden items-center gap-2 sm:flex">
            <a
              href="/login"
              className="whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium text-[#111114]/80 transition-colors duration-200 hover:bg-[#F1F1E9] hover:text-[#111114]"
            >
              Login
            </a>

            <a
              href="/register"
              className="whitespace-nowrap rounded-full border border-[#111114]/20 px-5 py-2.5 text-sm font-semibold text-[#111114] transition-colors duration-200 hover:border-[#111114] hover:bg-[#111114] hover:text-white"
            >
              Register
            </a>

            <a
              href="#contact"
              className="whitespace-nowrap rounded-full bg-[#111114] px-6 py-3 text-sm font-semibold !text-white transition-all duration-300 hover:bg-[#6A4DFF] hover:!text-white"
            >
              Enquire
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label="Toggle navigation"
            aria-expanded={open}
            className="relative grid h-10 w-10 place-items-center rounded-full bg-[#111114]/5 transition hover:bg-[#111114]/10 sm:hidden"
          >
            <span
              className={`absolute h-0.5 w-4 rounded bg-[#111114] transition-all duration-300 ${
                open ? "rotate-45" : "-translate-y-[5px]"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded bg-[#111114] transition-all duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute h-0.5 w-4 rounded bg-[#111114] transition-all duration-300 ${
                open ? "-rotate-45" : "translate-y-[5px]"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`mx-auto mt-3 max-w-[1068px] overflow-hidden rounded-3xl border border-black/5 bg-white/95 text-[#111114] shadow-xl backdrop-blur-xl transition-all duration-300 sm:hidden ${
          open ? "max-h-[420px] p-5 opacity-100" : "max-h-0 border-transparent p-0 opacity-0"
        }`}
      >
        <nav className="flex flex-col gap-1">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-4 py-3 text-base font-medium text-[#111114]/80 hover:bg-[#F1F1E9]"
            >
              {link.name}
            </a>
          ))}
        </nav>

        <div className="my-3 h-px bg-black/10" />

        <div className="grid grid-cols-2 gap-3">
          <a
            href="/login"
            onClick={() => setOpen(false)}
            className="rounded-full border border-black/15 py-3 text-center text-sm font-medium"
          >
            Login
          </a>
          <a
            href="/register"
            onClick={() => setOpen(false)}
            className="rounded-full bg-[#111114] py-3 text-center text-sm font-semibold !text-white"
          >
            Register
          </a>
        </div>

        <a
          href="#contact"
          onClick={() => setOpen(false)}
          className="mt-3 block rounded-full bg-[#D2E823] py-3 text-center text-sm font-bold text-[#111114]"
        >
          Enquire ↗
        </a>
      </div>
    </header>
  );
}

export default SiteHeader;