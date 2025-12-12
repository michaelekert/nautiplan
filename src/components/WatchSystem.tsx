import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Calendar, Clock, Users, ChefHat, Anchor, Download, PenLine } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { WatchSchedulePDF } from '@/documentToGenerate/WatchSchedulePDF';

interface WatchMember {
  watchNumber: number;
  members: string[];
}

interface WatchScheduleEntry {
  time: string;
  watchIndex: number;
  galleyIndex?: number;
}

export function WatchSystem() {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [watchCount, setWatchCount] = useState<3 | 4>(3);
  const [watchDuration, setWatchDuration] = useState<3 | 4>(4);
  const [watchMembers, setWatchMembers] = useState<WatchMember[]>([
    { watchNumber: 1, members: [''] },
    { watchNumber: 2, members: [''] },
    { watchNumber: 3, members: [''] },
  ]);
  const [hasGalleyWatch, setHasGalleyWatch] = useState<boolean>(false);
  const [galleyHasNavWatch, setGalleyHasNavWatch] = useState<boolean>(false);
  const [schedule, setSchedule] = useState<{ date: string; entries: WatchScheduleEntry[] }[] | null>(null);

  const handleWatchCountChange = (count: 3 | 4) => {
    setWatchCount(count);
    const newMembers: WatchMember[] = [];
    for (let i = 1; i <= count; i++) {
      const existing = watchMembers.find(w => w.watchNumber === i);
      newMembers.push(existing || { watchNumber: i, members: [''] });
    }
    setWatchMembers(newMembers);
  };

  const addMemberToWatch = (watchIndex: number) => {
    const newMembers = [...watchMembers];
    newMembers[watchIndex].members.push('');
    setWatchMembers(newMembers);
  };

  const removeMemberFromWatch = (watchIndex: number, memberIndex: number) => {
    const newMembers = [...watchMembers];
    if (newMembers[watchIndex].members.length > 1) {
      newMembers[watchIndex].members.splice(memberIndex, 1);
      setWatchMembers(newMembers);
    }
  };

  const updateMemberName = (watchIndex: number, memberIndex: number, name: string) => {
    const newMembers = [...watchMembers];
    newMembers[watchIndex].members[memberIndex] = name;
    setWatchMembers(newMembers);
  };

  const generateSchedule = () => {
    if (!startDate || !endDate) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const scheduleData: { date: string; entries: WatchScheduleEntry[] }[] = [];
    let currentWatchIndex = 0;
    let galleyWatchIndex = 0;
    const watchesPerDay = 24 / watchDuration;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dayEntries: WatchScheduleEntry[] = [];
      const dateStr = d.toLocaleDateString('pl-PL', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long' 
      });

      for (let slot = 0; slot < watchesPerDay; slot++) {
        const startHour = slot * watchDuration;
        const endHour = ((slot + 1) * watchDuration) % 24;
        const timeStr = `${startHour.toString().padStart(2, '0')}:00 - ${endHour.toString().padStart(2, '0')}:00`;
        let navWatchIdx = currentWatchIndex % watchCount;

        if (hasGalleyWatch && !galleyHasNavWatch && navWatchIdx === (galleyWatchIndex % watchCount)) {
          navWatchIdx = (navWatchIdx + 1) % watchCount;
        }

        const entry: WatchScheduleEntry = {
          time: timeStr,
          watchIndex: navWatchIdx,
        };

        if (hasGalleyWatch) {
          entry.galleyIndex = galleyWatchIndex % watchCount;
        }

        dayEntries.push(entry);
        currentWatchIndex = (currentWatchIndex + 1) % watchCount;
      }

      galleyWatchIndex = (galleyWatchIndex + 1) % watchCount;
      scheduleData.push({
        date: dateStr,
        entries: dayEntries
      });
    }

    setSchedule(scheduleData);
  };

  const watchColors = [
    'bg-sky-100 text-sky-800 border-sky-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-emerald-100 text-emerald-800 border-emerald-300',
    'bg-violet-100 text-violet-800 border-violet-300',
  ];

  return (
    <div className="space-y-6">
      <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
        <CardHeader className="border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg shadow-blue-200">
              <Anchor className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-slate-800">System Wacht</CardTitle>
              <CardDescription className="text-slate-500">
                Zaplanuj grafik wacht na rejs
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">1</div>
              <h3 className="text-lg font-semibold text-slate-700">Czas trwania rejsu</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
              <div className="space-y-2">
                <Label htmlFor="startDate" className="text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data rozpoczęcia
                </Label>
                <Input
                  id="startDate"
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate" className="text-slate-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Data zakończenia
                </Label>
                <Input
                  id="endDate"
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border-slate-200 focus:border-blue-400 focus:ring-blue-400"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">2</div>
                <h3 className="text-lg font-semibold text-slate-700">Liczba wacht</h3>
              </div>
              <div className="flex gap-3 ml-10">
                <Button
                  variant={watchCount === 3 ? "default" : "outline"}
                  onClick={() => handleWatchCountChange(3)}
                  className={watchCount === 3 ? "bg-blue-500 hover:bg-blue-600" : "border-slate-200 hover:bg-slate-50"}
                >
                  <Users className="w-4 h-4 mr-2" />
                  3 wachty
                </Button>
                <Button
                  variant={watchCount === 4 ? "default" : "outline"}
                  onClick={() => handleWatchCountChange(4)}
                  className={watchCount === 4 ? "bg-blue-500 hover:bg-blue-600" : "border-slate-200 hover:bg-slate-50"}
                >
                  <Users className="w-4 h-4 mr-2" />
                  4 wachty
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">3</div>
                <h3 className="text-lg font-semibold text-slate-700">Czas trwania wachty</h3>
              </div>
              <div className="flex gap-3 ml-10">
                <Button
                  variant={watchDuration === 3 ? "default" : "outline"}
                  onClick={() => setWatchDuration(3)}
                  className={watchDuration === 3 ? "bg-blue-500 hover:bg-blue-600" : "border-slate-200 hover:bg-slate-50"}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  3 godziny
                </Button>
                <Button
                  variant={watchDuration === 4 ? "default" : "outline"}
                  onClick={() => setWatchDuration(4)}
                  className={watchDuration === 4 ? "bg-blue-500 hover:bg-blue-600" : "border-slate-200 hover:bg-slate-50"}
                >
                  <Clock className="w-4 h-4 mr-2" />
                  4 godziny
                </Button>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">4</div>
                <h3 className="text-lg font-semibold text-slate-700">Członkowie wacht</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 ml-10">
                {watchMembers.map((watch, watchIdx) => (
                  <Card key={watchIdx} className={`border-2 ${watchColors[watchIdx]}`}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-semibold">
                        Wachta {watch.watchNumber}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {watch.members.map((member, memberIdx) => (
                        <div key={memberIdx} className="flex gap-2">
                          <Input
                            placeholder={`Osoba ${memberIdx + 1}`}
                            value={member}
                            onChange={(e) => updateMemberName(watchIdx, memberIdx, e.target.value)}
                            className="bg-white/80 border-white/50 text-sm"
                          />
                          {watch.members.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMemberFromWatch(watchIdx, memberIdx)}
                              className="px-2 hover:bg-white/50"
                            >
                              ✕
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => addMemberToWatch(watchIdx)}
                        className="w-full text-xs hover:bg-white/50"
                      >
                        + Dodaj osobę
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">5</div>
                <h3 className="text-lg font-semibold text-slate-700">Wachta kambuzowa</h3>
              </div>
              <div className="flex items-center gap-4 ml-10">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 border border-orange-200">
                  <ChefHat className="w-5 h-5 text-orange-600" />
                  <Label htmlFor="galley" className="text-slate-700 font-medium">
                    Dodaj wachtę kambuzową
                  </Label>
                  <Switch
                    id="galley"
                    checked={hasGalleyWatch}
                    onCheckedChange={setHasGalleyWatch}
                  />
                </div>
              </div>
            </div>

            {hasGalleyWatch && watchCount === 4 && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">6</div>
                  <h3 className="text-lg font-semibold text-slate-700">Kambuz i wachty nawigacyjne</h3>
                </div>
                <div className="flex items-center gap-4 ml-10">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-violet-50 border border-violet-200">
                    <Anchor className="w-5 h-5 text-violet-600" />
                    <Label htmlFor="galleyNav" className="text-slate-700 font-medium">
                      Kambuz pełni też wachty nawigacyjne
                    </Label>
                    <Switch
                      id="galleyNav"
                      checked={galleyHasNavWatch}
                      onCheckedChange={setGalleyHasNavWatch}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <Button
                onClick={generateSchedule}
                disabled={!startDate || !endDate}
                className="w-full md:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-200 py-6 px-8 text-lg"
              >
                <Anchor className="w-5 h-5 mr-2" />
                Generuj grafik wacht
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {schedule && (
        <Card className="border-2 border-slate-200 bg-gradient-to-br from-slate-50 to-white">
          <CardHeader className="border-b border-slate-100">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-slate-800">Grafik wacht</CardTitle>
                  <CardDescription className="text-slate-500">
                    {schedule.length} dni rejsu
                  </CardDescription>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <PDFDownloadLink
                  document={
                    <WatchSchedulePDF
                      schedule={schedule}
                      watchMembers={watchMembers}
                      hasGalleyWatch={hasGalleyWatch}
                      startDate={startDate}
                      endDate={endDate}
                      watchDuration={watchDuration}
                      watchCount={watchCount}
                      withoutNames={false}
                    />
                  }
                  fileName="grafik_wacht.pdf"
                >
                  {({ loading }) => (
                    <Button
                      variant="outline"
                      disabled={loading}
                      className="border-slate-200 hover:bg-slate-50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {loading ? 'Generowanie...' : 'Pobierz PDF'}
                    </Button>
                  )}
                </PDFDownloadLink>
                <PDFDownloadLink
                  document={
                    <WatchSchedulePDF
                      schedule={schedule}
                      watchMembers={watchMembers}
                      hasGalleyWatch={hasGalleyWatch}
                      startDate={startDate}
                      endDate={endDate}
                      watchDuration={watchDuration}
                      watchCount={watchCount}
                      withoutNames={true}
                    />
                  }
                  fileName="grafik_wacht_do_wypelnienia.pdf"
                >
                  {({ loading }) => (
                    <Button
                      variant="outline"
                      disabled={loading}
                      className="border-orange-200 hover:bg-orange-50 text-orange-700"
                    >
                      <PenLine className="w-4 h-4 mr-2" />
                      {loading ? 'Generowanie...' : 'PDF do wypełnienia'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <h4 className="text-sm font-semibold text-slate-600 mb-3">Skład wacht:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {watchMembers.map((watch, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <span className={`px-3 py-1.5 rounded-full text-sm font-bold border ${watchColors[idx]}`}>
                      Wachta {watch.watchNumber}
                    </span>
                    <span className="text-sm text-slate-600">
                      {watch.members.filter(m => m.trim()).join(', ') || '(brak przypisanych)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              {schedule.map((day, dayIdx) => (
                <div key={dayIdx} className="mb-6">
                  <h3 className="text-lg font-bold text-slate-700 mb-3 capitalize flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                    {day.date}
                  </h3>
                  <div className="overflow-hidden rounded-lg border border-slate-200">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-slate-100">
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              Godziny
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <Anchor className="w-4 h-4" />
                              Wachta nawigacyjna
                            </div>
                          </th>
                          {hasGalleyWatch && (
                            <th className="px-4 py-3 text-left text-sm font-semibold text-slate-600 border-b border-slate-200">
                              <div className="flex items-center gap-2">
                                <ChefHat className="w-4 h-4" />
                                Kambuz
                              </div>
                            </th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {day.entries.map((entry, entryIdx) => (
                          <tr 
                            key={entryIdx} 
                            className={`${entryIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50'} hover:bg-slate-100 transition-colors`}
                          >
                            <td className="px-4 py-3 text-sm font-mono text-slate-600 border-b border-slate-100">
                              {entry.time}
                            </td>
                            <td className="px-4 py-3 border-b border-slate-100">
                              <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${watchColors[entry.watchIndex]}`}>
                                Wachta {entry.watchIndex + 1}
                              </span>
                            </td>
                            {hasGalleyWatch && entry.galleyIndex !== undefined && (
                              <td className="px-4 py-3 border-b border-slate-100">
                                <span className={`inline-flex px-3 py-1.5 rounded-full text-sm font-medium border ${watchColors[entry.galleyIndex]}`}>
                                  Wachta {entry.galleyIndex + 1}
                                </span>
                              </td>
                            )}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}