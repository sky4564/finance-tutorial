"use client"

import { InferResponseType } from "hono"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown } from "lucide-react"
import { format } from "date-fns"


import { client } from "@/lib/hono"
import { formatCurrency } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Actions } from "./actions"
import { Badge } from "@/components/ui/badge"
import { AccountColumn } from "./account-column"
import { CategoryColumn } from "./category-column"
export type ResponseType = InferResponseType<typeof client.api.transactions.$get, 200>["data"][0]



// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
}

export const columns: ColumnDef<ResponseType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          date
          < ArrowUpDown className="ml-2 h-4 w-4" />
        </Button >
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return (
        <span>
          {format(date, "dd MMMM, yyyy")}
        </span>
      )
    }
  },
  {
    accessorKey: "category",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          < ArrowUpDown className="ml-2 h-4 w-4" />
        </Button >
      )
    },
    cell: ({ row }) => {      
      return (
        <CategoryColumn
          id={row.original.id}
          category={row.original.category}
          categoryId={row.original.categoryId}
        />
      )
    }
  },
  {
    accessorKey: "payee",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payee
          < ArrowUpDown className="ml-2 h-4 w-4" />
        </Button >
      )
    },

  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          < ArrowUpDown className="ml-2 h-4 w-4" />
        </Button >
      )
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

      return (
        <Badge
          variant={amount < 0 ? "destructive" :  "primary"}
          className="text-xs font-medium px-3.5 py-2.5"
        >
          {formatCurrency(amount)}
        </Badge>
      )
    }
  },
  {
    accessorKey: "account",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Account
          < ArrowUpDown className="ml-2 h-4 w-4" />
        </Button >
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("date") as Date
      return (
        <AccountColumn
          account={row.original.account}
          accountId={row.original.accountId}
        />
      )
    }
  },

  {
    id: "actions",
    cell: ({ row }) => <Actions id={row.original.id} />
  }

]
