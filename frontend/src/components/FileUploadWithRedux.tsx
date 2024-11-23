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
import { customersActions } from "../store/slices/customerSlice";
import { invoicesActions } from "../store/slices/invoiceSlice";
import { productsActions } from "../store/slices/productSlice";
import { useAppDispatch } from "../store/hooks";
import { v4 as uuidv4 } from "uuid";
import { UploadResultType } from "../types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

// Styled components
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

// API client function
const uploadFiles = async (
  files: File[]
): Promise<{ results: UploadResultType[] }> => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

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

  const processAndStoreData = (results: UploadResultType[]) => {
    results.forEach((result) => {
      if (result.result?.success && result.result.data) {
        const { invoices, products, customers } = result.result.data;

        // Process invoices
        invoices.forEach((invoice, index) => {
          dispatch(
            invoicesActions.addInvoice({
              uniqueId: uuidv4(), // Generate unique ID
              customerName: invoice.customerName,
              products: invoice.products,
              quantity: invoice.quantity,
              tax: invoice.tax,
              priceAfterTax: invoice.priceAfterTax,
              amount: invoice.amount,
              date: invoice.date,
            })
          );
        });

        // Process products
        products.forEach((product, index) => {
          dispatch(
            productsActions.addProduct({
              uniqueId: uuidv4(),
              productName: product.productName,
              quantity: product.quantity,
              unitPrice: product.unitPrice,
              tax: product.tax,
              discount: product.discount,
              priceAfterTax: product.priceAfterTax,
            })
          );
        });

        // Process customers
        customers.forEach((customer, index) => {
          dispatch(
            customersActions.addCustomer({
              uniqueId: uuidv4(),
              customerName: customer.customerName,
              phoneNumber: customer.phoneNumber,
              totalAmount: customer.totalAmount,
            })
          );
        });
      }
    });
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsLoading(true);
    setError(null);
    setResults([]);

    try {
      const files = Array.from(event.target.files || []);
      if (files.length === 0) {
        throw new Error("Please select a file to upload");
      }

      // Set loading state in all slices
      dispatch(invoicesActions.setLoading(true));
      dispatch(productsActions.setLoading(true));
      dispatch(customersActions.setLoading(true));

      const response = await uploadFiles(files);
      setResults(response.results);

      // Process and store the data
      processAndStoreData(response.results);

      // Clear any existing errors
      dispatch(invoicesActions.setError(null));
      dispatch(productsActions.setError(null));
      dispatch(customersActions.setError(null));

      // Reset file input
      event.target.value = "";
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);

      // Set error state in all slices
      dispatch(invoicesActions.setError(errorMessage));
      dispatch(productsActions.setError(errorMessage));
      dispatch(customersActions.setError(errorMessage));
    } finally {
      setIsLoading(false);

      // Reset loading state in all slices
      dispatch(invoicesActions.setLoading(false));
      dispatch(productsActions.setLoading(false));
      dispatch(customersActions.setLoading(false));
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
