import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Calendar, Clock, Users, ChefHat, Anchor, Download, PenLine } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { WatchSchedulePDF } from '@/documentToGenerate/WatchSchedulePDF';

interface WatchMember {
  watchNumber: number;
  members: string[];
}

interface DaySchedule {
  date: string;
  shortDate: string;
  watches: number[];
  galleyIndex: number;
}

interface ScheduleData {
  timeSlots: string[];
  days: DaySchedule[];
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
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  const toRoman = (num: number): string => {
    const romanNumerals = ['I', 'II', 'III', 'IV'];
    return romanNumerals[num - 1] || num.toString();
  };

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
    const watchesPerDay = 24 / watchDuration;
    
    const timeSlots: string[] = [];
    for (let slot = 0; slot < watchesPerDay; slot++) {
      const startHour = slot * watchDuration;
      const endHour = ((slot + 1) * watchDuration) % 24;
      timeSlots.push(`${startHour.toString().padStart(2, '0')}00-${endHour.toString().padStart(2, '0')}00`);
    }

    const days: DaySchedule[] = [];
    let currentWatchIndex = 0;
    let galleyWatchIndex = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toLocaleDateString('pl-PL', { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short' 
      });
      const shortDate = d.toLocaleDateString('pl-PL', { 
        day: 'numeric', 
        month: 'numeric' 
      });

      const watches: number[] = [];
      
      for (let slot = 0; slot < watchesPerDay; slot++) {
        let navWatchIdx = currentWatchIndex % watchCount;

        if (hasGalleyWatch && !galleyHasNavWatch && navWatchIdx === (galleyWatchIndex % watchCount)) {
          navWatchIdx = (navWatchIdx + 1) % watchCount;
        }

        watches.push(navWatchIdx);
        currentWatchIndex = (currentWatchIndex + 1) % watchCount;
      }

      days.push({
        date: dateStr,
        shortDate,
        watches,
        galleyIndex: galleyWatchIndex % watchCount,
      });

      galleyWatchIndex = (galleyWatchIndex + 1) % watchCount;
    }

    setSchedule({ timeSlots, days });
  };

  const watchColors = [
    'bg-sky-100 text-sky-800 border-sky-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-emerald-100 text-emerald-800 border-emerald-300',
    'bg-violet-100 text-violet-800 border-violet-300',
  ];

  const watchBgColors = [
    'bg-sky-50',
    'bg-amber-50',
    'bg-emerald-50',
    'bg-violet-50',
  ];

  const hasAnyMembers = watchMembers.some(w => w.members.some(m => m.trim()));

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
                        {toRoman(watch.watchNumber)}
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-emerald-200">
                  <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg sm:text-xl font-bold text-slate-800">Grafik wacht</CardTitle>
                  <CardDescription className="text-slate-500">
                    {schedule.days.length} dni rejsu
                  </CardDescription>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
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

          <CardContent className="p-4 sm:p-6 overflow-x-auto">
            {hasAnyMembers && (
              <div className="mb-4 p-3 rounded-lg bg-slate-50 border border-slate-200">
                <div className="flex flex-wrap gap-3">
                  {watchMembers.map((watch, idx) => {
                    const members = watch.members.filter(m => m.trim()).join(', ');
                    if (!members) return null;
                    return (
                      <div key={idx} className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold border ${watchColors[idx]}`}>
                          {toRoman(watch.watchNumber)}
                        </span>
                        <span className="text-xs text-slate-600">{members}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="overflow-x-auto w-70">
              <Table className="min-w-[600px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Godziny</TableHead>
                    {schedule.days.map((day, idx) => (
                      <TableHead key={idx} className="text-center whitespace-nowrap">
                        {day.date}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.timeSlots.map((time, timeIdx) => (
                    <TableRow key={timeIdx}>
                      <TableCell className="font-medium">{time}</TableCell>
                      {schedule.days.map((day, dayIdx) => (
                        <TableCell key={dayIdx} className="text-center">
                          <span className={`inline-flex px-2 py-1 rounded text-sm font-bold ${watchColors[day.watches[timeIdx]]}`}>
                            {toRoman(day.watches[timeIdx] + 1)}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                  {hasGalleyWatch && (
                    <TableRow>
                      <TableCell className="font-medium">Kambuz</TableCell>
                      {schedule.days.map((day, dayIdx) => (
                        <TableCell key={dayIdx} className="text-center">
                          <span className={`inline-flex px-2 py-1 rounded text-sm font-bold ${watchColors[day.galleyIndex]}`}>
                            {toRoman(day.galleyIndex + 1)}
                          </span>
                        </TableCell>
                      ))}
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}