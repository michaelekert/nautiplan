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
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardList, BookOpen, AlertCircle, Lightbulb, FileText } from "lucide-react"
import { BottomNavbar } from "@/components/BottomNavbar"

type Section = "checklisty" | "przepisy" | "usterki" | "porady" | "dokumenty"

const sections: { name: string; icon: typeof ClipboardList; key: Section }[] = [
  { name: "Checklisty", icon: ClipboardList, key: "checklisty" },
  { name: "Przepisy", icon: BookOpen, key: "przepisy" },
  { name: "Usterki", icon: AlertCircle, key: "usterki" },
  { name: "Porady", icon: Lightbulb, key: "porady" },
  { name: "Dokumenty", icon: FileText, key: "dokumenty" },
]

function AppSidebar({ activeSection, setActiveSection }: { 
  activeSection: Section; 
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
            {activeSection === "checklisty" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="item1" />
                      <label htmlFor="item1" className="cursor-pointer">
                        Sprawdzenie silnika
                      </label>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="item2" />
                      <label htmlFor="item2" className="cursor-pointer">
                        Sprawdzenie żagli
                      </label>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="item3" />
                      <label htmlFor="item3" className="cursor-pointer">
                        Kontrola lin cumowniczych
                      </label>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-2">
                      <Checkbox id="item4" />
                      <label htmlFor="item4" className="cursor-pointer">
                        Sprawdzenie kamizelki ratunkowej
                      </label>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "przepisy" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Prawo drogi na wodzie</h3>
                    <p className="text-sm text-muted-foreground">
                      Podstawowe zasady pierwszeństwa przejazdu między jednostkami.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Procedury bezpieczeństwa</h3>
                    <p className="text-sm text-muted-foreground">
                      Obowiązkowe zasady bezpieczeństwa na pokładzie.
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-semibold mb-2">Sygnały dźwiękowe i świetlne</h3>
                    <p className="text-sm text-muted-foreground">
                      Międzynarodowe przepisy dotyczące sygnalizacji.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "usterki" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Silnik nie odpala</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sprawdź paliwo, akumulator i układ zapłonowy.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Problem z radio</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Sprawdź połączenia antenowe i zasilanie.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Przeciek wody</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Zlokalizuj źródło i użyj pompy zęzowej.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "porady" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Zawsze sprawdzaj pogodę</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Przed wypłynięciem sprawdź prognozę na najbliższe 24-48 godzin.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Nie przeciążaj jachtu</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Zachowaj odpowiedni rozkład ciężaru i nie przekraczaj dopuszczalnej ilości pasażerów.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="w-5 h-5 text-yellow-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Planuj trasę z zapasem</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Uwzględnij dodatkowy czas na nieprzewidziane sytuacje i złe warunki.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === "dokumenty" && (
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Licencja żeglarska</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Patent żeglarski wymagany do prowadzenia jachtów.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Ubezpieczenie jachtu</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Polisa OC i AC dla jednostki pływającej.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <FileText className="w-5 h-5 text-blue-500 mt-0.5" />
                      <div>
                        <h3 className="font-semibold">Świadectwo zdolności żeglugowej</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Dokument potwierdzający stan techniczny jachtu.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
    <div className="z-50">
        <BottomNavbar />
    </div>
    </SidebarProvider>
  )
}