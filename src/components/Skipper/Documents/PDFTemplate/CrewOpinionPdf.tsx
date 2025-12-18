import {
  Document,
  Page,
  Text,
  View,
  Font,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { CrewMember, Captain, Yacht, Cruise } from "@/components/Skipper/Documents/CruiseOpinions";
import Logo from '@/assets/Logo.jpeg?url';

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/font/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/font/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 25,
    paddingBottom: 20,
    fontFamily: 'Roboto',
    fontSize: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    paddingBottom: 10,
  },
  logoPlaceholder: {
    width: 45,
    height: 45,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 4,
    letterSpacing: 2,
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    backgroundColor: '#f0f0f0',
    padding: 3,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  label: {
    fontSize: 8,
    color: '#333',
  },
  inputLine: {
    flex: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#999',
    borderBottomStyle: 'dotted',
    marginLeft: 4,
    minHeight: 14,
  },
  inputValue: {
    fontSize: 8,
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
    minHeight: 22,
    justifyContent: 'center',
  },
  cruiseInfoCellLast: {
    flex: 1,
    padding: 4,
    minHeight: 22,
    justifyContent: 'center',
  },
  cruiseInfoLabel: {
    fontSize: 7,
    color: '#666',
  },
  cruiseInfoValue: {
    fontSize: 8,
    marginTop: 2,
  },
  visitedPortsBox: {
    borderWidth: 1,
    borderColor: '#000',
    borderTopWidth: 0,
    minHeight: 30,
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
  hoursCellHeader: {
    fontSize: 7,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  hoursCellValue: {
    fontSize: 8,
    minHeight: 14,
  },

  opinionBox: {
    borderWidth: 1,
    borderColor: '#000',
    padding: 6,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  checkRowLabel: {
    fontSize: 8,
    fontWeight: 'bold',
    marginRight: 8,
    minWidth: 140,
  },
  checkOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  checkbox: {
    width: 10,
    height: 10,
    borderWidth: 1,
    borderColor: '#000',
    marginRight: 3,
  },
  checkLabel: {
    fontSize: 7.5,
  },
  commentsSection: {
    marginTop: 8,
  },
  commentsTitle: {
    fontSize: 8,
    fontWeight: 'bold',
    marginBottom: 3,
  },
  commentsBox: {
    borderWidth: 1,
    borderColor: '#999',
    minHeight: 35,
    padding: 4,
  },
  signatureRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  signatureBlock: {
    width: '45%',
    alignItems: 'center',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000',
    width: '100%',
    marginTop: 30,
    paddingTop: 3,
  },
  signatureLabel: {
    fontSize: 7,
    color: '#666',
    textAlign: 'center',
  },
  footnote: {
    fontSize: 7,
    color: '#666',
    marginTop: 8,
  },
});

function CheckboxRow({ label, options }: { label: string; options: string[] }) {
  return (
    <View style={styles.checkRow}>
      <Text style={styles.checkRowLabel}>{label}</Text>
      {options.map((option, idx) => (
        <View key={idx} style={styles.checkOption}>
          <View style={styles.checkbox} />
          <Text style={styles.checkLabel}>{option}</Text>
        </View>
      ))}
    </View>
  );
}

export function CrewOpinionPdf({
  member,
  captain,
  yacht,
  cruise,
}: {
  member?: CrewMember;
  captain?: Captain | null;
  yacht?: Yacht | null;
  cruise?: Cruise | null;
}) {
  const yesNo = (v?: boolean) =>
    v === true ? "TAK" : v === false ? "NIE" : "";

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View style={styles.logoPlaceholder}>
            <Image src={Logo} style={{ width: 50, height: 50 }} />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.mainTitle}>OPINIA Z REJSU</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O UCZESTNIKU REJSU</Text>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>
                {member?.firstName} {member?.lastName}
              </Text>
            </View>
          </View>
          <View style={[styles.halfRow, { marginLeft: 8 }]}>
            <Text style={styles.label}>stop. żegl./mot. i nr pat.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{member?.sailingDegree}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={[styles.halfRow, { flex: 0.8 }]}>
            <Text style={styles.label}>tel.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{member?.phone}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 1.2, marginLeft: 8 }]}>
            <Text style={styles.label}>adres e-mail:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{member?.email}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.8, marginLeft: 8 }]}>
            <Text style={styles.label}>funkcja:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{member?.role}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O JACHCIE</Text>
        <View style={styles.row}>
          <View style={[styles.halfRow, { flex: 0.3 }]}>
            <Text style={styles.label}>Nr rej.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{yacht?.registrationNumber}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.5, marginLeft: 8 }]}>
            <Text style={styles.label}>nazwa jachtu:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{yacht?.name}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.2, marginLeft: 8 }]}>
            <Text style={styles.label}>Lc=</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{yacht?.lengthOverall}</Text>
            </View>
            <Text style={styles.label}>[m]</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>port macierzysty:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{yacht?.homePort}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { flex: 0.4, marginLeft: 8 }]}>
            <Text style={styles.label}>moc silnika:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{yacht?.enginePower}</Text>
            </View>
            <Text style={styles.label}>[kW]</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O REJSIE</Text>
        <View style={styles.row}>
          <Text style={styles.label}>
            Wpisu dokonano na podstawie dziennika jachtowego*, nr pływania:
          </Text>
          <View style={styles.inputLine}>
            <Text style={styles.inputValue}></Text>
          </View>
        </View>

        <View style={styles.cruiseInfoRow}>
          <View style={[styles.cruiseInfoCell, { flex: 2 }]}>
            <Text style={styles.cruiseInfoLabel}>Port zaokrętowania:</Text>
            <Text style={styles.cruiseInfoValue}>{cruise?.startPort}</Text>
          </View>
          <View style={styles.cruiseInfoCell}>
            <Text style={styles.cruiseInfoLabel}>Data:</Text>
            <Text style={styles.cruiseInfoValue}>{cruise?.startDate}</Text>
          </View>
          <View style={styles.cruiseInfoCellLast}>
            <Text style={styles.cruiseInfoLabel}>Pływowy: TAK / NIE</Text>
            <Text style={styles.cruiseInfoValue}>
              {yesNo(cruise?.startPortTidal)}
            </Text>
          </View>
        </View>
        <View style={styles.cruiseInfoRowLast}>
          <View style={[styles.cruiseInfoCell, { flex: 2 }]}>
            <Text style={styles.cruiseInfoLabel}>Port wyokrętowania:</Text>
            <Text style={styles.cruiseInfoValue}>{cruise?.endPort}</Text>
          </View>
          <View style={styles.cruiseInfoCell}>
            <Text style={styles.cruiseInfoLabel}>Data:</Text>
            <Text style={styles.cruiseInfoValue}>{cruise?.endDate}</Text>
          </View>
          <View style={styles.cruiseInfoCellLast}>
            <Text style={styles.cruiseInfoLabel}>Pływowy: TAK / NIE</Text>
            <Text style={styles.cruiseInfoValue}>
              {yesNo(cruise?.endPortTidal)}
            </Text>
          </View>
        </View>

        <View style={styles.visitedPortsBox}>
          <Text style={styles.cruiseInfoLabel}>Odwiedzone porty:</Text>
          <Text style={styles.cruiseInfoValue}>{cruise?.visitedPorts}</Text>
        </View>

        <View style={styles.twoColumnRow}>
          <View style={styles.columnHalfBorder}>
            <Text style={styles.cruiseInfoLabel}>
              W tym liczba portów pływowych:
            </Text>
            <Text style={styles.cruiseInfoValue}>{cruise?.tidalPortsCount}</Text>
          </View>
          <View style={styles.columnHalf}>
            <Text style={styles.cruiseInfoLabel}>Liczba dni rejsu:</Text>
            <Text style={styles.cruiseInfoValue}>{cruise?.cruiseDays}</Text>
          </View>
        </View>

        <View style={{ marginTop: 8, borderWidth: 1, borderColor: '#000' }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ width: '80%', borderRightWidth: 1, borderRightColor: '#000' }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#e8e8e8', borderBottomWidth: 1, borderBottomColor: '#000' }}>
                <View style={{ width: '37.5%', padding: 3, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center' }}>
                  <Text style={styles.hoursCellHeader}>GODZINY ŻEGLUGI</Text>
                </View>
                <View style={{ width: '62.5%', padding: 3, alignItems: 'center' }}>
                  <Text style={styles.hoursCellHeader}>GODZINY POSTOJU</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '12.5%', padding: 3, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.hoursCellHeader}>razem</Text>
                  <Text style={{ fontSize: 6 }}>(pod żaglami i na silniku)</Text>
                </View>
                <View style={{ width: '12.5%', padding: 3, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.hoursCellHeader}>pod żaglami</Text>
                </View>
                <View style={{ width: '12.5%', padding: 3, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.hoursCellHeader}>na silniku</Text>
                </View>
                <View style={{ width: '31.25%', padding: 3, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.hoursCellHeader}>po wodach</Text>
                  <Text style={styles.hoursCellHeader}>pływowych</Text>
                </View>
                <View style={{ width: '31.25%', padding: 3, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={styles.hoursCellHeader}>w portach i na kotwicy</Text>
                </View>
              </View>
            </View>
            <View style={{ width: '20%', backgroundColor: '#e8e8e8', padding: 3, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={styles.hoursCellHeader}>PRZEBYTO</Text>
              <Text style={styles.hoursCellHeader}>MIL</Text>
              <Text style={styles.hoursCellHeader}>MORSKICH</Text>
            </View>
          </View>
          <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#000' }}>
            <View style={{ width: '10%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', minHeight: 18 }}>
              <Text style={styles.hoursCellValue}>{cruise?.totalHours}</Text>
            </View>
            <View style={{ width: '10%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', minHeight: 18 }}>
              <Text style={styles.hoursCellValue}>{cruise?.sailingHours}</Text>
            </View>
            <View style={{ width: '10%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', minHeight: 18 }}>
              <Text style={styles.hoursCellValue}>{cruise?.engineHours}</Text>
            </View>
            <View style={{ width: '25%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', minHeight: 18 }}>
              <Text style={styles.hoursCellValue}>{cruise?.tidalWatersHours}</Text>
            </View>
            <View style={{ width: '25%', padding: 4, borderRightWidth: 1, borderRightColor: '#000', alignItems: 'center', minHeight: 18 }}>
              <Text style={styles.hoursCellValue}>{cruise?.inPortHours}</Text>
            </View>
            <View style={{ width: '20%', padding: 4, alignItems: 'center', minHeight: 18 }}>
              <Text style={styles.hoursCellValue}>{cruise?.nauticalMiles}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>OPINIA KAPITANA**</Text>
        <View style={styles.opinionBox}>
          <CheckboxRow label="Opinia:" options={["pozytywna", "negatywna"]} />
          <CheckboxRow
            label="Z obowiązków wywiązywał/a się:"
            options={["bardzo dobrze", "dobrze", "dostatecznie", "niedostatecznie"]}
          />
          <CheckboxRow
            label="Chorobie morskiej:"
            options={[
              "nie podlegał/a",
              "chorował/a ciężko",
              "chorował/a lecz mógł/mogła pracować",
            ]}
          />
          <CheckboxRow
            label="Odporność w trudnych warunkach:"
            options={["dobra", "dostateczna", "niedostateczna", "nie sprawdzano"]}
          />
        </View>

        <View style={styles.commentsSection}>
          <Text style={styles.commentsTitle}>UWAGI KAPITANA</Text>
          <View style={styles.commentsBox} />
        </View>

        <Text style={styles.sectionTitle}>INFORMACJE O KAPITANIE</Text>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>
                {captain?.firstName} {captain?.lastName}
              </Text>
            </View>
          </View>
          <View style={[styles.halfRow, { marginLeft: 8 }]}>
            <Text style={styles.label}>stop. żegl./mot. i nr pat.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{captain?.sailingDegree}</Text>
            </View>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.halfRow}>
            <Text style={styles.label}>tel.:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{captain?.phone}</Text>
            </View>
          </View>
          <View style={[styles.halfRow, { marginLeft: 8 }]}>
            <Text style={styles.label}>adres e-mail:</Text>
            <View style={styles.inputLine}>
              <Text style={styles.inputValue}>{captain?.email}</Text>
            </View>
          </View>
        </View>

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

        <Text style={styles.footnote}>* jeżeli był prowadzony</Text>
        <Text style={styles.footnote}>
          ** wymagana na podstawie § 4 pkt 3 Rozporządzenia MSiT z dnia 9 kwietnia
          2013 r. w sprawie uprawiania turystyki wodnej
        </Text>
      </Page>
    </Document>
  );
}