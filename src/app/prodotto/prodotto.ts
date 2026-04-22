export class Prodotto {
    id?: number;
    title?: string;
    price?: number;
    description?: string;
    category?: string;
    image?: string;
    rating: any = {};

    constructor(json?: any) {
        this.setData(json);
    }

    setData(json: any): void {
        if (json) {
            this.id = json.id;
            this.title = json.title;
            this.price = json.price;
            this.description = json.description;
            this.category = json.category;
            this.image = json.image;
            this.rating = json.rating;
        }
    }
}