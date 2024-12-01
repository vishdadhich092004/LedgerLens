import { Container } from "@mui/material";
// import FileUploadSection from "../components/FileUploadSection";
// import TabsSection from "../components/TabsSection";
// import DummyTable from "../components/DummyTable";
import FileUploadSectionWithRedux from "../components/FileUploadWithRedux";
import InvoicesView from "../features/InvoicesView";
import CustomersView from "../features/CustomersView";
import ProductsView from "../features/ProductsView";

function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      {/* File Upload Section */}
      {/* <FileUploadSection /> */}

      <FileUploadSectionWithRedux />
      {/* Tabs Section */}
      {/* <TabsSection /> */}
      <InvoicesView />
      <CustomersView />
      <ProductsView />
      {/* <DummyTable /> */}
    </Container>
  );
}

export default HomePage;
