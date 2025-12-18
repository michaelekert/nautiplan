import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { pdf } from '@react-pdf/renderer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Download, Plus, Trash2, Loader2, Edit2, X, Check } from 'lucide-react';
import { CruiseCardPDF } from './PDFTemplate/CruiseCardPDF';

const captainSchema = z.object({
  name: z.string().optional(),
  certificate: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
});

const yachtSchema = z.object({
  regNo: z.string().optional(),
  name: z.string().optional(),
  length: z.string().optional(),
  homePort: z.string().optional(),
  enginePower: z.string().optional(),
});

const cruiseSchema = z.object({
  logBookNo: z.string().optional(),
  embarkationPort: z.string().optional(),
  embarkationDate: z.string().optional(),
  embarkationTidal: z.boolean().optional(),
  disembarkationPort: z.string().optional(),
  disembarkationDate: z.string().optional(),
  disembarkationTidal: z.boolean().optional(),
  visitedPorts: z.string().optional(),
  tidalPortsCount: z.string().optional(),
  cruiseDays: z.string().optional(),
});

const hoursSchema = z.object({
  totalUnderway: z.string().optional(),
  underSails: z.string().optional(),
  usingEngine: z.string().optional(),
  tidalWaters: z.string().optional(),
  inHarbours: z.string().optional(),
  tripNM: z.string().optional(),
});

const crewMemberSchema = z.object({
  name: z.string().optional(),
  certificate: z.string().optional(),
  rank: z.string().optional(),
});

const commentsSchema = z.object({
  captainComments: z.string().optional(),
  ownerComments: z.string().optional(),
});

export type CaptainFormData = z.infer<typeof captainSchema>;
export type YachtFormData = z.infer<typeof yachtSchema>;
export type CruiseFormData = z.infer<typeof cruiseSchema>;
export type HoursFormData = z.infer<typeof hoursSchema>;
export type CrewMemberFormData = z.infer<typeof crewMemberSchema>;
export type CommentsFormData = z.infer<typeof commentsSchema>;

export interface Captain extends CaptainFormData {
  id: string;
}

export interface Yacht extends YachtFormData {
  id: string;
}

export interface Cruise extends CruiseFormData {
  id: string;
}

export interface Hours extends HoursFormData {
  id: string;
}

export interface CrewMember extends CrewMemberFormData {
  id: string;
}

export interface Comments extends CommentsFormData {
  id: string;
}

const captainFieldLabels: Record<keyof CaptainFormData, string> = {
  name: 'Imię i nazwisko',
  certificate: 'Stopień żeglarski/motorowodny i nr patentu',
  phone: 'Telefon',
  email: 'Adres e-mail',
};

const captainFieldPlaceholders: Record<keyof CaptainFormData, string> = {
  name: 'np. Jan Kowalski',
  certificate: 'np. Kapitan Jachtowy 12345',
  phone: '+48 123 456 789',
  email: 'jan@email.pl',
};

const yachtFieldLabels: Record<keyof YachtFormData, string> = {
  regNo: 'Nr rejestracyjny',
  name: 'Nazwa jachtu',
  length: 'Długość całkowita [m]',
  homePort: 'Port macierzysty',
  enginePower: 'Moc silnika [kW]',
};

const yachtFieldPlaceholders: Record<keyof YachtFormData, string> = {
  regNo: 'np. POL-1234',
  name: 'np. Biały Orzeł',
  length: 'np. 12.5',
  homePort: 'np. Gdynia',
  enginePower: 'np. 55',
};

const hoursFieldLabels: Record<keyof HoursFormData, string> = {
  totalUnderway: 'Razem (pod żaglami i na silniku)',
  underSails: 'Pod żaglami',
  usingEngine: 'Na silniku',
  tidalWaters: 'Po wodach pływowych',
  inHarbours: 'W portach i na kotwicy',
  tripNM: 'Przebyto mil morskich',
};

const hoursFieldPlaceholders: Record<keyof HoursFormData, string> = {
  totalUnderway: 'np. 72',
  underSails: 'np. 48',
  usingEngine: 'np. 24',
  tidalWaters: 'np. 0',
  inHarbours: 'np. 264',
  tripNM: 'np. 180',
};

const crewFieldLabels: Record<keyof CrewMemberFormData, string> = {
  name: 'Imię i nazwisko',
  certificate: 'Stopień żeglarski/motorowodny',
  rank: 'Funkcja na jachcie',
};

