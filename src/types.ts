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

export interface ISection {
    type:
        | "intro"
        | "verse"
        | "pre-chorus"
        | "chorus"
        | "bridge"
        | "outro"
        | "solo";
    progression: IChord[];
}

export const SECTION_TYPES = [
    "intro",
    "verse",
    "pre-chorus",
    "chorus",
    "bridge",
    "outro",
    "solo"
];

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
];

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
}

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
    structure: []
};
