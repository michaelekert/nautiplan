import { Card, CardContent } from "@/components/ui/card"
import { Compass, CheckSquare, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BottomNavbar } from "@/components/BottomNavbar"

export default function Home() {
  const navigate = useNavigate()

  const tiles = [
    {
      name: "Passage View",
      icon: <Compass className="w-12 h-12 text-slate-600" />,
      path: "/passage-view",
    },
    {
      name: "Skipper View",
      icon: <CheckSquare className="w-12 h-12 text-slate-600" />,
      path: "/skipper-view",
    },
    {
      name: "Study View",
      icon: <BookOpen className="w-12 h-12 text-slate-600" />,
      path: "/study-view",
    },
  ]

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <Card
            key={tile.name}
            onClick={() => navigate(tile.path)}
            className="w-48 h-48 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 p-4">
              {tile.icon}
              <p className="text-lg font-semibold text-center">{tile.name}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BottomNavbar />
    </div>
  )
}
