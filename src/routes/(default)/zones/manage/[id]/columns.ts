import type { ZoneRecord } from "$lib/types";
import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table";
import DataTableActions from "./data-table-actions.svelte";

export function getColumns(
  onEdit: (entry: ZoneRecord) => void,
  onDelete?: (entry: ZoneRecord) => void,
): ColumnDef<ZoneRecord>[] {
  return [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "class",
      header: "Class",
    },
    {
      accessorKey: "ttl",
      header: "TTL",
    },
    {
      accessorKey: "priority",
      header: "Priority",
      cell: ({ row }) => {
        if (row.original.priority) {
          return row.original.priority;
        } else {
          return "-";
        }
      },
    },
    {
      accessorKey: "value",
      header: "Value",
    },
    {
      id: "actions",
      header: () => null,
      cell: ({ row }) => {
        return renderComponent(DataTableActions, {
          entry: row.original,
          onEdit,
          onDelete,
        });
      },
    },
  ];
}
