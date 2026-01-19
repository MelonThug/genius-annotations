import { useEffect, useState } from "react";
import { searchSong } from "../functions/apiFunctions";

export function useSearchSong(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, playerState: Spicetify.PlayerState | null){
    const [searchHits, setSongSearchHits] = useState<Map<number, string>>(new Map());
    const [selectedSongId, setSelectedSongId] = useState<number | null>(null);

    useEffect(() => {
	    if(!playerState?.item){
            setSelectedSongId(null);
            setSongSearchHits(new Map());      
            return;
        }

        const songName = playerState.item.name;
        const songArtist = playerState.item.artists?.[0].name;
        if(!songName || !songArtist) {
            setSelectedSongId(null);
            setSongSearchHits(new Map());
            setIsLoading(false);
            return;
        };

        (async () => {
            const hits = await searchSong(songName, songArtist);
            if(hits.size === 0) {
                setSelectedSongId(null);
                setSongSearchHits(new Map());
                setIsLoading(false);
                return;
            }
            setSongSearchHits(hits);
            setSelectedSongId(hits?.keys().next().value ?? null) //Default select the first song
        })();
	}, [playerState]); 

    return {selectedSongId, setSelectedSongId, searchHits};
}