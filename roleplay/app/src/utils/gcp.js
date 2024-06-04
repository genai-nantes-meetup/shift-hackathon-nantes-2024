

export default async function generateResponse(data) {
    try {
        // Generate image using GCP
        const res = await fetch('/api/google-ai', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data }),
          });
    
        if (!res.ok) {
          throw new Error('Failed to fetch');
        }
    
        const result = await res.json();

        return { result };
    } catch (error) {
        console.error('Error generating response:', error);
        throw new Error('Internal Server Error');
    }
}

