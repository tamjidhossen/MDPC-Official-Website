import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combine Tailwind CSS classes with clsx
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Get the full URL for an image path
 * @param {string} path - The relative image path
 * @returns {string} The full image URL
 */
export function getImageUrl(path) {
  // Return the path as is if it's already a full URL or a data URL or if it's null/undefined
  if (!path || path.startsWith("http") || path.startsWith("data:")) {
    return path;
  }

  // Get backend base URL from environment variable (without the /api/v1/ part)
  const backendBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

  // For paths starting with /uploads, we need to ensure they point to the backend
  if (path.startsWith("/uploads")) {
    // Remove any potential /api/v1 prefix if it exists
    const cleanPath = path.replace("/api/v1", "");
    return `${backendBaseUrl}${cleanPath}`;
  }

  return path;
}
