import { useState } from 'react';

import { ImportTable } from './import-table';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { string } from 'zod';
import { Row } from 'react-day-picker';
import { Item } from '@radix-ui/react-dropdown-menu';
import { index } from 'drizzle-orm/mysql-core';
import { convertAmountToMiliunits } from '@/lib/utils';
import { format, parse } from 'date-fns';

const dateFormat = "yyyy-MM-dd HH:mm:ss";
const outputFormat = "yyyy;-MM-dd";

const requiredOptions = [
  "amount",
  "date",
  "payee",
]

interface SelectedColumnState {
  [key: string]: string | null;
}

type Props = {
  data: string[][];
  onCancel: () => void;
  onSubmit: (data: any) => void;
}





export const ImportCard = ({
  data,
  onCancel,
  onSubmit,
}: Props) => {
  const [selectedColumns, setSelectedColumns] = useState<SelectedColumnState>({});

  const headers = data[0];
  const body = data.slice(1)

  const onTableHeadSelectChange = (
    columnIndex: number,
    value: string | null
  ) => {
    setSelectedColumns((prev) => {
      const newSelectedColumns = { ...prev }

      for (const key in newSelectedColumns) {
        if (newSelectedColumns[key] === value) {
          newSelectedColumns[key] = null;
        }
      }
      if (value === "skip") {
        value = null;
      }

      newSelectedColumns[`column_${columnIndex}`] = value;
      return newSelectedColumns
    })
  }
  const progress = Object.values(selectedColumns).filter(Boolean).length

  const handleContitnue = () => {
    const getColumnIndex = (column: string) => {
      return column.split("_")[1];
    }

    const mappedData = {
      headers: headers.map((_header, index) => {
        const columnIndex = getColumnIndex(`column_${index}`);
        return selectedColumns[`column_${columnIndex}`] || null;
      }),
      body: body.map((row) => {
        const transformedRow = row.map((cell, index) => {
          const columnIndex = getColumnIndex(`column_${index}`);
          return selectedColumns[`column_${columnIndex}`] ? cell : null
        })
        return transformedRow.every((item) => item === null)
          ? []
          : transformedRow
      }).filter((row) => row.length > 0),
    }
    const arrayOfData = mappedData.body.map((row) => {
      return row.reduce((acc: any, cell, index) => {
        const header = mappedData.headers[index];
        if (header !== null) {
          acc[header] = cell
        }
        return acc;
      }, {});
    }) 
    const formattedData = arrayOfData.map((item)=> ({
      ...item,
      amount: convertAmountToMiliunits(parseFloat(item.amount)),
      //payload 에서 데이터 포맷이 이상하게 들어가는거 확인함
      //주석하고 보내보니깐 zod 안걸리고 200 떨어짐 
      //이전에는 zod 걸려서 data invaild 뜨고 , 400 error 뜸
      // date: format(parse(item.date, dateFormat,new Date()), outputFormat)
    }))

    onSubmit(formattedData)
    
  };

  return (
    <div className='max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
      <Card className='border-none drop-shadow-sm'>

        <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>

          <CardTitle className='text-xl line-clamp-1'>
            Transactions History
          </CardTitle>

          <div className='flex items-center gap-x-2'>
            <Button
              onClick={onCancel}
              size="sm"
              className='w-full lg:w-auto'
            >
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={progress < requiredOptions.length}
              onClick={handleContitnue}
              className='w-full lg:w-auto'
            >
              Continue ({progress} / {requiredOptions.length})
            </Button>

          </div>

        </CardHeader>

        <CardContent>
          <ImportTable
            headers={headers}
            body={body}
            selectedColumns={selectedColumns}
            onTableHeadSelectChange={onTableHeadSelectChange}
          />

        </CardContent>
      </Card>
    </div>
  );
}
