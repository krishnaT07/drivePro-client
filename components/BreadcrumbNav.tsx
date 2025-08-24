"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function BreadcrumbNav({ path }: { path: { id: string; name: string }[] }) {
  return (
    <motion.nav
      className="flex items-center text-sm text-gray-600 dark:text-gray-300 mb-4"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      {path.map((item, i) => (
        <div key={item.id} className="flex items-center">
          <Link
            href={i === 0 ? "/drive" : `/drive/${item.id}`}
            className="hover:underline hover:text-blue-600"
          >
            {item.name}
          </Link>
          {i < path.length - 1 && <ChevronRight className="h-4 w-4 mx-1" />}
        </div>
      ))}
    </motion.nav>
  );
}
