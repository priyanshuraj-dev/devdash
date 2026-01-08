import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (!token) {
      toast.error("Invalid verification link");
      navigate("/login");
      return;
    }
    api.get(`/api/auth/verify-email?token=${token}`)
      .then(() => {
        toast.success("Email verified successfully");
        navigate("/login");
      })
      .catch(() => {
        toast.error("Verification link expired or invalid");
        navigate("/login");
      });
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0A0A10] text-white">
      Verifying your email...
    </div>
  );
}
