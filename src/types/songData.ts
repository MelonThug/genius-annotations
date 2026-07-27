import { Annotation } from "./annotation"

type SongData = {
    id: number,
    lyrics: Map<number, string>|null,
    description: string,
    annotations: Map<number, Annotation>|null,
    url: string|null,
    translations: Map<string, number>
}

export { SongData }