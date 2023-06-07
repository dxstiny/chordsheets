// @ts-ignore
import MidiParser from "midi-parser-js";

export interface INote {
    note: number;
    velocity: number;
    duration: number;
    start: number;
}

interface IMidiResult {
    formatType: number;
    tracks: number;
    timeDivision: number;
    track: {
        event: {
            data: string | number[];
            deltaTime: number;
            metaType: number;
            type: number;
        }[];
    }[];
}

interface IMidiTimeSignature {
    numerator: number;
    denominator: number;
    clocksPerTick: number;
    notesPerQuarter: number;
}

interface IMidiEvent {
    type: number;
    data: number[]; // [note, velocity]
    deltaTime: number;
    metaType: number;
}

export interface IMidiTrack {
    name: string;
    signature: IMidiTimeSignature;
    notes: INote[];
}

/**
 * removes all events except for press/release events
 * @returns {IMidiTrack} The parsed midi file
 */
const simplifyMidi = (result: IMidiResult | null) => {
    if (!result) return null;
    const { track } = result;

    const filterTracksWithNotes = track.filter((t) =>
        t.event.some((e) => e.type === 9 || e.type === 8)
    );
    // name is metaType 3 & type 255
    const name = filterTracksWithNotes[0].event.find(
        (e) => e.metaType === 3 && e.type === 255
    )?.data;

    const timeSignature = track
        .find((t) => t.event.some((e) => e.metaType === 88 && e.type === 255))
        ?.event.map((e) => e.data)
        .flat();

    if (!timeSignature) return null;
    const signature = {
        numerator: timeSignature[0],
        denominator: timeSignature[1],
        clocksPerTick: timeSignature[2],
        notesPerQuarter: timeSignature[3]
    } as IMidiTimeSignature;

    const events = filterTracksWithNotes
        .map((t) => {
            const events = t.event.filter((e) => e.type === 9 || e.type === 8);
            return events;
        })
        .flat() as IMidiEvent[];

    return {
        name,
        signature,
        notes: extractNotes(events)
    } as IMidiTrack;
};

export const midiFromFile = async (file: File) => {
    return new Promise<IMidiTrack | null>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            if (!e.target) {
                reject("No target");
                return;
            }

            const text = e.target.result as string;
            const midi = MidiParser.parse(text);
            resolve(simplifyMidi(midi));
        };

        reader.readAsDataURL(file);
    });
};

const extractNotes = (events: IMidiEvent[]) => {
    // 9 = note on
    // 8 = note off
    // iterate through and find matching pairs
    // then, calculate the duration
    const notes = [] as INote[];

    // [note]: { start: number, velocity: number }
    const activeNotes = {} as Record<
        number,
        { start: number; velocity: number }
    >;
    let absoluteTime = 0;

    for (const event of events) {
        absoluteTime += event.deltaTime;

        if (event.type === 9) {
            // note on
            activeNotes[event.data[0]] = {
                start: absoluteTime,
                velocity: event.data[1]
            };
        } else if (event.type === 8) {
            // note off
            const activeNote = activeNotes[event.data[0]];
            if (!activeNote) continue;

            const duration = absoluteTime - activeNote.start;
            notes.push({
                note: event.data[0],
                velocity: activeNote.velocity,
                duration,
                start: activeNote.start
            });
            delete activeNotes[event.data[0]];
        }
    }

    return notes;
};
