export default class Bookmark {
    url: string;
    sequence: number;

    constructor(url: string, sequence: number = 0) {
        this.url = url;
        this.sequence = sequence;
    }

    public static compare = (bookmarkA: Bookmark, bookmarkB: Bookmark)=> {
        const sequenceCompare = bookmarkA.sequence - bookmarkB.sequence;
        return sequenceCompare === 0 ?
            bookmarkA.url.localeCompare(bookmarkB.url)
            : sequenceCompare;
    }
    public static sortAndRenumber = (bookmarks: Bookmark[]) => {
        return bookmarks.sort((bookmark1, bookmark2) => {
            return Bookmark.compare(bookmark1, bookmark2);
        }).map((bookmark, sequence) => new Bookmark(bookmark.url, sequence))
    }
}