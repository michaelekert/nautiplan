import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, Edit2, X, Check, Share } from "lucide-react";
import * as z from "zod";
import { pdf } from '@react-pdf/renderer';
import { CrewOpinionPdf } from './PDFTemplate/CrewOpinionPdf';

const crewMemberSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  sailingDegree: z.string().optional(),
  phone: z.e164("Nieprawidłowy numer telefonu").optional(),
  email: z.email("Nieprawidłowy adres email").optional(),
  role: z.string().optional(),
});


const yachtSchema = z.object({
  registrationNumber: z.string().optional(),
  name: z.string().optional(),
  lengthOverall: z.string().optional(),
  homePort: z.string().optional(),
  enginePower: z.string().optional(),
});


const cruiseSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  startPort: z.string().optional(),
  startPortTidal: z.boolean().optional(),
  endPort: z.string().optional(),
  endPortTidal: z.boolean().optional(),
  visitedPorts: z.string().optional(),
  tidalPortsCount: z.string().optional(),
  cruiseDays: z.string().optional(),
  totalHours: z.string().optional(),
  sailingHours: z.string().optional(),
  engineHours: z.string().optional(),
  tidalWatersHours: z.string().optional(),
  inPortHours: z.string().optional(),
  anchoredHours: z.string().optional(),
  nauticalMiles: z.string().optional(),
});


const captainSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  sailingDegree: z.string().optional(),
  phone: z.e164("Nieprawidłowy numer telefonu").optional(),
  email: z.email("Nieprawidłowy adres email").optional(),
});

export type CrewMemberFormData = z.infer<typeof crewMemberSchema>;
export type YachtFormData = z.infer<typeof yachtSchema>;
export type CruiseFormData = z.infer<typeof cruiseSchema>;
export type CaptainFormData = z.infer<typeof captainSchema>;

export interface CrewMember extends CrewMemberFormData {
  id: string;
}

export interface Yacht extends YachtFormData {
  id: string;
}

export interface Cruise extends CruiseFormData {
  id: string;
}

export interface Captain extends CaptainFormData {
  id: string;
}

const crewFieldLabels: Record<keyof CrewMemberFormData, string> = {
  firstName: "Imię",
  lastName: "Nazwisko",
  sailingDegree: "Stopień żeglarski",
  phone: "Telefon",
  email: "Email",
  role: "Funkcja",
};

const crewFieldPlaceholders: Record<keyof CrewMemberFormData, string> = {
  firstName: "Wpisz imię",
  lastName: "Wpisz nazwisko",
  sailingDegree: "Podaj stopień żeglarski",
  phone: "np. +48123456789",
  email: "np. example@email.com",
  role: "Podaj funkcję",
};

const yachtFieldLabels: Record<keyof YachtFormData, string> = {
  registrationNumber: "Nr rejestracyjny",
  name: "Nazwa jachtu",
  lengthOverall: "LC (m)",
  homePort: "Port macierzysty",
  enginePower: "Moc silnika",
};

const yachtFieldPlaceholders: Record<keyof YachtFormData, string> = {
  registrationNumber: "np. PL-123-ABC",
  name: "Nazwa jachtu",
  lengthOverall: "np. 12.5",
  homePort: "np. Gdynia",
  enginePower: "np. 30 KM",
};

const captainFieldLabels: Record<keyof CaptainFormData, string> = {
  firstName: "Imię",
  lastName: "Nazwisko",
  sailingDegree: "Stopień",
  phone: "Telefon",
  email: "Email",
};

const captainFieldPlaceholders: Record<keyof CaptainFormData, string> = {
  firstName: "Wpisz imię",
  lastName: "Wpisz nazwisko",
  sailingDegree: "Podaj stopień",
  phone: "np. +48123456789",
  email: "np. kapitan@email.com",
};

const isCrewMemberComplete = (member: CrewMember): boolean => {
  return !!(
    member.firstName?.trim() ||
    member.lastName?.trim() ||
    member.sailingDegree?.trim() ||
    member.phone?.trim() ||
    member.email?.trim() ||
    member.role?.trim()
  );
};

