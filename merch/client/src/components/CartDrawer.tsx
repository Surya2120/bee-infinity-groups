import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../state/cart";
import { formatINR } from "../lib/format";
import GoldButton from "./GoldButton";
import GlassPanel from "./GlassPanel";

export default function CartDrawer() {
  const cart = useCart();
  const navigate = useNavigate();

  return (
    <AnimatePresence>
      {cart.open ? (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => cart.toggle(false)}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md p-3"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 40, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.9, 0.2, 1] }}
          >
            <GlassPanel className="flex h-full flex-col overflow-hidden">
              <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
                <div>
                  <div className="text-xs tracking-[0.34em] text-gold-200/70">CART</div>
                  <div className="text-lg font-semibold text-white/95">Your Selection</div>
                </div>
                <button
                  className="rounded-full border border-white/10 px-3 py-1 text-sm text-white/70 hover:text-white"
                  onClick={() => cart.toggle(false)}
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-auto px-5 py-4">
                {cart.items.length === 0 ? (
                  <div className="mt-10 text-center text-white/60">
                    Your showroom is empty.
                    <div className="mt-4">
                      <Link to="/products" onClick={() => cart.toggle(false)}>
                        <GoldButton variant="ghost">Explore Products</GoldButton>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {cart.items.map((i) => (
                      <div key={`${i.productId}:${i.color}:${i.size}`} className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
                        <div className="flex gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-lg border border-white/10 bg-ink-900">
                            {i.image ? (
                              <img src={i.image} alt={i.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-xs text-white/40">PREVIEW</div>
                            )}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="truncate text-sm font-semibold text-white/90">{i.name}</div>
                            <div className="mt-1 text-xs text-white/60">
                              {i.color ? <span className="mr-2">Color: {i.color}</span> : null}
                              {i.size ? <span>Size: {i.size}</span> : null}
                            </div>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="text-sm text-gold-100">{formatINR(i.priceINR)}</div>
                              <div className="flex items-center gap-2">
                                <button
                                  className="h-7 w-7 rounded-full border border-white/10 text-white/70 hover:text-white"
                                  onClick={() => cart.setQty(i.productId, i.qty - 1, i.color, i.size)}
                                >
                                  -
                                </button>
                                <div className="w-7 text-center text-sm">{i.qty}</div>
                                <button
                                  className="h-7 w-7 rounded-full border border-white/10 text-white/70 hover:text-white"
                                  onClick={() => cart.setQty(i.productId, i.qty + 1, i.color, i.size)}
                                >
                                  +
                                </button>
                                <button
                                  className="ml-2 rounded-full border border-white/10 px-2 py-1 text-xs text-white/60 hover:text-white"
                                  onClick={() => cart.remove(i.productId, i.color, i.size)}
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="border-t border-white/10 px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/70">Subtotal</span>
                  <span className="text-white/90">{formatINR(cart.subtotal)}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <GoldButton
                    variant="ghost"
                    className="flex-1"
                    disabled={cart.items.length === 0}
                    onClick={() => cart.clear()}
                  >
                    Clear
                  </GoldButton>
                  <GoldButton
                    className="flex-1"
                    disabled={cart.items.length === 0}
                    onClick={() => {
                      cart.toggle(false);
                      navigate("/checkout");
                    }}
                  >
                    Checkout
                  </GoldButton>
                </div>
              </div>
            </GlassPanel>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}

