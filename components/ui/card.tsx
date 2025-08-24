"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { motion, type HTMLMotionProps } from "framer-motion";
import { cva, type VariantProps } from "class-variance-authority";
import { Sparkles, Zap, Star, Crown } from "lucide-react";

// Card variants for different styles and effects
const cardVariants = cva(
  "rounded-xl border backdrop-blur-sm transition-all duration-300 relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: 
          "bg-white/90 dark:bg-slate-900/90 border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md",
        elevated: 
          "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl",
        glass: 
          "bg-white/60 dark:bg-slate-900/60 border-white/20 dark:border-slate-700/50 shadow-lg backdrop-blur-md",
        gradient: 
          "bg-gradient-to-br from-white via-slate-50 to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700 border-slate-200/50 dark:border-slate-600/50 shadow-lg",
        premium: 
          "bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-amber-900/20 dark:via-slate-900 dark:to-orange-900/20 border-amber-200 dark:border-amber-700/50 shadow-lg shadow-amber-500/10",
        success: 
          "bg-gradient-to-br from-green-50 via-white to-emerald-50 dark:from-green-900/20 dark:via-slate-900 dark:to-emerald-900/20 border-green-200 dark:border-green-700/50 shadow-lg shadow-green-500/10",
        warning: 
          "bg-gradient-to-br from-orange-50 via-white to-yellow-50 dark:from-orange-900/20 dark:via-slate-900 dark:to-yellow-900/20 border-orange-200 dark:border-orange-700/50 shadow-lg shadow-orange-500/10",
        danger: 
          "bg-gradient-to-br from-red-50 via-white to-pink-50 dark:from-red-900/20 dark:via-slate-900 dark:to-pink-900/20 border-red-200 dark:border-red-700/50 shadow-lg shadow-red-500/10",
        info: 
          "bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-blue-900/20 dark:via-slate-900 dark:to-cyan-900/20 border-blue-200 dark:border-blue-700/50 shadow-lg shadow-blue-500/10",
        glow: 
          "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 shadow-2xl shadow-blue-500/25 hover:shadow-blue-500/40",
      },
      size: {
        sm: "p-3",
        default: "p-4",
        lg: "p-6",
        xl: "p-8",
      },
      interactive: {
        none: "",
        hover: "hover:scale-[1.02] cursor-pointer",
        press: "hover:scale-[1.02] active:scale-[0.98] cursor-pointer",
        float: "hover:-translate-y-1 cursor-pointer",
      },
      border: {
        none: "border-0",
        default: "",
        thick: "border-2",
        dashed: "border-2 border-dashed",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      interactive: "none",
      border: "default",
    },
  }
);

const headerVariants = cva(
  "border-b transition-colors duration-200",
  {
    variants: {
      variant: {
        default: "border-slate-200 dark:border-slate-700 pb-3 mb-3",
        minimal: "border-0 pb-2 mb-4",
        accent: "border-blue-200 dark:border-blue-800 pb-3 mb-3",
        gradient: "border-0 pb-3 mb-3 bg-gradient-to-r from-transparent via-slate-200/50 to-transparent dark:via-slate-700/50 bg-[length:100%_1px] bg-bottom bg-no-repeat",
      },
      size: {
        sm: "px-3 py-2",
        default: "px-4 py-3",
        lg: "px-6 py-4",
        xl: "px-8 py-5",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const titleVariants = cva(
  "font-semibold leading-tight tracking-tight flex items-center",
  {
    variants: {
      size: {
        sm: "text-sm",
        default: "text-lg",
        lg: "text-xl",
        xl: "text-2xl",
      },
      variant: {
        default: "text-slate-900 dark:text-slate-100",
        muted: "text-slate-600 dark:text-slate-400",
        accent: "text-blue-600 dark:text-blue-400",
        premium: "bg-gradient-to-r from-amber-600 to-orange-600 dark:from-amber-400 dark:to-orange-400 bg-clip-text text-transparent",
        success: "text-green-600 dark:text-green-400",
        warning: "text-orange-600 dark:text-orange-400",
        danger: "text-red-600 dark:text-red-400",
      }
    },
    defaultVariants: {
      size: "default",
      variant: "default",
    },
  }
);

// Extended Card Props
interface CardProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof cardVariants> {
  glow?: boolean;
  shine?: boolean;
  animated?: boolean;
  loading?: boolean;
  ripple?: boolean;
}

interface CardHeaderProps extends 
  React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof headerVariants> {
  icon?: React.ReactNode;
  action?: React.ReactNode;
  subtitle?: string;
}

interface CardTitleProps extends 
  React.HTMLAttributes<HTMLHeadingElement>,
  VariantProps<typeof titleVariants> {
  icon?: React.ReactNode;
  badge?: React.ReactNode;
}

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "default" | "lg" | "xl";
}

// Ripple effect hook
const useRipple = () => {
  const [ripples, setRipples] = React.useState<Array<{ id: number; x: number; y: number }>>([]);

  const addRipple = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const id = Date.now();

    setRipples(prev => [...prev, { id, x, y }]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== id));
    }, 800);
  }, []);

  return { ripples, addRipple };
};

// Loading skeleton component
const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("rounded-xl border bg-slate-100 dark:bg-slate-800 animate-pulse", className)}>
    <div className="p-4 border-b border-slate-200 dark:border-slate-700">
      <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
    </div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-5/6"></div>
      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-4/6"></div>
    </div>
  </div>
);

