import styles from '../css/app.module.scss'
import React, { useState } from "react"
import { Annotation } from '../types/annotation';

export default function Lyrics({lyrics, annotations}: {lyrics: Map<number, string>|null, annotations: Map<string, Annotation>|null}){
    const [hoveredAnnotationId, setHoveredAnnotationId] = useState<number | null>(null);
    const [selectedAnnotation, setSelectedAnnotation] = useState<{annotationId: number, lyricIndex: number} | null>(null);
    if(!lyrics || lyrics?.size === 0) return;

    return (
            <div className={styles.lyrics_container} onClick={() => setSelectedAnnotation(null)}>
                {Array.from(lyrics).map(([lyricIndex, line]) => {
                    if(line === "\n") return <br></br>;

                    if(line === "") return " ";

                    const normalized = line.toLowerCase();
                    const annotation = new Map<string, Annotation>(annotations).get(normalized);
                    const isAnnotated = !!annotation;
                    const isSelected = isAnnotated && selectedAnnotation?.annotationId === annotation.id && selectedAnnotation?.lyricIndex === lyricIndex;
                    const className = isAnnotated ? isSelected ? styles.lyrics_text_selected : styles.lyrics_text_annotated : styles.lyrics_text;

                    return (
                        <>
                            <span
                            className=
                            {`
                            ${className}
                            `}
                            data-annotation-id={annotation?.id}
                            data-lyricIndex={lyricIndex} 
                            onMouseEnter={() => annotation && setHoveredAnnotationId(annotation.id)}
                            onMouseLeave={() => setHoveredAnnotationId(null)}
                            onClick={(e) => {
                                    e.stopPropagation();
                                    const isAlreadySelected = selectedAnnotation?.annotationId === annotation?.id && selectedAnnotation?.lyricIndex === lyricIndex;
                                    if(isAlreadySelected){
                                        setSelectedAnnotation(null)
                                    } else if(annotation){
                                        setSelectedAnnotation({annotationId: annotation?.id, lyricIndex: lyricIndex})
                                    }
                                }
                            }
                            >
                                {line + ' '}
                            </span>

                            {isSelected && annotation && (
                                <div className={styles.annotation_container}>
                                    <div 
                                    className={styles.annotation_body}
                                    dangerouslySetInnerHTML={sanitizeHtml(annotation.text, styles.twitter_tweet)}
                                    />
                                </div>
                            )}
                        </>
                    );
                })}
            </div>
    )
}

function sanitizeHtml(rawHtml: string, tweet_style: string): { __html: string } {
    const parser = new DOMParser();
    const doc = parser.parseFromString(rawHtml, "text/html");

    // For twitter embeds, just extract the link.
    doc.querySelectorAll("blockquote.twitter-tweet").forEach((blockquote) => {
        const link = blockquote.querySelector("a");
        const href = link?.getAttribute("href");

        if (href) {
            const cleanLink = doc.createElement("a");
            cleanLink.setAttribute("href", href);
            cleanLink.classList.add(tweet_style);
            cleanLink.textContent = "View tweet";
            blockquote.replaceWith(cleanLink);
        }
    });

    doc.querySelectorAll("br").forEach((br) => br.remove());
    doc.querySelectorAll("script, style, object, embed").forEach((node) => node.remove());
    doc.querySelectorAll("*").forEach((element) => {
        Array.from(element.attributes).forEach((attr) => {
            if (attr.name.startsWith("on")) {
                element.removeAttribute(attr.name);
            }
        });
    });

    doc.querySelectorAll("a").forEach((anchor) => {
        anchor.setAttribute("target", "_blank");
        anchor.setAttribute("rel", "noopener noreferrer");
    });

    return { __html: doc.body.innerHTML };
}



