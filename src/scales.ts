import { SCALES, type Scale } from "./types";

type ScaleLookup = {
    [K in Scale]: {
        keys: number[];
    };
};

export const SCALE: ScaleLookup = {
    Major: {
        keys: [0, 2, 4, 5, 7, 9, 11]
    },
    "Major Pentatonic": {
        keys: [0, 2, 4, 7, 9]
    },
    Minor: {
        keys: [0, 2, 3, 5, 7, 8, 10]
    },
    "Minor Pentatonic": {
        keys: [0, 3, 5, 7, 10]
    },
    "Blues Minor": {
        keys: [0, 3, 5, 6, 7, 10]
    },
    "Blues Major": {
        keys: [0, 2, 3, 4, 7, 9]
    },
    Dorian: {
        keys: [0, 2, 3, 5, 7, 9, 10]
    },
    Phrygian: {
        keys: [0, 1, 3, 5, 7, 8, 10]
    },
    Lydian: {
        keys: [0, 2, 4, 6, 7, 9, 11]
    },
    Mixolydian: {
        keys: [0, 2, 4, 5, 7, 9, 10]
    },
    Locrian: {
        keys: [0, 1, 3, 5, 6, 8, 10]
    },
    "Harmonic Minor": {
        keys: [0, 2, 3, 5, 7, 8, 11]
    },
    "Melodic Minor": {
        keys: [0, 2, 3, 5, 7, 9, 11]
    },
    "Super Locrian": {
        keys: [0, 1, 3, 4, 6, 8, 10]
    },
    "Hungarian Minor": {
        keys: [0, 2, 3, 6, 7, 8, 11]
    },
    "Minor Gypsy": {
        keys: [0, 1, 4, 5, 7, 8, 10]
    },
    "Double Harmonic": {
        keys: [0, 1, 4, 5, 7, 8, 11]
    }
};
