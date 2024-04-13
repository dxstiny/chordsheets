import type { IMidiTrack } from "./importMidi";

export const SCALES = [
    "Major",
    "Major Pentatonic",
    "Minor",
    "Minor Pentatonic",
    "Blues Major",
    "Blues Minor",
    "Dorian",
    "Phrygian",
    "Lydian",
    "Mixolydian",
    "Locrian",
    "Harmonic Minor",
    "Melodic Minor",
    "Super Locrian",
    "Hungarian Minor",
    "Minor Gypsy",
    "Double Harmonic"
] as const;
export type Scale = (typeof SCALES)[number];

export const SHARP_KEYS = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B"
] as const;
export const FLAT_KEYS = [
    "C",
    "Db",
    "D",
    "Eb",
    "E",
    "F",
    "Gb",
    "G",
    "Ab",
    "A",
    "Bb",
    "B"
] as const;

type MajorChordSharp = (typeof SHARP_KEYS)[number];

export type Key = MajorChordSharp;

type MinorChordSharp = `${MajorChordSharp}m`;
type MajorChordFlat = (typeof FLAT_KEYS)[number];
type MinorChordFlat = `${MajorChordFlat}m`;
type MajorChord = MajorChordSharp | MajorChordFlat;
type MinorChord = MinorChordSharp | MinorChordFlat;
export type Chord = MajorChord | MinorChord;

export interface IChord {
    chord: Chord;
    duration: number;
    selected?: boolean;
    id?: string;
}

export const SECTION_TYPES = [
    "intro",
    "verse",
    "pre-chorus",
    "chorus",
    "bridge",
    "break",
    "fill",
    "solo",
    "interlude",
    "outro",
    "(other)"
];

export interface ISection {
    type: string;
    progression: IChord[];
    id?: string;
    page?: number;
}

export interface IInstrument {
    type:
        | "Piano"
        | "Guitar"
        | "Strings"
        | "Choir & Pad"
        | "Drum Kit"
        | "E. Piano"
        | "Bass"
        | "Brass"
        | "Synth"
        | "Organ Flutes"
        | "Organ"
        | "Accordion"
        | "Woodwind"
        | "Percussion";
    for: string;
    name: string;
    page?: number;
    volume: number;
}

export const INSTRUMENT_TYPES = [
    "Piano",
    "Guitar",
    "Strings",
    "Choir & Pad",
    "Drum Kit",
    "E. Piano",
    "Bass",
    "Brass",
    "Synth",
    "Organ Flutes",
    "Organ",
    "Accordion",
    "Woodwind",
    "Percussion"
].sort();

export interface IInstruments {
    l?: IInstrument;
    r1?: IInstrument;
    r2?: IInstrument;
}

export interface ISong {
    title: string;
    artist: string;

    sections: ISection[];
    structure: string[];

    bpm: number;
    key: Chord;

    spotify: string;
    cover: string;

    transpose: number;
    octave: number;

    legacy?: {
        instruments: IInstruments;
        options: {
            touch: boolean;
            sustain: boolean;
            mono: boolean;
        };
    };
    options?: string[];
    instruments: IInstrument[];

    midi?: IMidiTrack[];
    id: number;
}

export type PageContent = ISection | IMidiTrack | null;

export const empty: ISong = {
    title: "",
    artist: "",
    spotify: "",
    cover: "",
    bpm: 120,
    key: "C",
    transpose: 0,
    octave: 0,
    sections: [],
    instruments: [],
    options: [],
    structure: [],
    id: 0
};

export const mock: ISong = {
    title: "Livin' On A Prayer",
    artist: "Bon Jovi",
    spotify: "https://open.spotify.com/track/0X1sqQ652p1sceKM2nJlIJ",
    cover: "https://i.scdn.co/image/ab67616d0000b273ede118b5f0e159dd18d42b90",
    bpm: 123,
    key: "C",
    structure: [
        "intro",
        "verse",
        "chorus",
        "verse",
        "chorus",
        "solo",
        "chorus"
    ],
    sections: [
        {
            type: "intro",
            progression: [
                { chord: "Em", duration: 16 },
                { chord: "Em", duration: 16 },
                { chord: "Em", duration: 16 },
                { chord: "Em", duration: 16 },
                { chord: "C", duration: 4 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 8 },
                { chord: "C", duration: 4 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 8 }
            ]
        },
        {
            type: "verse",
            progression: [
                { chord: "Em", duration: 16 },
                { chord: "C", duration: 4 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 8 },
                { chord: "Em", duration: 16 },
                { chord: "C", duration: 4 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 8 }
            ]
        },
        {
            type: "chorus",
            progression: [
                { chord: "Em", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "G", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "G", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 8 }
            ]
        },
        {
            type: "solo",
            progression: [
                { chord: "Em", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "G", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "Em", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "D", duration: 4 },
                { chord: "G", duration: 1 },
                { chord: "C", duration: 3 },
                { chord: "Em", duration: 4 },
                { chord: "Em", duration: 4 }
            ]
        }
    ],
    transpose: 0,
    octave: 0,
    options: ["touch"],
    instruments: [
        {
            for: "l",
            type: "Synth",
            name: "PunchyChordz",
            volume: 127,
            page: 1
        },
        {
            for: "r1",
            type: "Synth",
            name: "WildPWM",
            volume: 100,
            page: 2
        },
        {
            for: "r2",
            type: "Synth",
            name: "DetunedVintage",
            volume: 100,
            page: 2
        }
    ],
    id: new Date().getTime()
};

export const convertLegacySong = (legacySong: any): ISong => {
    legacySong.legacy = {};

    if (legacySong.options && !Array.isArray(legacySong.options)) {
        legacySong.legacy.options = legacySong.options;
        legacySong.options = Object.entries(
            legacySong.legacy.options as { [key: string]: boolean }
        )
            .filter(([k, value]) => value)
            .map(([k]) => k);
    }
    if (legacySong.instruments && !Array.isArray(legacySong.instruments)) {
        legacySong.legacy.instruments = legacySong.instruments;
        legacySong.instruments = Object.entries(
            legacySong.legacy.instruments as { [key: string]: object }
        ).map(([k, v]) => ({
            for: k,
            ...v
        }));
    }
    for (const section of legacySong.sections) {
        // if name is set, set the type to {type} ({name})
        if (section.name) {
            section.type = `${section.type} (${section.name})`;
            delete section.name;
        }
    }
    if (!legacySong.id) legacySong.id = Math.round(Math.random() * 1000000);
    return legacySong;
};
