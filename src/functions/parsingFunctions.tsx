import { Annotation } from "../types/annotation";
import { NORMALIZE_RULES } from "../types/normalizeRule";
import { config } from "../configDefaults";
import Fuse from "fuse.js"
import { LyricLine } from "../types/lyricLine";

function checkSongMatch(geniusTitle: string, spotifyName: string, spotifyArtist: string): boolean {
    if (geniusTitle.includes(spotifyName) && geniusTitle.includes(spotifyArtist)) {
        return true;
    }

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
    const annotationsMap = new Map<number, Annotation>();
    for(const annotation of annotations){
        annotationsMap.set(annotation.id, annotation);
    }
    return annotationsMap;
}

function formatLyrics(rawLyrics: Element|null){
    if(!rawLyrics) return new Map();
    const lyrics = extractLyrics(rawLyrics)
    return new Map(lyrics.map((line, i) => [i, line]));
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
    return descriptionHtml;
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
    let lyrics: LyricLine[] = [];
    let lyricsBegan = false;

    for(const node of lyricsData.childNodes) {
        if (!lyricsBegan) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim() || node.nodeName === "A") {
                lyricsBegan = true;
            } else if (node.nodeName === "BR") {
                continue;
            }
        }

        if(node.nodeName === "BR" && lyricsBegan){
            lyrics.push({text: "\n", annotationId: null});

        } else if (node.nodeName === "A"){
            const anchor = node as HTMLAnchorElement;
            const dataId = anchor.getAttribute("data-id");
            let annotationId = dataId ? parseInt(dataId, 10) : null; // Lyrics contain the annotationId in the data-id attribute of their href

            const text = getTextFromNode(anchor).trim();
            if(text){
                lyrics.push({
                    text: text,
                    annotationId: annotationId && !isNaN(annotationId) ? annotationId : null
                });
            }

        } else if (node.nodeType === Node.TEXT_NODE){
            const text = node.textContent?.trim();
            if(text){
                lyrics.push({
                    text: text,
                    annotationId: null
                });
            }

        } else if (node.nodeType === Node.ELEMENT_NODE){
            const text = getTextFromNode(node).trim();
            if(text){
                lyrics.push({
                    text: text,
                    annotationId: null
                });
            }
        }
    }
    return lyrics;
}

function sanitizeHtml(rawHtml: string, twitterClassName?: string, maxLength?: number): { __html: string } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // Transform twitter embeds into just links
    doc.querySelectorAll("blockquote.twitter-tweet").forEach((blockquote) => {
        const link = blockquote.querySelector("a");
        const href = link?.getAttribute("href");

        if (href) {
            const cleanLink = doc.createElement("a");
            cleanLink.setAttribute("href", href);
            if (twitterClassName) cleanLink.className = twitterClassName;
            cleanLink.textContent = "View tweet";
            blockquote.replaceWith(cleanLink);
        }
    });

    doc.querySelectorAll("br, script, style, object, embed").forEach((node) => node.remove());
    doc.querySelectorAll("*").forEach((element) => {
        Array.from(element.attributes).forEach((attr) => {
            if (attr.name.startsWith("on")) element.removeAttribute(attr.name);
        });
    });

    doc.querySelectorAll("a").forEach((anchor) => {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
    });

    if (maxLength && maxLength > 0) {
        truncateDomNode(doc.body, maxLength);
    }

    return { __html: doc.body.innerHTML };
}

function truncateDomNode(root: Node, maxChars: number) {
    let currentLength = 0;
    let limitReached = false;

    function traverse(node: Node) {
        if (limitReached) {
            node.parentNode?.removeChild(node);
            return;
        }

        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.nodeValue || "";
            if (currentLength + text.length > maxChars) {
                const allowed = maxChars - currentLength;
                node.nodeValue = text.slice(0, allowed) + "...";
                currentLength = maxChars;
                limitReached = true;
            } else {
                currentLength += text.length;
            }
        } else {
            const children = Array.from(node.childNodes);
            for (const child of children) {
                traverse(child);
            }
        }
    }

    traverse(root);
}

export { extractLyrics, formatAnnotations, formatLyrics, getRawLyrics, getDescription, getTranslations, checkSongMatch, normalize, sanitizeHtml }