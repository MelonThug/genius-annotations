import React, { useState } from 'react';
import styles from '../css/app.module.scss';
import { sanitizeHtml } from '../functions/parsingFunctions';

export default function Description({ text }: { text: string | null }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const descPreviewLength = 300;

    if (!text || text.trim() === "") return null;
    const shouldTruncate = text.replace(/<[^>]*>/g, '').length > descPreviewLength;

    return (
        <div className={styles.description_container}>
            <u className={styles.title}>Description</u>

            <div
                className={styles.description_body}
                dangerouslySetInnerHTML={sanitizeHtml(
                    text, 
                    styles.twitter_tweet, 
                    !isExpanded && shouldTruncate ? descPreviewLength : undefined
                )}
            />

            {shouldTruncate && (
                <button 
                    className={styles.button} 
                    onClick={() => setIsExpanded(!isExpanded)}
                >
                    {isExpanded ? "Read Less" : "Read More"}
                </button>
            )}
        </div>
    );
}