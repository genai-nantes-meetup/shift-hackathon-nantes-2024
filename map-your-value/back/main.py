from typing import List
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

from extraction.chain import analyse_company

app = FastAPI()


class descriptionOfACompany(BaseModel):
    Competitor: str
    Descriptive_summary: str
    Strengths: List[str] | str
    Weaknesses: List[str] | str
    Proximity_score: int
    Proximity_Explanation: str
    Crunchbase_Link: str
    Company_Card: str


class rankCompetitorList(BaseModel):
    competitors: List[descriptionOfACompany]


origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# /POST /competitor
@app.get("/competitor")
def searchCompetitor(search: str):
    out = analyse_company(search)
    competitors = []

    for i in out["competitors"]:
        i["Company_Card"] = ""

    for i in out["competitors"]:
        competitors.append(descriptionOfACompany.model_validate(i, from_attributes=True, strict=False))

    for i in competitors:
        if i.Competitor == "Otter.ai":
            with open("./extraction/company_fact_card/otter.txt", "r") as f:
                i.Company_Card = f.read()
        if i.Competitor == "Zoom IQ":
            with open("./extraction/company_fact_card/zoom.txt", "r") as f:
                i.Company_Card = f.read()

    return rankCompetitorList(competitors=competitors)
