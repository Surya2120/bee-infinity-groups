import { useState } from "react";
import { useNavigate } from "react-router-dom";
import GlassPanel from "../components/GlassPanel";
import GoldButton from "../components/GoldButton";
import { useAuth } from "../state/auth";

export default function Auth() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit() {
    setErr(null);
    setLoading(true);
    try {
      if (mode === "login") await auth.login(email, password);
      else await auth.register(username, email, password);
      navigate("/products");
    } catch (e: any) {
      setErr(e?.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="mx-auto max-w-lg">
        <GlassPanel className="p-6 md:p-8">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-xs tracking-[0.44em] text-gold-200/70">ACCESS</div>
              <div className="mt-2 text-2xl font-semibold text-white/95">{mode === "login" ? "Login" : "Create Account"}</div>
            </div>
            <button
              className="text-sm text-white/60 hover:text-white"
              onClick={() => setMode((m) => (m === "login" ? "register" : "login"))}
            >
              Switch to {mode === "login" ? "Register" : "Login"}
            </button>
          </div>

          {err ? <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">{err}</div> : null}

          <div className="mt-6 space-y-3">
            {mode === "register" ? (
              <Field label="Username">
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none focus:border-gold-500/40"
                  placeholder="BeeFan"
                />
              </Field>
            ) : null}
            <Field label="Email">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none focus:border-gold-500/40"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Password">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white/90 outline-none focus:border-gold-500/40"
                placeholder="Minimum 8 characters"
              />
            </Field>
          </div>

          <div className="mt-6">
            <GoldButton className="w-full" disabled={loading} onClick={submit}>
              {loading ? "Please wait..." : mode === "login" ? "Login" : "Create Account"}
            </GoldButton>
            <div className="mt-3 text-center text-xs text-white/50">
              JWT session is persisted locally for a smooth showroom return.
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="mb-1 text-xs tracking-wide text-white/60">{label}</div>
      {children}
    </label>
  );
}

