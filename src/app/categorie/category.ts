export class Category {
    id?: string;
    name?: string;

    constructor(json?: any) {
        if (json) {
            this.setData(json);
        }
    }

    setData(json?: any) {
        this.id = json?.id;
        this.name = json?.name;
    }

    getData(): any {
        var obj: any = {};
        if (this.id) {
            obj["id"] = this.id;
        }
        obj["name"] = this.name ?? null;
        return obj;
}
}