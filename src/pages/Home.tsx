import { Card, CardContent } from "@/components/ui/card"
import { Compass, CheckSquare, BookOpen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { BottomNavbar } from "@/components/BottomNavbar"
import { LanguageSwitcher } from "@/components/LanguageSwitcher"
import { useTranslation } from "react-i18next"

export default function Home() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const tiles = [
    {
      key: "passage",
      name: "Passage Plan",
      icon: <Compass className="w-12 h-12 text-slate-600" />,
      path: "/passage-view",
    },
    {
      key: "skipper",
      name: "Skipper",
      icon: <CheckSquare className="w-12 h-12 text-slate-600" />,
      path: "/skipper-view",
    },
    {
      key: "study",
      name: "Study",
      icon: <BookOpen className="w-12 h-12 text-slate-600" />,
      path: "/study-view",
    },
  ]

  return (
    <div className="flex flex-col items-center min-h-screen bg-background">
      <div className="w-full flex justify-end p-4">
        <LanguageSwitcher />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 flex-1 items-center justify-center">
        {tiles.map((tile) => (
          <Card
            key={tile.key}
            onClick={() => navigate(tile.path)}
            className="w-48 h-48 flex flex-col items-center justify-center cursor-pointer transition-all hover:scale-105 hover:shadow-lg"
          >
            <CardContent className="flex flex-col items-center justify-center gap-3 p-4">
              {tile.icon}
              <p className="text-lg font-semibold text-center">
                {t(tile.name)}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <BottomNavbar />
    </div>
  )
}
