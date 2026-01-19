import { config } from "../config";
import { Annotation } from "../types/annotation";
import { checkSongMatch, normalize } from "./parsingFunctions";

async function searchSong(name: string, artist: string){
    const query = new URLSearchParams({q: `${artist} ${normalize(name)}`});
    const fullUrl = config.PROXY + `https://api.genius.com/search?${query.toString()}`
    const response = await fetch(fullUrl);
    const data = await response.json();
    const hits = new Map<number, string>();

    for(const hit of data.response.hits){
        if(checkSongMatch(hit.result.full_title, name, artist)) {
            hits.set(hit.result.id, hit.result.full_title);
        }
    }  

    return hits;
}

async function getRawAnnotations(id: number){
    const geniusUrl = `?song_id=${id.toString()}&text_format=plain&per_page=50`
    const fullUrl = config.PROXY + `https://api.genius.com/referents${encodeURIComponent(geniusUrl)}`;
    const response = await fetch(fullUrl)
    const data = await response.json();

    let annotations: Annotation[] = [];
    for (const referent of data.response.referents){
        const annotationID = referent.id;
        const annotationLyric = referent.fragment;
        const annotationText = referent.annotations[0].body.plain
        annotations.push({id: annotationID, lyrics: annotationLyric, text: annotationText});
    }

    return annotations
}

async function getPreloadedState(id: number){
    const fullUrl = config.PROXY + `https://genius.com/songs/${id.toString()}`;
    const request = await fetch(fullUrl);
    const response = await request.text();
    const match = response.match(
      /window\.__PRELOADED_STATE__\s*=\s*JSON\.parse\(\s*('(?:\\.|[^'])*')\s*\);/
    );
    if (!match) return; 

    const jsStringLiteral = match[1];
    const jsonString = Function(`"use strict"; return ${jsStringLiteral};`)();
    const preloadedState = JSON.parse(jsonString);

    return preloadedState;
}

export {searchSong, getPreloadedState, getRawAnnotations}