import { Link, NavLink } from "react-router-dom";
import { useCart } from "../state/cart";
import { useAuth } from "../state/auth";
import SiteHeader from "./SiteHeader";

export default function Navbar() {
  const cart = useCart();
  const auth = useAuth();

  return (
    <div className="merch-site-navigation">
      <SiteHeader cartOpen={cart.open} />
      <div className="shop-utility">
        <div className="shop-utility__inner">
          <nav className="shop-links" aria-label="Merch navigation">
            <NavLink to="/" end>Showroom</NavLink>
            <NavLink to="/products">Products</NavLink>
          </nav>
          <div className="shop-actions">
            <div className="shop-account">
              {auth.user ? (
                <span title={auth.user.username}>
                  Signed in as <strong>{auth.user.username}</strong>
                </span>
              ) : (
                <span>Guest</span>
              )}
            </div>
            {!auth.user ? (
              <Link className="shop-action" to="/auth">Login</Link>
            ) : (
              <button className="shop-action" type="button" onClick={() => auth.logout()}>Logout</button>
            )}
            <button
              className="shop-action shop-action--cart"
              type="button"
              onClick={() => cart.toggle(true)}
              aria-label={`Open cart, ${cart.count} ${cart.count === 1 ? "item" : "items"}`}
            >Cart <span className="shop-cart-count" aria-hidden="true">{cart.count}</span></button>
          </div>
        </div>
      </div>
    </div>
  );
}

