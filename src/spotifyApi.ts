const TOKEN_URL =
    "https://europe-west6-elated-effect-396715.cloudfunctions.net/spotify/token";
const API_URL = "https://api.spotify.com/v1";

let tokenCache: string | null = null;

const getToken = async () => {
    if (tokenCache) {
        return tokenCache;
    }
    const response = await fetch(TOKEN_URL);

    if (!response.ok) {
        throw new Error("Could not fetch token");
    }

    tokenCache = await response.text();
    return tokenCache;
};

const headers = async () => ({
    Authorization: `Bearer ${await getToken()}`
});

const getTrack = async (id: string) => {
    const response = await fetch(`${API_URL}/tracks/${id}`, {
        headers: await headers()
    });
    return response.json();
};

const getAudioFeatures = async (id: string) => {
    const response = await fetch(`${API_URL}/audio-features/${id}`, {
        headers: await headers()
    });
    return response.json();
};

interface ISongInfo {
    name: string;
    artist: string;
    album: string;
    cover?: string;
    href: string;
    key: string;
    tempo: number;
}

const convertKey = (features: any) => {
    const keyMap = {
        0: "C",
        1: "C♯",
        2: "D",
        3: "D♯",
        4: "E",
        5: "F",
        6: "F♯",
        7: "G",
        8: "G♯",
        9: "A",
        10: "A♯",
        11: "B"
    } as any;
    const modeMap = {
        0: "",
        1: "m"
    } as any;
    return `${keyMap[features.key]}${modeMap[features.mode]}`;
};

export const getSongInfo = async (id: string): Promise<ISongInfo> => {
    const [track, features] = await Promise.all([
        getTrack(id),
        getAudioFeatures(id)
    ]);

    return {
        cover: track.album.images?.[0]?.url,
        name: track.name,
        artist: track.artists[0].name,
        album: track.album.name,
        href: track.external_urls.spotify,
        key: convertKey(features),
        tempo: Math.round(features.tempo)
    };
};

export const parseId = (url: string) => {
    const match = url.match(/track\/(\w+)/);
    if (!match) {
        throw new Error("Invalid URL");
    }
    return match[1];
};
