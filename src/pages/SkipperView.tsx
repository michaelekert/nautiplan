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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { ClipboardList, BookOpen, AlertCircle, Lightbulb, FileText } from "lucide-react"

type Section = "checklisty" | "przepisy" | "usterki" | "porady" | "dokumenty"

interface ChecklistItem {
  id: string
  text: string
  checked: boolean
}

interface Checklist {
  id: string
  title: string
  items: ChecklistItem[]
}

const initialChecklists: Checklist[] = [
  {
    id: "1",
    title: "Określ dane trasy",
    items: [
      { id: "1-1", text: "Określ punkt startu i celu.", checked: false },
      { id: "1-2", text: "Wybierz porty schronienia po drodze.", checked: false },
      { id: "1-3", text: "Przygotuj alternatywne trasy.", checked: false },
      { id: "1-4", text: "Wyznacz maksymalny czas rejsu i bufor.", checked: false },
      { id: "1-5", text: "Zapisz plan trasy w dzienniku lub aplikacji.", checked: false },
    ],
  },
  {
    id: "2",
    title: "Sprawdź wyposażenie łodzi",
    items: [
      { id: "2-1", text: "Sprawdź kamizelki ratunkowe.", checked: false },
      { id: "2-2", text: "Zweryfikuj środki łączności.", checked: false },
      { id: "2-3", text: "Sprawdź apteczkę i rakiety.", checked: false },
      { id: "2-4", text: "Sprawdź stan silnika i paliwa.", checked: false },
    ],
  },
  {
    id: "3",
    title: "Przygotuj dokumenty",
    items: [
      { id: "3-1", text: "Dokumenty łodzi i ubezpieczenie.", checked: false },
      { id: "3-2", text: "Licencje załogi.", checked: false },
      { id: "3-3", text: "Lista kontaktów awaryjnych.", checked: false },
    ],
  },
]

function ChecklistSection() {
  const [checklists, setChecklists] = useState<Checklist[]>(initialChecklists)

  const toggleItem = (checklistId: string, itemId: string) => {
    setChecklists(prev =>
      prev.map(checklist =>
        checklist.id === checklistId
          ? {
              ...checklist,
              items: checklist.items.map(item =>
                item.id === itemId ? { ...item, checked: !item.checked } : item
              ),
            }
          : checklist
      )
    )
  }

  const isChecklistComplete = (checklist: Checklist) => {
    return checklist.items.every(item => item.checked)
  }

  return (
    <div className="space-y-4">
      <Accordion type="single" collapsible className="w-full space-y-2">
        {checklists.map(checklist => {
          const isComplete = isChecklistComplete(checklist)
          return (
            <AccordionItem
              key={checklist.id}
              value={checklist.id}
              className={`!border !border-solid rounded-lg overflow-hidden ${
                isComplete ? "bg-green-50 !border-green-300" : "bg-white !border-gray-200"
              }`}
            >
              <AccordionTrigger
                className={`px-4 hover:no-underline ${
                  isComplete ? "text-green-900 font-semibold" : ""
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>{checklist.title}</span>
                  {isComplete && (
                    <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                      ✓ Ukończono
                    </span>
                  )}
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4">
                <ul className="space-y-3">
                  {checklist.items.map(item => (
                    <li key={item.id} className="flex items-start gap-3">
                      <Checkbox
                        id={item.id}
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(checklist.id, item.id)}
                        className="mt-0.5"
                      />
                      <label
                        htmlFor={item.id}
                        className={`text-sm cursor-pointer flex-1 ${
                          item.checked ? "line-through text-gray-500" : ""
                        }`}
                      >
                        {item.text}
                      </label>
                    </li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          )
        })}
      </Accordion>
    </div>
  )
}

function RegulationsSection() {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Przepisy żeglugowe</h2>
      <p className="text-gray-600">Tutaj będą przepisy... 🚧</p>
    </div>
  )
}

function AppSidebar({
  activeSection,
  setActiveSection,
}: {
  activeSection: Section
  setActiveSection: (section: Section) => void
}) {
  const sections: { name: string; icon: typeof ClipboardList; key: Section }[] = [
    { name: "Checklisty", icon: ClipboardList, key: "checklisty" },
    { name: "Przepisy", icon: BookOpen, key: "przepisy" },
    { name: "Usterki", icon: AlertCircle, key: "usterki" },
    { name: "Porady", icon: Lightbulb, key: "porady" },
    { name: "Dokumenty", icon: FileText, key: "dokumenty" },
  ]

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

  const renderContent = () => {
    switch (activeSection) {
      case "checklisty":
        return <ChecklistSection />
      case "przepisy":
        return <RegulationsSection />
      case "usterki":
        return <p>Sekcja usterek 🚧</p>
      case "porady":
        return <p>Sekcja porad ⚓</p>
      case "dokumenty":
        return <p>Sekcja dokumentów 📄</p>
      default:
        return null
    }
  }

  const sections: { name: string; key: Section }[] = [
    { name: "Checklisty", key: "checklisty" },
    { name: "Przepisy", key: "przepisy" },
    { name: "Usterki", key: "usterki" },
    { name: "Porady", key: "porady" },
    { name: "Dokumenty", key: "dokumenty" },
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
    </SidebarProvider>
  )
}