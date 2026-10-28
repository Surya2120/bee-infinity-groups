import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../state/cart";

type GuideContext = {
  page: "merch" | "auth" | "checkout" | "success";
  route: string;
  busy: boolean;
  sensitive: boolean;
};

/** Share the same guide with static pages, while keeping shop tasks uninterrupted. */
export default function MrBee() {
  const { pathname } = useLocation();
  const cart = useCart();
  const page: GuideContext["page"] = pathname.startsWith("/checkout")
    ? "checkout"
    : pathname.startsWith("/auth")
      ? "auth"
      : pathname.startsWith("/success") ? "success" : "merch";
  const latest = useRef<GuideContext>({ page, route: pathname, busy: cart.open, sensitive: page !== "merch" });
  latest.current = { page, route: pathname, busy: cart.open, sensitive: page !== "merch" };

  useEffect(() => {
    const publish = () => window.dispatchEvent(new CustomEvent("mrbee:context", { detail: latest.current }));
    const stylesheet = "/css/mrbee.css?v=sitewide-v1";
    const source = "/js/mrbee.js?v=sitewide-v1";
    let link = document.querySelector<HTMLLinkElement>('link[data-mrbee-shared="styles"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = stylesheet;
      link.dataset.mrbeeShared = "styles";
      document.head.append(link);
    }
    let script = document.querySelector<HTMLScriptElement>('script[data-mrbee-shared="script"]');
    const needsScript = !script;
    if (!script) {
      script = document.createElement("script");
      script.src = source;
      script.async = true;
      script.dataset.mrbeeShared = "script";
    }
    script.addEventListener("load", publish);
    window.addEventListener("mrbee:ready", publish);
    publish();
    if (needsScript) document.head.append(script);
    return () => {
      // These shared assets survive React StrictMode's setup/cleanup cycle.
      script?.removeEventListener("load", publish);
      window.removeEventListener("mrbee:ready", publish);
    };
  }, []);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent("mrbee:context", { detail: latest.current }));
  }, [pathname, cart.open]);

  return null;
}
