import React, { useEffect, useState } from "react";
import styles from '../../css/app.module.scss'
import { calcCacheSize, clearCache, getCacheStats } from "../../extensions/caching";

export default function CacheSection(){
    const [clearedCache, setClearedCache] = useState(false);
    const [cacheStats, setCacheStats] = useState<Record<string, number>>({songs: 0, tracks: 0});
    const [cacheSize, setCacheSize] = useState<number>(-1);

    useEffect(() => {
      async function fetchCacheStats() {
        setCacheStats(await getCacheStats());
        setCacheSize(await calcCacheSize());
      }

      fetchCacheStats();
    }, [])
    
    return (
        <div className={styles.config_container}>
            <p className={styles.config_text_label}>Cache</p>
            <div className={styles.config_text_container}>
                <sub>Data for frequently viewed songs are cached for faster retrieval and reduced API requests.</sub>
                <sub>Songs cached: <code>{cacheStats.songs || 0}</code></sub>
                <sub>Track references: <code>{cacheStats.tracks || 0}</code></sub>

                {cacheSize !== -1 ? 
                <sub>Cache size: <code>  ~{cacheSize}Kb</code></sub>
                : ""}
                {clearedCache && <sub>Cleared cache!</sub>} 
            </div>
            <div className={`${styles.config_container} ${styles.row}`}>
                <button
                className={styles.config_button}
                onClick={async () => {
                    clearCache();
                    setClearedCache(true);
                    setCacheSize(await calcCacheSize());
                    setCacheStats(await getCacheStats());
                    setTimeout(() => setClearedCache(false), 2000)
                }}>
                Clear Cache
                </button>
            </div>
        </div>
    )
}