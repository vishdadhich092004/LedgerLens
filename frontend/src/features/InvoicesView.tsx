import { useEffect, useState } from "react";
import { useAppSelector } from "../app/hooks";
import { InvoiceType } from "../types";

function InvoicesView() {
  const [allInvoices, setAllInvoices] = useState<InvoiceType[]>([]);
  const { invoices, loading } = useAppSelector((state) => state.invoices);

  useEffect(() => {
    setAllInvoices(invoices);
  }, [invoices]);

  if (loading) {
    return <h1>Loading...</h1>;
  }
  return (
    <div>
      <h1>Invoices</h1>
      {allInvoices.map((invoice) => (
        <ul>
          <li>Invoice number : {invoice.invoiceNumber}</li>
          <li>Invoice Amount : {Number(invoice.totalAmount)}</li>
          <li>Customer Name : {invoice.customer.customerName}</li>
          <li>Quantity : {Number(invoice.quantity)}</li>
          <li>Date : {invoice.date}</li>
          <li>Tax : {invoice.tax}</li>
          <li>Price After Tax : {invoice.priceAfterTax}</li>
          <li>
            Products
            <ol>
              {invoice.products.map((product) => (
                <li>Product Name : {product.productName}</li>
              ))}
            </ol>
          </li>
        </ul>
      ))}
    </div>
  );
}

export default InvoicesView;
