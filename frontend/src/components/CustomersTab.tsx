import { Card } from "@mui/material";
import { customersActions } from "../store/slices/customerSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { CustomerType } from "../types";
import { RootState } from "../store/store";
import EditTable, { Column } from "./EditableTableRow";

const columns: Column<CustomerType>[] = [
  {
    field: "customerId",
    label: "Customer Id",
    type: "text",
  },
  {
    field: "customerName",
    label: "Customer Name",
    type: "text",
  },
  {
    field: "phoneNumber",
    label: "Phone Number",
    type: "text",
  },

  {
    field: "totalAmount",
    label: "Total Amount",
    type: "number",
    render: (value: number) => `$${Number(value).toFixed(2)}`,
  },
] as const; // Make the array readonly to ensure type safety

function CustomersTab({ tabValue }: { tabValue: number }) {
  const dispatch = useAppDispatch();
  const {
    items: customers,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.customers);

  const handleUpdate = (updatedCustomer: CustomerType) => {
    // Calculate price after tax and discount
    const price = Number(updatedCustomer.totalAmount);

    // Update the product with calculated price
    const customerToSave = {
      ...updatedCustomer,
      totalAmount: Number(price.toFixed(2)),
    };

    dispatch(customersActions.updateCustomer(customerToSave));
  };

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
        <EditTable<CustomerType>
          data={customers}
          columns={columns}
          onUpdate={handleUpdate}
          className="p-4"
          tabValue={tabValue}
          index={2}
        />
      </Card>
    </div>
  );
}

export default CustomersTab;
