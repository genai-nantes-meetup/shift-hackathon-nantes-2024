import { Configuration, DefaultApi, SearchCompetitorCompetitorGetRequest } from '../../api';
import { Features } from "@/type.tsx";
import { CompetitorsResponse } from "@/App.tsx";

const api = new DefaultApi(new Configuration({ basePath: 'http://127.0.0.1:8000' }));

export async function getCompetitorsData(search: string): Promise<CompetitorsResponse> {
    try {
        const requestData: SearchCompetitorCompetitorGetRequest = { search };
        return await api.searchCompetitorCompetitorGet(requestData);
    } catch (error) {
        console.error('Error fetching data:', error);
        return { competitors: [] };
    }
}

export async function getFeaturesData(): Promise<Features[]> {
    return [
        { feature: "Responsive Design" },
        { feature: "SEO Optimization" },
        { feature: "Live Chat Support" },
        { feature: "Newsletter Signup" },
        { feature: "Social Media Integration" },
        { feature: "Contact Form" },
        { feature: "Blog" },
        { feature: "About Us Page" },
        { feature: "Calls to Action" },
        { feature: "Search Functionality" }
    ];
}
