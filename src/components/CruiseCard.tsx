import { useState } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Download, FileText, Plus, Trash2 } from 'lucide-react';
import { CruiseCardPDF, getEmptyFormData, type CruiseCardData, type CrewMember } from '@/documentToGenerate/CruiseCardPDF';

export function CruiseCard() {
  const [formData, setFormData] = useState<CruiseCardData>(getEmptyFormData());

  const updateCaptain = (field: keyof CruiseCardData['captain'], value: string) => {
    setFormData(prev => ({
      ...prev,
      captain: { ...prev.captain, [field]: value }
    }));
  };

  const updateYacht = (field: keyof CruiseCardData['yacht'], value: string) => {
    setFormData(prev => ({
      ...prev,
      yacht: { ...prev.yacht, [field]: value }
    }));
  };

  const updateCruise = (field: keyof CruiseCardData['cruise'], value: string) => {
    setFormData(prev => ({
      ...prev,
      cruise: { ...prev.cruise, [field]: value }
    }));
  };

  const updateHours = (field: keyof CruiseCardData['hours'], value: string) => {
    setFormData(prev => ({
      ...prev,
      hours: { ...prev.hours, [field]: value }
    }));
  };

  const addCrewMember = () => {
    if (formData.crew.length < 8) {
      setFormData(prev => ({
        ...prev,
        crew: [...prev.crew, { name: '', certificate: '', rank: '' }]
      }));
    }
  };

  const updateCrewMember = (index: number, field: keyof CrewMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      crew: prev.crew.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const removeCrewMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      crew: prev.crew.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData(getEmptyFormData());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Karta Rejsu PZŻ
          </CardTitle>
          <CardDescription>
            Wypełnij formularz, aby wygenerować Kartę Rejsu lub pobierz pusty dokument do wypełnienia ręcznie.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-6">
            <PDFDownloadLink 
              document={<CruiseCardPDF data={formData} />} 
              fileName="karta-rejsu.pdf"
            >
              {({ loading }) => (
                <Button disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Generowanie...' : 'Pobierz z danymi'}
                </Button>
              )}
            </PDFDownloadLink>
            
            <PDFDownloadLink 
              document={<CruiseCardPDF data={getEmptyFormData()} />} 
              fileName="karta-rejsu-pusta.pdf"
            >
              {({ loading }) => (
                <Button variant="outline" disabled={loading}>
                  <Download className="w-4 h-4 mr-2" />
                  {loading ? 'Generowanie...' : 'Pobierz pusty formularz'}
                </Button>
              )}
            </PDFDownloadLink>

            <Button variant="ghost" onClick={resetForm}>
              Wyczyść formularz
            </Button>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold border-b pb-2">Informacje o kapitanie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="captain-name">Imię i nazwisko</Label>
                <Input
                  id="captain-name"
                  value={formData.captain.name}
                  onChange={(e) => updateCaptain('name', e.target.value)}
                  placeholder="np. Jan Kowalski"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="captain-cert">Stopień żeglarski/motorowodny i nr patentu</Label>
                <Input
                  id="captain-cert"
                  value={formData.captain.certificate}
                  onChange={(e) => updateCaptain('certificate', e.target.value)}
                  placeholder="np. Kapitan Jachtowy 12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="captain-phone">Telefon</Label>
                <Input
                  id="captain-phone"
                  value={formData.captain.phone}
                  onChange={(e) => updateCaptain('phone', e.target.value)}
                  placeholder="+48 123 456 789"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="captain-email">Adres e-mail</Label>
                <Input
                  id="captain-email"
                  type="email"
                  value={formData.captain.email}
                  onChange={(e) => updateCaptain('email', e.target.value)}
                  placeholder="jan@email.pl"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold border-b pb-2">Informacje o jachcie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="yacht-reg">Nr rejestracyjny</Label>
                <Input
                  id="yacht-reg"
                  value={formData.yacht.regNo}
                  onChange={(e) => updateYacht('regNo', e.target.value)}
                  placeholder="np. POL-1234"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yacht-name">Nazwa jachtu</Label>
                <Input
                  id="yacht-name"
                  value={formData.yacht.name}
                  onChange={(e) => updateYacht('name', e.target.value)}
                  placeholder="np. Biały Orzeł"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yacht-length">Długość całkowita [m]</Label>
                <Input
                  id="yacht-length"
                  value={formData.yacht.length}
                  onChange={(e) => updateYacht('length', e.target.value)}
                  placeholder="np. 12.5"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yacht-port">Port macierzysty</Label>
                <Input
                  id="yacht-port"
                  value={formData.yacht.homePort}
                  onChange={(e) => updateYacht('homePort', e.target.value)}
                  placeholder="np. Gdynia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yacht-engine">Moc silnika [kW]</Label>
                <Input
                  id="yacht-engine"
                  value={formData.yacht.enginePower}
                  onChange={(e) => updateYacht('enginePower', e.target.value)}
                  placeholder="np. 55"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold border-b pb-2">Informacje o rejsie</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="cruise-logbook">Nr pływania (dziennik jachtowy)</Label>
                <Input
                  id="cruise-logbook"
                  value={formData.cruise.logBookNo}
                  onChange={(e) => updateCruise('logBookNo', e.target.value)}
                  placeholder="np. 2024/001"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="embark-port">Port zaokrętowania</Label>
                <Input
                  id="embark-port"
                  value={formData.cruise.embarkationPort}
                  onChange={(e) => updateCruise('embarkationPort', e.target.value)}
                  placeholder="np. Gdynia"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="embark-date">Data zaokrętowania</Label>
                <Input
                  id="embark-date"
                  type="date"
                  value={formData.cruise.embarkationDate}
                  onChange={(e) => updateCruise('embarkationDate', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="disembark-port">Port wyokrętowania</Label>
                <Input
                  id="disembark-port"
                  value={formData.cruise.disembarkationPort}
                  onChange={(e) => updateCruise('disembarkationPort', e.target.value)}
                  placeholder="np. Sopot"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="disembark-date">Data wyokrętowania</Label>
                <Input
                  id="disembark-date"
                  type="date"
                  value={formData.cruise.disembarkationDate}
                  onChange={(e) => updateCruise('disembarkationDate', e.target.value)}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="visited-ports">Odwiedzone porty</Label>
                <Textarea
                  id="visited-ports"
                  value={formData.cruise.visitedPorts}
                  onChange={(e) => updateCruise('visitedPorts', e.target.value)}
                  placeholder="np. Hel, Jastarnia, Puck, Władysławowo"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tidal-ports">Liczba portów pływowych</Label>
                <Input
                  id="tidal-ports"
                  value={formData.cruise.tidalPortsCount}
                  onChange={(e) => updateCruise('tidalPortsCount', e.target.value)}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cruise-days">Liczba dni rejsu</Label>
                <Input
                  id="cruise-days"
                  value={formData.cruise.cruiseDays}
                  onChange={(e) => updateCruise('cruiseDays', e.target.value)}
                  placeholder="np. 14"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <h3 className="text-lg font-semibold border-b pb-2">Godziny żeglugi i postoju</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="hours-total">Razem (pod żaglami i na silniku)</Label>
                <Input
                  id="hours-total"
                  value={formData.hours.totalUnderway}
                  onChange={(e) => updateHours('totalUnderway', e.target.value)}
                  placeholder="np. 72"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-sails">Pod żaglami</Label>
                <Input
                  id="hours-sails"
                  value={formData.hours.underSails}
                  onChange={(e) => updateHours('underSails', e.target.value)}
                  placeholder="np. 48"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-engine">Na silniku</Label>
                <Input
                  id="hours-engine"
                  value={formData.hours.usingEngine}
                  onChange={(e) => updateHours('usingEngine', e.target.value)}
                  placeholder="np. 24"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-tidal">Po wodach pływowych</Label>
                <Input
                  id="hours-tidal"
                  value={formData.hours.tidalWaters}
                  onChange={(e) => updateHours('tidalWaters', e.target.value)}
                  placeholder="np. 0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours-harbour">W portach i na kotwicy</Label>
                <Input
                  id="hours-harbour"
                  value={formData.hours.inHarbours}
                  onChange={(e) => updateHours('inHarbours', e.target.value)}
                  placeholder="np. 264"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="trip-nm">Przebyto mil morskich</Label>
                <Input
                  id="trip-nm"
                  value={formData.hours.tripNM}
                  onChange={(e) => updateHours('tripNM', e.target.value)}
                  placeholder="np. 180"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center border-b pb-2">
              <h3 className="text-lg font-semibold">Załoga</h3>
              <Button
                onClick={addCrewMember}
                disabled={formData.crew.length >= 8}
                size="sm"
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-1" />
                Dodaj członka załogi
              </Button>
            </div>
            
            {formData.crew.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Brak członków załogi. Kliknij "Dodaj członka załogi" aby dodać pierwszą osobę (max. 8).
              </p>
            )}

            <div className="space-y-4">
              {formData.crew.map((member, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium text-sm">Osoba {index + 1}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeCrewMember(index)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="space-y-2">
                      <Label>Imię i nazwisko</Label>
                      <Input
                        value={member.name}
                        onChange={(e) => updateCrewMember(index, 'name', e.target.value)}
                        placeholder="np. Anna Nowak"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Stopień żeglarski/motorowodny</Label>
                      <Input
                        value={member.certificate}
                        onChange={(e) => updateCrewMember(index, 'certificate', e.target.value)}
                        placeholder="np. Żeglarz Jachtowy"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Funkcja na jachcie</Label>
                      <Input
                        value={member.rank}
                        onChange={(e) => updateCrewMember(index, 'rank', e.target.value)}
                        placeholder="np. Załogant"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Uwagi</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="captain-comments">Uwagi kapitana</Label>
                <Textarea
                  id="captain-comments"
                  value={formData.captainComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, captainComments: e.target.value }))}
                  placeholder="Wpisz uwagi dotyczące rejsu..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="owner-comments">Uwagi armatora/właściciela jachtu</Label>
                <Textarea
                  id="owner-comments"
                  value={formData.ownerComments}
                  onChange={(e) => setFormData(prev => ({ ...prev, ownerComments: e.target.value }))}
                  placeholder="Wpisz uwagi armatora..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}