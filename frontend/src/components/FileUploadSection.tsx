/* eslint-disable @typescript-eslint/no-explicit-any */
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

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";
// API client function
const uploadFiles = async (
  files: File[]
): Promise<{
  message: string;
  results: Array<{
    filename: string;
    result?: any;
    error?: string;
  }>;
}> => {
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

// Styled components for file upload
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

interface UploadResult {
  filename: string;
  result?: any;
  error?: string;
}

function FileUploadSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<UploadResult[]>([]);

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

      const response = await uploadFiles(files);
      setResults(response.results);

      // Reset file input
      event.target.value = "";
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
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

export default FileUploadSection;