const crewFieldPlaceholders: Record<keyof CrewMemberFormData, string> = {
  name: 'np. Anna Nowak',
  certificate: 'np. Żeglarz Jachtowy',
  rank: 'np. Załogant',
};

const isCrewMemberComplete = (member: CrewMember): boolean => {
  return !!(member.name?.trim() || member.certificate?.trim() || member.rank?.trim());
};

const hasAnyData = (
  captain: Captain | null,
  yacht: Yacht | null,
  cruise: Cruise | null,
  hours: Hours | null,
  crew: CrewMember[],
  comments: Comments | null
): boolean => {
  const hasCaptainData = captain && (
    captain.name?.trim() ||
    captain.certificate?.trim() ||
    captain.phone?.trim() ||
    captain.email?.trim()
  );

  const hasYachtData = yacht && (
    yacht.regNo?.trim() ||
    yacht.name?.trim() ||
    yacht.length?.trim() ||
    yacht.homePort?.trim() ||
    yacht.enginePower?.trim()
  );

  const hasCruiseData = cruise && (
    cruise.logBookNo?.trim() ||
    cruise.embarkationPort?.trim() ||
    cruise.embarkationDate?.trim() ||
    cruise.disembarkationPort?.trim() ||
    cruise.disembarkationDate?.trim() ||
    cruise.visitedPorts?.trim()
  );

  const hasHoursData = hours && (
    hours.totalUnderway?.trim() ||
    hours.underSails?.trim() ||
    hours.usingEngine?.trim() ||
    hours.tidalWaters?.trim() ||
    hours.inHarbours?.trim() ||
    hours.tripNM?.trim()
  );

  const hasCrewData = crew.some(isCrewMemberComplete);

  const hasCommentsData = comments && (
    comments.captainComments?.trim() ||
    comments.ownerComments?.trim()
  );

  return !!(hasCaptainData || hasYachtData || hasCruiseData || hasHoursData || hasCrewData || hasCommentsData);
};

