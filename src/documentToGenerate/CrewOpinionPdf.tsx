import { Document, Page, Text, View, Font, Image } from "@react-pdf/renderer";
import type { CrewMember } from "@/components/CruiseOpinions";
import Logo from '@/assets/Logo.jpeg?url'; 
import { pdfStyles as styles } from "./pdfStyles";

Font.register({
  family: "Roboto",
  fonts: [
    { src: "/font/Roboto-Regular.ttf", fontWeight: "normal" },
    { src: "/font/Roboto-Bold.ttf", fontWeight: "bold" },
  ],
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

export function CrewOpinionPdf({member}: {member: CrewMember}) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={{ alignItems: 'center', marginBottom: 5 }}>
          <Image src={Logo} style={{ width: 50, height: 50 }} />
        </View>
        <Text style={styles.formTitle}>OPINIA Z REJSU</Text>
        
        <Text style={styles.sectionHeader}>INFORMACJE O UCZESTNIKU REJSU</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={styles.label}>Imię i nazwisko:</Text>
            <Text style={styles.value}>{member.firstName} {member.lastName}</Text>
            <Text style={[styles.label, { marginLeft: 10 }]}>stop. żegl. /mot. i nr pat.:</Text>
            <Text style={styles.value}>{member.sailingDegree}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Tel.:</Text>
            <Text style={styles.value}>{member.phone}</Text>
            <Text style={styles.label}>Adres e-mail:</Text>
            <Text style={styles.value}>{member.email}</Text>
            <Text style={styles.label}>Funkcja:</Text>
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
            <View style={{ borderBottom: "1 solid #888", width: 30, paddingBottom: 1 }}></View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Port macierzysty:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>moc silnika [kW]:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 45, paddingBottom: 1 }}></View>
          </View>
        </View>
        
        <Text style={styles.sectionHeader}>INFORMACJE O REJSIE</Text>
        <View style={styles.box}>
          <View style={styles.row}>
            <Text style={{ fontWeight: "bold" }}>Wpisu dokonano na podstawie dziennika jachtowego*, nr pływania:</Text>
            <View style={{ borderBottom: "1 solid #888", flex: 1, paddingBottom: 1, marginLeft: 3 }}></View>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Port zaokrętowania:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>Data:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 38, paddingBottom: 1 }}></View>
            <Text style={styles.label}>Pływowy:</Text>
            <Text style={styles.value}>TAK / NIE</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Port wyokrętowania:</Text>
            <View style={styles.value}></View>
            <Text style={styles.label}>Data:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 38, paddingBottom: 1 }}></View>
            <Text style={styles.label}>Pływowy:</Text>
            <Text style={styles.value}>TAK / NIE</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Odwiedzone porty:</Text>
            <View style={[styles.value, { minHeight: 11, paddingBottom: 1 }]}></View>
          </View>
          <View style={styles.row}>
            <Text style={{ fontWeight: "bold" }}>W tym liczba portów pływowych:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 50, paddingBottom: 1, marginLeft: 3, marginRight: 15 }}></View>
            <Text style={styles.label}>Liczba dni rejsu:</Text>
            <View style={{ borderBottom: "1 solid #888", width: 50, paddingBottom: 1, marginLeft: 3 }}></View>
          </View>
        </View>
        
        <Text style={styles.sectionHeader}>GODZINY ŻEGLUGI</Text>
        <View style={styles.table}>
          <View style={styles.tableHeaderRow}>
            <Text style={[styles.tableHeaderCell, {flex:1.255}] }>GODZINY ŻEGLUGI</Text>
            <Text style={[styles.tableHeaderCellSmall, {flex:1}]}>GODZINY POSTOJU</Text>
            <Text style={[styles.tableHeaderCellLast, {flex:0.7}]}>PRZEBYTO MIL MORSKICH</Text>
          </View>
          <View style={styles.tableDataRow}>
            <View style={styles.tableDataCell}>
              <Text>razem (pod żaglami i na silniku)</Text>
            </View>
            <View style={styles.tableDataCell}>
              <Text>pod żaglami</Text>
            </View>
            <View style={[styles.tableDataCell, {flex: 0.55}]}>
              <Text>na silniku</Text>
            </View>
            <View style={styles.tableDataCell}>
              <Text>po wodach pływowych</Text>
            </View>
            <View style={[styles.tableDataCell, {flex:1.1}]}>
              <Text>w portach i na kotwicy</Text>
            </View>
            <View style={styles.tableDataCellLast}>
              <Text>———————————————————————</Text>
            </View>
          </View>
          <View style={styles.tableDataRow}>
            <View style={styles.tableDataCell}>
              <Text></Text>
            </View>
            <View style={styles.tableDataCell}>
              <Text></Text>
            </View>
            <View style={[styles.tableDataCell, {flex: 0.55}]}>
              <Text></Text>
            </View>
            <View style={styles.tableDataCell}>
              <Text></Text>
            </View>
            <View style={[styles.tableDataCell, {flex:1.1}]}>
              <Text></Text>
            </View>
            <View style={styles.tableDataCellLast}>
            </View>
          </View>
        </View>
        
        <Text style={styles.sectionHeader}>OPINIA KAPITANA**</Text>
        <View style={styles.box}>
          <CheckRow options={["pozytywna", "negatywna"]} />
          <Text style={{ marginTop: 1, fontWeight: "bold" }}>Z obowiązków wywiązywał/a się:</Text>
          <CheckRow options={["bardzo dobrze", "dobrze", "dostatecznie", "niedostatecznie"]} />
          <Text style={{ marginTop: 1, fontWeight: "bold" }}>Chorobie morskiej:</Text>
          <CheckRow options={["nie podlegał/a", "chorował/a ciężko", "chorował/a lecz mógł/mogła pracować"]} />
          <Text style={{ marginTop: 1, fontWeight: "bold" }}>Odporność w trudnych warunkach:</Text>
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