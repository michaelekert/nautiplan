import { useState } from "react"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/Skipper/AppSidebar"
import { ChecklistSection } from "@/components/Skipper/CheckListSection"
import { RegulationsSection } from "@/components/Skipper/RegulationSection"
import { NauticalDictionarySection } from "@/components/Skipper/NauticalDictionarySection"
import DocumentsSection from "@/components/Skipper/DocumentsSection"
import { BottomNavbar } from "@/components/BottomNavbar"
import type { Section } from "@/types/Skipper/skipper"

const sections: { name: string; key: Section }[] = [
  { name: "Checklisty", key: "checklisty" },
  { name: "Przepisy", key: "przepisy" },
  { name: "Słownik żeglarski", key: "słownik żeglarski" },
  { name: "Moje trasy", key: "moje trasy" },
  { name: "Dokumenty", key: "dokumenty" },
]

export default function SkipperView() {
  const [activeSection, setActiveSection] = useState<Section>("checklisty")

  const renderContent = () => {
    switch (activeSection) {
      case "checklisty":
        return <ChecklistSection />
      case "przepisy":
        return <RegulationsSection />
      case "słownik żeglarski":
        return <NauticalDictionarySection />
      case "moje trasy":
        return <p>W budowie</p>
      case "dokumenty":
        return <DocumentsSection />
      default:
        return null
    }
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <main className="flex-1 pb-[10dvh] md:pb-16">
          <div className="sticky top-0 z-10 border-b bg-background p-4">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-2xl font-bold">
                {sections.find((s) => s.key === activeSection)?.name}
              </h1>
            </div>
          </div>

          <div className="p-2">{renderContent()}</div>
        </main>
        
        <div className="z-50">
          <BottomNavbar />
        </div>
      </div>
    </SidebarProvider>
  )
}