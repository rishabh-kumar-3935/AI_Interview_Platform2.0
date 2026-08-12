import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axiosInstance from "../api/axios";
import { Loader2, User, Mail, CalendarCheck, Sparkles } from "lucide-react";

function Profile() {
  const auth = useSelector((state) => state.auth);
  const [user, setUser] = useState(auth.userData);
  const [loading, setLoading] = useState(!auth.userData);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (auth.userData) {
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await axiosInstance.get("/api/v1/users/current-user");
        setUser(response.data?.data || null);
      } catch (err) {
        setError("Unable to load profile data.");
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, [auth.userData]);

  const createdAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : "Not available";

  const updatedAt = user?.updatedAt
    ? new Date(user.updatedAt).toLocaleDateString()
    : "Not available";

  const accountStatus = auth.status ? "Active" : "Not logged in";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090B] flex items-center justify-center text-white px-6 py-12">
        <Loader2 className="animate-spin mr-3" />
        Loading profile...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-8 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-green-500/10 text-green-400">
              <User size={28} />
            </div>
            <div>
              <h1 className="text-4xl font-bold">Profile</h1>
              <p className="text-zinc-400 mt-2">Your account information and profile details.</p>
            </div>
          </div>
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/10 p-6 text-red-200">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="flex items-center gap-3 text-zinc-300 mb-6">
              <Sparkles size={20} className="text-green-400" />
              <span className="font-semibold">Account summary</span>
            </div>
            <div className="space-y-5 text-sm text-zinc-300">
              <div className="rounded-3xl bg-zinc-950/80 p-5">
                <p className="text-zinc-500 uppercase text-[11px] tracking-[0.2em]">Full name</p>
                <p className="mt-2 text-lg font-semibold text-white">{user?.fullName || "—"}</p>
              </div>
              <div className="rounded-3xl bg-zinc-950/80 p-5">
                <p className="text-zinc-500 uppercase text-[11px] tracking-[0.2em]">Username</p>
                <p className="mt-2 text-lg font-semibold text-white">{user?.username || "—"}</p>
              </div>
              <div className="rounded-3xl bg-zinc-950/80 p-5">
                <p className="text-zinc-500 uppercase text-[11px] tracking-[0.2em]">Email</p>
                <p className="mt-2 text-lg font-semibold text-white">{user?.email || "—"}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
            <div className="flex items-center gap-3 text-zinc-300 mb-6">
              <CalendarCheck size={20} className="text-blue-400" />
              <span className="font-semibold">Account details</span>
            </div>
            <div className="space-y-5 text-sm text-zinc-300">
              <div className="rounded-3xl bg-zinc-950/80 p-5">
                <p className="text-zinc-500 uppercase text-[11px] tracking-[0.2em]">Account status</p>
                <p className="mt-2 text-lg font-semibold text-white">{accountStatus}</p>
              </div>
              <div className="rounded-3xl bg-zinc-950/80 p-5">
                <p className="text-zinc-500 uppercase text-[11px] tracking-[0.2em]">Member since</p>
                <p className="mt-2 text-lg font-semibold text-white">{createdAt}</p>
              </div>
              <div className="rounded-3xl bg-zinc-950/80 p-5">
                <p className="text-zinc-500 uppercase text-[11px] tracking-[0.2em]">Last updated</p>
                <p className="mt-2 text-lg font-semibold text-white">{updatedAt}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Security & profile guidance</h2>
              <p className="text-zinc-400 mt-2">
                Passwords are never shown here. Use the settings page to change your password and keep your account secure.
              </p>
            </div>
            <div className="rounded-3xl bg-zinc-950/80 px-4 py-3 text-sm text-zinc-300">
              <p className="font-semibold text-white">Profile completeness</p>
              <p className="mt-1">Display name, email, and username are visible.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
