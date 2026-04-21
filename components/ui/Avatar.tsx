import { cn, getInitials } from "@/lib/utils";
import Image from "next/image";

interface AvatarProps {
  name: string;
  src?: string | null;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { container: "w-8 h-8",  text: "text-xs" },
  md: { container: "w-10 h-10", text: "text-sm" },
  lg: { container: "w-14 h-14", text: "text-base" },
  xl: { container: "w-20 h-20", text: "text-xl" },
};

export default function Avatar({ name, src, size = "md", className }: AvatarProps) {
  const { container, text } = sizeMap[size];
  return (
    <div className={cn("rounded-full overflow-hidden flex items-center justify-center bg-gradient-to-br from-primary-500 to-primary-700 text-white font-semibold flex-shrink-0", container, className)}>
      {src ? (
        <Image src={src} alt={name} fill className="object-cover" />
      ) : (
        <span className={text}>{getInitials(name)}</span>
      )}
    </div>
  );
}
