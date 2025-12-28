"use client";

import {useState, useEffect} from "react";
import {Heart} from "lucide-react";
import {addFavorite, removeFavorite, isFavorite, type FavoriteVehicle} from "@/lib/favorites";

interface FavoriteButtonProps {
  vehicle: Omit<FavoriteVehicle, "addedAt">;
  size?: "sm" | "md" | "lg";
}

export function FavoriteButton({vehicle, size = "md"}: FavoriteButtonProps) {
  const [favorited, setFavorited] = useState(false);

  useEffect(() => {
    setFavorited(isFavorite(vehicle.id));

    const handleChange = () => setFavorited(isFavorite(vehicle.id));
    window.addEventListener("favoritesChanged", handleChange);
    return () => window.removeEventListener("favoritesChanged", handleChange);
  }, [vehicle.id]);

  const toggleFavorite = () => {
    if (favorited) {
      removeFavorite(vehicle.id);
    } else {
      addFavorite(vehicle);
    }
  };

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`group rounded-full border border-white/10 bg-black/40 p-2 backdrop-blur transition hover:border-red-400 hover:bg-red-500/20 ${
        favorited ? "border-red-400 bg-red-500/20" : ""
      }`}
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`${sizeClasses[size]} transition ${
          favorited ? "fill-red-400 text-red-400" : "text-white group-hover:text-red-400"
        }`}
      />
    </button>
  );
}
