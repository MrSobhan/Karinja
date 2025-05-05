import * as React from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreVerticalIcon,
  Trash,
  SquarePen
} from "lucide-react"


export function DataTable({ headers, data, onEdit, onDelete }) {
  const [rowSelection, setRowSelection] = React.useState({})
  const [sorting, setSorting] = React.useState([])
  const [pagination, setPagination] = React.useState({
    pagediensten: 0,
    pageSize: 10,
  })

  

  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="انتخاب همه"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="flex items-center justify-center">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="انتخاب ردیف"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      ...headers.map((header) => ({
        accessorKey: header.key,
        header: () => <div className="text-right">{header.label}</div>,
        cell: ({ row }) => (
          <div className="text-right">{row.original[header.key]}</div>
        ),
      })),
      {
        id: "actions",
        header: () => <div className="text-right">اقدامات</div>,
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                size="icon"
              >
                <MoreVerticalIcon />
                <span className="sr-only">باز کردن منو</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="right" className="w-32">
              <DropdownMenuItem className="!pl-10" onClick={() => onEdit(row.original)}>
                ویرایش <SquarePen />
              </DropdownMenuItem>
              <DropdownMenuItem className="!pl-14" onClick={() => onDelete(row.original.id)}>
                حذف <Trash />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ],
    [headers, onEdit, onDelete]
  )

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      rowSelection,
      pagination,
    },
    getRowId: (row) => row.id?.toString() || Math.random().toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div className="overflow-hidden rounded-lg border" dir="rtl">
      <Table>
        <TableHeader className="sticky top-0 z-10 bg-muted">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id} colSpan={header.colSpan} className="text-right">
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {
            table.getRowModel().rows?.length != 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {
                    row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))
                  }
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  بدون نتیجه
                </TableCell>
              </TableRow>
            )
          }
        </TableBody>
      </Table>
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="mr-auto flex items-center gap-2 lg:mr-0">
            <Button
              variant="outline"
              className="hidden size-8 lg:flex"
              size="icon"
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">رفتن به آخرین صفحه</span>
              <ChevronsRightIcon />
            </Button>
            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="sr-only">رفتن به صفحه بعدی</span>
              <ChevronRightIcon />
            </Button>

            <Button
              variant="outline"
              className="size-8"
              size="icon"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">رفتن به صفحه قبلی</span>
              <ChevronLeftIcon />
            </Button>
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <span className="sr-only">رفتن به اولین صفحه</span>
              <ChevronsLeftIcon />
            </Button>


          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            صفحه {table.getState().pagination.pageIndex + 1} از{" "}
            {table.getPageCount()}
          </div>
        </div>
        <div className="hidden text-sm text-muted-foreground lg:flex mr-0">
          {table.getFilteredSelectedRowModel().rows.length} از{" "}
          {table.getFilteredRowModel().rows.length} ردیف انتخاب شده
        </div>
      </div>
    </div>
  )
}
