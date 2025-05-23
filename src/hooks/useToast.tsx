
import { toast as sonnerToast } from "sonner";

type ToastVariant = "success" | "error" | "info";

type ToastProps = {
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
};

const variantStyles: Record<ToastVariant, string> = {
  success: "bg-green-100 text-green-800 border-l-3 border-green-500",
  error: "bg-red-100 text-red-800 border-l-3 border-red-500",
  info: "bg-blue-100 text-blue-800 border-l-3 border-blue-500",
};

const useToast = () => {
  const showToast = ({
    title,
    description,
    variant = "info",
    duration = 3000,
  }: ToastProps) => {
    const style = variantStyles[variant];

    return sonnerToast.custom(
      () => (
        <div
          className={`p-2 rounded-md shadow-md ${style} w-full max-w-sm`}
        >
          <div className="font-semibold">{title}</div>
          {description && <div className="text-sm mt-1">{description}</div>}
        </div>
      ),
      {
        duration,
        position: "top-right",
      }
    );
  };

  const success = (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "success", duration });

  const error = (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "error", duration });

  const info = (title: string, description?: string, duration?: number) =>
    showToast({ title, description, variant: "info", duration });

  return {
    success,
    error,
    info,
    dismiss: sonnerToast.dismiss,
  };
};

export default useToast;
