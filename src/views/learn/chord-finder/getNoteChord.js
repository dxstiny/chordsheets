import { _notes } from './globals.js'

// converts user inputted chord 
// from array of ids to literal note name array
// return array of literal note names
export function getNoteChord(idChord) {
    return idChord
        .map((element) => {
            return _notes[element]
        })
}
