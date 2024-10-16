export default class JiminiLink {
    link: string;
    name: string;

    constructor(link: string, name: string) {
        this.link = link;
        this.name = name;
    }
    static parseString(s: string): JiminiLink {
        // =>[<whitespace>]<URL>[<whitespace><USER-FRIENDLY LINK NAME>]
        // "=>" *WSP URI-reference [1*WSP 1*(SP / VCHAR)] *WSP CRLF
        let link: string = "";
        let name: string = "";

        let regexp = /(?<link>\S+)\s?(?<name>.*)/
        let array = regexp.exec(s);
        if (array && array.groups) {
            link = array.groups.link ?? "";
            name = array.groups.name ?? "";
        }
        return new JiminiLink(link.trim(), name ? name.trim() : link.trim());
    }
    isGeminiLink(): boolean  {
        return this.link.startsWith("gemini:");
    }
}