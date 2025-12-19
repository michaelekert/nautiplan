import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ClipboardList, BookOpen, AlertCircle, Lightbulb, FileText } from "lucide-react"
import type { Section } from "@/types/Skipper/skipper"

interface AppSidebarProps {
  activeSection: Section
  setActiveSection: (section: Section) => void
}

const sections: { name: string; icon: typeof ClipboardList; key: Section }[] = [
  { name: "Checklisty", icon: ClipboardList, key: "checklisty" },
  { name: "Przepisy", icon: BookOpen, key: "przepisy" },
  { name: "Słownik żeglarski", icon: AlertCircle, key: "słownik żeglarski" },
  { name: "Moje trasy", icon: Lightbulb, key: "moje trasy" },
  { name: "Dokumenty", icon: FileText, key: "dokumenty" },
]

export function AppSidebar({ activeSection, setActiveSection }: AppSidebarProps) {
  return (
    <Sidebar className="z-40">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Menu główne</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sections.map((section) => (
                <SidebarMenuItem key={section.key}>
                  <SidebarMenuButton
                    isActive={activeSection === section.key}
                    onClick={() => setActiveSection(section.key)}
                  >
                    <section.icon className="h-4 w-4" />
                    <span>{section.name}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}