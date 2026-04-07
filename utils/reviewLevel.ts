export interface ReviewLevel {
  emoji: string;
  label: string;
  bg: string;
  text: string;
}

export function getReviewLevel(count: number): ReviewLevel | null {
  if (count >= 25) return { emoji: "🏆", label: "Super Ambasador",   bg: "bg-yellow-100", text: "text-yellow-700" };
  if (count >= 10) return { emoji: "⭐", label: "Ambasador Sibiu",    bg: "bg-orange-100", text: "text-orange-700" };
  if (count >= 3)  return { emoji: "🏅", label: "Local Expert",       bg: "bg-blue-100",   text: "text-blue-700"   };
  if (count >= 1)  return { emoji: "🗺️", label: "Local Explorer",    bg: "bg-green-100",  text: "text-green-700"  };
  return null;
}
