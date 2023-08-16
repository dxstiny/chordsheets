const NOTES = {
    0: "C",
    1: "C#",
    2: "D",
    3: "D#",
    4: "E",
    5: "F",
    6: "F#",
    7: "G",
    8: "G#",
    9: "A",
    10: "A#",
    11: "B"
};

type NoteId = keyof typeof NOTES;
type NoteName = (typeof NOTES)[NoteId];
export const getNoteChord = (idChord: NoteId[]): NoteName[] => {
    return idChord.map((element) => {
        return NOTES[element];
    });
};
