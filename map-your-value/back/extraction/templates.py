JSON_TEMPLATE = {
    "Summary": "",
    "Core features": [
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
    ],
    "Additional_features": [
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
        {
            "feature": "",
            "description": "",
        },
    ],
}

PROMPT_GEMINI = """
As a Gartner analyst, can you give me the 7 main competitors for the product mentioned in the prompt and the descriptive summary?

Structure your answer in the form of a table, adding 1 column with the strengths and weaknesses of each competitor in relation to tldv.

Add a column with a proximity score (between 1 and 5) for each competitor, to define whether the competitor is very close (5) or rather distant (1) from tldv's value proposition.
Can you add a column to explain the proximity score?


Can you add the crunchbase link for each competitor as a short link, in last column

Output the result in the JSON.

Product: {}
"""
PROMPT_MISTRAL = """
Analyse the website that I will give you.
Create a best resume, adding Marketing insights : unique value proposition, positioning
Product: features, customizations, integrations, differentiation, platforms, and more.
Add Pricing approach in the resume (business model, pricing tiers) and audience (users, buyers, target company type, size.



Website: {}
"""
