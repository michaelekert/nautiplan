import { useCallback, useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { pdf } from '@react-pdf/renderer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Download, FileText, Plus, Trash2, Loader2 } from 'lucide-react';
import { CruiseCardPDF } from '@/documentToGenerate/CruiseCardPDF';

const crewMemberSchema = z.object({
  name: z.string(),
  certificate: z.string(),
  rank: z.string(),
});

const cruiseCardSchema = z.object({
  captain: z.object({
    name: z.string(),
    certificate: z.string(),
    phone: z.string(),
    email: z.string(),
  }),
  yacht: z.object({
    regNo: z.string(),
    name: z.string(),
    length: z.string(),
    homePort: z.string(),
    enginePower: z.string(),
  }),
  cruise: z.object({
    logBookNo: z.string(),
    embarkationPort: z.string(),
    embarkationDate: z.string(),
    embarkationTidal: z.boolean(),
    disembarkationPort: z.string(),
    disembarkationDate: z.string(),
    disembarkationTidal: z.boolean(),
    visitedPorts: z.string(),
    tidalPortsCount: z.string(),
    cruiseDays: z.string(),
  }),
  hours: z.object({
    totalUnderway: z.string(),
    underSails: z.string(),
    usingEngine: z.string(),
    tidalWaters: z.string(),
    inHarbours: z.string(),
    tripNM: z.string(),
  }),
  crew: z.array(crewMemberSchema),
  captainComments: z.string(),
  ownerComments: z.string(),
});

type CruiseCardFormData = z.infer<typeof cruiseCardSchema>;

const getEmptyForm = (): CruiseCardFormData => ({
  captain: {
    name: '',
    certificate: '',
    phone: '',
    email: '',
  },
  yacht: {
    regNo: '',
    name: '',
    length: '',
    homePort: '',
    enginePower: '',
  },
  cruise: {
    logBookNo: '',
    embarkationPort: '',
    embarkationDate: '',
    embarkationTidal: false,
    disembarkationPort: '',
    disembarkationDate: '',
    disembarkationTidal: false,
    visitedPorts: '',
    tidalPortsCount: '',
    cruiseDays: '',
  },
  hours: {
    totalUnderway: '',
    underSails: '',
    usingEngine: '',
    tidalWaters: '',
    inHarbours: '',
    tripNM: '',
  },
  crew: [],
  captainComments: '',
  ownerComments: '',
});

const formToPdfData = (data: CruiseCardFormData, isEmpty: boolean = false) => ({
  ...data,
  cruise: {
    ...data.cruise,
    embarkationTidal: isEmpty ? '' : (data.cruise.embarkationTidal ? 'TAK' : 'NIE'),
    disembarkationTidal: isEmpty ? '' : (data.cruise.disembarkationTidal ? 'TAK' : 'NIE'),
  },
});

export function CruiseCard() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingEmpty, setIsGeneratingEmpty] = useState(false);

  const form = useForm<CruiseCardFormData>({
    resolver: zodResolver(cruiseCardSchema),
    defaultValues: getEmptyForm(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'crew',
  });

  const downloadPDF = useCallback(async (data: CruiseCardFormData, fileName: string, isEmpty: boolean = false) => {
    const pdfData = formToPdfData(data, isEmpty);
    const blob = await pdf(<CruiseCardPDF data={pdfData} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const handleDownloadWithData = async () => {
    setIsGenerating(true);
    try {
      const data = form.getValues();
      await downloadPDF(data, 'karta-rejsu.pdf');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadEmpty = async () => {
    setIsGeneratingEmpty(true);
    try {
      await downloadPDF(getEmptyForm(), 'karta-rejsu-pusta.pdf', true);
    } finally {
      setIsGeneratingEmpty(false);
    }
  };

  const addCrewMember = () => {
    if (fields.length < 8) {
      append({ name: '', certificate: '', rank: '' });
    }
  };

  const resetForm = () => {
    form.reset(getEmptyForm());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Karta Rejsu
          </CardTitle>
          <CardDescription>
            Wypełnij formularz, aby wygenerować Kartę Rejsu lub pobierz pusty dokument do wypełnienia ręcznie.
          </CardDescription>
        </CardHeader>
        <CardContent>

          <div className="flex flex-wrap gap-3 mb-6">
            <Button onClick={handleDownloadWithData} disabled={isGenerating} type="button">
              {isGenerating ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGenerating ? 'Generowanie...' : 'Pobierz z danymi'}
            </Button>

            <Button variant="outline" onClick={handleDownloadEmpty} disabled={isGeneratingEmpty} type="button">
              {isGeneratingEmpty ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Download className="w-4 h-4 mr-2" />
              )}
              {isGeneratingEmpty ? 'Generowanie...' : 'Pobierz pusty formularz'}
            </Button>

            <Button variant="ghost" onClick={resetForm} type="button">
              Wyczyść formularz
            </Button>
          </div>

          <Form {...form}>
            <form className="space-y-8">

              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informacje o kapitanie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="captain.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Imię i nazwisko</FormLabel>
                        <FormControl>
                          <Input placeholder="np. Jan Kowalski" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="captain.certificate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stopień żeglarski/motorowodny i nr patentu</FormLabel>
                        <FormControl>
                          <Input placeholder="np. Kapitan Jachtowy 12345" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="captain.phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefon</FormLabel>
                        <FormControl>
                          <Input placeholder="+48 123 456 789" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="captain.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Adres e-mail</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="jan@email.pl" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informacje o jachcie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="yacht.regNo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nr rejestracyjny</FormLabel>
                        <FormControl>
                          <Input placeholder="np. POL-1234" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yacht.name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nazwa jachtu</FormLabel>
                        <FormControl>
                          <Input placeholder="np. Biały Orzeł" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yacht.length"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Długość całkowita [m]</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 12.5" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yacht.homePort"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Port macierzysty</FormLabel>
                        <FormControl>
                          <Input placeholder="np. Gdynia" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="yacht.enginePower"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Moc silnika [kW]</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 55" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Informacje o rejsie</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cruise.logBookNo"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Nr pływania (dziennik jachtowy)</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 2024/001" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Zaokrętowanie</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="cruise.embarkationPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                            <Input placeholder="np. Gdynia" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cruise.embarkationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cruise.embarkationTidal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 h-10">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Port pływowy</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="rounded-lg border p-4 space-y-4">
                  <h4 className="font-medium text-sm text-muted-foreground">Wyokrętowanie</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                    <FormField
                      control={form.control}
                      name="cruise.disembarkationPort"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Port</FormLabel>
                          <FormControl>
                            <Input placeholder="np. Sopot" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cruise.disembarkationDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Data</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="cruise.disembarkationTidal"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center space-x-3 space-y-0 h-10">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="font-normal">Port pływowy</FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cruise.visitedPorts"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>Odwiedzone porty</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="np. Hel, Jastarnia, Puck, Władysławowo"
                            rows={2}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cruise.tidalPortsCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liczba portów pływowych</FormLabel>
                        <FormControl>
                          <Input placeholder="0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cruise.cruiseDays"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Liczba dni rejsu</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 14" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Godziny żeglugi i postoju</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="hours.totalUnderway"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Razem (pod żaglami i na silniku)</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 72" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours.underSails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pod żaglami</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 48" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours.usingEngine"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Na silniku</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 24" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours.tidalWaters"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Po wodach pływowych</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 0" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours.inHarbours"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>W portach i na kotwicy</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 264" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="hours.tripNM"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Przebyto mil morskich</FormLabel>
                        <FormControl>
                          <Input placeholder="np. 180" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="text-lg font-semibold">Załoga</h3>
                  <Button
                    onClick={addCrewMember}
                    disabled={fields.length >= 8}
                    size="sm"
                    variant="outline"
                    type="button"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Dodaj członka załogi
                  </Button>
                </div>

                {fields.length === 0 && (
                  <p className="text-center text-gray-500 py-4">
                    Brak członków załogi. Kliknij "Dodaj członka załogi" aby dodać pierwszą osobę (max. 8).
                  </p>
                )}

                <div className="space-y-4">
                  {fields.map((field, index) => (
                    <div key={field.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-medium text-sm">Osoba {index + 1}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => remove(index)}
                          type="button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <FormField
                          control={form.control}
                          name={`crew.${index}.name`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Imię i nazwisko</FormLabel>
                              <FormControl>
                                <Input placeholder="np. Anna Nowak" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`crew.${index}.certificate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Stopień żeglarski/motorowodny</FormLabel>
                              <FormControl>
                                <Input placeholder="np. Żeglarz Jachtowy" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`crew.${index}.rank`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Funkcja na jachcie</FormLabel>
                              <FormControl>
                                <Input placeholder="np. Załogant" {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Uwagi</h3>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="captainComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uwagi kapitana</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Wpisz uwagi dotyczące rejsu..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ownerComments"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Uwagi armatora/właściciela jachtu</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Wpisz uwagi armatora..."
                            rows={3}
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}