export function CruiseCard() {
  const [captain, setCaptain] = useState<Captain | null>(null);
  const [editingCaptain, setEditingCaptain] = useState(false);

  const [yacht, setYacht] = useState<Yacht | null>(null);
  const [editingYacht, setEditingYacht] = useState(false);

  const [cruise, setCruise] = useState<Cruise | null>(null);
  const [editingCruise, setEditingCruise] = useState(false);

  const [hours, setHours] = useState<Hours | null>(null);
  const [editingHours, setEditingHours] = useState(false);

  const [crew, setCrew] = useState<CrewMember[]>([]);
  const [editingCrewId, setEditingCrewId] = useState<string | null>(null);

  const [comments, setComments] = useState<Comments | null>(null);
  const [editingComments, setEditingComments] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [isGeneratingEmpty, setIsGeneratingEmpty] = useState(false);

  const addCaptain = () => {
    const newCaptain: Captain = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      certificate: '',
      phone: '',
      email: '',
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
    if (!captain?.name && !captain?.certificate) {
      setCaptain(null);
    }
    setEditingCaptain(false);
  };

  const removeCaptain = () => setCaptain(null);

  const addYacht = () => {
    const newYacht: Yacht = {
      id: Math.random().toString(36).substring(2, 9),
      regNo: '',
      name: '',
      length: '',
      homePort: '',
      enginePower: '',
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
    if (!yacht?.name && !yacht?.regNo) {
      setYacht(null);
    }
    setEditingYacht(false);
  };

  const removeYacht = () => setYacht(null);

  const addCruise = () => {
    const newCruise: Cruise = {
      id: Math.random().toString(36).substring(2, 9),
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
    if (!cruise?.embarkationPort && !cruise?.disembarkationPort) {
      setCruise(null);
    }
    setEditingCruise(false);
  };

  const removeCruise = () => setCruise(null);

  const addHours = () => {
    const newHours: Hours = {
      id: Math.random().toString(36).substring(2, 9),
      totalUnderway: '',
      underSails: '',
      usingEngine: '',
      tidalWaters: '',
      inHarbours: '',
      tripNM: '',
    };
    setHours(newHours);
    setEditingHours(true);
  };

  const handleSaveHours = (data: HoursFormData) => {
    if (hours) {
      setHours({ ...hours, ...data });
    }
    setEditingHours(false);
  };

  const handleCancelHours = () => {
    if (!hours?.totalUnderway && !hours?.tripNM) {
      setHours(null);
    }
    setEditingHours(false);
  };

  const removeHours = () => setHours(null);

  const addCrewMember = () => {
    if (crew.length >= 8) return;
    const newMember: CrewMember = {
      id: Math.random().toString(36).substring(2, 9),
      name: '',
      certificate: '',
      rank: '',
    };
    setCrew((prev) => [...prev, newMember]);
    setEditingCrewId(newMember.id);
  };

  const handleSaveCrewMember = (id: string, data: CrewMemberFormData) => {
    setCrew((prev) => prev.map((m) => (m.id === id ? { ...m, ...data } : m)));
    setEditingCrewId(null);
  };

  const handleCancelCrewMember = (id: string) => {
    const member = crew.find((m) => m.id === id);
    if (member && !isCrewMemberComplete(member)) {
      setCrew((prev) => prev.filter((m) => m.id !== id));
    }
    setEditingCrewId(null);
  };

  const removeCrewMember = (id: string) => {
    setCrew((prev) => prev.filter((m) => m.id !== id));
  };

  const addComments = () => {
    const newComments: Comments = {
      id: Math.random().toString(36).substring(2, 9),
      captainComments: '',
      ownerComments: '',
    };
    setComments(newComments);
    setEditingComments(true);
  };

  const handleSaveComments = (data: CommentsFormData) => {
    if (comments) {
      setComments({ ...comments, ...data });
    }
    setEditingComments(false);
  };

  const handleCancelComments = () => {
    if (!comments?.captainComments && !comments?.ownerComments) {
      setComments(null);
    }
    setEditingComments(false);
  };

  const removeComments = () => setComments(null);

  const buildPdfData = () => ({
    captain: {
      name: captain?.name || '',
      certificate: captain?.certificate || '',
      phone: captain?.phone || '',
      email: captain?.email || '',
    },
    yacht: {
      regNo: yacht?.regNo || '',
      name: yacht?.name || '',
      length: yacht?.length || '',
      homePort: yacht?.homePort || '',
      enginePower: yacht?.enginePower || '',
    },
    cruise: {
      logBookNo: cruise?.logBookNo || '',
      embarkationPort: cruise?.embarkationPort || '',
      embarkationDate: cruise?.embarkationDate || '',
      embarkationTidal: cruise?.embarkationTidal ? 'TAK' : 'NIE',
      disembarkationPort: cruise?.disembarkationPort || '',
      disembarkationDate: cruise?.disembarkationDate || '',
      disembarkationTidal: cruise?.disembarkationTidal ? 'TAK' : 'NIE',
      visitedPorts: cruise?.visitedPorts || '',
      tidalPortsCount: cruise?.tidalPortsCount || '',
      cruiseDays: cruise?.cruiseDays || '',
    },
    hours: {
      totalUnderway: hours?.totalUnderway || '',
      underSails: hours?.underSails || '',
      usingEngine: hours?.usingEngine || '',
      tidalWaters: hours?.tidalWaters || '',
      inHarbours: hours?.inHarbours || '',
      tripNM: hours?.tripNM || '',
    },
    crew: crew.map((m) => ({
      name: m.name || '',
      certificate: m.certificate || '',
      rank: m.rank || '',
    })),
    captainComments: comments?.captainComments || '',
    ownerComments: comments?.ownerComments || '',
  });

  const getEmptyPdfData = () => ({
    captain: { name: '', certificate: '', phone: '', email: '' },
    yacht: { regNo: '', name: '', length: '', homePort: '', enginePower: '' },
    cruise: {
      logBookNo: '',
      embarkationPort: '',
      embarkationDate: '',
      embarkationTidal: '',
      disembarkationPort: '',
      disembarkationDate: '',
      disembarkationTidal: '',
      visitedPorts: '',
      tidalPortsCount: '',
      cruiseDays: '',
    },
    hours: { totalUnderway: '', underSails: '', usingEngine: '', tidalWaters: '', inHarbours: '', tripNM: '' },
    crew: [],
    captainComments: '',
    ownerComments: '',
  });

  const downloadPDF = async (data: ReturnType<typeof buildPdfData>, fileName: string) => {
    const blob = await pdf(<CruiseCardPDF data={data} />).toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadWithData = async () => {
    setIsGenerating(true);
    try {
      await downloadPDF(buildPdfData(), 'karta-rejsu.pdf');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadEmpty = async () => {
    setIsGeneratingEmpty(true);
    try {
      await downloadPDF(getEmptyPdfData(), 'karta-rejsu-pusta.pdf');
    } finally {
      setIsGeneratingEmpty(false);
    }
  };

  const resetAll = () => {
    setCaptain(null);
    setYacht(null);
    setCruise(null);
    setHours(null);
    setCrew([]);
    setComments(null);
  };

  const hasData = hasAnyData(captain, yacht, cruise, hours, crew, comments);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">Karta Rejsu</h1>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o kapitanie</CardTitle>
        </CardHeader>
        <CardContent>
          {!captain ? (
            <Button onClick={addCaptain}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj informacje o kapitanie
            </Button>
          ) : editingCaptain ? (
            <CaptainForm captain={captain} onSave={handleSaveCaptain} onCancel={handleCancelCaptain} />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p><strong>{captain.name || 'Brak imienia'}</strong></p>
                {captain.certificate && <p>Stopień: {captain.certificate}</p>}
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
          <CardTitle>Informacje o jachcie</CardTitle>
        </CardHeader>
        <CardContent>
          {!yacht ? (
            <Button onClick={addYacht}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj informacje o jachcie
            </Button>
          ) : editingYacht ? (
            <YachtForm yacht={yacht} onSave={handleSaveYacht} onCancel={handleCancelYacht} />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p><strong>{yacht.name || 'Brak nazwy'}</strong></p>
                {yacht.regNo && <p>Nr rej.: {yacht.regNo}</p>}
                {yacht.length && <p>Długość: {yacht.length} m</p>}
                {yacht.homePort && <p>Port: {yacht.homePort}</p>}
                {yacht.enginePower && <p>Silnik: {yacht.enginePower} kW</p>}
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
            <CruiseInfoForm cruise={cruise} onSave={handleSaveCruise} onCancel={handleCancelCruise} />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                {cruise.logBookNo && <p><strong>Nr pływania: {cruise.logBookNo}</strong></p>}
                {cruise.embarkationPort && (
                  <p>Zaokrętowanie: {cruise.embarkationPort} {cruise.embarkationDate && `(${cruise.embarkationDate})`} {cruise.embarkationTidal && '- pływowy'}</p>
                )}
                {cruise.disembarkationPort && (
                  <p>Wyokrętowanie: {cruise.disembarkationPort} {cruise.disembarkationDate && `(${cruise.disembarkationDate})`} {cruise.disembarkationTidal && '- pływowy'}</p>
                )}
                {cruise.visitedPorts && <p>Odwiedzone porty: {cruise.visitedPorts}</p>}
                {cruise.cruiseDays && <p>Dni rejsu: {cruise.cruiseDays}</p>}
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
          <CardTitle>Godziny żeglugi i postoju</CardTitle>
        </CardHeader>
        <CardContent>
          {!hours ? (
            <Button onClick={addHours}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj godziny żeglugi
            </Button>
          ) : editingHours ? (
            <HoursForm hours={hours} onSave={handleSaveHours} onCancel={handleCancelHours} />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                {hours.totalUnderway && <p><strong>Razem: {hours.totalUnderway} godz.</strong></p>}
                {hours.underSails && <p>Pod żaglami: {hours.underSails} godz.</p>}
                {hours.usingEngine && <p>Na silniku: {hours.usingEngine} godz.</p>}
                {hours.tidalWaters && <p>Wody pływowe: {hours.tidalWaters} godz.</p>}
                {hours.inHarbours && <p>W portach/na kotwicy: {hours.inHarbours} godz.</p>}
                {hours.tripNM && <p>Przebyto: {hours.tripNM} NM</p>}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingHours(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={removeHours}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Informacje o załodze</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={addCrewMember} disabled={crew.length >= 8}>
            <Plus className="w-4 h-4 mr-2" />
            Dodaj członka załogi {crew.length > 0 && `(${crew.length}/8)`}
          </Button>

          {crew.length === 0 && (
            <p className="text-muted-foreground">
              Brak członków załogi — dodaj pierwszego (max. 8).
            </p>
          )}

          {crew.map((member) => (
            <Card key={member.id} className="bg-muted/30">
              <CardContent className="pt-6">
                {editingCrewId === member.id ? (
                  <CrewMemberForm
                    member={member}
                    onSave={(data) => handleSaveCrewMember(member.id, data)}
                    onCancel={() => handleCancelCrewMember(member.id)}
                  />
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <p><strong>{member.name || 'Brak imienia'}</strong></p>
                      {member.certificate && <p>{member.certificate}</p>}
                      {member.rank && <p>Funkcja: {member.rank}</p>}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setEditingCrewId(member.id)}>
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => removeCrewMember(member.id)}>
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

      <Card>
        <CardHeader>
          <CardTitle>Uwagi</CardTitle>
        </CardHeader>
        <CardContent>
          {!comments ? (
            <Button onClick={addComments}>
              <Plus className="w-4 h-4 mr-2" />
              Dodaj uwagi
            </Button>
          ) : editingComments ? (
            <CommentsForm comments={comments} onSave={handleSaveComments} onCancel={handleCancelComments} />
          ) : (
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                {comments.captainComments && (
                  <div>
                    <p className="font-medium">Uwagi kapitana:</p>
                    <p className="text-muted-foreground">{comments.captainComments}</p>
                  </div>
                )}
                {comments.ownerComments && (
                  <div>
                    <p className="font-medium">Uwagi armatora:</p>
                    <p className="text-muted-foreground">{comments.ownerComments}</p>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingComments(true)}>
                  <Edit2 className="w-4 h-4" />
                </Button>
                <Button variant="destructive" size="sm" onClick={removeComments}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="space-y-3">
        {hasData && (
          <Button onClick={handleDownloadWithData} disabled={isGenerating} size="lg" className="w-full">
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Download className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? 'Generowanie...' : 'Pobierz kartę rejsu z danymi'}
          </Button>
        )}

        <Button onClick={handleDownloadEmpty} disabled={isGeneratingEmpty} size="lg" variant="outline" className="w-full">
          {isGeneratingEmpty ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Download className="w-4 h-4 mr-2" />
          )}
          {isGeneratingEmpty ? 'Generowanie...' : 'Pobierz pusty formularz'}
        </Button>

        {hasData && (
          <Button onClick={resetAll} variant="ghost" className="w-full">
            Wyczyść wszystkie dane
          </Button>
        )}
      </div>
    </div>
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
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
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

  const handleSubmit = () => {
    onSave(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={(e) => e.preventDefault()}>
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

function CruiseInfoForm({
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
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FormField
          name="logBookNo"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nr pływania (dziennik jachtowy)</FormLabel>
              <FormControl>
                <Input {...field} placeholder="np. 2024/001" />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="rounded-lg border p-4 space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground">Zaokrętowanie</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <FormField
              name="embarkationPort"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="np. Gdynia" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="embarkationDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="embarkationTidal"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 h-10">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
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
              name="disembarkationPort"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="np. Sopot" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="disembarkationDate"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data</FormLabel>
                  <FormControl>
                    <Input {...field} type="date" />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              name="disembarkationTidal"
              control={form.control}
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 h-10">
                  <FormControl>
                    <Checkbox checked={field.value || false} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">Port pływowy</FormLabel>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="visitedPorts"
            control={form.control}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Odwiedzone porty</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="np. Hel, Jastarnia, Puck, Władysławowo" rows={2} />
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
                  <Input {...field} placeholder="0" />
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
                  <Input {...field} placeholder="np. 14" />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
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

function HoursForm({
  hours,
  onSave,
  onCancel,
}: {
  hours: Hours;
  onSave: (data: HoursFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<HoursFormData>({
    resolver: zodResolver(hoursSchema),
    defaultValues: hours,
  });

  const handleSubmit = () => {
    onSave(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 md:grid-cols-3 gap-4" onSubmit={(e) => e.preventDefault()}>
        {(Object.keys(hoursFieldLabels) as (keyof HoursFormData)[]).map((key) => (
          <FormField
            key={key}
            name={key}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{hoursFieldLabels[key]}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={hoursFieldPlaceholders[key]} />
                </FormControl>
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
    defaultValues: member,
  });

  const handleSubmit = () => {
    onSave(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="grid grid-cols-1 md:grid-cols-3 gap-4" onSubmit={(e) => e.preventDefault()}>
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

function CommentsForm({
  comments,
  onSave,
  onCancel,
}: {
  comments: Comments;
  onSave: (data: CommentsFormData) => void;
  onCancel: () => void;
}) {
  const form = useForm<CommentsFormData>({
    resolver: zodResolver(commentsSchema),
    defaultValues: comments,
  });

  const handleSubmit = () => {
    onSave(form.getValues());
  };

  return (
    <Form {...form}>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FormField
          name="captainComments"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uwagi kapitana</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Wpisz uwagi dotyczące rejsu..." rows={3} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          name="ownerComments"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uwagi armatora/właściciela jachtu</FormLabel>
              <FormControl>
                <Textarea {...field} placeholder="Wpisz uwagi armatora..." rows={3} />
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