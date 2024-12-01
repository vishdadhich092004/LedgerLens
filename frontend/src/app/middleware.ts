/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAction } from "@reduxjs/toolkit";

export const notifyChange = createAction<{
  type: "customer" | "product";
  id: string;
  changes: Record<string, any>;
}>("shared/notifyChange");
