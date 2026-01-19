import { useEffect, useState } from "react";
import { Annotation } from "../types/annotation";
import { getPreloadedState, getRawAnnotations } from "../functions/apiFunctions";
import { formatAnnotations, formatLyrics, getDescription, getRawLyrics } from "../functions/parsingFunctions";

export function useSongData(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, songId: number | null){
    const [lyrics, setLyrics] = useState<Map<number, string>>(new Map());
    const [annotations, setAnnotations] = useState<Map<string, Annotation>>(new Map());
    const [description, setDescription] = useState<string>("");
    const [url, setUrl] = useState<string>("");

    useEffect(() => {
        if(!songId) return;
        
        (async () => {
            const [preloadedState, rawAnnotations] = await Promise.all([
			    getPreloadedState(songId),
			    getRawAnnotations(songId)
		    ]);

		    const rawLyrics = getRawLyrics(preloadedState);
		    const description = getDescription(preloadedState);

		    description && setDescription(description ?? "");
		    rawLyrics && setLyrics(formatLyrics(rawLyrics) ?? []);
		    rawAnnotations && setAnnotations(formatAnnotations(rawAnnotations) ?? []);
            songId && setUrl(`https://genius.com/songs/${songId}`);
            setIsLoading(false);
        })();
    }, [songId])

    return {lyrics, annotations, description, url};
}