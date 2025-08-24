'use client';

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, ArrowRight, Shield, Zap, Sparkles } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function PremiumLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      
      localStorage.setItem("token", res.data.tokens);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      router.push("/drive");
    } catch (err: any) {
      console.log(err);
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  // Floating icons
  const floatingIcons = [
    { icon: Shield, delay: 0, x: "10%", y: "20%" },
    { icon: Zap, delay: 2, x: "85%", y: "15%" },
    { icon: Sparkles, delay: 4, x: "15%", y: "75%" },
    { icon: Sparkles, delay: 1, x: "90%", y: "80%" },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6, staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20 animate-pulse" />
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
        />
        {floatingIcons.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 0], y: [0, -20, 0] }}
            transition={{ duration: 3, repeat: Infinity, delay: item.delay, ease: "easeInOut" }}
            className="absolute"
            style={{ left: item.x, top: item.y }}
          >
            <item.icon className="w-6 h-6 text-white/20" />
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="w-full max-w-md">
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-8">
            <motion.div 
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/25 mx-auto">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-black bg-gradient-to-r from-white via-blue-200 to-purple-200 bg-clip-text text-transparent mb-2">Welcome Back</h1>
            <p className="text-gray-400">Access your premium cloud experience</p>
          </motion.div>

          {/* Login Card */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200" />
            <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-8 shadow-2xl">
              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-300 text-sm flex items-center gap-2"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <form className="space-y-6" onSubmit={handleLogin}>
                {/* Email */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Email Address</label>
                  <div className="relative flex items-center">
                    <Mail className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-blue-400/50 focus:bg-white/10 outline-none transition-all duration-300 hover:bg-white/10"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password */}
                <motion.div variants={itemVariants} className="relative">
                  <label className="block text-gray-300 text-sm font-semibold mb-2">Password</label>
                  <div className="relative flex items-center">
                    <Lock className="absolute left-4 w-5 h-5 text-gray-400 z-10" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:border-purple-400/50 focus:bg-white/10 outline-none transition-all duration-300 hover:bg-white/10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 text-gray-400 hover:text-white transition-colors z-10"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </motion.div>

                {/* Login Button */}
                <motion.div variants={itemVariants}>
                  <motion.button
                    type="submit"
                    disabled={isLoading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full relative group overflow-hidden rounded-xl p-4 font-bold text-white shadow-2xl shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 opacity-100 transition-opacity" />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <AnimatePresence>
                      {isLoading && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className={`relative flex items-center justify-center gap-2 transition-opacity ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                      Sign In
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.button>
                </motion.div>
              </form>

              {/* Register Link */}
              <motion.div variants={itemVariants} className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don't have an account?{" "}
                  <span 
                    className="text-blue-400 hover:text-blue-500 font-semibold cursor-pointer"
                    onClick={() => router.push("/auth/register")}
                  >
                    Register
                  </span>
                </p>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

