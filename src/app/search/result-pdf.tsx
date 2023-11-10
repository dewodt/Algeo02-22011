import { type ImageResults } from "@/types/image";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
  Link,
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
    gap: 24,
  },
  h1: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  h2: {
    fontSize: 18,
    fontWeight: "semibold",
    textAlign: "center",
  },
  text: {
    fontSize: 14,
  },
  inputSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  resultSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  imagesSection: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    gap: 16,
  },
  imageAndLabelSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  image: {
    width: 225,
    height: 135,
    objectFit: "cover",
    objectPosition: "center",
  },
  imageLabel: {
    fontSize: 12,
    textAlign: "center",
  },
});

// Create Document Component
const ResultPDF = ({
  imageInputSrc,
  imageResults,
  timeTaken,
  dataSetUrl,
}: {
  imageInputSrc: string;
  imageResults: ImageResults;
  timeTaken: number;
  dataSetUrl?: string;
}) => (
  <Document
    title="Reverse Image Results"
    author="HBD Lens"
    subject="Image Results"
    keywords="HBD Lens, Reverse Image Results, PDF"
  >
    <Page size="A3" orientation="portrait" style={styles.page}>
      {/* Title */}
      <Text style={styles.h1}>Reverse Image Search Result</Text>

      {/* Image Input */}
      <View style={styles.inputSection}>
        <Text style={styles.h2}>Image Input:</Text>
        {/* eslint-disable-next-line */}
        <Image src={imageInputSrc} style={styles.image} />
      </View>

      {/* Image Results */}
      <View style={styles.resultSection}>
        {/* Results Title */}
        <Text style={styles.h2}>Results:</Text>

        {/* Results count & time */}
        <Text style={styles.text}>
          {imageResults.length} results in {timeTaken.toFixed(2)} seconds
        </Text>

        {/* Data set URL Source (if using scraping) */}
        {dataSetUrl && (
          <Link src={dataSetUrl} style={styles.text}>
            Data Set Source
          </Link>
        )}

        {/* Results images */}
        <View style={styles.imagesSection}>
          {imageResults.map((image, idx) => {
            return (
              <View key={idx} style={styles.imageAndLabelSection}>
                {/* eslint-disable-next-line */}
                <Image src={image.imageSrc} style={styles.image} />
                <Text style={styles.imageLabel}>
                  {(image.similarity * 100).toFixed(2)}%
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </Page>
  </Document>
);

export default ResultPDF;
