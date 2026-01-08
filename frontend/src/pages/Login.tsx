import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiArrowRight, FiActivity } from "react-icons/fi";
import api from "../services/api";
import { loginSchema } from "../utils/validators";

import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";


type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const form = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = form;
  const onSubmit = async (data: LoginForm) => {
    try {
      await api.post("/api/auth/login", {
        identifier: data.email,
        password: data.password,
      });
      const res = await api.post("/api/auth/me");
      // this is done so that it don't create problem on navigating to dashboard, bcz if we don't set user in authContext then it won't hit navigate to dasboard bcz there will no user present here so dashboard can't be reached 
      setUser(res.data.user);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050508] relative overflow-hidden px-4 font-sans">
      
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md">
        
        {/* Brand Logo / Identity */}
        <div className="flex flex-col items-center mb-8">
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-2xl">
                <FiActivity className="text-teal-500 text-3xl" />
            </div>
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
                Dev<span className="text-teal-500">Dash</span>
            </h1>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] mt-2">
                Authentication Portal
            </p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl shadow-black/50">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 text-sm mt-1">Enter your credentials to access the console</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Email Input Group */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="email"
                  placeholder="name@example.com"
                  {...register("email")}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                />
              </div>
              {errors.email && <p className="text-[10px] font-bold text-red-400 mt-1 ml-1 uppercase">{errors.email.message}</p>}
            </div>

            {/* Password Input Group */}
            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Password</label>
                <Link to="/forgot-password"  className="text-[10px] font-black text-teal-500/70 hover:text-teal-400 uppercase tracking-widest transition-colors">
                    Forgot?
                </Link>
              </div>
              <div className="relative group">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-500 transition-colors" />
                <input
                  type="password"
                  placeholder="••••••••"
                  {...register("password")}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
                />
              </div>
              {errors.password && <p className="text-[10px] font-bold text-red-400 mt-1 ml-1 uppercase">{errors.password.message}</p>}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-black font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isSubmitting ? "Authenticating..." : "Establish Session"}
                {!isSubmitting && <FiArrowRight className="group-hover:translate-x-1 transition-transform" />}
              </span>
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-xs font-medium">
              New to the platform?{" "}
              <Link to="/signup" className="text-white hover:text-teal-400 font-bold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}