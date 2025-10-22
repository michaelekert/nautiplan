import { useState } from "react"
import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { ClipboardList, BookOpen, AlertCircle, Lightbulb, FileText } from "lucide-react"
import { BottomNavbar } from "@/components/BottomNavbar"


import { ChecklistSection } from "@/components/CheckListSection"
import { RegulationsSection } from "@/components/RegulationSection"


type Section = "checklisty" | "przepisy" | "usterki" | "porady" | "dokumenty"

const sections: { name: string; icon: typeof ClipboardList; key: Section }[] = [
  { name: "Checklisty", icon: ClipboardList, key: "checklisty" },
  { name: "Przepisy", icon: BookOpen, key: "przepisy" },
  { name: "Usterki", icon: AlertCircle, key: "usterki" },
  { name: "Porady", icon: Lightbulb, key: "porady" },
  { name: "Dokumenty", icon: FileText, key: "dokumenty" },
]

function AppSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: Section
  setActiveSection: (section: Section) => void
}) {
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

export default function SkipperView() {
  const [activeSection, setActiveSection] = useState<Section>("checklisty")

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        <main className="flex-1">
          <div className="sticky top-0 z-10 border-b bg-background p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">
                {sections.find((s) => s.key === activeSection)?.name}
              </h1>
            </div>
          </div>

          <div className="p-6">
            {activeSection === "checklisty" && <ChecklistSection />}
            {activeSection === "przepisy" && <RegulationsSection />}
            {activeSection === "usterki" && <p>Tu będą usterki 🚧</p>}
            {activeSection === "porady" && <p>Tu będą porady ⚓</p>}
            {activeSection === "dokumenty" && <p>Tu będą dokumenty 📄</p>}
          </div>
        </main>
      </div>

      <div className="z-50">
        <BottomNavbar />
      </div>
    </SidebarProvider>
  )
}
