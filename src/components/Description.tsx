import React, { useState } from 'react'
import styles from '../css/app.module.scss'
import { config } from '../config';

export default function Description({text}: {text: string}){
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <>
            <div className={styles.description_container}>
                <u className={styles.title}>Description</u>
                <p className={styles.description_text}>
                    {isExpanded ? text : `${text.slice(0, config.DESC_PREVIEW_LEN)}${text.length > config.DESC_PREVIEW_LEN ? "..." : ""}`}
                </p>
                {text.length > config.DESC_PREVIEW_LEN && 
                <button className={styles.button} onClick={() => setIsExpanded(!isExpanded)}>{isExpanded ? "Read Less" : "Read More"}</button>
                }
            </div>
        </>
    )
}