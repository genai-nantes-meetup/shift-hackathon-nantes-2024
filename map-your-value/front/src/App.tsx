import { useState } from 'react';
import './App.css';
import InputSearch from "@/components/inputSearch";
import CompetitorsTable from "@/components/competitors/competitors";
import { Competitors } from "@/type.tsx";
import { searchCompetitorCompetitorGetRaw } from "@/api/call.tsx";

export interface CompetitorsResponse {
    competitors: Competitors[];
}

function App() {
    const [showCompetitorsTable, setShowCompetitorsTable] = useState(false);
    const [competitors, setCompetitors] = useState<Competitors[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    const handleSearchCompetitors = async (search: string) => {
        setLoading(true);
        try {
            const result: CompetitorsResponse = await searchCompetitorCompetitorGetRaw({ search });
            console.log('Result from getCompetitorsData:', result);
            if (result && result.competitors) {
                setCompetitors(result.competitors);
            } else {
                console.error('Unexpected result structure:', result);
            }
        } catch (error) {
            console.error('Error handling search competitors:', error);
        } finally {
            setLoading(false);
            setShowCompetitorsTable(false);
            setTimeout(() => {
                setShowCompetitorsTable(true);
            }, 50);
        }
    };

    return (
        <>
            <div className="absolute inset-0 overflow-hidden z-[-1]">
                <div className="absolute inset-0 filter blur-lg">
                    <div className="absolute w-72 h-72 bg-gradientEnd opacity-40 rounded-full top-1/4 left-1/4 px-32 py-16"></div>
                    <div className="absolute w-96 h-96 bg-gradientStart opacity-40 rounded-full top-1/3 left-2/4"></div>
                </div>
            </div>
            <div className="h-screen w-full flex flex-col justify-center items-center">
                <InputSearch onSearch={handleSearchCompetitors} />
                {loading && (
                    <div className="mt-4 flex justify-center items-center">
                        <div className="w-8 h-8 border-4 border-t-4 border-gray-200 border-t-gradientStart rounded-full animate-spin"></div>
                    </div>
                )}
                {showCompetitorsTable && (
                    <div className="w-full animate-fadeIn">
                        <CompetitorsTable data={competitors} loading={loading} />
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
