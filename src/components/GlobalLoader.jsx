// GlobalLoader.jsx
import { useLoading } from "../context/LoadingContext";

export default function GlobalLoader() {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <progress className="progress progress-warning w-full"></progress>
    </div>
  );
}