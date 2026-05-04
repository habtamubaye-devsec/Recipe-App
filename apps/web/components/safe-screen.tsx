import type { ReactNode } from "react";

type SafeScreenProps = {
  children: ReactNode;
  className?: string;
};

export default function SafeScreen({ children, className = "" }: SafeScreenProps) {
  return <main className={`mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${className}`}>{children}</main>;
}
