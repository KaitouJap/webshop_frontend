export interface ProductType {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    productType: number;
    count: number;
}