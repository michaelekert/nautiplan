import { useQuery } from "@tanstack/react-query"
import { Card, CardContent } from "@/components/ui/card"
import { fetchRegulations } from "@/mocks/api"

export function RegulationsSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["regulations"],
    queryFn: fetchRegulations,
  })

  if (isLoading) return <p>Ładowanie przepisów...</p>
  if (error) return <p>Nie udało się pobrać danych</p>

  return (
    <div className="space-y-4">
      {data?.map((reg) => (
        <Card key={reg.id}>
          <CardContent className="pt-6">
            <h3 className="font-semibold mb-2">{reg.title}</h3>
            <p className="text-sm text-muted-foreground">{reg.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
