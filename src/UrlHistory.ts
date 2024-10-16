export default class UrlHistory {
    capacity: number;
    index: number;
    history: URL[];

    constructor(capacity: number) {
        this.capacity = capacity;
        this.index = -1;
        this.history = [];
    }
    // This deletes everything after the current item
    // and then adds the new item to the end of the list
    public add = (item: URL) => {
        // If this item would exceed capacity, remove the oldest item first.
        if (this.index + 1 >= this.capacity) {
            this.history.shift()
            --this.index;
        }
        this.history.splice(++this.index, this.history.length, item);
    }
    public currentUrl = (): URL | undefined => {
        if (this.history.length === 0) return undefined;
        if (!this.index) this.index = 0;
        return this.history[this.index];
    }
    public hasPreviousUrl = (): boolean => {
        return this.history.length > 1 && this.index > 0;
    }
    public previousUrl = (): URL | undefined => {
        return this.hasPreviousUrl()
            ? this.history[--this.index]
            : undefined;
    }
    public removeCurrentUrl = (): URL | undefined => {
        if (this.history.length === 1) {
            this.history.pop();
        } else if (this.hasPreviousUrl()) {
            this.history.splice(this.index--, 1);
            return this.history[this.index];
        }
        return undefined;
    }
    public hasNextUrl = (): boolean => {
        return this.history.length > 1 && this.index + 1 < this.history.length;
    }
    public nextUrl = (): URL | undefined => {
        return this.hasNextUrl()
            ? this.history[++this.index]
            : undefined;
    }
}