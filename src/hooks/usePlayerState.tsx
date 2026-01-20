import { useState, useEffect, useRef } from "react";

export function usePlayerState(setIsLoading: React.Dispatch<React.SetStateAction<boolean>>, debounce: number){
    const [playerState, setPlayerState] = useState<Spicetify.PlayerState | null>(null);
    const debounceRef = useRef<number | null>(debounce);

  	useEffect(() => {
  	  	const update = () => {
			if(debounceRef.current) clearTimeout(debounceRef.current);
            setIsLoading(true);
			debounceRef.current = setTimeout(() => {
				setPlayerState(Spicetify.Player.data)
				debounceRef.current = null;
			}, debounce)
		}
	  
		update();
  	  	Spicetify.Player.addEventListener("songchange", update)

  	  	return () => {
			Spicetify.Player.removeEventListener("songchange", update)
			if(debounceRef.current) clearTimeout(debounceRef.current);
		}
  	}, []);

    return {playerState, debounceRef};
}