export async function searchCompetitorCompetitorGetRaw(requestParameters: { search: string }) {
    if (!requestParameters.search) {
        throw new Error("Search parameter is missing");
    }

    const queryParameters = new URLSearchParams({ search: requestParameters.search });

    try {
        const response = await fetch(`http://localhost:8000/competitor?${queryParameters}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
            const responseText = await response.text();
            console.error("Expected JSON response but got:", responseText);
            throw new Error(`Expected JSON response but got ${contentType}`);
        }

        return await response.json();
    } catch (error) {
        console.error("Error in searchCompetitorCompetitorGetRaw:", error);
        throw error;
    }
}
