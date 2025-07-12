import type { Zone } from "$lib/types";
import type { ColumnDef } from "@tanstack/table-core";
import { renderComponent } from "$lib/components/ui/data-table";
import DataTableActions from "./data-table-actions.svelte";

export const columns: ColumnDef<Zone>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "Register Date",
    cell: ({ row }) => new Date(row.original.created_at).toLocaleDateString(),
  },
  {
    accessorKey: "expires_at",
    header: "Expiration Date",
    cell: ({ row }) => {
      if (row.original.expires_at == "N/A") {
        return "-";
      } else {
        return new Date(row.original.expires_at).toLocaleDateString();
      }
    },
  },
  {
    accessorKey: "registrant",
    header: "Registrant",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return renderComponent(DataTableActions, { id: row.original.id });
    },
  },
];
