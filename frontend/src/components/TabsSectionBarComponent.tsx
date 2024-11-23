import { Tabs, Tab } from "@mui/material";

interface TabsSectionBarComponentProps {
  tabValue: number;
  handleTabChange: (event: React.SyntheticEvent, newValue: number) => void;
}

function TabsSectionBarComponent({
  tabValue,
  handleTabChange,
}: TabsSectionBarComponentProps) {
  return (
    <div>
      <Tabs value={tabValue} onChange={handleTabChange}>
        <Tab label="Invoices" />
        <Tab label="Products" />
        <Tab label="Customers" />
      </Tabs>
    </div>
  );
}

export default TabsSectionBarComponent;
