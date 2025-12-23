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
import { WatchSchedulePDF } from './PDFTemplate/WatchSchedulePDF';

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

interface ScheduleConfig {
  watchCount: 3 | 4;
  watchDuration: 3 | 4;
  hasGalleyWatch: boolean;
  galleyHasNavWatch: boolean;
}

function generateTimeSlots(config: ScheduleConfig): string[] {
  const { watchCount, watchDuration, hasGalleyWatch, galleyHasNavWatch } = config;
  const hasJump = hasGalleyWatch && !galleyHasNavWatch && watchCount === 4 && watchDuration === 4;
  
  if (hasJump) {
    return ['0000-0400', '0400-0800', '0800-1200', '1200-1400', '1400-1600', '1600-2000', '2000-2400'];
  }
  
  const slotsPerDay = 24 / watchDuration;
  return Array.from({ length: slotsPerDay }, (_, i) => {
    const startHour = i * watchDuration;
    const endHour = ((i + 1) * watchDuration) % 24;
    return `${startHour.toString().padStart(2, '0')}00-${endHour.toString().padStart(2, '0')}00`;
  });
}

function generateDayWatches(dayIndex: number, config: ScheduleConfig): { watches: number[]; galleyIndex: number } {
  const { watchCount, watchDuration, hasGalleyWatch, galleyHasNavWatch } = config;
  const slotsPerDay = 24 / watchDuration;
  
  if (!hasGalleyWatch) {
    const dailyOffset = slotsPerDay % watchCount;
    const startWatch = (dailyOffset * dayIndex) % watchCount;
    const watches = Array.from({ length: slotsPerDay }, (_, i) => (startWatch + i) % watchCount);
    return { watches, galleyIndex: 0 };
  }
  
  const watchCycleDay = dayIndex % watchCount;
  const galleyCycleDay = dayIndex % (watchCount - 1);
  
  if (watchCount === 3 && watchDuration === 3 && galleyHasNavWatch) {
    const startWatches = [0, 2, 1];
    const galleyRotation = [2, 1, 0];
    const startWatch = startWatches[watchCycleDay];
    const galleyIndex = galleyRotation[watchCycleDay];
    const watches = Array.from({ length: 8 }, (_, i) => (startWatch + i) % 3);
    return { watches, galleyIndex };
  }
  
  if (watchCount === 3 && !galleyHasNavWatch) {
    const galleyIndex = (2 - watchCycleDay + 3) % 3;
    const navWatches = [0, 1, 2].filter(w => w !== galleyIndex);
    const watches = Array.from({ length: slotsPerDay }, (_, i) => navWatches[i % 2]);
    return { watches, galleyIndex };
  }
  
  const galleyIndex = galleyCycleDay + 1;
  
  if (watchDuration === 3) {
    const startWatch = watchCycleDay;
    const watches: number[] = [];
    
    for (let i = 0; i < 5; i++) {
      watches.push((startWatch + i) % watchCount);
    }
    
    const skippedWatch = (watches[4] + 1) % watchCount;
    let nextWatch = skippedWatch;
    
    for (let i = 5; i < 8; i++) {
      if (nextWatch === skippedWatch) nextWatch = (nextWatch + 1) % watchCount;
      watches.push(nextWatch);
      nextWatch = (nextWatch + 1) % watchCount;
    }
    
    return { watches, galleyIndex };
  }
  
  if (watchDuration === 4) {
    if (galleyHasNavWatch) {
      const startWatch = watchCycleDay;
      const watches: number[] = [];
      
      for (let i = 0; i < 3; i++) {
        watches.push((startWatch + i) % watchCount);
      }
      
      const skippedWatch = (watches[2] + 1) % watchCount;
      let nextWatch = skippedWatch;
      
      for (let i = 3; i < 6; i++) {
        if (nextWatch === skippedWatch) nextWatch = (nextWatch + 1) % watchCount;
        watches.push(nextWatch);
        nextWatch = (nextWatch + 1) % watchCount;
      }
      
      return { watches, galleyIndex };
    }
    
    const galleyRotation = [3, 0, 1, 2];
    const galleyIdx = galleyRotation[watchCycleDay];
    const navWatches = [0, 1, 2, 3].filter(w => w !== galleyIdx);
    
    let startNavIdx = navWatches.indexOf(watchCycleDay);
    if (startNavIdx === -1) startNavIdx = 0;
    
    const watches = Array.from({ length: 7 }, (_, i) => navWatches[(startNavIdx + i) % 3]);
    return { watches, galleyIndex: galleyIdx };
  }
  
  return { watches: Array(slotsPerDay).fill(0), galleyIndex: 0 };
}

