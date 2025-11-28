import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Map, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
      if (routes) {
        const parsed = JSON.parse(routes)
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

  return (
    <div className="space-y-6">

<div className="rounded-md border border-slate-300 overflow-hidden">
  <Table>
    <TableHeader>
      <TableRow className="bg-slate-800">
        <TableHead className="text-slate-100">Nazwa</TableHead>
        <TableHead className="text-slate-100">Zapisano</TableHead>
        <TableHead className="text-right text-slate-100">Akcje</TableHead>
      </TableRow>
    </TableHeader>

    <TableBody className="bg-white text-black">
      {savedRoutes.length === 0 && (
        <TableRow>
          <TableCell
            colSpan={3}
            className="h-16 text-center text-gray-500"
          >
            Brak zapisanych tras
          </TableCell>
        </TableRow>
      )}

      {savedRoutes.map((route) => (
        <TableRow key={route.id} className="hover:bg-gray-100">
          <TableCell className="font-medium">
            {route.name}
          </TableCell>

          <TableCell>
            {formatDate(route.savedAt)}
          </TableCell>

          <TableCell className="text-right">
            <div className="flex justify-end gap-2">
              <Button
                onClick={() => handleLoadRoute(route.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="sm"
              >
                <Map className="h-4 w-4 mr-1" />
                Wczytaj
              </Button>

              <Button
                variant="destructive"
                onClick={() => confirmDelete(route.id)}
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
</div>


      {/* MODAL USUWANIA */}
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
