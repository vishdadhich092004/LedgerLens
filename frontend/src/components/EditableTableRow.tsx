/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Tooltip,
  TableContainer,
} from "@mui/material";
import { Edit, Save, X } from "lucide-react";
import TabPanel from "./TabPanels";

interface BaseRecord {
  uniqueId: string;
  [key: string]: any;
}

export interface Column<T> {
  field: keyof T;
  label: string;
  type?: "text" | "number" | "email" | "date";
  render?: (value: any) => React.ReactNode;
}

interface EditTableProps<T extends BaseRecord> {
  data: T[];
  columns: Column<T>[];
  onUpdate: (updatedItem: T) => void;
  className?: string;
  tabValue: number;
  index: number;
}

const EditTable = <T extends BaseRecord>({
  data,
  columns,
  onUpdate,
  tabValue,
  index,
  className = "",
}: EditTableProps<T>) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editedData, setEditedData] = useState<T | null>(null);

  const handleEdit = (row: T) => {
    setEditingId(row.uniqueId);
    setEditedData(row);
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditedData(null);
  };

  const handleChange = (field: keyof T, value: any) => {
    if (!editedData) return;

    setEditedData((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
  };

  const handleSave = () => {
    if (!editedData) return;
    onUpdate(editedData);
    setEditingId(null);
    setEditedData(null);
  };

  return (
    <div className={`rounded-md border ${className}`}>
      <TabPanel value={tabValue} index={index}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell key={String(column.field)} className="font-medium">
                    {column.label}
                  </TableCell>
                ))}
                <TableCell className="w-24">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row) => (
                <TableRow
                  key={row.uniqueId}
                  className={`transition-colors ${
                    editingId === row.uniqueId
                      ? "bg-muted/50"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {columns.map((column) => (
                    <TableCell key={String(column.field)}>
                      {editingId === row.uniqueId ? (
                        <div className="relative">
                          <Input
                            type={column.type || "text"}
                            value={editedData?.[column.field] ?? ""}
                            onChange={(e) =>
                              handleChange(column.field, e.target.value)
                            }
                          />
                        </div>
                      ) : (
                        <span className="px-2 py-1">
                          {column.render
                            ? column.render(row[column.field])
                            : String(row[column.field])}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  <TableCell>
                    <div className="flex gap-2 justify-end">
                      {editingId === row.uniqueId ? (
                        <>
                          <Tooltip title="Save">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleSave}
                            >
                              <Save className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                          <Tooltip title="Cancel">
                            <Button
                              variant="contained"
                              size="small"
                              onClick={handleCancel}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </Tooltip>
                        </>
                      ) : (
                        <Tooltip title="Edit">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleEdit(row)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Tooltip>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </div>
  );
};

export default EditTable;
