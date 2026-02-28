import { useFavorites } from "../context/FavoritesContext";

export default function FavoriteToast() {
  const { notification } = useFavorites();

  if (!notification) return null;

  return (
    <div className="
      fixed
      bottom-6
      left-1/2
      -translate-x-1/2
      sm:bottom-8
      sm:right-8
      sm:left-auto
      sm:translate-x-0
      z-50
    ">
      <div className="alert alert-success shadow-lg animate-fadeIn">
        <span>{notification}</span>
      </div>
    </div>
  );
}