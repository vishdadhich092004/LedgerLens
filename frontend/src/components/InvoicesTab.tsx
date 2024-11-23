import { Card } from "@mui/material";
import { useAppSelector } from "../store/hooks";
import { RootState } from "../store/store";
import EditTable, { Column } from "./EditableTableRow";
import { InvoiceType } from "../types";
const columns: Column<InvoiceType>[] = [
  {
    field: "uniqueId",
    label: "Unique Invoice Id",
    type: "text",
  },
  {
    field: "customerName",
    label: "Customer Name",
    type: "text",
  },
  {
    field: "products",
    label: "Products",
    type: "text",
  },
  {
    field: "quantity",
    label: "Quantity",
    type: "number",
  },
  {
    field: "amount",
    label: "Amount",
    type: "number",
  },
  {
    field: "tax",
    label: "Tax (%)",
    type: "number",
    render: (value: number) => `${value}%`,
  },
  {
    field: "priceAfterTax",
    label: "Price with Tax",
    type: "number",
    render: (value: number) => `$${Number(value).toFixed(2)}`,
  },
  {
    field: "date",
    label: "Invoice Date",
    type: "date",
  },
] as const; // Make the array readonly to ensure type safety

function InvoicesTab({ tabValue }: { tabValue: number }) {
  const {
    items: invoices,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.invoices);

  // Show loading state
  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  // Show error state
  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <EditTable<InvoiceType>
          data={invoices}
          columns={columns}
          onUpdate={() => {
            console.log("Cant be updated");
          }}
          className="p-4"
          tabValue={tabValue}
          index={0}
        />
      </Card>
    </div>
  );
}

export default InvoicesTab;
