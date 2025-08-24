"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, 
  Shield, 
  Zap, 
  Users, 
  ArrowRight, 
  CheckCircle, 
  Star,
  Globe,
  Lock,
  Smartphone,
  Monitor,
  Sparkles
} from "lucide-react";

export default function HomePage() {
  const { user, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  

  useEffect(() => {
    if (authLoading) return; // Wait for auth to load

    const redirect = async () => {
      setIsRedirecting(true);
      
      // Small delay for smooth animation
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (user) {
        router.push("/drive");
      } else {
        router.push("/auth/login");
      }
    };

    redirect();
  }, [user, authLoading, router]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 flex items-center justify-center">
        <motion.div 
          className="text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Cloud className="w-8 h-8 text-white" />
          </motion.div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">
              Initializing your workspace
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              Connecting to your cloud drive...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Premium landing experience while redirecting
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-blue-600/20 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1.1, 1, 1.1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div 
          className="text-center max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Logo/Brand Section */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-6">
              <motion.div 
                className="p-3 rounded-2xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
                whileHover={{ scale: 1.05, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Cloud className="w-8 h-8 text-white" />
              </motion.div>
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                CloudDrive
              </h1>
            </div>
          </motion.div>

          {/* Hero Content */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-slate-800 dark:text-slate-200">
              Your Premium Cloud Experience
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Secure, fast, and intelligent cloud storage designed for the modern digital lifestyle. 
              Access your files anywhere, anytime, with enterprise-grade security.
            </p>
          </motion.div>

          {/* Feature Highlights */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {[
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade encryption keeps your data safe"
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Optimized performance for instant access"
              },
              {
                icon: Globe,
                title: "Global Access",
                description: "Your files available anywhere in the world"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="p-6 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-white/20 dark:border-slate-700/50"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
                whileHover={{ 
                  scale: 1.05,
                  y: -5,
                  transition: { type: "spring", stiffness: 300 }
                }}
              >
                <feature.icon className="w-8 h-8 text-blue-500 mb-4 mx-auto" />
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Loading/Redirect State */}
          <AnimatePresence>
            {isRedirecting && (
              <motion.div
                className="mt-12 space-y-6"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-center space-x-3">
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-500"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-6 h-6 rounded-full bg-gradient-to-r from-pink-500 to-blue-500"
                    animate={{ 
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7]
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                
                <div className="space-y-2">
                  <p className="text-lg font-medium text-slate-800 dark:text-slate-200">
                    {user ? "Taking you to your drive..." : "Redirecting to login..."}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Preparing your premium experience
                  </p>
                </div>

                {/* Progress bar */}
                <div className="w-64 h-1 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mx-auto">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2, ease: "easeInOut" }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Action Button - if needed */}
          {!isRedirecting && (
            <motion.button
              className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center space-x-2 mx-auto"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(user ? "/drive" : "/auth/login")}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <span>{user ? "Open Drive" : "Get Started"}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}

          {/* Subtle branding footer */}
          <motion.div
            className="mt-16 opacity-60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Powered by advanced cloud technology • Trusted by thousands
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles for extra premium feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 6 + Math.random() * 4,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>
    </div>
  );
}