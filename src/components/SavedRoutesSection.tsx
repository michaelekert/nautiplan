import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Map, Trash2, Calendar, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export interface SavedRoute {
  id: string
  name: string
  segments: any[]
  startDate: string
  defaultSpeed: number
  savedAt: string
}

const ROUTES_STORAGE_KEY = "savedRoutes"

export function SavedRoutesSection() {
  const navigate = useNavigate()
  const [savedRoutes, setSavedRoutes] = useState<SavedRoute[]>([])
  const [routeToDelete, setRouteToDelete] = useState<string | null>(null)

  const loadSavedRoutes = () => {
    try {
      const routes = localStorage.getItem(ROUTES_STORAGE_KEY)
      console.log("Raw routes from localStorage:", routes)
      if (routes) {
        const parsed = JSON.parse(routes)
        console.log("Parsed routes:", parsed)
        setSavedRoutes(parsed)
      }
    } catch (error) {
      console.error("Error loading routes:", error)
      toast.error("Błąd wczytywania tras")
    }
  }

  useEffect(() => {
    loadSavedRoutes()
  }, [])

  const handleLoadRoute = (routeId: string) => {
    // Przekierowanie do mapy z parametrem trasy
    navigate(`/passage-view?loadRoute=${routeId}`)
  }

  const confirmDelete = (routeId: string) => {
    setRouteToDelete(routeId)
  }

  const handleDelete = () => {
    if (!routeToDelete) return

    try {
      const routes = localStorage.getItem(ROUTES_STORAGE_KEY)
      if (routes) {
        const parsed: SavedRoute[] = JSON.parse(routes)
        const filtered = parsed.filter((r) => r.id !== routeToDelete)
        localStorage.setItem(ROUTES_STORAGE_KEY, JSON.stringify(filtered))
        setSavedRoutes(filtered)
        toast.success("Trasa usunięta!")
      }
    } catch (error) {
      console.error("Error deleting route:", error)
      toast.error("Błąd usuwania trasy")
    }

    setRouteToDelete(null)
  }

  const cancelDelete = () => {
    setRouteToDelete(null)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const formatStartDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pl-PL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Map className="h-6 w-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">Zapisane trasy</h2>
        </div>

        {savedRoutes.length === 0 ? (
          <div className="text-center py-12">
            <Navigation className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Brak zapisanych tras</p>
            <p className="text-gray-500 text-sm mt-2">
              Zapisz trasę w planowaniu przejścia, aby zobaczyć ją tutaj
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {savedRoutes.map((route) => (
              <div
                key={route.id}
                className="border border-slate-600 rounded-lg p-5 hover:bg-slate-700 transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-white">{route.name}</h3>
                </div>

                <div className="space-y-2 text-sm text-gray-300 mb-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-gray-400">Zapisano:</span>
                    <span>{formatDate(route.savedAt)}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-600">
                    <div>
                      <span className="font-medium text-gray-400">Segmentów:</span>
                      <span className="ml-2 text-white">{route.segments.length}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-400">Prędkość:</span>
                      <span className="ml-2 text-white">{route.defaultSpeed} w.</span>
                    </div>
                    <div className="col-span-2">
                      <span className="font-medium text-gray-400">Start:</span>
                      <span className="ml-2 text-white">{formatStartDate(route.startDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleLoadRoute(route.id)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Map className="h-4 w-4 mr-2" />
                    Wczytaj
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => confirmDelete(route.id)}
                    className="px-3"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {routeToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 text-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h3 className="text-lg font-bold mb-4">Potwierdź usunięcie</h3>
            <p className="mb-6 text-gray-300">
              Czy na pewno chcesz usunąć tę trasę? Ta operacja jest nieodwracalna.
            </p>
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
  )
}