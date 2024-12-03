export default class Bookmark {
    url: string;
    sequence: number;

    constructor(url: string, sequence: number = 0) {
        this.url = url;
        this.sequence = sequence;
    }
}