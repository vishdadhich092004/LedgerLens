export interface InvoiceType {
  uniqueId: string;
  customerName: string;
  products: ProductType[];
  quantity: number;
  amount: number;
  tax: number;
  priceAfterTax: number;
  date: Date;
}

export interface CustomerType {
  uniqueId: string;
  customerName: string;
  phoneNumber: string;
  totalAmount: number;
}

export interface ProductType {
  uniqueId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  tax: number;
  discount: number;
  priceAfterTax: number;
}

export interface UploadResultType {
  filename: string;
  result?: {
    success: boolean;
    data?: {
      invoices: InvoiceType[];
      products: ProductType[];
      customers: CustomerType[];
    };
    error?: string;
  };
  error?: string;
}
