export enum ColorScheme {
    LIGHT,
    DARK,
    SYSTEM
}
export enum TextSize {
    SMALL,
    MEDIUM,
    LARGE
}
export class Settings {
    colorScheme: ColorScheme;
    homeUrlString: string;
    textSize: TextSize;

    constructor(colorScheme?: ColorScheme, homeUrlString?: string, textSize?: TextSize) {
        this.colorScheme = colorScheme ?? ColorScheme.SYSTEM;
        this.homeUrlString = homeUrlString ?? "";
        this.textSize = textSize ?? TextSize.MEDIUM;
    }
}