// Motion Card for enhanced animations
const MotionCard = React.forwardRef<HTMLDivElement, CardProps & HTMLMotionProps<"div">>(
  ({ 
    className, 
    variant, 
    size, 
    interactive, 
    border, 
    glow = false, 
    shine = false, 
    animated = false, 
    loading = false,
    ripple = false,
    children,
    onClick,
    ...props 
  }, ref) => {
    const { ripples, addRipple } = useRipple();

    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (ripple) {
        addRipple(event);
      }
      if (onClick) {
        onClick(event);
      }
    }, [ripple, addRipple, onClick]);

    if (loading) {
      return <CardSkeleton className={className} />;
    }

    return (
      <motion.div
        ref={ref}
        className={cn(cardVariants({ variant, size, interactive, border }), className)}
        onClick={handleClick}
        whileHover={animated ? { y: -4, scale: 1.02 } : undefined}
        whileTap={interactive === "press" ? { scale: 0.98 } : undefined}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        {...props}
      >
        {/* Glow effect */}
        {glow && (
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition duration-300" />
        )}

        {/* Shine effect */}
        {shine && (
          <div className="absolute inset-0 rounded-xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
          </div>
        )}

        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Ripple effects */}
        {ripple && ripples.map(ripple => (
          <motion.span
            key={ripple.id}
            className="absolute bg-slate-400/30 rounded-full pointer-events-none z-20"
            style={{
              left: ripple.x - 15,
              top: ripple.y - 15,
              width: 30,
              height: 30,
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ scale: 6, opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        ))}
      </motion.div>
    );
  }
);
MotionCard.displayName = "MotionCard";

// Main Card component
const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ 
    className, 
    variant, 
    size, 
    interactive, 
    border, 
    glow = false, 
    shine = false, 
    animated = false, 
    loading = false,
    ripple = false,
    children,
    ...props 
  }, ref) => {
    // Use motion card for enhanced features
    if (glow || shine || animated || ripple || interactive !== "none") {
      return (
        <MotionCard
          ref={ref}
          className={className}
          variant={variant}
          size={size}
          interactive={interactive}
          border={border}
          glow={glow}
          shine={shine}
          animated={animated}
          loading={loading}
          ripple={ripple}
          {...props}
        >
          {children}
        </MotionCard>
      );
    }

    if (loading) {
      return <CardSkeleton className={className} />;
    }

    // Regular card for basic use cases
    return (
      <div
        ref={ref}
        className={cn(cardVariants({ variant, size, interactive, border }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
Card.displayName = "Card";

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, variant, size, icon, action, subtitle, children, ...props }, ref) => (
    <div 
      ref={ref} 
      className={cn(headerVariants({ variant, size }), "flex items-center justify-between", className)} 
      {...props}
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          {icon && <span className="flex-shrink-0">{icon}</span>}
          <div className="min-w-0 flex-1">
            {children}
            {subtitle && (
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
      {action && (
        <div className="flex-shrink-0 ml-4">
          {action}
        </div>
      )}
    </div>
  )
);
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, size, variant, icon, badge, children, ...props }, ref) => (
    <h3
      ref={ref}
      className={cn(titleVariants({ size, variant }), "space-x-2", className)}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </h3>
  )
);
CardTitle.displayName = "CardTitle";

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "px-3 py-2",
      default: "px-4 py-3",
      lg: "px-6 py-4",
      xl: "px-8 py-5",
    };

    return (
      <div 
        ref={ref} 
        className={cn(sizeClasses[size], "text-slate-600 dark:text-slate-300", className)} 
        {...props} 
      />
    );
  }
);
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50", className)}
      {...props}
    />
  )
);
CardFooter.displayName = "CardFooter";

// Premium Card variants for specific use cases
const PremiumCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card 
      ref={ref} 
      variant="premium" 
      glow 
      shine 
      animated 
      interactive="hover"
      {...props}
    >
      {children}
    </Card>
  )
);
PremiumCard.displayName = "PremiumCard";

const GlassCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card 
      ref={ref} 
      variant="glass" 
      animated 
      interactive="float"
      {...props}
    >
      {children}
    </Card>
  )
);
GlassCard.displayName = "GlassCard";

const InteractiveCard = React.forwardRef<HTMLDivElement, CardProps>(
  ({ children, ...props }, ref) => (
    <Card 
      ref={ref} 
      interactive="press" 
      ripple 
      animated 
      {...props}
    >
      {children}
    </Card>
  )
);
InteractiveCard.displayName = "InteractiveCard";

const StatCard = React.forwardRef<HTMLDivElement, { title: string; value: string | number; icon?: React.ReactNode; trend?: "up" | "down" | "neutral"; trendValue?: string; className?: string }>(
  ({ title, value, icon, trend, trendValue, className, ...props }, ref) => {
    const trendColors = {
      up: "text-green-600 dark:text-green-400",
      down: "text-red-600 dark:text-red-400",
      neutral: "text-slate-600 dark:text-slate-400",
    };

    return (
      <Card ref={ref} variant="elevated" animated interactive="hover" className={className} {...props}>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-1">
                {title}
              </p>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {value}
              </p>
              {trend && trendValue && (
                <p className={cn("text-sm mt-1", trendColors[trend])}>
                  {trendValue}
                </p>
              )}
            </div>
            {icon && (
              <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900/30">
                {icon}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }
);
StatCard.displayName = "StatCard";

export { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardFooter,
  PremiumCard,
  GlassCard,
  InteractiveCard,
  StatCard,
  cardVariants 
};