function generateFullSchedule(startDate: Date, endDate: Date, config: ScheduleConfig): ScheduleData {
  const timeSlots = generateTimeSlots(config);
  const days: DaySchedule[] = [];
  
  let dayIndex = 0;
  const currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    const dateStr = currentDate.toLocaleDateString('pl-PL', { weekday: 'short', day: 'numeric', month: 'short' });
    const shortDate = currentDate.toLocaleDateString('pl-PL', { day: 'numeric', month: 'numeric' });
    const { watches, galleyIndex } = generateDayWatches(dayIndex, config);
    
    days.push({ date: dateStr, shortDate, watches, galleyIndex });
    dayIndex++;
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return { timeSlots, days };
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
  const [galleyHasNavWatch, setGalleyHasNavWatch] = useState<boolean>(true);
  const [schedule, setSchedule] = useState<ScheduleData | null>(null);

  const toRoman = (num: number): string => ['I', 'II', 'III', 'IV'][num - 1] || num.toString();

  const handleWatchCountChange = (count: 3 | 4) => {
    setWatchCount(count);
    setWatchMembers(
      Array.from({ length: count }, (_, i) => 
        watchMembers.find(w => w.watchNumber === i + 1) || { watchNumber: i + 1, members: [''] }
      )
    );
  };

  const addMemberToWatch = (watchIndex: number) => {
    const newMembers = [...watchMembers];
    newMembers[watchIndex].members.push('');
    setWatchMembers(newMembers);
  };

  const removeMemberFromWatch = (watchIndex: number, memberIndex: number) => {
    if (watchMembers[watchIndex].members.length > 1) {
      const newMembers = [...watchMembers];
      newMembers[watchIndex].members.splice(memberIndex, 1);
      setWatchMembers(newMembers);
    }
  };

  const updateMemberName = (watchIndex: number, memberIndex: number, name: string) => {
    const newMembers = [...watchMembers];
    newMembers[watchIndex].members[memberIndex] = name;
    setWatchMembers(newMembers);
  };

  const handleGenerateSchedule = () => {
    if (!startDate || !endDate) return;
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start > end) {
      alert('Data rozpoczęcia musi być przed datą zakończenia');
      return;
    }
    
    setSchedule(generateFullSchedule(start, end, { watchCount, watchDuration, hasGalleyWatch, galleyHasNavWatch }));
  };

  const watchColors = [
    'bg-sky-100 text-sky-800 border-sky-300',
    'bg-amber-100 text-amber-800 border-amber-300',
    'bg-emerald-100 text-emerald-800 border-emerald-300',
    'bg-violet-100 text-violet-800 border-violet-300',
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
              <CardDescription className="text-slate-500">Zaplanuj grafik wacht na rejs</CardDescription>
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
                      <CardTitle className="text-base font-semibold">{toRoman(watch.watchNumber)}</CardTitle>
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
                  <Label htmlFor="galley" className="text-slate-700 font-medium">Dodaj wachtę kambuzową</Label>
                  <Switch id="galley" checked={hasGalleyWatch} onCheckedChange={setHasGalleyWatch} />
                </div>
              </div>
            </div>

            {hasGalleyWatch && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">6</div>
                  <h3 className="text-lg font-semibold text-slate-700">Kambuz i wachty nawigacyjne</h3>
                </div>
                <div className="flex items-center gap-4 ml-10">
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-violet-50 border border-violet-200">
                    <Anchor className="w-5 h-5 text-violet-600" />
                    <Label htmlFor="galleyNav" className="text-slate-700 font-medium">Kambuz pełni też wachty nawigacyjne</Label>
                    <Switch id="galleyNav" checked={galleyHasNavWatch} onCheckedChange={setGalleyHasNavWatch} />
                  </div>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-100">
              <Button
                onClick={handleGenerateSchedule}
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
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
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
                    <Button variant="outline" disabled={loading} className="border-slate-200 hover:bg-slate-50 w-full sm:w-auto">
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
                    <Button variant="outline" disabled={loading} className="border-orange-200 hover:bg-orange-50 text-orange-700 w-full sm:w-auto">
                      <PenLine className="w-4 h-4 mr-2" />
                      {loading ? 'Generowanie...' : 'PDF do wypełnienia'}
                    </Button>
                  )}
                </PDFDownloadLink>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
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
            <div className="w-full overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px] sticky left-0 z-10">Godziny</TableHead>
                    {schedule.days.map((day, idx) => (
                      <TableHead key={idx} className="text-center whitespace-nowrap min-w-[80px]">{day.date}</TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {schedule.timeSlots.map((time, timeIdx) => (
                    <TableRow key={timeIdx}>
                      <TableCell className="font-medium sticky left-0 z-10">{time}</TableCell>
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
                    <TableRow className="bg-orange-50/50">
                      <TableCell className="font-medium sticky left-0 bg-orange-50 z-10">
                        <span className="flex items-center gap-1">
                          <ChefHat className="w-4 h-4 text-orange-600" />
                          Kambuz
                        </span>
                      </TableCell>
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