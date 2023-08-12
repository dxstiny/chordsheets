import type { IMidiTrack } from "./importMidi";

type MajorChordSharp =
    | "C"
    | "C#"
    | "D"
    | "D#"
    | "E"
    | "F"
    | "F#"
    | "G"
    | "G#"
    | "A"
    | "A#"
    | "B";
type MinorChordSharp =
    | "Cm"
    | "C#m"
    | "Dm"
    | "D#m"
    | "Em"
    | "Fm"
    | "F#m"
    | "Gm"
    | "G#m"
    | "Am"
    | "A#m"
    | "Bm";
type MajorChordFlat =
    | "C"
    | "Db"
    | "D"
    | "Eb"
    | "E"
    | "F"
    | "Gb"
    | "G"
    | "Ab"
    | "A"
    | "Bb"
    | "B";
type MinorChordFlat =
    | "Cm"
    | "Dbm"
    | "Dm"
    | "Ebm"
    | "Em"
    | "Fm"
    | "Gbm"
    | "Gm"
    | "Abm"
    | "Am"
    | "Bbm"
    | "Bm";
type MajorChord = MajorChordSharp | MajorChordFlat;
type MinorChord = MinorChordSharp | MinorChordFlat;
type Chord = MajorChord | MinorChord;

export interface IChord {
    chord: Chord;
    duration: number;
    selected?: boolean;
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
    type: (typeof SECTION_TYPES)[number];
    name?: string;
    progression: IChord[];
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

    transpose: number;
    octave: number;

    instruments: IInstruments;
    options: {
        touch: boolean;
        sustain: boolean;
        mono: boolean;
    };

    midi?: IMidiTrack[];
    id: number;
}

export type IPageContent = ISection | IMidiTrack;

export const empty: ISong = {
    title: "",
    artist: "",
    bpm: 120,
    key: "C",
    transpose: 0,
    octave: 0,
    sections: [],
    instruments: {} as IInstruments,
    options: {
        touch: false,
        sustain: false,
        mono: false
    },
    structure: [],
    id: 0
};

export const mock: ISong = {
    title: "Livin' On A Prayer",
    artist: "Bon Jovi",
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
    options: {
        touch: true,
        sustain: false,
        mono: false
    },
    instruments: {
        l: {
            type: "Synth",
            name: "PunchyChordz",
            volume: 127,
            page: 1
        },
        r1: {
            type: "Synth",
            name: "WildPWM",
            volume: 100,
            page: 2
        },
        r2: {
            type: "Synth",
            name: "DetunedVintage",
            volume: 100,
            page: 2
        }
    },
    id: new Date().getTime()
};
