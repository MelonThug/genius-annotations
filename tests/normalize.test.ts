import { describe, it, expect } from "vitest";
import { normalize } from "../src/functions/parsingFunctions";

describe('Song Title Normalization', () => {
  const testCases = [
    // [Input Title, Expected Normalized Output]
    ["When the Smoke Is Going Down - 2015 - Remaster", "when the smoke is going down"],
    ["I'll Try Anything Once (\"You Only Live Once\" demo) - Heart In a Cage B-Side", "ill try anything once"],
    ["Song Title (feat. Someone) [Remix 2022] (Live)", "song title"],
    ["Track Name (Acoustic Version) - Bonus Track", "track name"],
    ["Always Somewhere - 2015 - Remaster", "always somewhere"],
    ["Something - Pt. 2 - Live at Madison Square Garden", "something"],
    ["Stereo Hearts (feat. Adam Levine & Some Other Artist) - Radio Edit", "stereo hearts"],
    ["Song Name - As featured in \"Movie Name\"", "song name"],
    ["Another Song (with Guest Singer) - OST", "another song"],
    ["Evil $, I, Yes, to Find a Shore", "evil i yes to find a shore"],
    ["Track Name!? (!!!)", "track name"],
    ["Track (Demo) (Demo Version) - Remastered", "track"],
    ["Song Title (Live at Wembley) - 2020 Remaster", "song title"],
    ["Song Name (feat. Artist) (Explicit) - Deluxe Edition", "song name"],
    ["Café del Mar – 20th Anniversary", "café del mar"],
    ["Pokémon Theme (Original Japanese Version)", "pokémon theme"],
    ["Bohemian Rhapsody (2011 Remaster)", "bohemian rhapsody"],
    ["Song / Title (feat. Artist) [Live]", "song title"],
    ["Track Name (feat. Someone) (feat. Another Artist)", "track name"],
    ["Song Name - Remix - Radio Edit", "song name"],
    ["Track Name (Special Edition) - Bonus Track", "track name"],
    ["Live Forever (2000 Remastered) (Live at Wembley)", "live forever"],
    ["Song Title (Acoustic) (Demo) - 2019 Remaster", "song title"],
    ["Track – Part 2 (Live)", "track"],
    ["Another Track - OST / Soundtrack", "another track"],
    ["Song Name (2021 Version) - Live", "song name"],
    ["Track Name – Special Remix (feat. Guest)", "track name"],
    ["Song Title (feat. Someone) - Live in Tokyo", "song title"],
    ["Track Name (Demo) / Original Mix", "track name"],
    ["Another Song (Radio Edit) - Explicit", "another song"],
    ["Track Name (with Artist) - Deluxe Edition", "track name"],
    ["Song Title (Extended Version) – 2020 Remaster", "song title"],
    ["Track (feat. Someone) – Acoustic Version", "track"],
    ["Song Name (Pt. 2) (Live) - Remaster", "song name"],
    ["Track Name (Original Demo) - Bonus Track", "track name"],
    ["Song Title (Remaster 2019) (Live)", "song title"],
    ["Track Name – Extended Remix (feat. Artist)", "track name"],
    ["Another Track (OST / Soundtrack) - Bonus Track", "another track"],
    ["Track Name (feat. Multiple Artists) (Explicit)", "track name"],
    ["Song Title (Special Edition) – Remix", "song title"],
    ["Track Name (Acoustic Version) (Demo)", "track name"],
    ["Song Name (Live) - Deluxe Edition", "song name"],
    ["Track Name (feat. Guest) (Radio Edit)", "track name"],
    ["Song Title (Extended Version) (feat. Artist)", "song title"],
    ["Track Name (Live at Wembley) – Remaster", "track name"],
    ["Always Somewhere (2015 - Remaster)", "always somewhere"],
    ["ココロノナカ - Complete ver.", "ココロノナカ"],
    ["Australia (Don't Ever Let Her Go)", "australia dont ever let her go"],
    ["White Lies - EP Version", "white lies"],
    ["Dearth - B-Side", "dearth"],
    ["2001 - LCO Session", "2001"],
    ["Mercy Mercy Me (The Ecology) by The Strokes (Ft. Eddie Vedder & Josh Homme)", "mercy mercy me the ecology by the strokes"],
    ["When It Started (Last Nite B-Side)", "when it started"]
  ];

  it.each(testCases)('should normalize "%s" to "%s"', (input, expected) => {
    expect(normalize(input)).toBe(expected);
  });
});