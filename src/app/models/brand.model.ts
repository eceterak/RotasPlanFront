import { Image } from './image.model';

export class Brand {
    public id?: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}