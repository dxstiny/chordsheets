const randomString = (startWith: string, length: number) => {
    let res = startWith;
    for (let i = res.length; i < length; i++) {
        res += Math.random().toString(36).substring(2);
    }
    return res.substring(0, length);
};

const wait = async (ms: number) =>
    new Promise((resolve) => {
        setTimeout(resolve, ms);
    });

export const loadText = async (
    newText: string,
    callback: (val: string) => void
) => {
    const len = newText.length;

    const increment = len / 5;

    for (let i = 0; i < len; i++) {
        for (let j = 0; j < 7; j += increment) {
            //callback(randomString(newText.substring(0, i), len)); // randomly fill
            callback(newText.substring(0, i)); // no fill
            await wait(7);
        }
    }

    callback(newText);
};
