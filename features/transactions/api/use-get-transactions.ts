import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

import { client } from '@/lib/hono'
import { transactions } from "@/db/schema";
import { convertAmountFromMiliunits } from "@/lib/utils";

client.api.accounts.$get

export const useGetTransactions = () => {
  const params = useSearchParams();
  const from = params.get("from") || "";
  const to = params.get("to") || "";
  const accountId = params.get("accountId") || "";

  const query = useQuery({
    // todo: check if params are needed in the
    queryKey: ['transactions', { from, to, accountId }],
    queryFn: async () => {
      const response = await client.api.transactions.$get({
        query: {
          from,
          to,
          accountId
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch transactions")
      }

      const { data } = await response.json();
      return data.map((transaction)=>({
        ...transaction,
        amount: convertAmountFromMiliunits(transaction.amount),
      }))
    }
  })

  return query
}