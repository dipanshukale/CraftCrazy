import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../AuthContext/AuthContext";
import { getApiUrl } from "../utils/apiConfig";

interface LoginResponse {
  token: string;
  user: {
    name: string;
    email: string;
  };
}

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const emailRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { login } = useAuth();

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(getApiUrl('api/auth/login'), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse & { message?: string } = await res.json();

      // SUCCESS
      if (res.ok && data.token) {
        login(data.user, data.token);

        toast.success(`Welcome Back, ${data.user?.name}!`);

        // wait for toast to close
        setTimeout(() => navigate("/"), 2200);

        return;
      }

      // FAILURE
      toast.error(data.message || "Invalid Credentials");
      setError(data.message || "Invalid Credentials");

    } catch (err) {
      console.error(err);
      setError("Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-2xl p-6 sm:p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-5">
          <img
            src={"/Logo.jpeg"}
            alt="CraftiCrazy Logo"
            className="w-24 h-24 rounded-full object-cover shadow-md border-2 border-amber-400"
          />
          <h1 className="mt-3 text-xl sm:text-2xl font-bold text-amber-600 text-center">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 text-center">
            Please login to continue to{" "}
            <span className="font-semibold text-amber-700">CraftiCrazy</span>
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="mt-5 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-medium text-sm sm:text-base">
              Email
            </label>
            <div className="relative mt-1">
              <Mail className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                ref={emailRef}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium text-sm sm:text-base">
              Password
            </label>
            <div className="relative mt-1">
              <Lock className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="password"
                required
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs sm:text-sm text-amber-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex items-center cursor-pointer justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg shadow-md transition text-sm sm:text-base ${
              loading ? "opacity-60 cursor-not-allowed" : ""
            }`}
          >
            <LogIn size={18} />
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-2 my-5">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="text-xs sm:text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-center text-gray-600 mt-4 text-xs sm:text-sm">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-amber-600 font-semibold hover:underline"
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
