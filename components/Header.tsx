import Link from "next/link";
import type { Route } from "next";

const navItems: { href: Route; label: string }[] = [
  { href: "/", label: "Hoy" },
  { href: "/que-hacer-hoy", label: "Qué hacer" },
  { href: "/planifica", label: "Planifica" },
  { href: "/mapa", label: "Mapa" },
  { href: "/alertas", label: "Alertas" },
  { href: "/inteligencia-turistica", label: "Inteligencia" },
  { href: "/sobre-el-proyecto", label: "Proyecto" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <Link className="focus-ring rounded-sm" href="/">
          <span className="block text-sm font-bold uppercase tracking-[0.16em] text-alicante-blue">
            Observatorio Alicante
          </span>
          <span className="text-xs text-slate-600">Turismo + clima + decisión</span>
        </Link>
        <nav aria-label="Navegación principal" className="flex gap-2 overflow-x-auto pb-1 lg:pb-0">
          {navItems.map((item) => (
            <Link
              className="focus-ring whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-alicante-sky hover:text-alicante-deep"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
