// 本地存储的收藏管理
const STORAGE_KEY = "autoexport_favorites";

export interface FavoriteVehicle {
  id: string;
  name: string;
  image: string | null;
  price: string;
  category: string;
  addedAt: number;
}

// 获取所有收藏
export function getFavorites(): FavoriteVehicle[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// 添加收藏
export function addFavorite(vehicle: Omit<FavoriteVehicle, "addedAt">): void {
  const favorites = getFavorites();
  const exists = favorites.some((f) => f.id === vehicle.id);
  if (!exists) {
    favorites.push({...vehicle, addedAt: Date.now()});
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new CustomEvent("favoritesChanged"));
  }
}

// 移除收藏
export function removeFavorite(vehicleId: string): void {
  const favorites = getFavorites().filter((f) => f.id !== vehicleId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
}

// 检查是否已收藏
export function isFavorite(vehicleId: string): boolean {
  return getFavorites().some((f) => f.id === vehicleId);
}

// 清空所有收藏
export function clearFavorites(): void {
  localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent("favoritesChanged"));
}
