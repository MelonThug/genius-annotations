import styles from './css/app.module.scss'
import React, { useState, useEffect, useRef} from 'react'
import { getRawAnnotations, searchSong, getPreloadedState} from './functions/apiFunctions';
import { Annotation } from './types/annotation';
import { formatAnnotations, formatLyrics, getRawLyrics, getDescription } from './functions/parsingFunctions';
import Lyrics from './components/Lyrics';
import Description from './components/Description';

const App: React.FC = () => {
  	const [currentPlayerState, setCurrentPlayerState] = useState<Spicetify.PlayerState | null>(null);
  	const [currentLyrics, setCurrentLyrics] = useState<Map<number, string>>(new Map());
  	const [currentAnnotations, setCurrentAnnotations] = useState<Map<string, Annotation>>(new Map());
  	const [currentSongDescription, setCurrentSongDescription] = useState<string>("");
	const [songSearchHits, setSongSearchHits] = useState<Map<number, string>>(new Map());
	const [selectedSongId, setSelectedSongId] = useState<number | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const debounceRef = useRef<number | null>(null);

  	useEffect(() => {

  	  	const updatePlayerState = () => {
			if(debounceRef.current) clearTimeout(debounceRef.current);
			setIsLoading(true);
			debounceRef.current = setTimeout(() => {
				setCurrentPlayerState(Spicetify.Player.data)
				debounceRef.current = null;
			}, 500)
		}
	  
		updatePlayerState();
  	  	Spicetify.Player.addEventListener("songchange", updatePlayerState)

  	  	return () => {
			Spicetify.Player.removeEventListener("songchange", updatePlayerState)
			if(debounceRef.current) clearTimeout(debounceRef.current);
		}
  	}, []);

	const fetchSongData = async (songId: number) => {		
		const [preloadedState, rawAnnotations] = await Promise.all([
			getPreloadedState({id: songId}),
			getRawAnnotations({id: songId})
		]);

		const rawLyrics = getRawLyrics(preloadedState);
		const description = getDescription(preloadedState);

		description && setCurrentSongDescription(description);
		rawLyrics && setCurrentLyrics(formatLyrics(rawLyrics));
		rawAnnotations && setCurrentAnnotations(formatAnnotations(rawAnnotations))
	}

  	useEffect(() => {
	  (async () => {
	  	  	setIsLoading(true);

	  	  	const songEntry = currentPlayerState?.item;
	  		if (!songEntry) {
	  	    	setIsLoading(false);
	  	    	return;
	  	  	}
	  	  	const songName = songEntry.name;
	  	  	const songArtist = songEntry.artists?.[0]?.name;
	  	  	if (!songName || !songArtist) {
	  	  	  	setIsLoading(false);
	  	  	  	return;
	  	  	}

	  	  	try {
	  	  	  	const searchHits = await searchSong({ name: songName, artist: songArtist });
	  	  	  	setSongSearchHits(searchHits);

	  	  	  	const songId = searchHits?.keys().next().value;
	  	  	  	if (!songId) {
	  	  	    	setIsLoading(false);
					setSelectedSongId(null);
	  	  	    	return;
	  	  	  	}

	  	  	  	setSelectedSongId(songId);
	  	  	  	await fetchSongData(songId);
	  	  	} catch (err) {
	  	  	  	console.error("[Genius-Lyrics] Error fetching song data:", err);
	  	  	}

	  	  setIsLoading(false);
	  	})();
	}, [currentPlayerState]); 

  	return (
  		<>
		{isLoading ? (
    	  <div className={styles.container}>
    	    <p className={styles.title}>Loading…</p>
    	  </div>
    	) : selectedSongId ? 
		(
			<div className={styles.container}>
				<div className={styles.translation_container}>
					<select className={styles.translation_select} value={selectedSongId ?? ""} 
					onChange={async (e) => {
  						  const songId = Number(e.target.value);
  						  setSelectedSongId(songId);
  						  setIsLoading(true);
  						  await fetchSongData(songId);
  						  setIsLoading(false);
  					}}>
						{[...songSearchHits].map(([id, title]) => (
							<option className={styles.translation_item} key={id} value={id}>{title}</option>
						))}
					</select>
				</div>
  			  	{currentSongDescription !== "" && <Description text={currentSongDescription}></Description>}
  			  	<Lyrics lyrics={currentLyrics} annotations={currentAnnotations}></Lyrics>
  			</div>
		 ) : !debounceRef.current && (
			<div className={styles.container}>
				<p className={styles.title}>No data found for current song ;-;</p>
			</div>
		 )}
  		</>
  	);
};

export default App;
