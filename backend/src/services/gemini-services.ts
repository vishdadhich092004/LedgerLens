import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import "dotenv/config";
import { ResultType } from "../types";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

const extractionPrompt = `Analyze the document and provide a JSON output that strictly follows this structure:
{
  "invoices": [
    {
      "customer": {
      "customerName": string,
      "phoneNumber": string,
      "totalAmount": number
      },
      "products": [
      {
  "productName": string,
      "quantity": number,
      "unitPrice": number,
      "tax": number,
      "discount": number,
      "priceAfterTax": number
      }
      ],
      "quantity": number,
      "amount": number,
      "tax": number,
      "priceAfterTax": number,
      "date": string (in ISO format)
    }
  ],
  "products": [
    {
      "productName": string,
      "quantity": number,
      "unitPrice": number,
      "tax": number,
      "discount": number,
      "priceAfterTax": number
    }
  ],
  "customers": [
    {
      "customerName": string,
      "phoneNumber": string,
      "totalAmount": number
    }
  ]
}

Rules to follow:
- All fields must be present in each object. Use null for missing values.
- Remove any newlines (\\n) or tabs (\\t) from string values.
- Ensure all number values are properly formatted as numbers, not strings.
- Dates should be in ISO format (YYYY-MM-DD).
- All arrays must be present, even if empty.
- Ensure productIds in invoices correctly reference _id values from products.
- Calculate priceAfterTax based on amount/unitPrice, tax, and discount where applicable.
`;

const cleanResponse = (response: string): string => {
  // Remove JSON code block markers and any surrounding whitespace
  const cleaned = response
    .replace(/^```json\s*/, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    // Parse and stringify to ensure valid JSON structure
    const parsed = JSON.parse(cleaned);
    return JSON.stringify(parsed);
  } catch (error) {
    throw new Error("Invalid JSON structure in response");
  }
};

const handleExcelFiles = async (
  filePath: string,
  result: any,
  extractionPrompt: string
) => {
  const workbook = XLSX.readFile(filePath);
  const sheetData: { [sheet: string]: any[] } = {};

  workbook.SheetNames.forEach((sheetName) => {
    const worksheet = workbook.Sheets[sheetName];
    sheetData[sheetName] = XLSX.utils.sheet_to_json(worksheet);
  });

  result = await model.generateContent([
    { text: extractionPrompt },
    { text: JSON.stringify(sheetData, null, 2) },
  ]);
  return result;
};

const handlePdfFiles = async (
  filePath: string,
  mimeType: string,
  result: any
) => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const uploadResponse = await fileManager.uploadFile(filePath, {
    mimeType: mimeType,
    displayName: path.basename(filePath),
  });

  result = await model.generateContent([
    {
      fileData: {
        mimeType: uploadResponse.file.mimeType,
        fileUri: uploadResponse.file.uri,
      },
    },
    { text: extractionPrompt },
  ]);
  return result;
};

const handleImageFiles = async (
  filePath: string,
  mimeType: string,
  result: any
) => {
  const fileData = {
    inlineData: {
      data: Buffer.from(fs.readFileSync(filePath)).toString("base64"),
      mimeType,
    },
  };

  result = await model.generateContent([fileData, { text: extractionPrompt }]);
  return result;
};

export async function processFileWithGemini(
  filePath: string,
  mimeType: string
): Promise<ResultType> {
  try {
    console.log(`Processing file: ${filePath} with mime type: ${mimeType}`);

    let result;

    if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      result = await handleExcelFiles(filePath, result, extractionPrompt);
    } else if (mimeType === "application/pdf") {
      result = await handlePdfFiles(filePath, mimeType, result);
    } else {
      result = await handleImageFiles(filePath, mimeType, result);
    }

    const response = await result;
    const cleanedData = cleanResponse(response.response.text());
    const parsedData = JSON.parse(cleanedData);

    return {
      success: true,
      data: parsedData,
    };
  } catch (error) {
    const processError = error as Error;
    console.error(`Error processing file ${filePath}:`, {
      error: processError.message,
      stack: processError.stack,
      name: processError.name,
    });
    return {
      success: false,
      error: processError.message,
    };
  }
}
