import { NavLink } from "react-router-dom"
import { Home, BookOpen, Compass, CheckSquare } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"

export function BottomNavbar() {
  const { t } = useTranslation()

  const navItems = [
    { name: t("Home"), to: "/", icon: Home },
    { name: t("Passage Plan"), to: "/passage-view", icon: Compass },
    { name: t("Skipper"), to: "/skipper-view", icon: CheckSquare },
    { name: t("Study"), to: "/study-view", icon: BookOpen },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 shadow-md">
      <ul className="flex justify-around items-center md:h-16 h-[10dvh]">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex flex-col items-center text-slate-500 hover:text-slate-900 transition",
                  isActive && "text-blue-600 font-semibold"
                )
              }
            >
              <item.icon className="w-5 h-5 mb-1" />
              <span className="text-xs">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
