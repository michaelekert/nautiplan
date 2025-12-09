import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, Edit2, X } from "lucide-react";
import * as z from "zod";
import { pdf } from '@react-pdf/renderer';
import { CrewOpinionPdf } from '@/documentToGenerate/CrewOpinionPdf';

const crewMemberSchema = z.object({
  firstName: z.string().min(2, "Imię musi mieć minimum 2 znaki"),
  lastName: z.string().min(2, "Nazwisko musi mieć minimum 2 znaki"),
  sailingDegree: z.string().min(3, "Stopień żeglarski jest wymagany"),
  phone: z.e164("Nieprawidłowy numer telefonu"),
  email: z.email("Nieprawidłowy adres email"),
  role: z.string().min(3, "Funkcja jest wymagana"),
});

export type CrewMemberFormData = z.infer<typeof crewMemberSchema>;

export interface CrewMember extends CrewMemberFormData {
  id: string;
}

// dodac jesxcze tlumaczenie
const fieldLabels: Record<keyof CrewMemberFormData, string> = {
  firstName: "Imię",
  lastName: "Nazwisko",
  sailingDegree: "Stopień żeglarski",
  phone: "Telefon",
  email: "Email",
  role: "Funkcja",
};

const fieldPlaceholders: Record<keyof CrewMemberFormData, string> = {
  firstName: "Wpisz imię",
  lastName: "Wpisz nazwisko",
  sailingDegree: "Podaj stopień żeglarski",
  phone: "np. +48123456789",
  email: "np. example@email.com",
  role: "Podaj funkcję",
};

const isCrewMemberComplete = (member: CrewMember): boolean => {
  try {
    crewMemberSchema.parse({
      firstName: member.firstName,
      lastName: member.lastName,
      sailingDegree: member.sailingDegree,
      phone: member.phone,
      email: member.email,
      role: member.role,
    });
    return true;
  } catch {
    return false;
  }
};

export function CruiseOpinions() {
  const [members, setMembers] = useState<CrewMember[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);

  const addMember = () => {
    const newMember: CrewMember = {
      id: crypto.randomUUID(),
      firstName: "",
      lastName: "",
      sailingDegree: "",
      phone: "",
      email: "",
      role: "",
    };
    setMembers((prev) => [...prev, newMember]);
    setEditingId(newMember.id);
  };

  const editMember = (id: string) => {
    setEditingId(id);
  };

  const handleSave = (id: string, data: CrewMemberFormData) => {
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...data } : m))
    );
    setEditingId(null);
  };

  const handleCancel = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (member && !isCrewMemberComplete(member)) {
      setMembers((prev) => prev.filter((m) => m.id !== id));
    }
    setEditingId(null);
  };

  const removeMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
  };

  const generatePdfs = async () => {
    for (const member of members) {
      const blob = await pdf(<CrewOpinionPdf member={member} />).toBlob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${member.firstName}_${member.lastName}_opinia_z_rejsu.pdf`;
      a.click();

      URL.revokeObjectURL(url);
    }
  };

  const hasCompleteMembers = members.some(isCrewMemberComplete);

  return (
    <div className="space-y-6">
      <Button onClick={addMember} className="mb-4">
        <Plus className="w-4 h-4 mr-2" />
        Dodaj członka załogi
      </Button>

      {members.length === 0 && (
        <p className="text-muted-foreground">
          Brak członków załogi — dodaj pierwszego.
        </p>
      )}

      {members.map((member) => (
        <Card key={member.id}>
          <CardContent className="pt-6">
            {editingId === member.id ? (
              <MemberForm
                member={member}
                onSave={(data) => handleSave(member.id, data)}
                onCancel={() => handleCancel(member.id)}
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
                  <Button variant="destructive" size="sm" onClick={() => removeMember(member.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {hasCompleteMembers && (
        <Button onClick={generatePdfs} className="mb-4">
          Wygeneruj opinie rejsu
        </Button>
      )}
    </div>
  );
}

function MemberForm({
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
        {(Object.keys(form.getValues()) as (keyof CrewMemberFormData)[]).map((key) => (
          <FormField
            key={key}
            name={key}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{fieldLabels[key]}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={fieldPlaceholders[key]} />
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
