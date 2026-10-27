import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import "../../../../css/site-header.css";

export default function SiteHeader({ cartOpen = false }: { cartOpen?: boolean }) {
  const header = useRef<HTMLElement>(null);
  const navigation = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const explore = useRef<HTMLDetailsElement>(null);
  const [mobile, setMobile] = useState(() => window.matchMedia("(max-width: 980px)").matches);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add("has-site-header", "site-nav-ready");
    return () => {
      document.body.classList.remove("has-site-header", "site-nav-ready", "site-menu-open");
    };
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 980px)");
    const onChange = () => {
      const focusInside = navigation.current?.contains(document.activeElement);
      setMobile(query.matches);
      setMenuOpen(false);
      if (explore.current) explore.current.open = false;
      if (query.matches && focusInside) toggle.current?.focus();
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const open = mobile && menuOpen && !cartOpen;
    document.body.classList.toggle("site-menu-open", open);
    if (navigation.current) {
      navigation.current.inert = mobile && !open;
      if (mobile && !open) navigation.current.setAttribute("aria-hidden", "true");
      else navigation.current.removeAttribute("aria-hidden");
    }
    if (!open && explore.current) explore.current.open = false;
  }, [mobile, menuOpen, cartOpen]);

  useEffect(() => {
    setMenuOpen(false);
    if (explore.current) explore.current.open = false;
  }, [location.pathname, cartOpen]);

  useEffect(() => {
    const closeExplore = (restoreFocus = false) => {
      if (!explore.current?.open) return;
      explore.current.open = false;
      if (restoreFocus) explore.current.querySelector("summary")?.focus();
    };
    const closeMenu = (restoreFocus = false) => {
      setMenuOpen(false);
      closeExplore();
      if (restoreFocus && mobile) toggle.current?.focus();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!explore.current?.contains(event.target)) closeExplore();
      if (menuOpen && !header.current?.contains(event.target)) {
        closeMenu(Boolean(navigation.current?.contains(document.activeElement)));
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (explore.current?.open) {
        event.preventDefault();
        closeExplore(Boolean(explore.current.contains(document.activeElement)));
      } else if (menuOpen) {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const onFocusIn = (event: FocusEvent) => {
      if (!(event.target instanceof Node)) return;
      if (!explore.current?.contains(event.target)) closeExplore();
      if (menuOpen && !header.current?.contains(event.target)) closeMenu();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("focusin", onFocusIn);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("focusin", onFocusIn);
    };
  }, [menuOpen, mobile]);

  const expanded = mobile && menuOpen && !cartOpen;

  return (
    <header className={`site-header${expanded ? " is-menu-open" : ""}`} id="siteHeader" ref={header}>
      <div className="site-header__inner">
        <a className="site-brand" href="/index.html" aria-label="Bee Infinity Groups home">
          <img src="/assets/images/logo/favicon.png" alt="" width="144" height="144" />
          <span className="site-brand__wordmark">Bee Infinity Groups<span>STUDIOZ</span></span>
        </a>
        <button
          className="site-header__toggle"
          id="siteMenuToggle"
          type="button"
          ref={toggle}
          aria-expanded={expanded}
          aria-controls="siteNavigation"
          aria-label={expanded ? "Close navigation" : "Open navigation"}
          onClick={() => setMenuOpen((open) => !open)}
        ><span /><span /></button>
        <nav
          className="site-nav"
          id="siteNavigation"
          aria-label="Main navigation"
          ref={navigation}
          onClick={(event) => {
            if (event.target instanceof Element && event.target.closest("a[href]")) {
              setMenuOpen(false);
              if (explore.current) explore.current.open = false;
            }
          }}
        >
          <a href="/index.html">Home</a>
          <a href="/about.html">About</a>
          <a href="/divisions.html">Divisions</a>
          <a href="/ourservices.html">Services</a>
          <a href="/gallery.html">Gallery</a>
          <a href="/spectrum.html">Spectrum</a>
          <details className="site-explore" id="siteExplore" ref={explore}>
            <summary>Explore <span aria-hidden="true">+</span></summary>
            <div className="site-explore__links">
              <a href="/careers.html">Careers</a>
              <a href="/bigcinemaz.html">Big Cinemaz</a>
              <a href="/AnnouncingSoon.html">BOTD</a>
              <a href="/merch/" aria-current="page">Our Merch</a>
            </div>
          </details>
          <a className="site-contact" href="/contact.html">Let’s talk <span aria-hidden="true">↗</span></a>
        </nav>
      </div>
    </header>
  );
}
