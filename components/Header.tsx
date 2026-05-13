import Link from "next/link";
import type { Route } from "next";

const navItems: { href: Route; label: string }[] = [
  { href: "/", label: "Hoy" },
  { href: "/que-hacer-hoy", label: "Qué hacer" },
  { href: "/planifica", label: "Planifica" },
  { href: "/mapa", label: "Mapa" },
  { href: "/alertas", label: "Alertas" },
  { href: "/inteligencia-turistica", label: "Inteligencia" },
  { href: "/chat", label: "Chat" },
  { href: "/sobre-el-proyecto", label: "Proyecto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/90 backdrop-blur-xl">
      <div className="section-shell flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
        <Link className="focus-ring flex items-center gap-3 rounded-full" href="/">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-alicante-violet text-sm font-black text-white shadow-glow">
            OA
          </span>
          <span>
            <span className="block text-sm font-black tracking-tight text-alicante-ink">Observatorio Alicante</span>
            <span className="text-xs font-medium text-alicante-muted">Turismo + clima + decisión</span>
          </span>
        </Link>
        <nav
          aria-label="Navegación principal"
          className="flex gap-1 overflow-x-auto rounded-full border border-sky-100 bg-white p-1 shadow-soft"
        >
          {navItems.map((item) => (
            <Link
              className="focus-ring whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-alicante-muted transition hover:bg-sky-50 hover:text-alicante-violet"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <Link className="primary-pill hidden lg:inline-flex" href="/chat">
          Habla con Bárbara
        </Link>
      </div>
    </header>
  );
}
