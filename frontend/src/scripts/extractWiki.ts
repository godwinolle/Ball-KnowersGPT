import { createHash } from "crypto";
import wiki, { pageError } from "wikipedia";

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

interface WikiArticle {
    title: string;
    content: string;
    url: string;
    revisionId: string;
}

interface WikiCleanResult {
    section: string;
    content: string;
}

type WikiFetchResult =
  | { ok: true; article: WikiArticle }
  | { ok: false; reason: "page_not_found"; message: string }
  | { ok: false; reason: "incomplete_page_data"; message: string; missingFields: string[] };


async function fetchWikipediaArticle(title: string): Promise<WikiFetchResult> {
    try {
        const page = await wiki.page(title);
        const content = await page.content();
        const revisionId = page.lastrevid;
        const pageTitle = page.title;
        const url = page.fullurl;

        let text = content.trim()
        let revisionIdString: string;

        if (!revisionId || !pageTitle || !url || !text) {
            const missingFields = [];
            !revisionId && missingFields.push("revisionId");
            !pageTitle && missingFields.push("pageTitle");
            !url && missingFields.push("url");
            !text && missingFields.push("text");
            return { ok: false, reason: "incomplete_page_data", message: "Missing required page data", missingFields: missingFields };
        } else {
            revisionIdString = revisionId.toString();
        }

        return {
            ok: true,
            article: {
                title: pageTitle,
                content: text,
                url: url,
                revisionId: revisionIdString,
            },
        };
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        
        if (error instanceof pageError && errorMessage.includes("No page with given title exists")) {
            return { ok: false, reason: "page_not_found", message: errorMessage };
        }

        throw error;
    }
}

const SKIP_SECTIONS = new Set([
    "references",
    "see also",
    "external links",
    "notes",
    "further reading",
    "bibliography",
    "sources",
    "citations",
    "footnotes",
    "independent websites"
]);
function isSkipSection(heading: string): boolean {
    return SKIP_SECTIONS.has(heading.trim().toLowerCase());
}

function cleanText(text: string): WikiCleanResult[] {
    let sections: WikiCleanResult[] = [];
    let current: WikiCleanResult = { section: "Introduction", content: "" };

    const HEADING = /^(={2,6})\s*(.+?)\s*\1$/;

    const flush = () => {
        const content = current.content.replace(/\n{3,}/g, "\n\n").trim();
        if (!content || isSkipSection(current.section)) return;
        sections.push({ section: current.section, content });
    };

    for (const line of text.split('\n')) {
        const match = line.trim().match(HEADING);
        if (!match) {
            current.content += (current.content ? "\n" : "") + line;
            continue;
        }

        flush();
        current = { section: match[2], content: "" };
    }
    flush();

    console.log(sections.map(s => ({ section: s.section, preview: s.content.slice(0, 60) })));
    return sections;
}

function hashText(sections: WikiCleanResult[]): string {
    const combinedText = sections.map(s => s.content).join("\n\n");

    return createHash("sha256").update(combinedText, "utf8").digest("hex");
}

async function ingestWikipediaArticle(title: string) {
    const result = await fetchWikipediaArticle(title);
    if (result.ok) {
        const articleContent = cleanText(result.article.content);
        const hash = hashText(articleContent);
        console.log(`Article content successfully fetched for ${title}: ${hash}`);
    } else {
        console.error(`Failed to fetch Wikipedia article: ${result.message}`);
    }
}


ingestWikipediaArticle("Liverpool F.C.");