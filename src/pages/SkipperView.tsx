import { useState } from "react"
import { useTranslation } from "react-i18next"
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
import { ClipboardList, BookOpen, AlertCircle, Lightbulb, FileText, Map } from "lucide-react"
import { BottomNavbar } from "@/components/BottomNavbar"
import { ChecklistSection } from "@/components/CheckListSection"
import { RegulationsSection } from "@/components/RegulationSection"
import { SavedRoutesSection } from "@/components/SavedRoutesSection"

type Section = "checklisty" | "przepisy" | "usterki" | "porady" | "dokumenty" | "trasy"

function AppSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: Section
  setActiveSection: (section: Section) => void
}) {
  const { t } = useTranslation()

  const sections: { name: string; icon: typeof ClipboardList; key: Section }[] = [
    { name: t("Checklists"), icon: ClipboardList, key: "checklisty" },
    { name: t("Regulations"), icon: BookOpen, key: "przepisy" },
    { name: "Zapisane trasy", icon: Map, key: "trasy" },
    { name: t("Faults"), icon: AlertCircle, key: "usterki" },
    { name: t("Tips"), icon: Lightbulb, key: "porady" },
    { name: t("Documents"), icon: FileText, key: "dokumenty" },
  ]

  return (
    <Sidebar className="z-40">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-4 py-2">
          <div className="flex flex-col">
            <span className="text-sm font-semibold">{t("Main menu")}</span>
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
  const { t } = useTranslation()
  const [activeSection, setActiveSection] = useState<Section>("checklisty")

  const renderContent = () => {
    switch (activeSection) {
      case "checklisty":
        return <ChecklistSection />
      case "przepisy":
        return <RegulationsSection />
      case "trasy":
        return <SavedRoutesSection />
      case "usterki":
        return <p>{t("Faults section placeholder")} 🚧</p>
      case "porady":
        return <p>{t("Tips section placeholder")} ⚓</p>
      case "dokumenty":
        return <p>{t("Documents section placeholder")} 📄</p>
      default:
        return null
    }
  }

  const sections: { name: string; key: Section }[] = [
    { name: t("Checklists"), key: "checklisty" },
    { name: t("Regulations"), key: "przepisy" },
    { name: "Zapisane trasy", key: "trasy" },
    { name: t("Faults"), key: "usterki" },
    { name: t("Tips"), key: "porady" },
    { name: t("Documents"), key: "dokumenty" },
  ]

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

          <div className="p-6">{renderContent()}</div>
        </main>
      </div>

      <div className="z-50">
        <BottomNavbar />
      </div>
    </SidebarProvider>
  )
}
