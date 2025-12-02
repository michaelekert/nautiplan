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
  text: string
  checked: boolean
}

interface Checklist {
  title: string
  items: ChecklistItem[]
}

interface ChecklistCategory {
  name: string
  icon: string
  checklists: Checklist[]
}

const initialCategories: ChecklistCategory[] = [
  {
    name: "Przed rejsem",
    icon: "📋",
    checklists: [
      {
        title: "Nawigacja i planowanie trasy",
        items: [
          { text: "Określ punkt startu i celu.", checked: false },
          { text: "Wybierz porty schronienia po drodze.", checked: false },
          { text: "Przygotuj alternatywne trasy.", checked: false },
          { text: "Wyznacz maksymalny czas rejsu i bufor.", checked: false },
          { text: "Zapisz plan trasy w dzienniku lub aplikacji.", checked: false },
        ],
      },
      {
        title: "Sprawdź wyposażenie łodzi",
        items: [
          { text: "Sprawdź kamizelki ratunkowe.", checked: false },
          { text: "Zweryfikuj środki łączności.", checked: false },
          { text: "Sprawdź apteczkę i rakiety.", checked: false },
          { text: "Sprawdź stan silnika i paliwa.", checked: false },
        ],
      },
      {
        title: "Przygotuj dokumenty",
        items: [
          { text: "Dokumenty łodzi i ubezpieczenie.", checked: false },
          { text: "Licencje załogi.", checked: false },
          { text: "Lista kontaktów awaryjnych.", checked: false },
        ],
      },
    ],
  },
  {
    name: "Silnik",
    icon: "⚙️",
    checklists: [
      {
        title: "Odpalenie silnika (WOBBLE)",
        items: [
          { text: "Sprawdź, czy zawór wody jest otwarty.", checked: false },
          { text: "Upewnij się, że wloty nie są zatkane.", checked: false },
          { text: "Po odpaleniu potwierdź wypływ wody chłodzącej ", checked: false },
          { text: "Sprawdź poziom oleju na bagnecie.", checked: false },
          { text: "Upewnij się, że nie ma wycieków w okolicy miski i filtra.", checked: false },
          { text: "Oceń kolor oleju (ciemny = normalny, mleczny = alarm).", checked: false },
          { text: "Przełącz na właściwy akumulator/\"bank\".", checked: false },
          { text: "Sprawdź napięcie (min. ~12.4V przed rozruchem).", checked: false },
          { text: "Upewnij się, że wyłącznik główny jest na ON.", checked: false },
          { text: "Sprawdź napięcie paska alternatora.", checked: false },
          { text: "Upewnij się, że nie ma pęknięć ani przetarć.", checked: false },
          { text: "Upewnij się, że koła pasowe obracają się swobodnie.", checked: false },
          { text: "Skontroluj przestrzeń pod silnikiem pod kątem paliwa, wody i oleju.", checked: false },
          { text: "Sprawdź filtry paliwa/oleju, czy nie \"pocą się\".", checked: false },
          { text: "Zweryfikuj przewody paliwowe i wodne.", checked: false },
          { text: "Ustaw manetkę w pozycję neutralną.", checked: false },
          { text: "Sprawdź poziom paliwa i odpowietrzenie zbiornika.", checked: false },
          { text: "Upewnij się, że alarmy i kontrolki działają po przekręceniu kluczyka.", checked: false },
          { text: "Wietrz przedział silnikowy przed startem.", checked: false },
        ],
      },
      {
        title: "Post-start engine check",
        items: [
          { text: "Potwierdź stabilny wypływ wody chłodzącej", checked: false },
          { text: "Sprawdź temperaturę silnika — powinna rosnąć stopniowo, bez skoków.", checked: false },
          { text: "Nasłuchuj sygnałów alarmowych dot. przegrzewania.", checked: false },
          { text: "Sprawdź ciśnienie oleju — powinno wzrosnąć w ciągu kilku sekund.", checked: false },
          { text: "Zweryfikuj obroty biegu jałowego (zwykle 700–900 obr/min).", checked: false },
          { text: "Sprawdź, czy nie ma nietypowych wibracji.", checked: false },
          { text: "Upewnij się, że silnik pracuje równo i bez falowania.", checked: false },
          { text: "Sprawdź, czy nie występują stuki, tarcia, metaliczne odgłosy.", checked: false },
          { text: "Oceń zapach spalin — nadmierny dym to sygnał alarmowy.", checked: false },
          { text: "Upewnij się, że nie ma wycieków wody lub spalin przy kolanku wydechu.", checked: false },
          { text: "Potwierdź, że strumień wody jest stały i synchroniczny z pracą silnika.", checked: false },
          { text: "Sprawdź, czy na filtrze nie pojawiły się bąble powietrza.", checked: false },
          { text: "Nasłuchuj \"nierównej\" pracy, która sugeruje zapowietrzenie.", checked: false },
          { text: "Sprawdź poziom paliwa i odpowietrzenie zbiornika.", checked: false },
          { text: "Zweryfikuj, czy alternator ładuje akumulator (zwykle 13.5–14.2V).", checked: false },
          { text: "Upewnij się, że kontrolki i alarmy gasną po poprawnym starcie.", checked: false },
          { text: "Sprawdź działanie obrotomierza i wskaźników.", checked: false },
          { text: "Sprawdź, czy nie pojawiają się nowe wycieki (woda, olej, paliwo).", checked: false },
          { text: "Oceń temperaturę komory — nie powinna gwałtownie rosnąć.", checked: false },
          { text: "Upewnij się, że remiza silnika jest zamknięta lub zabezpieczona.", checked: false },
          { text: "Przełącz manetkę w neutral i potwierdź reakcję silnika.", checked: false },
          { text: "Upewnij się, że układ sterowy działa płynnie.", checked: false },
          { text: "Zweryfikuj działanie biegu w przód i wstecz (krótkie \"kliknięcie\").", checked: false },
          { text: "Obserwuj temperaturę – powinna ustabilizować się po kilku minutach.", checked: false },
          { text: "Kontroluj przepływ wody chłodzącej.", checked: false },
          { text: "Przy pierwszym obciążeniu sprawdź reakcję silnika.", checked: false },
          { text: "Zanotuj czas włączenia silnika.", checked: false },
          { text: "Zapisz parametry pracy (temp., ciśnienie, napięcie).", checked: false },
          { text: "Zapisz poziom paliwa przed wyjściem.", checked: false },
        ],
      },
    ],
  },
]

