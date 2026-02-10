import { Annotation } from "../types/annotation";
import { NORMALIZE_RULES } from "../types/normalizeRule";
import { config } from "../configDefaults";
import Fuse from "fuse.js"

function checkSongMatch(geniusTitle: string, spotifyName: string, spotifyArtist: string): boolean {
    const geniusWords = geniusTitle.split(' ');
    const titleFuse = new Fuse(geniusWords, {
        threshold: 0.35,
        distance: 10
    });

    const artistMatch = titleFuse.search(spotifyArtist).length > 0 || geniusTitle.includes(spotifyArtist);
    if (!artistMatch) return false;

    const nameTokens = spotifyName.split(' ').filter(t => t.length > 1);
    let matchedCount = 0;

    for (const token of nameTokens) {
        if (geniusTitle.includes(token)) {
            matchedCount++;
            continue;
        }
        
        // Fallback to fuzzy match if word fails
        const fuzzyResult = titleFuse.search(token);
        if (fuzzyResult.length > 0) {
            matchedCount++;
        }
    }

    const score = matchedCount / nameTokens.length;
    return score >= config.SONG_MATCH_THRESHOLD;
}

function formatAnnotations(annotations: Annotation[]){
    for(const annotation of annotations){
        annotation.lyrics = normalizeQuotes(annotation.lyrics);
    }
    const annotationsMap = new Map(annotations.map((annotation) => [annotation.lyrics.toLowerCase(), annotation]))
    return annotationsMap;
}

function formatLyrics(rawLyrics: Element|null){
    if(!rawLyrics) return new Map();
    const lyrics = extractLyrics(rawLyrics).map(normalizeQuotes)
    let lyricsMap = new Map<number, string>();
    lyricsMap = new Map(lyrics.map((line, i) => [i, line]));
    return lyricsMap
}

function normalizeQuotes(s: string) {
    return s.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');
}

function normalize(title: string): string {
  let result = title;

  for (const rule of NORMALIZE_RULES) {
    result = result.replace(rule.pattern, rule.replace ?? "");
  }

  return result
    .replace(/\u00A0/g, " ")                 // nbsp → space
    .replace(/[^\p{L}\p{N}\s]/gu, "")        // strip punctuation
    .replace(/\s+/g, " ")                    // collapse spaces
    .toLowerCase()
    .trim();
}

function getRawLyrics(preloadedState: any){ //Its complex JSON so :any will have to suffice
    if(!preloadedState) return null;
    const lyricsHtml = preloadedState.songPage.lyricsData.body.html;
    const doc = new DOMParser().parseFromString(lyricsHtml, "text/html");
    const lyricsData = doc.querySelector("p") ?? null;
    return lyricsData;
}

function getDescription(preloadedState: any){ 
    if(!preloadedState) return "";
    const annotationKey = Object.keys(preloadedState.entities.annotations)[0]
    const descriptionHtml = preloadedState.entities.annotations[annotationKey].body.html;
    const doc = new DOMParser().parseFromString(descriptionHtml, "text/html");
    const description = doc.body.textContent || "";
    return description;
}

function getTranslations(id: number, preloadedState: any){
    const translationMap = new Map<string, number>();
    if(!preloadedState) return translationMap;
    
    const translationKeys = [id, ...preloadedState.entities.songs[id].translationSongs];
    translationKeys.sort();
    
    for(const key of translationKeys){
        const songLanguage = preloadedState.entities.songs[key].language as keyof typeof config.GENIUS_LANGUAGE_MAP;
        translationMap.set(config.GENIUS_LANGUAGE_MAP[songLanguage], key);
    }

    return translationMap;
}

function getTextFromNode(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent?.trim() ?? "";

    } else if(node.nodeName === "BR") {
        return "\n ";

    } else if (node.nodeType === Node.ELEMENT_NODE) {
        return Array.from(node.childNodes).map(getTextFromNode).join("");
    }
    return "";
}

function extractLyrics(lyricsData: Element){
    let lyrics: string[] = [];
    let lyricsBegan = false;

    for(const node of lyricsData.childNodes) {
        if (!lyricsBegan) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() || node.nodeName === "A") {
                lyricsBegan = true;
            } else if (node.nodeName === "BR") {
                continue;
            }
        }

        if(node.nodeType === Node.TEXT_NODE) {
            if(node.textContent) lyrics.push(node.textContent.trim());

        } else if(node.nodeName === "BR" && lyricsBegan) {
            lyrics.push("\n");

        } else if(node.nodeType === Node.ELEMENT_NODE) {
            const text = getTextFromNode(node);
            if (text) lyrics.push(text.trim());
        }
    }
    return lyrics;
}

export { extractLyrics, formatAnnotations, formatLyrics, getRawLyrics, getDescription, getTranslations, checkSongMatch, normalize }