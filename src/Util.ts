export default class Util {
    // https://dirask.com/posts/TypeScript-convert-bytes-array-to-string-1xN2xp
    // Converts a byte array into a string by making a string of each byte converting
    // into a URI-escaped value and then letting decodeURIComponent decode the string.
    // This allows for Unicode graphemes!
    static bin2String = (bytes: number[]): string => {
        let chars: string[] = [];
        for (let i = 0; i < bytes.length; ++i) {
            const byte = bytes[i];
            chars.push((byte < 16 ? '%0' : '%') + byte.toString(16));
        }
        return decodeURIComponent(chars.join(''));
    };
    static toUrl = (urlString: string): URL => {
        const parts = urlString.split("://");
        return new URL(parts.length == 1 ? `gemini://${parts[0]}` : urlString);
    }
}