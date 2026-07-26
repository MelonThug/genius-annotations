import styles from '../css/app.module.scss'
import React, { useState, useRef, useLayoutEffect } from "react"
import { Annotation } from '../types/annotation';
import { sanitizeHtml } from '../functions/parsingFunctions';
import { LyricLine } from '../types/lyricLine';

export default function Lyrics({lyrics, annotations}: {lyrics: Map<number, LyricLine>|null, annotations: Map<number, Annotation>|null}){
    const [selectedAnnotation, setSelectedAnnotation] = useState<{annotationId: number, lyricIndex: number} | null>(null);
    const selectedLyricRef = useRef<HTMLSpanElement | null>(null);

    useLayoutEffect(() => {
        if(selectedAnnotation && selectedLyricRef.current){
            selectedLyricRef.current.scrollIntoView({
                behavior: "smooth",
                block: "nearest"
            })
        }
    }, [selectedAnnotation])

    if(!lyrics || lyrics?.size === 0) return;

    return (
            <div className={styles.lyrics_container} onClick={() => setSelectedAnnotation(null)}>
                {Array.from(lyrics).map(([lyricIndex, line]) => {
                    const { text, annotationId } = line;

                    if(text === "\n") return <br></br>;
                    if(text === "") return " ";

                    const annotation = annotationId ? annotations?.get(annotationId) ?? null : null;
                    const isAnnotated = !!annotation;
                    const isSelected = isAnnotated && selectedAnnotation?.annotationId === annotation.id && selectedAnnotation?.lyricIndex === lyricIndex;
                    const className = isAnnotated ? 
                                      isSelected ? styles.lyrics_text_selected : styles.lyrics_text_annotated 
                                      : styles.lyrics_text;

                    return (
                        <>
                            <span
                            ref={isSelected ? selectedLyricRef : null}
                            className={`${className}`}
                            data-annotation-id={annotation?.id}
                            data-lyricIndex={lyricIndex} 
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
                                {text + ' '}
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



