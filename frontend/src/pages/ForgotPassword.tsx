import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FiMail, FiSend, FiActivity, FiChevronLeft } from "react-icons/fi";

import api from "../services/api";
import { forgotPasswordSchema } from "../utils/validators";

type Form = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const form = useForm<Form>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const { register, handleSubmit, formState: { errors, isSubmitting } } = form;

  const onSubmit = async (data: Form) => {
    try {
      await api.post("/api/auth/forgot-password", data);
      toast.success("If an account exists, a reset link has been sent");
      form.reset();
    } catch {
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-[#050508] relative overflow-hidden px-4 font-sans pt-16 pb-12">
      
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[120px]" />

      {/* Brand Identity */}
      <div className="relative z-10 flex flex-col items-center mb-12 animate-in fade-in slide-in-from-top-4 duration-1000">
          <div className="p-4 bg-white/5 border border-white/10 rounded-2xl mb-4 shadow-2xl backdrop-blur-md">
              <FiActivity className="text-teal-500 text-3xl" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
              Dev<span className="text-teal-500">Dash</span>
          </h1>
          <p className="text-gray-500 text-[10px] font-bold uppercase tracking-[0.4em] mt-3">
              Security Protocol: Access Recovery
          </p>
      </div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-[440px] bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl shadow-black/50">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-white tracking-tight">Recover Access</h2>
          <p className="text-gray-500 text-sm mt-2 italic opacity-80">We'll dispatch a secure recovery link</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Email Input Group */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Registered Email</label>
            <div className="relative group">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-teal-500 transition-colors" />
              <input
                type="email"
                placeholder="developer@domain.com"
                {...register("email")}
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-all"
              />
            </div>
            {errors.email && (
              <p className="text-[10px] font-bold text-red-400 mt-1 ml-1 uppercase">
                {errors.email.message}
              </p>
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="group relative w-full py-4 rounded-2xl bg-teal-500 hover:bg-teal-400 text-black font-black uppercase tracking-widest transition-all shadow-lg shadow-teal-500/20 disabled:opacity-50 overflow-hidden"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isSubmitting ? "Dispatching..." : "Send Reset Link"}
              {!isSubmitting && <FiSend className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
            </span>
          </button>
        </form>

        <div className="mt-8 text-center pt-8 border-t border-white/5">
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 text-gray-500 text-xs font-medium hover:text-white transition-colors"
          >
            <FiChevronLeft /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}