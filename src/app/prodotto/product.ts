export class Product {
    id?: string;
    title?: string;
    price?: number;
    description?: string;
    image?: string;
    categoryId?: string;

    constructor(json?: any) {
        if (json) {
            this.setData(json);
        }
    }

    setData(json?: any) {
        this.id = json?.id;
        this.title = json?.title;
        this.price = json?.price;
        this.description = json?.description;
        this.image = json?.image;
        this.categoryId = json?.categoryId;
    }

    getData(): any {
        var obj: any = {};
        if (this.id) {
            obj["id"] = this.id;
        }
        obj["title"] = this.title ?? null;
        obj["price"] = this.price ?? null;
        obj["description"] = this.description ?? null;
        obj["image"] = this.image ?? null;
        obj["categoryId"] = this.categoryId ?? null;
        return obj
    }
}