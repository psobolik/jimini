export class Parameter {
    attribute: string;
    value: string;

    constructor(attribute: string, value: string) {
        this.attribute = attribute;
        this.value = value;
    }
}

export default class GeminiMimeType {
    type: string;
    subtype: string;
    parameters?: Parameter[];

    constructor(type: string, subtype: string, parameters?: Parameter[]) {
        this.type = type;
        this.subtype = subtype;
        this.parameters = parameters;
    }

    static fromContentType = (contentType: string): GeminiMimeType => {
        let type: string = "";
        let subtype: string = "";
        let parameters: Parameter[] | undefined = undefined;

        // This is not very strictly conforming...
        const type_params = contentType.split(";")
        if (type_params.length > 0) {
            let temp: string = "";
            const type_subtype = type_params[0].split("/");
            if (type_subtype.length > 0) {
                temp = type_subtype[0].trim();
                if (temp) type = temp.toLowerCase();
                if (type_subtype.length > 1) {
                    temp = type_subtype[1].trim();
                    if (temp) subtype = temp.toLowerCase();
                }
            }
            if (type_params.length > 1) {
                parameters = [];
                for (let i = 1; i < type_params.length; ++i) {
                    const att_val = type_params[i].split("=");
                    if (att_val.length === 2 && att_val[0].trim() && att_val[1].trim())
                        parameters.push(new Parameter(att_val[0].trim().toLowerCase(), att_val[1].trim().toLowerCase()))
                }
            }
        }
        return new GeminiMimeType(type, subtype, parameters)
    }
    public toString = (): string => {
        let s = `${this.type}/${this.subtype}`;
        if (this.parameters) {
            for (let i = 0; i < this.parameters.length; ++i) {
                s += `;${this.parameters[i].attribute}=${this.parameters[i].value}`
            }
        }
        return s;
    }
    public debug = (): string => {
        let s = `{ type: "${this.type}"; subtype: "${this.subtype}";`;
        if (this.parameters) {
            for (let i = 0; i < this.parameters.length; ++i) {
                s += ` p${i + 1}: ${this.parameters[i].attribute} = ${this.parameters[i].value};`
            }
        }
        s += " }";
        return s;
    }
}