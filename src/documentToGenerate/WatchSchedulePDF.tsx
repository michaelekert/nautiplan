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

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 10,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2px solid #1e40af',
    paddingBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e40af',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    color: '#64748b',
  },
  infoSection: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 4,
  },
  infoColumn: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 8,
    color: '#64748b',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 11,
    color: '#1e293b',
    fontWeight: 'bold',
  },
  dayHeader: {
    backgroundColor: '#1e40af',
    padding: 10,
    marginTop: 15,
    marginBottom: 0,
  },
  dayHeaderText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  table: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderTopWidth: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  tableHeaderCell: {
    padding: 8,
    fontWeight: 'bold',
    fontSize: 9,
    color: '#475569',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    minHeight: 28,
  },
  tableRowEven: {
    backgroundColor: '#ffffff',
  },
  tableRowOdd: {
    backgroundColor: '#fafafa',
  },
  tableCell: {
    padding: 8,
    fontSize: 9,
    color: '#334155',
    justifyContent: 'center',
  },
  colTime: {
    width: '20%',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  colWatch: {
    width: '40%',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
  },
  colWatchNoGalley: {
    width: '80%',
  },
  colGalley: {
    width: '40%',
  },
  watchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  watchBadgeText: {
    fontSize: 8,
    fontWeight: 'bold',
  },
  legendSection: {
    marginTop: 20,
    padding: 12,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  legendTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: 10,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    width: '50%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingRight: 10,
  },
  legendBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginRight: 10,
    minWidth: 70,
  },
  legendBadgeText: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  legendNames: {
    flex: 1,
    fontSize: 9,
    color: '#334155',
  },
  emptyField: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    borderStyle: 'dotted',
    minHeight: 16,
    marginLeft: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingTop: 10,
  },
  footerText: {
    fontSize: 8,
    color: '#94a3b8',
  },
  pageNumber: {
    fontSize: 8,
    color: '#94a3b8',
  },
});

const watchColors = [
  { bg: '#e0f2fe', text: '#0369a1' },
  { bg: '#fef3c7', text: '#b45309' },
  { bg: '#d1fae5', text: '#047857' },
  { bg: '#ede9fe', text: '#7c3aed' },
];

interface WatchMember {
  watchNumber: number;
  members: string[];
}

interface WatchScheduleEntry {
  time: string;
  watchIndex: number;
  galleyIndex?: number;
}

interface ScheduleDay {
  date: string;
  entries: WatchScheduleEntry[];
}

interface WatchSchedulePDFProps {
  schedule: ScheduleDay[];
  watchMembers: WatchMember[];
  hasGalleyWatch: boolean;
  startDate: string;
  endDate: string;
  watchDuration: number;
  watchCount: number;
  withoutNames?: boolean;
}

const WatchBadge = ({ watchNumber, colorIndex }: { watchNumber: number; colorIndex: number }) => {
  const color = watchColors[colorIndex] || watchColors[0];
  return (
    <View style={[styles.watchBadge, { backgroundColor: color.bg }]}>
      <Text style={[styles.watchBadgeText, { color: color.text }]}>Wachta {watchNumber}</Text>
    </View>
  );
};

const Legend = ({ watchMembers, withoutNames }: { watchMembers: WatchMember[]; withoutNames: boolean }) => {
  return (
    <View style={styles.legendSection}>
      <Text style={styles.legendTitle}>Sklad wacht:</Text>
      <View style={styles.legendGrid}>
        {watchMembers.map((watch, idx) => {
          const color = watchColors[idx] || watchColors[0];
          const memberNames = watch.members.filter(m => m.trim()).join(', ');
          return (
            <View key={idx} style={styles.legendItem}>
              <View style={[styles.legendBadge, { backgroundColor: color.bg }]}>
                <Text style={[styles.legendBadgeText, { color: color.text }]}>
                  Wachta {watch.watchNumber}
                </Text>
              </View>
              {withoutNames ? (
                <View style={styles.emptyField} />
              ) : (
                <Text style={styles.legendNames}>
                  {memberNames || '(brak przypisanych)'}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
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

  const renderDayTable = (day: ScheduleDay) => (
    <View wrap={false}>
      <View style={styles.dayHeader}>
        <Text style={styles.dayHeaderText}>{day.date}</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.tableHeader}>
          <View style={[styles.tableHeaderCell, styles.colTime]}>
            <Text>Godziny</Text>
          </View>
          <View style={[styles.tableHeaderCell, hasGalleyWatch ? styles.colWatch : styles.colWatchNoGalley]}>
            <Text>Wachta nawigacyjna</Text>
          </View>
          {hasGalleyWatch && (
            <View style={[styles.tableHeaderCell, styles.colGalley]}>
              <Text>Kambuz</Text>
            </View>
          )}
        </View>
        {day.entries.map((entry, entryIdx) => (
          <View
            key={entryIdx}
            style={[
              styles.tableRow,
              entryIdx % 2 === 0 ? styles.tableRowEven : styles.tableRowOdd,
            ]}
          >
            <View style={[styles.tableCell, styles.colTime]}>
              <Text>{entry.time}</Text>
            </View>
            <View style={[styles.tableCell, hasGalleyWatch ? styles.colWatch : styles.colWatchNoGalley]}>
              <WatchBadge watchNumber={entry.watchIndex + 1} colorIndex={entry.watchIndex} />
            </View>
            {hasGalleyWatch && entry.galleyIndex !== undefined && (
              <View style={[styles.tableCell, styles.colGalley]}>
                <WatchBadge watchNumber={entry.galleyIndex + 1} colorIndex={entry.galleyIndex} />
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Grafik Wacht</Text>
          <Text style={styles.subtitle}>Plan wacht nawigacyjnych na rejs</Text>
        </View>
        <View style={styles.infoSection}>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Data rozpoczecia</Text>
            <Text style={styles.infoValue}>{formatDate(startDate)}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Data zakonczenia</Text>
            <Text style={styles.infoValue}>{formatDate(endDate)}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Liczba wacht</Text>
            <Text style={styles.infoValue}>{watchCount}</Text>
          </View>
          <View style={styles.infoColumn}>
            <Text style={styles.infoLabel}>Czas wachty</Text>
            <Text style={styles.infoValue}>{watchDuration}h</Text>
          </View>
        </View>
        <Legend watchMembers={watchMembers} withoutNames={withoutNames} />
        {schedule.length > 0 && renderDayTable(schedule[0])}
        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>Wygenerowano automatycznie</Text>
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `Strona ${pageNumber} z ${totalPages}`}
          />
        </View>
      </Page>
      {schedule.slice(1).map((day, dayIdx) => (
        <Page key={dayIdx + 1} size="A4" style={styles.page}>
          {renderDayTable(day)}
          <View style={styles.footer} fixed>
            <Text style={styles.footerText}>Wygenerowano automatycznie</Text>
            <Text
              style={styles.pageNumber}
              render={({ pageNumber, totalPages }) => `Strona ${pageNumber} z ${totalPages}`}
            />
          </View>
        </Page>
      ))}
    </Document>
  );
};