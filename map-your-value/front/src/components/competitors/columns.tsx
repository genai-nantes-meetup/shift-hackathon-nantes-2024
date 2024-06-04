import { ColumnDef } from "@tanstack/react-table";
import { Competitors } from "@/type.tsx";
import { Checkbox } from "@/components/ui/checkbox.tsx";
import {Popover} from "@radix-ui/react-popover";
import {PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogDescription } from "@/components/ui/dialog.tsx";
import { Button } from "@/components/ui/button.tsx";

export const columns: ColumnDef<Competitors>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <div className="flex justify-center items-center h-full mr-4">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="flex justify-center items-center h-full mr-4">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "Rank",
        header: "Rank",
        cell: info => info.row.index + 1,
        enableSorting: false,
    },
    {
        accessorKey: "Competitor",
        header: "Competitor",
        cell: info => info.getValue(),
        enableSorting: true,
    },
    {
        accessorKey: "Descriptive_summary",
        header: "Descriptive Summary",
    },
    {
        accessorKey: "Strengths",
        header: "Strengths",
        cell: info => (Array.isArray(info.getValue()) ? (info.getValue() as string[]).join(", ") : info.getValue()),
    },
    {
        accessorKey: "Weaknesses",
        header: "Weaknesses",
        cell: info => (Array.isArray(info.getValue()) ? (info.getValue() as string[]).join(", ") : info.getValue()),
    },
    {
        accessorKey: "Proximity_score",
        header: "Proximity Score",
        cell: info => {
            const value = info.getValue() as number;
            const row = info.row.original as Competitors;
            return (
                <>
                    <Popover>
                        <PopoverTrigger asChild>
                            <div className="w-full h-2 bg-gradientBg rounded-full cursor-pointer">
                                <div className="h-2 bg-gradientStart rounded-full"
                                     style={{width: `${value * 100 / 5}%`}}></div>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-80">
                            <div className="grid gap-4">
                                {row.Proximity_Explanation}
                            </div>
                        </PopoverContent>
                    </Popover>
                </>
            );
        },
    },
    {
        accessorKey: "Crunchbase_Link",
        header: "Crunchbase Link",
        cell: info => {
            const crunchbaseLink = info.getValue() as string;
            return (
                <a href={crunchbaseLink} className="underline" target="_blank" rel="noopener noreferrer">
                    Crunchbase
                </a>
            );
        },
    },
    {
        accessorKey: "Company_Card",
        header: "Company Card",
        cell: ({ row }) => (
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline">View Details</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <h2 className="font-bold text-xl">Company Card</h2>
                        <DialogDescription >
                            Detailed information about {row.original.Competitor}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div>{row.original.Company_Card}</div>
                    </div>
                </DialogContent>
            </Dialog>
        ),
    },
];

