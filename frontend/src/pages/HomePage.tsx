import { Container } from "@mui/material";
// import FileUploadSection from "../components/FileUploadSection";
import TabsSection from "../components/TabsSection";
// import DummyTable from "../components/DummyTable";
import FileUploadSectionWithRedux from "../components/FileUploadWithRedux";

function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* File Upload Section */}
      {/* <FileUploadSection /> */}

      <FileUploadSectionWithRedux />
      {/* Tabs Section */}
      <TabsSection />

      {/* <DummyTable /> */}
    </Container>
  );
}

export default HomePage;
