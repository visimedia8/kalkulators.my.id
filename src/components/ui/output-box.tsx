"use client";

import * as React from "react";
import CountUp from "react-countup";
import { cn } from "@/lib/utils";

interface OutputBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
}

const OutputBox = React.forwardRef<HTMLDivElement, OutputBoxProps>(
  ({ className, label, value, prefix = "", suffix = "", decimals = 0, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-start justify-center p-6 rounded-2xl border border-[rgba(99,102,241,0.3)] bg-gradient-to-br from-[rgba(99,102,241,0.08)] to-[rgba(99,102,241,0.02)]",
          className
        )}
        {...props}
      >
        <span className="text-secondary text-[13px] font-sans mb-1">{label}</span>
        <div className="font-mono text-4xl font-semibold text-primary">
          {prefix}
          <CountUp end={value} decimals={decimals} duration={1.5} separator="." decimal="," />
          {suffix}
        </div>
      </div>
    );
  }
);

OutputBox.displayName = "OutputBox";

export { OutputBox };
