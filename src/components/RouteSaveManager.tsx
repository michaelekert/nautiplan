import { useState, useEffect } from "react";
import { Save, FolderOpen, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { SavedRoute } from "../hooks/useRouteSave";

interface RouteSaveManagerProps {
  onSave: (name: string) => void;
  onLoad: (routeId: string) => void;
  onDelete: (routeId: string) => void;
  getSavedRoutes: () => SavedRoute[];
  hasActiveRoute: boolean;
}

interface Notification {
  id: number;
  type: "success" | "error" | "info";
  message: string;
}

export function RouteSaveManager({
  onSave,
  onLoad,
  onDelete,
  getSavedRoutes,
  hasActiveRoute,
}: RouteSaveManagerProps) {
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [routeName, setRouteName] = useState("");
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null);

  const refreshRoutes = () => {
    setSavedRoutes(getSavedRoutes());
  };

  useEffect(() => {
    refreshRoutes();
  }, []);

  const addNotification = (message: string, type: Notification["type"] = "info") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  };

  const handleSave = () => {
    if (!routeName.trim()) {
      addNotification("Podaj nazwę trasy!", "error");
      return;
    }
    onSave(routeName.trim());
    setRouteName("");
    setShowSaveDialog(false);
    refreshRoutes();
    addNotification("Trasa zapisana!", "success");
  };

  const handleLoad = (routeId: string) => {
    onLoad(routeId);
    setShowLoadDialog(false);
    addNotification("Trasa wczytana!", "success");
  };

  const confirmDelete = (routeId: string) => {
    setRouteToDelete(routeId);
  };

  const handleDelete = () => {
    if (routeToDelete) {
      onDelete(routeToDelete);
      refreshRoutes();
      addNotification("Trasa usunięta!", "success");
      setRouteToDelete(null);
    }
  };

  const cancelDelete = () => {
    setRouteToDelete(null);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex flex-col gap-2 relative">
      <div className="fixed top-4 right-4 flex flex-col gap-2 z-50">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`px-4 py-2 rounded shadow text-white ${
              n.type === "success"
                ? "bg-green-600"
                : n.type === "error"
                ? "bg-red-600"
                : "bg-blue-600"
            }`}
          >
            {n.message}
          </div>
        ))}
      </div>

      <Button
        onClick={() => setShowSaveDialog(true)}
        disabled={!hasActiveRoute}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        <Save size={20} />
        <span className="inline">Zapisz trasę</span>
      </Button>

      <Button
        onClick={() => {
          refreshRoutes();
          setShowLoadDialog(true);
        }}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <FolderOpen size={20} />
        <span className="inline">Wczytaj trasę</span>
      </Button>

      {showSaveDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 text-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Zapisz trasę</h2>
              <button
                onClick={() => setShowSaveDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="mb-4">
              <Label className="text-sm font-medium mb-2">Nazwa trasy</Label>
              <Input
                type="text"
                value={routeName}
                onChange={(e) => setRouteName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="np. Gdynia - Bornholm"
                className="w-full px-3 py-2 rounded-lg border border-slate-600 bg-slate-900 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setShowSaveDialog(false)}>
                Anuluj
              </Button>
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                Zapisz
              </Button>
            </div>
          </div>
        </div>
      )}

      {showLoadDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 text-white rounded-lg shadow-xl max-w-2xl w-full p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Zapisane trasy</h2>
              <button
                onClick={() => setShowLoadDialog(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {savedRoutes.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Brak zapisanych tras</p>
            ) : (
              <div className="space-y-3">
                {savedRoutes.map((route) => (
                  <div
                    key={route.id}
                    className="border border-slate-600 rounded-lg p-4 hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{route.name}</h3>
                        <p className="text-sm text-gray-400">
                          Zapisano: {formatDate(route.savedAt)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleLoad(route.id)}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Wczytaj
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => confirmDelete(route.id)}
                        >
                          Usuń
                        </Button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-400">
                      <div>
                        <span className="font-medium">Segmentów:</span> {route.segments.length}
                      </div>
                      <div>
                        <span className="font-medium">Prędkość:</span> {route.defaultSpeed} w.
                      </div>
                      <div className="col-span-2">
                        <span className="font-medium">Start:</span>{" "}
                        {new Date(route.startDate).toLocaleDateString("pl-PL")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {routeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 text-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <p className="mb-4">Czy na pewno chcesz usunąć tę trasę?</p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={cancelDelete}>
                Anuluj
              </Button>
              <Button onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                Usuń
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
