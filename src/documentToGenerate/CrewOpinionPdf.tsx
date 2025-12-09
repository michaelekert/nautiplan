import { Document, Page, Text, View, StyleSheet, Font } from "@react-pdf/renderer";
import type { CrewMember } from "@/components/CruiseOpinions";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/font/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/font/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
});


const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontFamily: "Roboto",
    fontSize: 8.2,
    backgroundColor: "#fff"
  },
  orgHeader: {
    fontSize: 10,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 2,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: "bold",
    alignSelf: "center",
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 2,
    backgroundColor: "#f4f4f4",
    padding: 2,
    border: "1 solid #000",
    textAlign: "center",
  },
  box: {
    border: "1 solid #000",
    marginBottom: 2,
    padding: 3,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 1,
  },
  label: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 8.1,
    marginRight: 2,
  },
  value: {
    flex: 6,
    borderBottom: "1 solid #888",
    minHeight: 12,
    fontSize: 8.2,
    paddingLeft: 1,
    paddingVertical: 1,
  },
  doubleRow: { flexDirection: "row", flexWrap: "wrap", },
  leftCol:   { flex: 1, marginRight: 5 },
  rightCol:  { flex: 2 },
  blockCheck: {
    border: "1 solid #000",
    width: 10, height: 10,
    marginRight: 2,
    alignItems: "center", justifyContent: "center"
  },
  checkLabel: { fontSize: 8.2 },
  smallBt:    { fontSize: 7, marginTop: 2 },
  uwagiHeader: { fontWeight: "bold", fontSize: 9, marginBottom: 1, },
  emptyBox: { border: "1 solid #888", minHeight: 44, marginVertical: 1, padding: 2 },
  podpisy: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
  podpis: { borderTop: "1 solid #000", width: 120, textAlign: "center", paddingTop: 1, fontSize: 8, marginTop: 50 }
});

function CheckRow({ options }: { options: string[] }) {
  return (
    <View style={styles.row}>
      {options.map((label, idx) => (
        <View key={idx} style={{ flexDirection: "row", alignItems: "center", marginRight: 10 }}>
          <View style={styles.blockCheck} />
          <Text style={styles.checkLabel}>{label}</Text>
        </View>
      ))}
    </View>
  );
}



export function CrewOpinionPdf({ member }: { member: CrewMember }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.orgHeader}>POLSKI ZWIĄZEK ŻEGLARSKI</Text>
        <Text style={styles.formTitle}>OPINIA Z REJSU</Text>
        <Text style={styles.sectionHeader}>INFORMACJE O UCZESTNIKU REJSU</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <Text style={styles.value}>{member.firstName} {member.lastName}</Text>
            <Text style={[styles.label, { flex: 3, marginLeft: 15 } ]}>stop. żegl. /mot. i nr pat.:</Text>
            <Text style={styles.value}>{member.sailingDegree}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>tel.:</Text>
            <Text style={styles.value}>{member.phone}</Text>
            <Text style={styles.label}>adres e-mail:</Text>
            <Text style={styles.value}>{member.email}</Text>
            <Text style={styles.label}>funkcja:</Text>
            <Text style={styles.value}>{member.role}</Text>
          </View>
        </View>
        <Text style={styles.sectionHeader}>INFORMACJE O JACHCIE</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>Nr rej.:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>nazwa jachtu:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>Lc=[m]:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 35, minHeight: 12 }}></View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Port macierzysty:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>moc silnika [kW]:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 48, minHeight: 12 }}></View>
          </View>
        </View>
        <Text style={styles.sectionHeader}>INFORMACJE O REJSIE</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={{ flex: 4, fontWeight: "bold" }}>Wpisu dokonano na podstawie dziennika jachtowego*, nr pływania:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 5, minHeight: 12 }}></View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Port zaokrętowania:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>Data:</Text>
            <View style={[styles.value, { width: 41 }]}></View>
            <Text style={styles.label}>Pływowy:</Text>
            <Text style={styles.value}>TAK / NIE</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Port wyokrętowania:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>Data:</Text>
            <View style={[styles.value, { width: 41 }]}></View>
            <Text style={styles.label}>Pływowy:</Text>
            <Text style={styles.value}>TAK / NIE</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Odwiedzone porty:</Text>
            <View style={[styles.value, { flex: 7, minHeight: 14 }]}></View>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 1.2, fontWeight: "bold" }}>W tym liczba portów pływowych:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
            <View style={{ flex: 0.1 }}/>
            <Text style={styles.label}>Liczba dni rejsu:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
          </View>
        </View>
        <Text style={styles.sectionHeader}>GODZINY ŻEGLUGI</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={{ flex: 1.5 }}>razem (pod żaglami i na silniku):</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
            <Text style={{ flex: 1 }}>pod żaglami:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
            <Text style={{ flex: 1 }}>na silniku:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
          </View>
          <View style={styles.row}>
            <Text style={{ flex: 2 }}>po wodach pływowych:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
            <Text style={{ flex: 1 }}>w portach i na kotwicy:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
            <Text style={{ flex: 1.5 }}>Przebyto mil morskich:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, minHeight: 12 }}></View>
          </View>
        </View>
        <Text style={styles.sectionHeader}>OPINIA KAPITANA**</Text>
        <View style={styles.box}>
          <CheckRow options={["pozytywna", "negatywna"]} />
          <Text style={{ marginTop: 2, fontWeight: "bold" }}>Z obowiązków wywiązywał/a się:</Text>
          <CheckRow options={["bardzo dobrze", "dobrze", "dostatecznie", "niedostatecznie"]} />
          <Text style={{ marginTop: 2, fontWeight: "bold" }}>Chorobie morskiej:</Text>
          <CheckRow options={["nie podlegał/a", "chorował/a ciężko", "chorował/a lecz mógł/mogła pracować"]} />
          <Text style={{ marginTop: 2, fontWeight: "bold" }}>Odporność w trudnych warunkach:</Text>
          <CheckRow options={["dobra", "dostateczna", "niedostateczna", "nie sprawdzano"]} />
        </View>
        <View>
          <Text style={styles.uwagiHeader}>UWAGI KAPITANA</Text>
          <View style={styles.emptyBox} />
        </View>
        <Text style={styles.sectionHeader}>INFORMACJE O KAPITANIE</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>stop. żegl. / mot. i nr pat.:</Text>
            <View style={styles.value}></View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>tel.:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>adres e-mail:</Text>
            <View style={styles.value}></View>
          </View>
        </View>
        <View style={styles.podpisy}>
          <Text style={styles.podpis}>miejscowość, data</Text>
          <Text style={styles.podpis}>podpis kapitana</Text>
        </View>
        <Text style={styles.smallBt}>* jeżeli był prowadzony</Text>
        <Text style={styles.smallBt}>
          ** wymagana na podstawie § 4 pkt 3 Rozporządzenia MSiT z dnia 9 kwietnia 2013 r. w sprawie uprawiania turystyki wodnej
        </Text>
      </Page>
    </Document>
  );
}