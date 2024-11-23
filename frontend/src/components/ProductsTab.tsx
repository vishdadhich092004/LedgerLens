import { Card } from "@mui/material";
import { productsActions } from "../store/slices/productSlice";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { ProductType } from "../types";
import { RootState } from "../store/store";
import EditTable, { Column } from "./EditableTableRow";

const columns: Column<ProductType>[] = [
  {
    field: "uniqueId",
    label: "Unique Product Id",
    type: "text",
  },
  {
    field: "productName",
    label: "Product Name",
    type: "text",
  },
  {
    field: "quantity",
    label: "Quantity",
    type: "number",
  },
  {
    field: "unitPrice",
    label: "Unit Price",
    type: "number",
    render: (value: number) => `$${Number(value).toFixed(2)}`,
  },
  {
    field: "tax",
    label: "Tax (%)",
    type: "number",
    render: (value: number) => `${value}%`,
  },
  {
    field: "discount",
    label: "Discount",
    type: "number",
    render: (value: number) => `${value}%`,
  },
  {
    field: "priceAfterTax",
    label: "Price with Tax",
    type: "number",
    render: (value: number) => `$${Number(value).toFixed(2)}`,
  },
] as const; // Make the array readonly to ensure type safety

function ProductsTab({ tabValue }: { tabValue: number }) {
  const dispatch = useAppDispatch();
  const {
    items: products,
    loading,
    error,
  } = useAppSelector((state: RootState) => state.products);

  const handleUpdate = (updatedProduct: ProductType) => {
    // Calculate price after tax and discount
    const price = Number(updatedProduct.unitPrice);
    const tax = Number(updatedProduct.tax);
    const discount = Number(updatedProduct.discount);

    // Calculate price after tax
    const priceWithTax = price + (price * tax) / 100;

    // Apply discount
    const finalPrice = priceWithTax - (priceWithTax * discount) / 100;

    // Update the product with calculated price
    const productToSave = {
      ...updatedProduct,
      priceAfterTax: Number(finalPrice.toFixed(2)),
    };

    dispatch(productsActions.updateProduct(productToSave));
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
        <EditTable<ProductType>
          data={products}
          columns={columns}
          onUpdate={handleUpdate}
          className="p-4"
          tabValue={tabValue}
          index={1}
        />
      </Card>
    </div>
  );
}

export default ProductsTab;
