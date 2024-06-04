import { useState, useEffect } from 'react';
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
    PaginationState,
    getPaginationRowModel,
} from "@tanstack/react-table";
import NameIcon from '@/assets/name.svg';
import WebsiteIcon from '@/assets/website.svg';
import SummaryIcon from '@/assets/summary.svg';
import WeaknessIcon from '@/assets/weakness.svg';
import StrengthsIcon from '@/assets/strentgh.svg';
import ProximityScoreIcon from '@/assets/measure.svg';
import ProximityExplanationIcon from '@/assets/explanation.svg';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Competitors } from "@/type.tsx";
import { Button } from "@/components/ui/button.tsx";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
}

const icons = {
    Competitor: NameIcon,
    Descriptive_summary: SummaryIcon,
    Weaknesses: WeaknessIcon,
    Strengths: StrengthsIcon,
    Proximity_score: ProximityScoreIcon,
    Proximity_Explanation: ProximityExplanationIcon,
    Crunchbase_Link: WebsiteIcon,
};

export function assignRanks(data: Competitors[]): Competitors[] {
    return data
        .sort((a, b) => b.Proximity_score - a.Proximity_score)
        .map((item, index) => ({ ...item, Rank: index + 1 }));
}

export function DataTable<TData, TValue>({ columns, data }: DataTableProps<TData, TValue>) {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 5,
    });
    const [rowSelection, setRowSelection] = useState({});

    const sortedData = assignRanks(data);

    const table = useReactTable({
        data: sortedData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        pageCount: Math.ceil(data.length / pagination.pageSize),
        state: {
            pagination,
            rowSelection,
        },
        onPaginationChange: setPagination,
        onRowSelectionChange: setRowSelection,
        manualPagination: true,
    });

    useEffect(() => {
        console.log('Pagination state:', pagination);
    }, [pagination]);

    return (
        <>
            <div className="rounded-md border">
                <Table>
                    <TableHeader className="bg-gray text-grayText">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header, index) => {
                                    const Icon = icons[header.column.id as keyof typeof icons] || null;
                                    return (
                                        <TableHead
                                            key={header.id}
                                            className={`text-sm ${index !== 0 ? "border-l border-gray-300" : ""}`}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <div className="flex items-center">
                                                    {Icon && <img src={Icon} alt="" className="mr-2 w-4 h-4" />}
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                                </div>
                                            )}
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody className="bg-white">
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.slice(0, 5).map((row) => ( // Limiter à 5 lignes
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                >
                                    {row.getVisibleCells().map((cell, index) => (
                                        <TableCell
                                            key={cell.id}
                                            className={`text-sm ${index !== 0 ? "border-l border-gray-300" : ""}`}
                                        >
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        console.log('Previous page clicked');
                        table.previousPage();
                    }}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                        console.log('Next page clicked');
                        table.nextPage();
                    }}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </>
    );
}
