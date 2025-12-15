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

export interface CrewMember {
  name: string;
  certificate: string;
  rank: string;
}

export interface CruiseCardData {
  captain: {
    name: string;
    certificate: string;
    phone: string;
    email: string;
  };
  yacht: {
    regNo: string;
    name: string;
    length: string;
    homePort: string;
    enginePower: string;
  };
  cruise: {
    logBookNo: string;
    embarkationPort: string;
    embarkationDate: string;
    embarkationTidal: string;
    disembarkationPort: string;
    disembarkationDate: string;
    disembarkationTidal: string;
    visitedPorts: string;
    tidalPortsCount: string;
    cruiseDays: string;
  };
  hours: {
    totalUnderway: string;
    underSails: string;
    usingEngine: string;
    tidalWaters: string;
    inHarbours: string;
    tripNM: string;
  };
  crew: CrewMember[];
  captainComments: string;
  ownerComments: string;
}


const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontFamily: 'Roboto',
    fontSize: 9,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  logoPlaceholder: {
    width: 50,
    height: 50,
    marginRight: 15,
    borderWidth: 1,
    borderColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 8,
    color: '#003366',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 11,
    letterSpacing: 3,
    color: '#003366',
    fontWeight: 'bold',
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    backgroundColor: '#f0f0f0',
    padding: 4,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    color: '#333',
    minWidth: 100,
  },
  inputLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    borderBottomStyle: 'dotted',
    marginLeft: 5,
    minHeight: 14,
    paddingBottom: 2,
  },
  inputValue: {
    fontSize: 9,
  },
  halfRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  cruiseInfoRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderBottomWidth: 0,
  },
  cruiseInfoRowLast: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
  },
  cruiseInfoCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
    minHeight: 20,
    justifyContent: 'center',
  },
  cruiseInfoCellLast: {
    flex: 1,
    padding: 4,
    minHeight: 20,
    justifyContent: 'center',
  },
  cruiseInfoLabel: {
    fontSize: 7,
    color: '#666',
  },
  cruiseInfoValue: {
    fontSize: 9,
    marginTop: 2,
  },
  hoursTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#000',
  },
  hoursTableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
  },
  hoursCell: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoursCellLast: {
    flex: 1,
    padding: 4,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  hoursCellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hoursCellValue: {
    fontSize: 9,
    minHeight: 16,
  },
  crewTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#e8e8e8',
    borderWidth: 1,
    borderColor: '#000',
  },
  crewTableRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
    minHeight: 18,
  },
  crewCell: {
    padding: 3,
    borderRightWidth: 1,
    borderRightColor: '#000',
    justifyContent: 'center',
  },
  crewCellLast: {
    padding: 3,
    justifyContent: 'center',
  },
  crewCellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  commentsSection: {
    marginTop: 10,
  },
  commentsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  commentsLine: {
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    borderBottomStyle: 'dotted',
    minHeight: 16,
    marginBottom: 2,
    paddingTop: 2,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  signatureBlock: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: '100%',
    marginTop: 20,
    paddingTop: 4,
  },
  signatureLabel: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
  },
  footnote: {
    fontSize: 7,
    color: '#666',
    marginTop: 15,

  },
  visitedPortsBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
    minHeight: 50,
    padding: 4,
  },
  twoColumnRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
  },
  columnHalf: {
    flex: 1,
    padding: 4,
  },
  columnHalfBorder: {
    flex: 1,
    padding: 4,
    borderRightWidth: 1,
    borderRightColor: '#000',
  },
});

