import * as React from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreVerticalIcon,
  Trash,
  SquarePen,
} from "lucide-react";

export function DataTable({ headers, data, onEdit, onDelete, valueMappings = {} }) {
  const [selectedRows, setSelectedRows] = React.useState(new Set());
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize] = React.useState(10);

  const toggleRowSelection = (id) => {
    const newSelection = new Set(selectedRows);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedRows(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedRows.size === data.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(data.map((item) => item.id)));
    }
  };

  const totalPages = Math.ceil(data.length / pageSize);
  const paginatedData = data.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  React.useEffect(() => {
    console.log("Data received:", data);
  }, [data]);

  const getDisplayValue = (key, value) => {
    if (valueMappings[key] && valueMappings[key][value]) {
      return valueMappings[key][value];
    }
    return value;
  };

  return (
    <div className="overflow-hidden rounded-lg border" dir="rtl">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          <TableRow>
            <TableHead className="text-right">
              <Checkbox
                checked={selectedRows.size === data.length && data.length > 0}
                onCheckedChange={toggleSelectAll}
                aria-label="انتخاب همه"
              />
            </TableHead>
            {headers.map((header) => (
              <TableHead key={header.key} className="text-right">
                {header.label}
              </TableHead>
            ))}
            <TableHead className="text-right">اقدامات</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedData.length > 0 ? (
            paginatedData.map((row) => (
              <TableRow
                key={row.id}
                data-state={selectedRows.has(row.id) && "selected"}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.has(row.id)}
                    onCheckedChange={() => toggleRowSelection(row.id)}
                    aria-label="انتخاب ردیف"
                  />
                </TableCell>
                {headers.map((header) => {
                  // console.log(row[header.key]);
                  
                  return (
                    <TableCell key={header.key} className="text-right">
                      {getDisplayValue(header.key, row[header.key])}
                    </TableCell>
                  )
                })}
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      className="size-8 text-blue-600"
                      size="icon"
                      onClick={() => onEdit(row)}
                    >
                      <SquarePen />
                      <span className="sr-only">ویرایش</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="size-8 text-red-600"
                      size="icon"
                      onClick={() => onDelete(row.id)}
                    >
                      <Trash />
                      <span className="sr-only">حذف</span>
                    </Button>
                  </div>
                
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={headers.length + 2}
                className="h-24 text-center"
              >
                بدون نتیجه
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="mr-auto flex items-center gap-2 lg:mr-0">
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">رفتن به آخرین صفحه</span>
              <ChevronsRightIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              <span className="sr-only">رفتن به صفحه بعدی</span>
              <ChevronRightIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">رفتن به صفحه قبلی</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
            >
              <span className="sr-only">رفتن به اولین صفحه</span>
              <ChevronsLeftIcon />
            </Button>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            صفحه {currentPage} از {totalPages}
          </div>
        </div>
        <div className="hidden text-sm text-muted-foreground lg:flex mr-0">
          {selectedRows.size} از {data.length} ردیف انتخاب شده
        </div>
      </div>
    </div>
  );
}