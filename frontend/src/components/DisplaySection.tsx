import React, { useState } from "react";
import {
  Tabs,
  Tab,
  Box,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
} from "@mui/material";
import { useAppSelector } from "../app/hooks";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function TabbedViews() {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    event.preventDefault();
    setValue(newValue);
  };

  // Invoices View
  const { invoices, loading: invoicesLoading } = useAppSelector(
    (state) => state.invoices
  );

  // Customers View
  const { customers, loading: customersLoading } = useAppSelector(
    (state) => state.customers
  );

  // Products View
  const { products, loading: productsLoading } = useAppSelector(
    (state) => state.products
  );

  const renderInvoicesTable = () => {
    if (invoicesLoading) {
      return <Typography>Loading Invoices...</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="invoices table">
          <TableHead>
            <TableRow>
              <TableCell>Invoice Number</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Price After Tax</TableCell>
              <TableCell>Products</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {invoices.map((invoice, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{invoice.invoiceNumber}</TableCell>
                <TableCell>{Number(invoice.totalAmount)}</TableCell>
                <TableCell>{invoice.customer.customerName}</TableCell>
                <TableCell>{Number(invoice.quantity)}</TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.tax}</TableCell>
                <TableCell>{invoice.priceAfterTax}</TableCell>
                <TableCell>
                  {invoice.products.map((product, prodIndex) => (
                    <Typography key={prodIndex} variant="body2">
                      {product.productName}
                    </Typography>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderCustomersTable = () => {
    if (customersLoading) {
      return <Typography>Loading Customers...</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="customers table">
          <TableHead>
            <TableRow>
              <TableCell>Customer ID</TableCell>
              <TableCell>Customer Name</TableCell>
              <TableCell>Phone Number</TableCell>
              <TableCell>Total Amount</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{customer.customerId}</TableCell>
                <TableCell>{customer.customerName}</TableCell>
                <TableCell>{customer.phoneNumber}</TableCell>
                <TableCell>{customer.totalAmount}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const renderProductsTable = () => {
    if (productsLoading) {
      return <Typography>Loading Products...</Typography>;
    }

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="products table">
          <TableHead>
            <TableRow>
              <TableCell>Product ID</TableCell>
              <TableCell>Product Name</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Unit Price</TableCell>
              <TableCell>Discount</TableCell>
              <TableCell>Price After Discount</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Price After Tax</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product, index) => (
              <TableRow
                key={index}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.unitPrice}</TableCell>
                <TableCell>{product.discount}</TableCell>
                <TableCell>{product.priceAfterDiscount}</TableCell>
                <TableCell>{product.tax}</TableCell>
                <TableCell>{product.priceAfterTax}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="Invoices" />
          <Tab label="Customers" />
          <Tab label="Products" />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        {renderInvoicesTable()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        {renderCustomersTable()}
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        {renderProductsTable()}
      </CustomTabPanel>
    </Box>
  );
}

export default TabbedViews;
