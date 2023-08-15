import { _notes } from "./globals";

export function getNoteId(value) {
    for (let key in _notes) {
        if (_notes[key] === value) {
            return key;
        }
    }
    console.warn("No note found for value: " + value);
    return null;
}