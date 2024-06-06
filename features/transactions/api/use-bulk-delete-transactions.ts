import { toast } from "sonner";
import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/hono"

type RequestType = InferRequestType<typeof client.api.transactions["bulk-delete"]["$post"]>["json"]
type ResponseType = InferResponseType<typeof client.api.transactions["bulk-delete"]["$post"]>;

export const useBulkDeleteTransactions = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation<
        ResponseType,
        Error,
        RequestType
    >({
        mutationFn: async (json) => {            
            const response = await client.api.transactions["bulk-delete"]["$post"]({json});
            return await response.json();
        },
        onSuccess: () => {
            toast.success("transaction delete");
            queryClient.invalidateQueries({ queryKey: ["transactions"] })
            // todo : also invalidate summary
        },
        onError: () => {
            toast.error("failed to delete transactions");
        }
    })


    return mutation;
}

