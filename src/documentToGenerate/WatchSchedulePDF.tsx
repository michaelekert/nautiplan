import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/font/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/font/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
});

const watchColors = [
  { bg: '#e0f2fe', text: '#0369a1' },
  { bg: '#fef3c7', text: '#b45309' },
  { bg: '#d1fae5', text: '#047857' },
  { bg: '#ede9fe', text: '#7c3aed' },
];

const toRoman = (num: number): string => {
  const romanNumerals = ['I', 'II', 'III', 'IV'];
  return romanNumerals[num - 1] || num.toString();
};

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

interface WatchSchedulePDFProps {
  schedule: ScheduleData;
  watchMembers: WatchMember[];
  hasGalleyWatch: boolean;
  startDate: string;
  endDate: string;
  watchDuration: number;
  watchCount: number;
  withoutNames?: boolean;
}

const createStyles = (daysCount: number, watchCount: number) => {
  const isCompact = daysCount > 7;
  const fontSize = isCompact ? 6 : 8;
  const padding = isCompact ? 3 : 5;
  const legendItemWidth = `${100 / watchCount}%`;
  
  return StyleSheet.create({
    page: {
      padding: 15,
      fontFamily: 'Roboto',
      fontSize: fontSize,
      backgroundColor: '#ffffff',
      justifyContent: 'center',
    },
    content: {
      flex: 1,
      justifyContent: 'center',
    },
    header: {
      marginBottom: 8,
      borderBottom: '2px solid #1e40af',
      paddingBottom: 6,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    titleSection: {
      flex: 1,
    },
    title: {
      fontSize: isCompact ? 14 : 16,
      fontWeight: 'bold',
      color: '#1e40af',
    },
    subtitle: {
      fontSize: isCompact ? 7 : 8,
      color: '#64748b',
    },
    infoSection: {
      flexDirection: 'row',
      gap: 15,
    },
    infoItem: {
      alignItems: 'center',
    },
    infoLabel: {
      fontSize: 5,
      color: '#64748b',
      textTransform: 'uppercase',
    },
    infoValue: {
      fontSize: isCompact ? 7 : 8,
      color: '#1e293b',
      fontWeight: 'bold',
    },
    legendSection: {
      marginBottom: 8,
      padding: 6,
      backgroundColor: '#f8fafc',
      borderRadius: 4,
      borderWidth: 1,
      borderColor: '#e2e8f0',
    },
    legendTitle: {
      fontSize: isCompact ? 6 : 7,
      fontWeight: 'bold',
      color: '#475569',
      marginBottom: 4,
    },
    legendGrid: {
      flexDirection: 'row',
      width: '100%',
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      width: legendItemWidth,
      paddingRight: 8,
    },
    legendBadge: {
      paddingHorizontal: 5,
      paddingVertical: 2,
      borderRadius: 3,
      marginRight: 4,
    },
    legendBadgeText: {
      fontSize: isCompact ? 6 : 7,
      fontWeight: 'bold',
    },
    legendNames: {
      fontSize: isCompact ? 6 : 7,
      color: '#334155',
      flex: 1,
    },
    emptyField: {
      flex: 1,
      borderBottomWidth: 1,
      borderBottomColor: '#94a3b8',
      minHeight: 10,
    },
    table: {
      borderWidth: 1,
      borderColor: '#cbd5e1',
    },
    tableRow: {
      flexDirection: 'row',
    },
    headerCell: {
      backgroundColor: '#1e40af',
      padding: padding,
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerCellText: {
      fontSize: isCompact ? 5 : 6,
      fontWeight: 'bold',
      color: '#ffffff',
      textAlign: 'center',
    },
    timeHeaderCell: {
      backgroundColor: '#f1f5f9',
      padding: padding,
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      justifyContent: 'center',
    },
    timeHeaderCellText: {
      fontSize: isCompact ? 5 : 6,
      fontWeight: 'bold',
      color: '#475569',
    },
    timeCell: {
      backgroundColor: '#f8fafc',
      padding: padding,
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      justifyContent: 'center',
    },
    timeCellText: {
      fontSize: isCompact ? 5 : 6,
      color: '#334155',
    },
    dataCell: {
      padding: isCompact ? 2 : 3,
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      justifyContent: 'center',
      alignItems: 'center',
    },
    watchBadge: {
      paddingHorizontal: isCompact ? 3 : 4,
      paddingVertical: isCompact ? 1 : 2,
      borderRadius: 2,
    },
    watchBadgeText: {
      fontSize: isCompact ? 6 : 7,
      fontWeight: 'bold',
    },
    galleyLabelCell: {
      backgroundColor: '#ffedd5',
      padding: padding,
      borderWidth: 0.5,
      borderColor: '#cbd5e1',
      justifyContent: 'center',
    },
    galleyLabelText: {
      fontSize: isCompact ? 5 : 6,
      fontWeight: 'bold',
      color: '#c2410c',
    },
    footer: {
      position: 'absolute',
      bottom: 10,
      left: 15,
      right: 15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      paddingTop: 5,
    },
    footerText: {
      fontSize: 5,
      color: '#94a3b8',
    },
  });
};

export const WatchSchedulePDF = ({
  schedule,
  watchMembers,
  hasGalleyWatch,
  startDate,
  endDate,
  watchDuration,
  watchCount,
  withoutNames = false,
}: WatchSchedulePDFProps) => {
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('pl-PL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const daysCount = schedule.days.length;
  const styles = createStyles(daysCount, watchCount);
  
  const timeColWidth = daysCount > 10 ? 10 : 12;
  const dataColWidth = (100 - timeColWidth) / daysCount;

  const hasAnyMembers = watchMembers.some(w => w.members.some(m => m.trim()));
  const showLegend = hasAnyMembers || withoutNames;

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleSection}>
            <Text style={styles.title}>Grafik Wacht</Text>
            <Text style={styles.subtitle}>Plan wacht nawigacyjnych na rejs</Text>
          </View>
          <View style={styles.infoSection}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Od</Text>
              <Text style={styles.infoValue}>{formatDate(startDate)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Do</Text>
              <Text style={styles.infoValue}>{formatDate(endDate)}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>Wachty</Text>
              <Text style={styles.infoValue}>{watchCount} × {watchDuration}h</Text>
            </View>
          </View>
        </View>
        
        {showLegend && (
          <View style={styles.legendSection}>
            <Text style={styles.legendTitle}>Skład wacht:</Text>
            <View style={styles.legendGrid}>
              {watchMembers.map((watch, idx) => {
                const color = watchColors[idx] || watchColors[0];
                const memberNames = watch.members.filter(m => m.trim()).join(', ');
                
                if (!withoutNames && !memberNames) return null;
                
                return (
                  <View key={idx} style={styles.legendItem}>
                    <View style={[styles.legendBadge, { backgroundColor: color.bg }]}>
                      <Text style={[styles.legendBadgeText, { color: color.text }]}>
                        {toRoman(watch.watchNumber)}
                      </Text>
                    </View>
                    {withoutNames ? (
                      <View style={styles.emptyField} />
                    ) : (
                      <Text style={styles.legendNames}>{memberNames}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          </View>
        )}
        
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={[styles.timeHeaderCell, { width: `${timeColWidth}%` }]}>
              <Text style={styles.timeHeaderCellText}>Godz.</Text>
            </View>
            {schedule.days.map((day, idx) => (
              <View key={idx} style={[styles.headerCell, { width: `${dataColWidth}%` }]}>
                <Text style={styles.headerCellText}>{day.date}</Text>
              </View>
            ))}
          </View>
          
          {schedule.timeSlots.map((time, timeIdx) => (
            <View key={timeIdx} style={styles.tableRow}>
              <View style={[styles.timeCell, { width: `${timeColWidth}%` }]}>
                <Text style={styles.timeCellText}>{time}</Text>
              </View>
              {schedule.days.map((day, dayIdx) => {
                const watchIdx = day.watches[timeIdx];
                const color = watchColors[watchIdx] || watchColors[0];
                return (
                  <View 
                    key={dayIdx} 
                    style={[
                      styles.dataCell, 
                      { width: `${dataColWidth}%`, backgroundColor: color.bg + '40' }
                    ]}
                  >
                    <View style={[styles.watchBadge, { backgroundColor: color.bg }]}>
                      <Text style={[styles.watchBadgeText, { color: color.text }]}>
                        {toRoman(watchIdx + 1)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
          
          {hasGalleyWatch && (
            <View style={styles.tableRow}>
              <View style={[styles.galleyLabelCell, { width: `${timeColWidth}%` }]}>
                <Text style={styles.galleyLabelText}>Kambuz</Text>
              </View>
              {schedule.days.map((day, dayIdx) => {
                const color = watchColors[day.galleyIndex] || watchColors[0];
                return (
                  <View 
                    key={dayIdx} 
                    style={[
                      styles.dataCell, 
                      { width: `${dataColWidth}%`, backgroundColor: color.bg + '40' }
                    ]}
                  >
                    <View style={[styles.watchBadge, { backgroundColor: color.bg }]}>
                      <Text style={[styles.watchBadgeText, { color: color.text }]}>
                        {toRoman(day.galleyIndex + 1)}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
        </View>
        
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Wygenerowano automatycznie</Text>
          <Text style={styles.footerText}>Strona 1 z 1</Text>
        </View>
      </Page>
    </Document>
  );
};