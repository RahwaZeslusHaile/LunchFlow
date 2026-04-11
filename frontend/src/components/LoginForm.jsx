import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, ShieldCheck, Utensils, ChevronRight, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName.trim()) {
      setError("Email is required");
      return;
    }
    if (!password.trim()) {
      setError("Password is required");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data?.message || "Login failed. Please check your credentials.");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.forms) {
        localStorage.setItem("forms", JSON.stringify(data.user.forms));
      }

      if (data.user.roleId === 1) {
        navigate("/admin");
      } else {
        navigate("/volunteer");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      
      {}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-indigo-600/20 rounded-full blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-rose-600/10 rounded-full blur-[100px]"></div>

      <main className="relative z-10 w-full max-w-md">
        
        {}
        <div className="text-center mb-10">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-500/30 mb-6 mx-auto rotate-12 hover:rotate-0 transition duration-500">
            <Utensils size={32} />
          </div>

          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            LunchFlow<span className="text-indigo-500">.</span>
          </h1>

          <p className="text-slate-400 font-medium">
            Smart Lunch Ordering for CYF London
          </p>

          <p className="text-slate-500 text-sm mt-2">
            Manage attendance, coordinate volunteers, and streamline lunch orders—all in one place.
          </p>
        </div>

        {}
        <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">

          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition duration-700 pointer-events-none">
            <ShieldCheck size={120} className="text-white" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            
            {}
            <div>
              <label htmlFor="email" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Email
              </label>

              <div className="relative mt-2">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />

                <input
                  id="email"
                  type="email"
                  value={userName}
                  placeholder="name@codeyourfuture.io"
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-12 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                />
              </div>
            </div>

            {}
            <div>
              <label htmlFor="password" className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">
                Password
              </label>

              <div className="relative mt-2">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-12 py-4 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {}
            {error && (
              <div
                aria-live="polite"
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold"
              >
                {error}
              </div>
            )}

            {}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-4 py-4 text-sm font-bold text-white shadow-lg hover:bg-indigo-500 active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ChevronRight size={18} />
                </>
              )}
            </button>

            {}
            <p className="text-center text-sm text-slate-500 hover:text-white cursor-pointer">
              Forgot your password?
            </p>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500 font-medium">
            Access restricted to authorised CYF London trainees and volunteers.
          </p>
        </div>

        {}
        <p className="mt-12 text-center text-[10px] font-black tracking-[0.3em] uppercase text-slate-700">
          CYF LOGISTIC SYSTEM // LONDON // 2026
        </p>
      </main>
    </div>
  );
}

export default LoginForm;