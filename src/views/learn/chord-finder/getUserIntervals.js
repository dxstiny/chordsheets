import { getInterval } from './getInterval'
import { getNoteId } from './getNoteId'

//return array of intervals found in chord
export function getUserIntervals(userChord) {
    //console.log("userChord Length: " + userChord.length)
    let index = 0,
        intervals = [],
        num_of_intervals = userChord.length - 1

    // store intervals
    while (num_of_intervals > 0) {
        intervals.push(
            getInterval(
                getNoteId(userChord[index]),
                getNoteId(userChord[index + 1])
            )
        )
        num_of_intervals--
        index++
    }
    return intervals
}