export function CruiseOpinions() {
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [editingCrewId, setEditingCrewId] = useState<string | null>(null);

  const [yacht, setYacht] = useState<Yacht | null>(null);
  const [editingYacht, setEditingYacht] = useState(false);

  const [cruise, setCruise] = useState<Cruise | null>(null);
  const [editingCruise, setEditingCruise] = useState(false);

  const [captain, setCaptain] = useState<Captain | null>(null);
  const [editingCaptain, setEditingCaptain] = useState(false);

  const addMember = () => {
    const newMember: CrewMember = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: undefined,
      lastName: undefined,
      sailingDegree: undefined,
      phone: undefined,
      email: undefined,
      role: undefined,
    };
    setMembers((prev) => [...prev, newMember]);
    setEditingCrewId(newMember.id);
  };

  const editMember = (id: string) => {
    setEditingCrewId(id);
  };

  const handleSaveMember = (id: string, data: CrewMemberFormData) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
    setEditingCrewId(null);
  };

  const handleCancelMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member && !isCrewMemberComplete(member)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
    setEditingCrewId(null);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const addYacht = () => {
    const newYacht: Yacht = {
      id: Math.random().toString(36).substring(2, 9),
      registrationNumber: "",
      name: "",
      lengthOverall: "",
      homePort: "",
      enginePower: "",
    };
    setYacht(newYacht);
    setEditingYacht(true);
  };

  const handleSaveYacht = (data: YachtFormData) => {
    if (yacht) {
      setYacht({ ...yacht, ...data });
    }
    setEditingYacht(false);
  };

  const handleCancelYacht = () => {
    if (!yacht?.name && !yacht?.registrationNumber) {
      setYacht(null);
    }
    setEditingYacht(false);
  };

  const removeYacht = () => {
    setYacht(null);
  };

  const addCruise = () => {
    const newCruise: Cruise = {
      id: Math.random().toString(36).substring(2, 9),
      startDate: "",
      endDate: "",
      startPort: "",
      startPortTidal: false,
      endPort: "",
      endPortTidal: false,
      visitedPorts: "",
      tidalPortsCount: "",
      cruiseDays: "",
      totalHours: "",
      sailingHours: "",
      engineHours: "",
      tidalWatersHours: "",
      inPortHours: "",
      anchoredHours: "",
      nauticalMiles: "",
    };
    setCruise(newCruise);
    setEditingCruise(true);
  };

  const handleSaveCruise = (data: CruiseFormData) => {
    if (cruise) {
      setCruise({ ...cruise, ...data });
    }
    setEditingCruise(false);
  };

  const handleCancelCruise = () => {
    if (!cruise?.startDate && !cruise?.endDate) {
      setCruise(null);
    }
    setEditingCruise(false);
  };

  const removeCruise = () => {
    setCruise(null);
  };

  const addCaptain = () => {
    const newCaptain: Captain = {
      id: Math.random().toString(36).substring(2, 9),
      firstName: "",
      lastName: "",
      sailingDegree: "",
      phone: "",
      email: "",
    };
    setCaptain(newCaptain);
    setEditingCaptain(true);
  };

  const handleSaveCaptain = (data: CaptainFormData) => {
    if (captain) {
      setCaptain({ ...captain, ...data });
    }
    setEditingCaptain(false);
  };

  const handleCancelCaptain = () => {
    if (!captain?.firstName && !captain?.lastName) {
      setCaptain(null);
    }
    setEditingCaptain(false);
  };

  const removeCaptain = () => {
    setCaptain(null);
  };


  const shareFile = async (blob: Blob, fileName: string, title: string, text: string) => {
    const file = new File([blob], fileName, { type: 'application/pdf' });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title,
          text,
        });
      } catch (err) {
        console.error(err);
      }
    } else {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(url);
    }
  };


  const generatePdfs = async () => {
  for (const member of members) {
    const blob = await pdf(
      <CrewOpinionPdf member={member} captain={captain} yacht={yacht} cruise={cruise} />
    ).toBlob();

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${member.firstName}_${member.lastName}_opinia_z_rejsu.pdf`;
    a.click();

    URL.revokeObjectURL(url);
  }
};

const generateEmptyPdf = async () => {
  const blob = await pdf(<CrewOpinionPdf />).toBlob();
  await shareFile(blob, 'Opinia_z_rejsu.pdf', 'Opinia z rejsu', 'Czysty formularz do wypełnienia');
};


const generateSinglePdf = async (member: CrewMember) => {
  const blob = await pdf(
    <CrewOpinionPdf member={member} captain={captain} yacht={yacht} cruise={cruise} />
  ).toBlob();

  const firstName = member.firstName || "BrakImienia";
  const lastName = member.lastName || "BrakNazwiska";
  const fileName = `${firstName}_${lastName}_opinia_z_rejsu.pdf`;

  
  const shareTitle = `${firstName} ${lastName} – Opinia z rejsu`;

  await shareFile(blob, fileName, shareTitle, `Opinia dla ${firstName} ${lastName}`);
};

const generatePartialPdf = async () => {
  const blob = await pdf(
    <CrewOpinionPdf captain={captain} yacht={yacht} cruise={cruise} />
  ).toBlob();

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = 'Opinia_z_rejsu.pdf';
  a.click();
  URL.revokeObjectURL(url);
};


  const hasCompleteMembers = members.some(isCrewMemberComplete); 
  const isCrewCompletelyEmpty = members.length === 0 || members.every(m => !isCrewMemberComplete(m));

  const hasAnyData = () => {
    const hasYachtData = yacht && (
      yacht.name?.trim() ||
      yacht.registrationNumber?.trim() ||
      yacht.lengthOverall?.trim() ||
      yacht.homePort?.trim() ||
      yacht.enginePower?.trim()
    );

    const hasCruiseData = cruise && (
      cruise.startDate?.trim() ||
      cruise.endDate?.trim() ||
      cruise.startPort?.trim() ||
      cruise.endPort?.trim() ||
      cruise.visitedPorts?.trim() ||
      cruise.cruiseDays?.trim() ||
      cruise.nauticalMiles?.trim()
    );

    const hasCaptainData = captain && (
      captain.firstName?.trim() ||
      captain.lastName?.trim() ||
      captain.sailingDegree?.trim() ||
      captain.phone?.trim() ||
      captain.email?.trim()
    );

    return hasYachtData || hasCruiseData || hasCaptainData || members.length > 0;
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Formularz opinii z rejsu</h1>

      <Card>
        <CardHeader>
          <CardTitle>Jacht</CardTitle>
        </CardHeader>
        <CardContent>
          {!yacht ? (
            <Button onClick={addYacht}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj jacht
            </Button>
          ) : editingYacht ? (
            <YachtForm
              yacht={yacht}
              onSave={handleSaveYacht}
              onCancel={handleCancelYacht}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p><strong>{yacht.name || "Brak nazwy"}</strong></p>
                {yacht.registrationNumber && <p>Nr rej.: {yacht.registrationNumber}</p>}
                {yacht.lengthOverall && <p>LC: {yacht.lengthOverall} m</p>}
                {yacht.homePort && <p>Port: {yacht.homePort}</p>}
                {yacht.enginePower && <p>Silnik: {yacht.enginePower}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingYacht(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={removeYacht}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o rejsie</CardTitle>
        </CardHeader>
        <CardContent>
          {!cruise ? (
            <Button onClick={addCruise}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj informacje o rejsie
            </Button>
          ) : editingCruise ? (
            <CruiseForm
              cruise={cruise}
              onSave={handleSaveCruise}
              onCancel={handleCancelCruise}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                {cruise.startDate && cruise.endDate && (
                  <p><strong>{cruise.startDate} - {cruise.endDate}</strong></p>
                )}
                {cruise.startPort && <p>Start: {cruise.startPort} {cruise.startPortTidal && "(pływowy)"}</p>}
                {cruise.endPort && <p>Koniec: {cruise.endPort} {cruise.endPortTidal && "(pływowy)"}</p>}
                {cruise.cruiseDays && <p>Dni rejsu: {cruise.cruiseDays}</p>}
                {cruise.nauticalMiles && <p>Mile morskie: {cruise.nauticalMiles}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingCruise(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={removeCruise}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Kapitan</CardTitle>
        </CardHeader>
        <CardContent>
          {!captain ? (
            <Button onClick={addCaptain}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj kapitana
            </Button>
          ) : editingCaptain ? (
            <CaptainForm
              captain={captain}
              onSave={handleSaveCaptain}
              onCancel={handleCancelCaptain}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p><strong>{captain.firstName} {captain.lastName}</strong></p>
                {captain.sailingDegree && <p>Stopień: {captain.sailingDegree}</p>}
                {captain.phone && <p>Tel: {captain.phone}</p>}
                {captain.email && <p>Email: {captain.email}</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingCaptain(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={removeCaptain}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Członkowie załogi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addMember}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj członka załogi
          </Button>

          {members.length === 0 && (
            <p className="text-muted-foreground">
              Brak członków załogi — dodaj pierwszego.
            </p>
          )}

          {members.map((member) => (
            <Card key={member.id} className="bg-muted/30">
              <CardContent className="pt-6">
                {editingCrewId === member.id ? (
                  <CrewMemberForm
                    member={member}
                    onSave={(data) => handleSaveMember(member.id, data)}
                    onCancel={() => handleCancelMember(member.id)}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p>
                        <strong>{member.firstName} {member.lastName}</strong>
                      </p>
                      <p>{member.role} – {member.sailingDegree}</p>
                      <p>{member.phone} | {member.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => editMember(member.id)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button className="md:hidden" variant="secondary" size="sm" onClick={() => generateSinglePdf(member)}>
                        <Share className="w-4 h-4 mr-1" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeMember(member.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>

      {hasCompleteMembers && (
        <Button onClick={generatePdfs} size="lg" className="w-full">
          Wygeneruj opinie dla członków załogi
        </Button>
      )}

      {isCrewCompletelyEmpty && hasAnyData() && (
        <Button onClick={generatePartialPdf} size="lg" variant="secondary" className="w-full">
          Wygeneruj opinię o rejsie z częściowymi danymi
        </Button>
      )}

      <Button onClick={generateEmptyPdf} size="lg" variant="outline" className="w-full">
        Wygeneruj pusty formularz
      </Button>
    </div>
  );
}

function CrewMemberForm({
  member,
  onSave,
  onCancel,
}: {
  member: CrewMember;
  onSave: (data: CrewMemberFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<CrewMemberFormData>({
    resolver: zodResolver(crewMemberSchema),
    defaultValues: {
      firstName: member.firstName,
      lastName: member.lastName,
      sailingDegree: member.sailingDegree,
      phone: member.phone,
      email: member.email,
      role: member.role,
    },
    mode: "onChange",
  });

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onSave(form.getValues());
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {(Object.keys(crewFieldLabels) as (keyof CrewMemberFormData)[]).map((key) => (
          <FormField
            key={key}
            name={key}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{crewFieldLabels[key]}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={crewFieldPlaceholders[key]} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Anuluj
        </Button>
        <Button onClick={handleSubmit}>
          <Check className="w-4 h-4 mr-1" /> Zapisz
        </Button>
      </div>
    </Form>
  );
}

function YachtForm({
  yacht,
  onSave,
  onCancel,
}: {
  yacht: Yacht;
  onSave: (data: YachtFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<YachtFormData>({
    resolver: zodResolver(yachtSchema),
    defaultValues: yacht,
  });

  const handleSubmit = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      onSave(form.getValues());
    }
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {(Object.keys(yachtFieldLabels) as (keyof YachtFormData)[]).map((key) => (
          <FormField
            key={key}
            name={key}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{yachtFieldLabels[key]}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={yachtFieldPlaceholders[key]} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Anuluj
        </Button>
        <Button onClick={handleSubmit}>Zapisz</Button>
      </div>
    </Form>
  );
}

function CruiseForm({
  cruise,
  onSave,
  onCancel,
}: {
  cruise: Cruise;
  onSave: (data: CruiseFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<CruiseFormData>({
    resolver: zodResolver(cruiseSchema),
    defaultValues: cruise,
  });

  const handleSubmit = () => {
    onSave(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        <FormField
          name="startDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data startu</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="endDate"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data końca</FormLabel>
              <FormControl>
                <Input {...field} type="date" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="startPort"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port zaokrętowania</FormLabel>
              <FormControl>
                <Input {...field} placeholder="np. Gdynia" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="startPortTidal"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 pb-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Port pływowy</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          name="endPort"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Port wyokrętowania</FormLabel>
              <FormControl>
                <Input {...field} placeholder="np. Hel" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="endPortTidal"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center gap-2 space-y-0 pb-4">
              <FormControl>
                <input
                  type="checkbox"
                  checked={field.value || false}
                  onChange={field.onChange}
                  className="w-4 h-4"
                />
              </FormControl>
              <FormLabel className="!mt-0">Port pływowy</FormLabel>
            </FormItem>
          )}
        />
        <FormField
          name="visitedPorts"
          control={form.control}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Odwiedzone porty</FormLabel>
              <FormControl>
                <Input {...field} placeholder="np. Gdynia, Hel, Władysławowo" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="tidalPortsCount"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liczba portów pływowych</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="cruiseDays"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Liczba dni rejsu</FormLabel>
              <FormControl>
                <Input {...field} type="number" placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="totalHours"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Razem godzin (pod żaglami + silnik)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="sailingHours"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pod żaglami (godz.)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="engineHours"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Na silniku (godz.)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="tidalWatersHours"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Po wodach pływowych (godz.)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="inPortHours"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>W portach (godz.)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="anchoredHours"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Na kotwicy (godz.)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="nauticalMiles"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Przebyto mil morskich</FormLabel>
              <FormControl>
                <Input {...field} placeholder="0" />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Anuluj
        </Button>
        <Button onClick={handleSubmit}>
          <Check className="w-4 h-4 mr-1" /> Zapisz
        </Button>
      </div>
    </Form>
  );
}

function CaptainForm({
  captain,
  onSave,
  onCancel,
}: {
  captain: Captain;
  onSave: (data: CaptainFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<CaptainFormData>({
    resolver: zodResolver(captainSchema),
    defaultValues: captain,
  });

  const handleSubmit = () => {
    onSave(form.getValues());
  };

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
        onSubmit={(e) => e.preventDefault()}
      >
        {(Object.keys(captainFieldLabels) as (keyof CaptainFormData)[]).map((key) => (
          <FormField
            key={key}
            name={key}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{captainFieldLabels[key]}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={captainFieldPlaceholders[key]} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </form>
      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-1" /> Anuluj
        </Button>
        <Button onClick={handleSubmit}>
          <Check className="w-4 h-4 mr-1" /> Zapisz
        </Button>
      </div>
    </Form>
  );
}