import { computed, ref } from "vue";
import { getNoteChord } from "./chord-finder/getNoteChord.js";
import { Chord } from "tonal";

let midi: MIDIAccess;
export const inputDevices = ref<MIDIInput[]>([]);
type ActiveNote = {
    [key: number]: {
        vel: number;
        time: number;
        device: string;
    };
};

export const activeMidiNotes = ref<ActiveNote>({});

function onMIDIMessage(evt: Event) {
    const event = evt as MIDIMessageEvent;

    if ([144, 128].includes(event.data[0])) {
        const note = event.data[1];
        const velocity = event.data[2];
        const type = event.data[0] === 144 ? "on" : "off";

        if (type === "on") {
            activeMidiNotes.value[note] = {
                vel: velocity,
                time: Date.now(),
                device: (evt.target as MIDIInput).name ?? "Unknown"
            };
        } else {
            delete activeMidiNotes.value[note];
        }
    }
}

function onMIDISuccess(midiAccess: MIDIAccess) {
    midi = midiAccess; // store in the global (in real usage, would probably keep in an object instance)

    midiAccess.inputs.forEach((entry) => {
        inputDevices.value.push(entry);
        entry.onmidimessage = onMIDIMessage;
    });
}

function onMIDIFailure(msg: any) {}

export const start = () => {
    navigator.requestMIDIAccess().then(onMIDISuccess, onMIDIFailure);
};

export const currentChord = computed(() => {
    const noteIds = Object.keys(activeMidiNotes.value)
        .sort()
        .map((note) => parseInt(note) % 12);
    const notes = getNoteChord(noteIds);
    const chords = Chord.detect(notes);

    if (chords.length === 0) return "No chord detected";

    const full = chords.join(", ");
    const shorter = chords
        .map((x) => x.replace("M", "").split("/")[0])
        .sort((a, b) => a.length - b.length);
    const shortest = shorter[0];
    //return `${shortest} (${full})`;
    return shortest;
});
