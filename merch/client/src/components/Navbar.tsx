import { Link, NavLink } from "react-router-dom";
import { useCart } from "../state/cart";
import { useAuth } from "../state/auth";
import GoldButton from "./GoldButton";

function navClass({ isActive }: { isActive: boolean }) {
  return [
    "text-sm tracking-wide transition",
    isActive ? "text-gold-100" : "text-white/70 hover:text-white"
  ].join(" ");
}

export default function Navbar() {
  const cart = useCart();
  const auth = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink-950/65 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="group flex items-center gap-2">
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-gold-500/40 bg-gold-500/10">
            <span className="h-2.5 w-2.5 rounded-full bg-gold-500 shadow-glow" />
          </span>
          <div className="leading-tight">
            <div className="text-[13px] font-semibold tracking-[0.22em] text-white/90">BEE INFINITY</div>
            <div className="text-[10px] tracking-[0.38em] text-gold-200/70">MERCH SHOWROOM</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" className={navClass} end>
            Home
          </NavLink>
          <NavLink to="/products" className={navClass}>
            Products
          </NavLink>
          <a
            href="https://beeinfinitygroups.com"
            className="text-sm tracking-wide text-white/70 transition hover:text-white"
          >
            Main Site
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden text-xs text-white/70 md:block">
            {auth.user ? (
              <span>
                Signed in as <span className="text-gold-100">{auth.user.username}</span>
              </span>
            ) : (
              <span className="text-white/60">Guest</span>
            )}
          </div>

          {!auth.user ? (
            <Link to="/auth">
              <GoldButton variant="ghost">Login</GoldButton>
            </Link>
          ) : (
            <GoldButton variant="ghost" onClick={() => auth.logout()}>
              Logout
            </GoldButton>
          )}

          <GoldButton onClick={() => cart.toggle(true)} aria-label="Open cart">
            Cart <span className="ml-2 rounded-full bg-ink-950/20 px-2 py-0.5 text-xs">{cart.count}</span>
          </GoldButton>
        </div>
      </div>
    </header>
  );
}

