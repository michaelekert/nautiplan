import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { fetchChecklists } from "@/mocks/api"

type ChecklistItem = {
  id: number
  name: string
  checked: boolean
}

export function ChecklistSection() {
  const { data, isLoading, error } = useQuery<ChecklistItem[]>({
    queryKey: ["checklists"],
    queryFn: fetchChecklists,
  })

  // Lokalne przechowywanie stanu zaznaczenia po załadowaniu danych
  const [items, setItems] = useState<ChecklistItem[]>([])

  // Gdy dane się załadują, ustawiamy je w stanie (raz)
  if (!isLoading && data && items.length === 0) {
    setItems(data)
  }

  if (isLoading) return <p>Ładowanie checklist...</p>
  if (error) return <p>Nie udało się pobrać danych</p>

  const toggleItem = (id: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((item) => (
        <Card
          key={item.id}
          onClick={() => toggleItem(item.id)}
          className="cursor-pointer transition hover:bg-muted"
        >
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Checkbox
                id={`item-${item.id}`}
                checked={item.checked}
                onCheckedChange={() => toggleItem(item.id)}
              />
              <label htmlFor={`item-${item.id}`} className="cursor-pointer">
                {item.name}
              </label>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
