import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassPanel from "../components/GlassPanel";
import GoldButton from "../components/GoldButton";
import { useAuth } from "../state/auth";
import { useCart } from "../state/cart";
import { apiFetch } from "../lib/api";
import { formatINR } from "../lib/format";

export default function Checkout() {
  const auth = useAuth();
  const cart = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState(auth.user?.email || "");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [payProvider, setPayProvider] = useState<"Cashfree" | "Razorpay" | "Placeholder">("Placeholder");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const shipping = useMemo(() => (cart.subtotal >= 1999 ? 0 : cart.items.length ? 99 : 0), [cart.items.length, cart.subtotal]);
  const grand = useMemo(() => cart.subtotal + shipping, [cart.subtotal, shipping]);

  async function placeOrder() {
    setErr(null);
    if (!auth.token) {
      navigate("/auth");
      return;
    }
    if (cart.items.length === 0) {
      setErr("Cart is empty");
      return;
    }

    setLoading(true);
    try {
      const data = await apiFetch<{ orderId: string }>("/api/orders", {
        method: "POST",
        token: auth.token,
        body: {
          items: cart.items.map((i) => ({ productId: i.productId, qty: i.qty, color: i.color, size: i.size })),
          billing: { fullName, email, phone, address1, address2, city, state, postalCode, country: "India" },
          paymentProvider: payProvider.toLowerCase()
        }
      });
      cart.clear();
      navigate(`/success/${data.orderId}`);
    } catch (e: any) {
      setErr(e?.message || "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="p-6 md:p-8">
          <div className="text-xs tracking-[0.44em] text-gold-200/70">CHECKOUT</div>
          <div className="mt-3 text-2xl font-semibold text-white/95">Billing</div>
          <div className="mt-2 text-sm text-white/60">Payment integration placeholder: Cashfree / Razorpay ready.</div>

          {err ? <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</div> : null}

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <Field label="Full Name" className="md:col-span-2">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Email" className="md:col-span-2">
              <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Phone">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Postal Code">
              <input value={postalCode} onChange={(e) => setPostalCode(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Address Line 1" className="md:col-span-2">
              <input value={address1} onChange={(e) => setAddress1(e.target.value)} className={inputCls} />
            </Field>
            <Field label="Address Line 2" className="md:col-span-2">
              <input value={address2} onChange={(e) => setAddress2(e.target.value)} className={inputCls} />
            </Field>
            <Field label="City">
              <input value={city} onChange={(e) => setCity(e.target.value)} className={inputCls} />
            </Field>
            <Field label="State">
              <input value={state} onChange={(e) => setState(e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="mt-5">
            <div className="mb-2 text-xs tracking-wide text-white/60">Payment Provider (placeholder)</div>
            <div className="flex flex-wrap gap-2">
              {(["Placeholder", "Cashfree", "Razorpay"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPayProvider(p)}
                  className={[
                    "rounded-full border px-3 py-1.5 text-xs transition",
                    p === payProvider
                      ? "border-gold-500/60 bg-gold-500/10 text-gold-100 shadow-glow"
                      : "border-white/10 bg-white/[0.02] text-white/65 hover:text-white"
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <GoldButton className="w-full" disabled={loading} onClick={placeOrder}>
              {loading ? "Placing order..." : "Place Order"}
            </GoldButton>
            {!auth.token ? (
              <div className="mt-3 text-xs text-white/50">
                You’ll be redirected to login if you are not signed in.
              </div>
            ) : null}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6 md:p-8">
          <div className="text-xs tracking-[0.44em] text-gold-200/70">SUMMARY</div>
          <div className="mt-3 text-2xl font-semibold text-white/95">Order</div>

          <div className="mt-6 space-y-3">
            {cart.items.map((i) => (
              <div key={`${i.productId}:${i.color}:${i.size}`} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-white/90">{i.name}</div>
                  <div className="mt-1 text-xs text-white/55">
                    Qty {i.qty}
                    {i.color ? ` • ${i.color}` : ""}{i.size ? ` • ${i.size}` : ""}
                  </div>
                </div>
                <div className="text-sm text-gold-100">{formatINR(i.qty * i.priceINR)}</div>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-white/70">Subtotal</span>
              <span className="text-white/90">{formatINR(cart.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-white/70">Shipping</span>
              <span className="text-white/90">{formatINR(shipping)}</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between text-base">
              <span className="text-white/85">Grand Total</span>
              <span className="text-gold-100">{formatINR(grand)}</span>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none focus:border-gold-500/40";

function Field({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <div className="mb-1 text-xs tracking-wide text-white/60">{label}</div>
      {children}
    </label>
  );
}

