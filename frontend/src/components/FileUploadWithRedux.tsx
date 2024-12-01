import {
  Paper,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useState } from "react";
import { addCustomer } from "../store/slices/customerSlice";
import { addInvoice } from "../store/slices/invoiceSlice";
import { addProduct } from "../store/slices/productSlice";
import { useAppDispatch } from "../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { UploadResultType } from "../types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Styled component for file input
const VisuallyHiddenInput = styled("input")`
  clip: rect(0 0 0 0);
  clip-path: inset(50%);
  height: 1px;
  overflow: hidden;
  position: absolute;
  bottom: 0;
  left: 0;
  white-space: nowrap;
  width: 1px;
`;

// Utility to upload files
const uploadFiles = async (
  files: File[]
): Promise<{ results: UploadResultType[] }> => {
  const formData = new FormData();
  files.forEach((file) => formData.append("files", file));

  const response = await fetch(`${API_BASE_URL}/api/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

function FileUploadSectionWithRedux() {
  const dispatch = useAppDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UploadResultType[]>([]);

  // Helper to process and dispatch uploaded data
  const processAndStoreData = (results: UploadResultType[]) => {
    results.forEach((result) => {
      if (result.result?.success && result.result.data) {
        const { invoices, products, customers } = result.result.data;

        invoices.forEach((invoice) => {
          dispatch(
            addInvoice({
              invoiceNumber: invoice.invoiceNumber,
              customer: invoice.customer,
              products: invoice.products,
              quantity: invoice.quantity,
              tax: invoice.tax,
              priceAfterTax: invoice.priceAfterTax,
              amount: invoice.amount,
              date: invoice.date,
            })
          );
        });

        products.forEach((product) => {
          dispatch(
            addProduct({
              productId: uuidv4(),
              productName: product.productName,
              quantity: product.quantity,
              unitPrice: product.unitPrice,
              tax: product.tax,
              discount: product.discount,
              priceAfterTax: product.priceAfterTax,
              priceAfterDiscount: product.priceAfterDiscount,
            })
          );
        });

        customers.forEach((customer) => {
          dispatch(
            addCustomer({
              customerId: uuidv4(),
              customerName: customer.customerName,
              phoneNumber: customer.phoneNumber,
              totalAmount: customer.totalAmount,
            })
          );
        });
      }
    });
  };

  // Handle file uploads
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) {
        throw new Error("Please select a file to upload.");
      }

      const response = await uploadFiles(files);
      setResults(response.results);

      processAndStoreData(response.results);
      event.target.value = ""; // Reset input field
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mb: 4,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
        sx={{ mb: 2 }}
        disabled={isLoading}
      >
        {isLoading ? "Uploading..." : "Upload File"}
        <VisuallyHiddenInput
          type="file"
          onChange={handleFileUpload}
          multiple
          accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.ods"
        />
      </Button>

      <Typography variant="body2" color="text.secondary">
        Supported formats: Excel, PDF, Images
      </Typography>

      {isLoading && (
        <Box sx={{ mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
          {error}
        </Alert>
      )}

      {results.length > 0 && (
        <Box sx={{ mt: 2, width: "100%" }}>
          {results.map((result, index) => (
            <Alert
              key={index}
              severity={result.error ? "error" : "success"}
              sx={{ mt: 1 }}
            >
              {result.filename}: {result.error || "Processed successfully"}
            </Alert>
          ))}
        </Box>
      )}
    </Paper>
  );
}

export default FileUploadSectionWithRedux;
