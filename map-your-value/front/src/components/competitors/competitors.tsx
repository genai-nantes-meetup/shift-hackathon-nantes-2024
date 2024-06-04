import React from 'react';
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { Input } from "@/components/ui/input";
import { ColumnFiltersState, SortingState, useReactTable, getCoreRowModel, getPaginationRowModel, getSortedRowModel, getFilteredRowModel } from "@tanstack/react-table";
import { Button } from "@/components/ui/button.tsx";
import { Competitors } from "@/type.tsx";

interface CompetitorsTableProps {
    data: Competitors[];
}

export function CompetitorsTable({ data }: CompetitorsTableProps) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [filterValue, setFilterValue] = React.useState<string>("");
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onRowSelectionChange: setRowSelection,
        state: {
            sorting,
            columnFilters,
            rowSelection,
        },
    });

    React.useEffect(() => {
        const nameColumn = table.getColumn("Competitor");
        if (nameColumn) {
            nameColumn.setFilterValue(filterValue);
        }
    }, [filterValue, table]);

    const filteredData = table.getFilteredRowModel().rows.map(row => row.original);

    const handleExportToCSV = () => {
        const headers = columns.map(col => col.header as string).join(',');
        const rows = filteredData.map(row =>
            columns.map(col => {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                const key = col.accessorKey as keyof Competitors;
                const value = row[key];
                return Array.isArray(value) ? value.join(';') : value;
            }).join(',')
        );
        const csvContent = [headers, ...rows].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'competitors.csv');
        link.click();
    };

    const handleOpenWebsiteClick = () => {
        const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
        console.log(selectedRows);
        selectedRows.forEach(row => {
            const website = row.Crunchbase_Link;
            if (website) {
                window.open(website, '_blank', 'noopener,noreferrer');
            }
        });
    };

    return (
        <div className="container mx-auto py-10">
            <div className="flex items-center justify-between py-4">
                <h1 className="text-3xl">Data Analyse</h1>
                <div className="flex gap-2">
                    <Input
                        placeholder="Filter Competitors"
                        value={filterValue}
                        onChange={(event) => setFilterValue(event.target.value)}
                        className="max-w-sm"
                    />
                    <Button variant="outline" onClick={handleExportToCSV}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"
                             color="#6b7d91" fill="none">
                            <path
                                d="M3.5 10C3.5 6.22876 3.5 4.34315 4.7448 3.17157C5.98959 2 7.99306 2 12 2H12.7727C16.0339 2 17.6645 2 18.7969 2.79784C19.1214 3.02643 19.4094 3.29752 19.6523 3.60289C20.5 4.66867 20.5 6.20336 20.5 9.27273V11.8182C20.5 14.7814 20.5 16.2629 20.0311 17.4462C19.2772 19.3486 17.6829 20.8491 15.6616 21.5586C14.4044 22 12.8302 22 9.68182 22C7.88275 22 6.98322 22 6.26478 21.7478C5.10979 21.3424 4.19875 20.4849 3.76796 19.3979C3.5 18.7217 3.5 17.8751 3.5 16.1818V10Z"
                                stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                            <path
                                d="M20.5 12C20.5 13.8409 19.0076 15.3333 17.1667 15.3333C16.5009 15.3333 15.716 15.2167 15.0686 15.3901C14.4935 15.5442 14.0442 15.9935 13.8901 16.5686C13.7167 17.216 13.8333 18.0009 13.8333 18.6667C13.8333 20.5076 12.3409 22 10.5 22"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path d="M8 7H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                            <path d="M8 11H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                  strokeLinejoin="round"/>
                        </svg>
                    </Button>
                    <Button variant="outline" onClick={handleOpenWebsiteClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="22" height="22"
                             color="#6b7d91" fill="none">
                            <path
                                d="M11.1005 3.00208C7.45162 3.00864 5.54086 3.09822 4.31974 4.31931C3.00195 5.63706 3.00195 7.75796 3.00195 11.9997C3.00195 16.2415 3.00195 18.3624 4.31974 19.6801C5.63753 20.9979 7.75849 20.9979 12.0004 20.9979C16.2423 20.9979 18.3632 20.9979 19.6811 19.6801C20.9021 18.4591 20.9917 16.5484 20.9983 12.8996"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                            <path
                                d="M20.4809 3.51715L14.9316 9.05114M20.4809 3.51715C19.9869 3.02264 16.6593 3.06873 15.9558 3.07874M20.4809 3.51715C20.9748 4.01166 20.9288 7.34292 20.9188 8.04718"
                                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
                                strokeLinejoin="round"/>
                        </svg>
                    </Button>
                    <Button variant="outline">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" color="#6B7D91" fill="none">
                            <path d="M11.9959 12H12.0049" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M17.9998 12H18.0088" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M5.99981 12H6.00879" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </Button>
                </div>
            </div>
            <DataTable columns={columns} data={filteredData}/>
        </div>
    );
}

export default CompetitorsTable;
