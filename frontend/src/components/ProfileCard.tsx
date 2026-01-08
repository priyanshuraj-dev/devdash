import { AxiosError } from "axios";
// }: ProfileCardProps) {
//   if (!user) return null;
//   const navigate = useNavigate()
//   const handleAvatarUpload = async (file: {
//     url: string;
//     publicId: string;
//   }) => {
//     try {
//       await api.patch("/api/user/profile", {
//         avatar: file,
//       });
//       toast.success("Profile photo updated");
//       await onAvatarUpdated();
//     } catch(err:any) {
//       if(err?.response?.status == 401){
//         try {
//             await api.post("/api/auth/refresh");
//             await api.patch("api/user/profile",{
//                 avatar: file
//             });
//             toast.success("Profile photo updated");
//             await onAvatarUpdated();
//             return;
//         } catch (error) {
//             navigate("/login")
//             return;
//         }
//       }
//       toast.error("Failed to update avatar");
//     }
//   };

//   return (
//     <div className="max-w-6xl mx-auto bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">

//       {/* Avatar */}
//       <div className="flex-shrink-0">
//         {user.avatar?.url ? (
//           <img
//             src={user.avatar.url}
//             alt="avatar"
//             className="w-28 h-28 rounded-full object-cover border border-white/20"
//           />
//         ) : (
//           <div className="w-28 h-28 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-gray-400">
//             No photo
//           </div>
//         )}
//       </div>

//       {/* Info */}
//       <div className="flex-1 space-y-1 text-center md:text-left">
//         <p className="text-2xl font-semibold">
//           @{user.username}
//         </p>
//         <p className="text-gray-400 text-sm">
//           {user.email}
//         </p>
//         <p className="text-sm">
//           Status:{" "}
//           {user.isVerified ? (
//             <span className="text-teal-400 font-medium">
//               Verified
//             </span>
//           ) : (
//             <span className="text-red-400 font-medium">
//               Not verified
//             </span>
//           )}
//         </p>
//       </div>

//       {/* Actions */}
//       <div className="w-full md:w-auto">
//         <UploadImage
//           currentAvatar={user.avatar?.url}
//           onUploadSuccess={handleAvatarUpload}
//           label="Update avatar"
//         />
//       </div>
//     </div>
//   );
// }



import UploadImage from "./UploadImage";
import api from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { FiShield, FiAlertTriangle, FiMail } from "react-icons/fi";

interface User {
  username: string;
  email: string;
  isVerified: boolean;
  avatar?: { url: string; publicId: string };
}

interface ProfileCardProps {
  user: User | null;
  onAvatarUpdated: () => Promise<void>;
}
// onAvatarUpdated : () => Promise<void>
export default function ProfileCard({ user, onAvatarUpdated }: ProfileCardProps) {
  const navigate = useNavigate();
  if (!user) return null;

  const handleAvatarUpload = async (file: { url: string; publicId: string }) => {
    try {
      await api.patch("/api/user/profile", { avatar: file });
      toast.success("Profile photo updated");
      await onAvatarUpdated();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.status === 401) {
        try {
          await api.post("/api/auth/refresh");
          await api.patch("/api/user/profile", { avatar: file });
          toast.success("Profile photo updated");
          await onAvatarUpdated();
          return;
        } catch {
          navigate("/login");
          return;
        }
      }
      toast.error(err instanceof AxiosError ? err.response?.data?.message : "Failed to update avatar");
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-10 items-center relative z-10">
        
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <UploadImage
            currentAvatar={user.avatar?.url}
            onUploadSuccess={handleAvatarUpload}
            label="Change"
          />
        </div>

        {/* Info Section */}
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
              <h2 className="text-3xl font-black text-white tracking-tight">
                @{user.username}
              </h2>
              {user.isVerified ? (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-teal-500/20 text-teal-400 text-[10px] font-bold uppercase rounded-md border border-teal-500/30">
                  <FiShield size={12} /> Verified
                </div>
              ) : (
                <div className="flex items-center gap-1 px-2 py-0.5 bg-red-500/10 text-red-400 text-[10px] font-bold uppercase rounded-md border border-red-500/20">
                  <FiAlertTriangle size={12} /> Pending
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400">
              <FiMail className="text-teal-500/50" />
              <span className="text-sm font-medium">{user.email}</span>
            </div>
          </div>

          <div className="pt-2">
            <div className="h-1 w-20 bg-gradient-to-r from-teal-500 to-transparent rounded-full mx-auto md:mx-0" />
            <p className="text-[10px] text-gray-500 uppercase font-black tracking-[0.2em] mt-2">
              Portfolio Owner
            </p>
          </div>
        </div>

        {/* Optional: Stats Summary or Quick Link */}
        <div className="hidden lg:block border-l border-white/10 pl-10">
           <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-2">Account Security</p>
           <p className="text-sm text-gray-300">
             {user.isVerified ? "All systems operational" : "Please check your email"}
           </p>
        </div>
      </div>
    </div>
  );
}