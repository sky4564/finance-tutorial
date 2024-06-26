"use client"

import { toast } from 'sonner';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';

import { useNewTransaction } from '@/features/transactions/hooks/use-new-transaction';
import { useGetTransactions } from '@/features/transactions/api/use-get-transactions';
import { useBulkDeleteTransactions } from '@/features/transactions/api/use-bulk-delete-transactions';
import { useDeleteTransaction } from '@/features/transactions/api/use-delete-transaction';
import { useSelectAccount } from '@/features/accounts/hooks/use-select-account';
import { useBulkCreateTransactions } from '@/features/transactions/api/use-bulk-create-transactions';


import { transactions as transactionSchema } from "@/db/schema" 
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data.table';
import { Skeleton } from '@/components/ui/skeleton';

import { columns } from './columns';
import { UploadButton } from './upload-button';
import { ImportCard } from './import-card';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';


enum VARIANTS {
  LIST = "LIST",
  IMPORT = "IMPORT"
}

const INITAL_IMPORT_RESULTS = {
  data: [],
  errors: [],
  meta: {},
}

const TransactionsPage = () => {  
  const [AccountDialog, confirm] = useSelectAccount();
  const [variant, setVariant] = useState<VARIANTS>(VARIANTS.LIST);
  const [importResults, setImportResults] = useState(INITAL_IMPORT_RESULTS)

  const onUpload = (results: typeof INITAL_IMPORT_RESULTS) => {
    console.log({ results })
    setImportResults(results)
    setVariant(VARIANTS.IMPORT);
  };

  const onCancelImport = () => {
    setImportResults(INITAL_IMPORT_RESULTS);
    setVariant(VARIANTS.LIST);
  }

  const newTransaction = useNewTransaction();
  const createTransactions = useBulkCreateTransactions()
  const transactionsQuery = useGetTransactions();
  const deleteTransactions = useBulkDeleteTransactions();
  const transactions = transactionsQuery.data || []

  const isDisabled =
    transactionsQuery.isLoading ||
    deleteTransactions.isPending

  const onSubmitImport = async (
    values: typeof transactionSchema.$inferInsert[],
  ) => {
    const accountId = await confirm();

    if(!accountId ) {
      return toast.error("Please select an account to continue")
    }

    console.log('this is values',values)
    console.log(values)    
    //error 발생
    const data = values.map((value) => ({
      ...value,
      accountId: accountId as string,
    })) 
    
    createTransactions.mutate(data, {
      onSuccess: () => {
        onCancelImport();
      }
    })
  };
  

  if (transactionsQuery.isLoading) {
    return (
      <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
        <Card className='border-none drop-shadow-sm'>
          <CardHeader>
            <Skeleton className='h-8 w-48' />
          </CardHeader>
          <CardContent>
            <div className='h-[500px] w-full flex items-center justify-center'>
              <Loader2 className='size-6 text-slate-300 animate-spin' />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }
  if (variant === VARIANTS.IMPORT) {
    return (
      <>
        <AccountDialog/>
        <ImportCard
          data={importResults.data}
          onCancel={onCancelImport}
          onSubmit={onSubmitImport}
        />
      </>
    )
  }

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>
        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
          <CardTitle className='text-xl line-clamp-1'>
            Transactions History
          </CardTitle>
          <div className='flex items-center gap-x-2'>
            <Button onClick={newTransaction.onOpen} size="sm">
              <Plus className="size-4 mr-2" />
              Add new
            </Button>
            <UploadButton onUpload={onUpload} />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            filterKey='payee'
            columns={columns}
            data={transactions}
            onDelete={(row) => {
              const ids = row.map((r) => r.original.id);
              deleteTransactions.mutate({ ids });
            }}
            disabled={isDisabled}
          />
        </CardContent>
      </Card>
    </div>
  );
};


export default TransactionsPage