function ChecklistSection() {
  const [categories, setCategories] = useState<ChecklistCategory[]>(initialCategories)

  const toggleItem = (categoryName: string, checklistTitle: string, itemText: string) => {
    setCategories(prev =>
      prev.map(category =>
        category.name === categoryName
          ? {
              ...category,
              checklists: category.checklists.map(checklist =>
                checklist.title === checklistTitle
                  ? {
                      ...checklist,
                      items: checklist.items.map(item =>
                        item.text === itemText ? { ...item, checked: !item.checked } : item
                      ),
                    }
                  : checklist
              ),
            }
          : category
      )
    )
  }

  const isChecklistComplete = (checklist: Checklist) => {
    return checklist.items.length > 0 && checklist.items.every(item => item.checked)
  }

  const getCategoryProgress = (category: ChecklistCategory) => {
    const totalItems = category.checklists.reduce((sum, cl) => sum + cl.items.length, 0)
    const checkedItems = category.checklists.reduce(
      (sum, cl) => sum + cl.items.filter(item => item.checked).length,
      0
    )
    return { total: totalItems, checked: checkedItems, percentage: Math.round((checkedItems / totalItems) * 100) }
  }

  return (
    <div className="space-y-8">
      {categories.map(category => {
        const progress = getCategoryProgress(category)
        return (
          <div key={category.name} className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </h2>
              <div className="text-sm text-gray-600">
                {progress.checked}/{progress.total} ({progress.percentage}%)
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-2">
              {category.checklists.map(checklist => {
                const isComplete = isChecklistComplete(checklist)
                return (
                  <AccordionItem
                    key={checklist.title}
                    value={checklist.title}
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
                          <li key={item.text} className="flex items-start gap-3">
                            <Checkbox
                              id={item.text}
                              checked={item.checked}
                              onCheckedChange={() => toggleItem(category.name, checklist.title, item.text)}
                              className="mt-0.5"
                            />
                            <label
                              htmlFor={item.text}
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
      })}
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