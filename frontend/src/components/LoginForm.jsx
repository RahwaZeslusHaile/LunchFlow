import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Mail, Lock, ShieldCheck, Utensils, ChevronRight, Eye, EyeOff, Sparkles } from "lucide-react";

function LoginForm() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const isVolunteer = searchParams.get("role") === "volunteer";
  const isNewUser = searchParams.get("new") === "true";

  const theme = useMemo(() => ({
    bg: isVolunteer ? "bg-emerald-950/40" : "bg-indigo-600/20",
    accent: isVolunteer ? "bg-emerald-600" : "bg-indigo-600",
    hover: isVolunteer ? "hover:bg-emerald-500" : "hover:bg-indigo-500",
    ring: isVolunteer ? "focus:ring-emerald-500/10" : "focus:ring-indigo-500/10",
    border: isVolunteer ? "focus:border-emerald-500" : "focus:border-indigo-500",
    text: isVolunteer ? "text-emerald-500" : "text-indigo-500",
    icon: isVolunteer ? <Utensils size={32} /> : <ShieldCheck size={32} />,
    title: isVolunteer ? "Volunteer Portal" : "Admin Portal",
    subtitle: isVolunteer ? "Smart Lunch Coordination" : "Smart Lunch Board"
  }), [isVolunteer]);

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
        setError(data?.message || "Login failed. Please check your email and password.");
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
      <div className={`absolute top-[-20%] left-[-10%] w-[300px] h-[300px] md:w-[600px] md:h-[600px] ${theme.bg} rounded-full blur-[100px] animate-pulse`}></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-rose-600/10 rounded-full blur-[100px]"></div>

      <main className="relative z-10 w-full max-w-md">
        
        {}
        {isNewUser && (
          <div className="mb-8 animate-in fade-in zoom-in duration-500">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Sparkles size={20} className="shrink-0" />
              <div className="text-sm font-semibold">
                Account created successfully! <br/>
                <span className="text-xs font-medium opacity-80">Please log in to access your dashboard.</span>
              </div>
            </div>
          </div>
        )}

        {}
        <div className="text-center mb-10">
          <div className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl ${theme.accent} text-white shadow-xl shadow-slate-950/50 mb-6 mx-auto transition duration-500`}>
            {theme.icon}
          </div>

          <h1 className="text-4xl font-black text-white tracking-tighter mb-2">
            LunchFlow<span className={theme.text}>.</span>
          </h1>

          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
            {theme.title}
          </p>

          <p className="text-slate-500 text-sm mt-3">
            {isVolunteer 
              ? "Access your assigned forms and coordinate with the team." 
              : "Manage attendance, coordinate volunteers, and streamline lunch orders."}
          </p>
        </div>

        {}
        <div className="rounded-[2.5rem] border border-slate-800 bg-slate-900/40 backdrop-blur-2xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">

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
                  className={`w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-12 py-4 text-white placeholder:text-slate-600 focus:ring-4 ${theme.ring} ${theme.border} outline-none transition-all`}
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
                  className={`w-full rounded-2xl border border-slate-800 bg-slate-950/50 px-12 py-4 text-white placeholder:text-slate-600 focus:ring-4 ${theme.ring} ${theme.border} outline-none transition-all`}
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

            {error && (
              <div
                aria-live="polite"
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm font-semibold"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`flex w-full items-center justify-center gap-2 rounded-2xl ${theme.accent} px-4 py-4 text-sm font-bold text-white shadow-lg ${theme.hover} active:scale-[0.98] disabled:opacity-50 transition-all`}
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In to {isVolunteer ? "Volunteer Portal" : "Admin Portal"}
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-slate-500 font-medium">
            Access restricted to authorised CYF London trainees and volunteers.
          </p>
        </div>

        {/* Footer */}
        <p className="mt-12 text-center text-[10px] font-black tracking-[0.3em] uppercase text-slate-700">
          CYF LOGISTIC SYSTEM // LONDON // 2026
        </p>
      </main>
    </div>
  );
}

export default LoginForm;