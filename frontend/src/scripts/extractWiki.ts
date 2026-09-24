import { summary as getSummary } from "wikipedia";

interface WikiPageLookup {
    "seasons": string[];
    "teams": string[];
}

const wikiLookup: WikiPageLookup = {
    "seasons": [
        "2024-25 Premier League",
        "2025-26 Premier League",
        "2026-27 Premier League",
    ],
    "teams": [
        "Liverpool F.C.",
        "Manchester City F.C.",
        "Manchester United F.C.",
        "Chelsea F.C.",
        "Arsenal F.C.",
        "Tottenham Hotspur F.C.",
        "Aston Villa F.C.",
        "Everton F.C.",
        "Crystal Palace F.C.",
        "Fulham F.C.",
        "Newcastle United F.C.",
        "Nottingham Forest F.C."
    ],
}

async function extractWikiInformation(title: string) {
    
}