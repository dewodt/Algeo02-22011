import { type SearchByUploadImageResults } from "@/types/image";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuOKfMZhrib2Bg-4.ttf",
      fontWeight: 300,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfMZhrib2Bg-4.ttf",
      fontWeight: 400,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuI6fMZhrib2Bg-4.ttf",
      fontWeight: 500,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYMZhrib2Bg-4.ttf",
      fontWeight: 600,
    },
    {
      src: "http://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYMZhrib2Bg-4.ttf",
      fontWeight: 700,
    },
  ],
});

// Create styles
const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    padding: 30,
    backgroundColor: "#FFFFFF",
    flexDirection: "column",
    alignItems: "center",
    gap: 16,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
  },
  resultsSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 16,
  },
  imageSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  image: {
    width: 150,
    height: 150,
    objectFit: "cover",
    objectPosition: "center",
  },
  imageLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});

// Create Document Component
const SearchByUploadPDF = ({
  imageResults,
  timeTaken,
}: {
  imageResults: SearchByUploadImageResults;
  timeTaken: number;
}) => (
  <Document
    title="Reverse Image Results"
    author="HBD Lens"
    subject="Image Results"
    keywords="HBD Lens, Reverse Image Results, PDF"
  >
    <Page size="A4" orientation="portrait" style={styles.page}>
      {/* Title */}
      <Text style={styles.h1}>Reverse Image Search Result</Text>

      {/* Results count & time */}
      <Text style={styles.text}>
        {imageResults.length} results in {timeTaken.toFixed(2)} seconds
      </Text>

      {/* Results images */}
      <View style={styles.resultsSection}>
        {imageResults.map((image, idx) => {
          const url = URL.createObjectURL(image.image);
          return (
            <View key={idx} style={styles.imageSection}>
              <Image src={url} style={styles.image} />
              {/* eslint-disable-line */}
              <Text style={styles.imageLabel}>
                {(image.similarity * 100).toFixed(2)}%
              </Text>
            </View>
          );
        })}
      </View>
    </Page>
  </Document>
);

export default SearchByUploadPDF;
