import { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchInvoices } from "../slices/invoiceSlice";
import { fetchCustomers } from "../slices/customerSlice";
import { fetchProducts } from "../slices/productSlice";
import { UploadResultType } from "../types";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const uploadFiles = async (files: File[]) => {
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

function FileUploadWithRedux() {
  const [, setResults] = useState(null);
  const dispatch = useAppDispatch();
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    try {
      const files: File[] = Array.from(event.target.files || []);
      if (files.length === 0) {
        throw new Error("Please select a file to upload.");
      }

      const response = await uploadFiles(files);
      setResults(response.results);
      processData(response.results);
      event.target.value = ""; // Reset input field
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred.";
      console.log(errorMessage);
    }
  };
  const processData = (results: UploadResultType) => {
    results.map((result) => {
      dispatch(fetchInvoices(result.result.data.invoices));
      dispatch(fetchCustomers(result.result.data.customers));
      dispatch(fetchProducts(result.result.data.products));
    });
  };
  return (
    <div>
      <h1>File Upload</h1>
      <div className="flex py-2 px-3">
        <input
          type="file"
          multiple
          onChange={handleFileUpload}
          accept=".jpg,.jpeg,.png,.pdf,.xls,.xlsx,.ods"
        />
      </div>
    </div>
  );
}

export default FileUploadWithRedux;