export const CruiseCardPDF = ({ data }: { data: CruiseCardData }) => {
  const crewRows: CrewMember[] = [];
  for (let i = 0; i < 8; i++) {
    crewRows.push(data.crew[i] || { name: '', certificate: '', rank: '' });
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.mainTitle}>KARTA REJSU</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O KAPITANIE</Text>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.captain.name}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { marginLeft: 10 }]}>
            <Text style={styles.label}>stop. żegl./mot. i nr pat.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.captain.certificate}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>tel.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.captain.phone}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { marginLeft: 10 }]}>
            <Text style={styles.label}>adres e-mail:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.captain.email}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O JACHCIE</Text>
        <View style={styles.row}>
          <View style={[styles.halfRow, { flex: 0.3 }]}>
            <Text style={styles.label}>Nr rej.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.yacht.regNo}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.5, marginLeft: 10 }]}>
            <Text style={styles.label}>nazwa jachtu:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.yacht.name}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.2, marginLeft: 10 }]}>
            <Text style={styles.label}>Lc=</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.yacht.length}</Text>
            </View>
            <Text style={styles.label}>[m]</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>port macierzysty:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.yacht.homePort}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.4, marginLeft: 10 }]}>
            <Text style={styles.label}>moc silnika:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{data.yacht.enginePower}</Text>
            </View>
            <Text style={styles.label}>[kW]</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O REJSIE</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Wpisu dokonano na podstawie dziennika jachtowego*, nr pływania:</Text>
          <View style={styles.inputLine}>
            <Text style={styles.inputValue}>{data.cruise.logBookNo}</Text>
          </View>
        </View>

        <View style={styles.cruiseInfoRow}>
          <View style={[styles.cruiseInfoCell, { flex: 2 }]}>
            <Text style={styles.cruiseInfoLabel}>Port zaokrętowania:</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.embarkationPort}</Text>
          </View>
          <View style={styles.cruiseInfoCell}>
            <Text style={styles.cruiseInfoLabel}>Data:</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.embarkationDate}</Text>
          </View>
          <View style={styles.cruiseInfoCellLast}>
            <Text style={styles.cruiseInfoLabel}>Pływowy: TAK / NIE</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.embarkationTidal}</Text>
          </View>
        </View>
        <View style={styles.cruiseInfoRowLast}>
          <View style={[styles.cruiseInfoCell, { flex: 2 }]}>
            <Text style={styles.cruiseInfoLabel}>Port wyokrętowania:</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.disembarkationPort}</Text>
          </View>
          <View style={styles.cruiseInfoCell}>
            <Text style={styles.cruiseInfoLabel}>Data:</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.disembarkationDate}</Text>
          </View>
          <View style={styles.cruiseInfoCellLast}>
            <Text style={styles.cruiseInfoLabel}>Pływowy: TAK / NIE</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.disembarkationTidal}</Text>
          </View>
        </View>

        <View style={styles.visitedPortsBox}>
          <Text style={styles.cruiseInfoLabel}>Odwiedzone porty:</Text>
          <Text style={styles.cruiseInfoValue}>{data.cruise.visitedPorts}</Text>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.columnHalfBorder}>
            <Text style={styles.cruiseInfoLabel}>W tym liczba portów pływowych:</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.tidalPortsCount}</Text>
          </View>
          <View style={styles.columnHalf}>
            <Text style={styles.cruiseInfoLabel}>Liczba dni rejsu:</Text>
            <Text style={styles.cruiseInfoValue}>{data.cruise.cruiseDays}</Text>
          </View>
        </View>

        <View style={{ marginTop: 10 }}>
          <View style={styles.hoursTableHeader}>
            <View style={[styles.hoursCell, { flex: 2 }]}>
              <Text style={styles.hoursCellHeader}>GODZINY ŻEGLUGI</Text>
            </View>
            <View style={[styles.hoursCell, { flex: 2 }]}>
              <Text style={styles.hoursCellHeader}>GODZINY POSTOJU</Text>
            </View>
            <View style={styles.hoursCellLast}>
              <Text style={styles.hoursCellHeader}>PRZEBYTO</Text>
              <Text style={styles.hoursCellHeader}>MIL</Text>
              <Text style={styles.hoursCellHeader}>MORSKICH</Text>
            </View>
          </View>
          <View style={styles.hoursTableRow}>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellHeader}>razem</Text>
              <Text style={{ fontSize: 6 }}>(pod żaglami i na silniku)</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellHeader}>pod żaglami</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellHeader}>na silniku</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellHeader}>po wodach pływowych</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellHeader}>w portach i na kotwicy</Text>
            </View>
            <View style={styles.hoursCellLast}>
              <Text style={styles.hoursCellHeader}></Text>
            </View>
          </View>
          <View style={styles.hoursTableRow}>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellValue}>{data.hours.totalUnderway}</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellValue}>{data.hours.underSails}</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellValue}>{data.hours.usingEngine}</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellValue}>{data.hours.tidalWaters}</Text>
            </View>
            <View style={styles.hoursCell}>
              <Text style={styles.hoursCellValue}>{data.hours.inHarbours}</Text>
            </View>
            <View style={styles.hoursCellLast}>
              <Text style={styles.hoursCellValue}>{data.hours.tripNM}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O ZAŁODZE</Text>
        <View style={styles.crewTableHeader}>
          <View style={[styles.crewCell, { width: 25 }]}>
            <Text style={styles.crewCellHeader}>Lp.</Text>
          </View>
          <View style={[styles.crewCell, { flex: 2 }]}>
            <Text style={styles.crewCellHeader}>Imię i nazwisko</Text>
          </View>
          <View style={[styles.crewCell, { flex: 1 }]}>
            <Text style={styles.crewCellHeader}>stopień żegl./mot.</Text>
          </View>
          <View style={[styles.crewCell, { flex: 1 }]}>
            <Text style={styles.crewCellHeader}>funkcja na jachcie</Text>
          </View>
          <View style={[styles.crewCell, { width: 25 }]}>
            <Text style={styles.crewCellHeader}>Lp.</Text>
          </View>
          <View style={[styles.crewCell, { flex: 2 }]}>
            <Text style={styles.crewCellHeader}>Imię i nazwisko</Text>
          </View>
          <View style={[styles.crewCell, { flex: 1 }]}>
            <Text style={styles.crewCellHeader}>stopień żegl./mot.</Text>
          </View>
          <View style={[styles.crewCellLast, { flex: 1 }]}>
            <Text style={styles.crewCellHeader}>funkcja na jachcie</Text>
          </View>
        </View>
        {[0, 1, 2, 3].map((rowIndex) => (
          <View key={rowIndex} style={styles.crewTableRow}>
            <View style={[styles.crewCell, { width: 25 }]}>
              <Text style={{ fontSize: 8, textAlign: 'center' }}>{rowIndex * 2 + 1}</Text>
            </View>
            <View style={[styles.crewCell, { flex: 2 }]}>
              <Text style={{ fontSize: 8 }}>{crewRows[rowIndex * 2]?.name || ''}</Text>
            </View>
            <View style={[styles.crewCell, { flex: 1 }]}>
              <Text style={{ fontSize: 8 }}>{crewRows[rowIndex * 2]?.certificate || ''}</Text>
            </View>
            <View style={[styles.crewCell, { flex: 1 }]}>
              <Text style={{ fontSize: 8 }}>{crewRows[rowIndex * 2]?.rank || ''}</Text>
            </View>
            <View style={[styles.crewCell, { width: 25 }]}>
              <Text style={{ fontSize: 8, textAlign: 'center' }}>{rowIndex * 2 + 2}</Text>
            </View>
            <View style={[styles.crewCell, { flex: 2 }]}>
              <Text style={{ fontSize: 8 }}>{crewRows[rowIndex * 2 + 1]?.name || ''}</Text>
            </View>
            <View style={[styles.crewCell, { flex: 1 }]}>
              <Text style={{ fontSize: 8 }}>{crewRows[rowIndex * 2 + 1]?.certificate || ''}</Text>
            </View>
            <View style={[styles.crewCellLast, { flex: 1 }]}>
              <Text style={{ fontSize: 8 }}>{crewRows[rowIndex * 2 + 1]?.rank || ''}</Text>
            </View>
          </View>
        ))}

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>UWAGI KAPITANA</Text>
          <View style={styles.commentsLine}>
            <Text style={{ fontSize: 8 }}>{data.captainComments}</Text>
          </View>
          <View style={styles.commentsLine}></View>
          <View style={styles.commentsLine}></View>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>miejscowość, data</Text>
              </View>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>podpis kapitana</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>UWAGI ARMATORA/WŁAŚCICIELA JACHTU</Text>
          <View style={styles.commentsLine}>
            <Text style={{ fontSize: 8 }}>{data.ownerComments}</Text>
          </View>
          <View style={styles.commentsLine}></View>
          <View style={styles.commentsLine}></View>
          <View style={styles.signatureRow}>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>miejscowość, data</Text>
              </View>
            </View>
            <View style={styles.signatureBlock}>
              <View style={styles.signatureLine}>
                <Text style={styles.signatureLabel}>podpis armatora/właściciela jachtu</Text>
              </View>
            </View>
          </View>
        </View>

        <Text style={styles.footnote}>* jeżeli był prowadzony</Text>
      </Page>
    </Document>
  );
};

export const getEmptyFormData = (): CruiseCardData => ({
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
    embarkationTidal: '',
    disembarkationPort: '',
    disembarkationDate: '',
    disembarkationTidal: '',
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