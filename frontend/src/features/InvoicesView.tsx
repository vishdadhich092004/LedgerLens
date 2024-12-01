import { useEffect } from "react";
import { useAppSelector } from "../store/hooks";

function InvoicesView() {
  const invoices = useAppSelector((state) => state.invoices.items);

  useEffect(() => {
    console.log("Invoice Updated", invoices);
  }, [invoices]);
  return (
    <div>
      <h1>Invoices</h1>
      {invoices.map((invoice) => (
        <div key={invoice.invoiceNumber} className="invoice-card">
          <ul>
            <li>
              <strong>Invoice Number:</strong> {invoice.invoiceNumber}
            </li>
            {/* <li>
              <strong>Amount:</strong> {invoice.amount.toFixed(2)}
            </li> */}
            <li>
              <strong>Customer Name:</strong>{" "}
              {invoice.customer.customerName || ""}
            </li>
            {/* <li>
              <strong>Price After Tax:</strong>{" "}
              {invoice.priceAfterTax.toFixed(2)}
            </li> */}
            <li>
              <strong>Quantity:</strong> {invoice.quantity}
            </li>
            <li>
              <strong>Tax:</strong> {invoice.tax}%
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
}

export default InvoicesView;
