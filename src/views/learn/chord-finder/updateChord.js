import { getUserIntervals } from './getUserIntervals.js'
import { getChord } from './getChord.js'
import { getNoteChord } from './getNoteChord.js'

// main function in the program
export function updateChord(idChord) {
    const newChord = getNoteChord(idChord)
    // stores array with all intervals of notes
    // console.log(intervals)
    let userIntervals = getUserIntervals(newChord)
    // find chord using the chord letters and interval values
    return getChord(newChord, userIntervals)
}
