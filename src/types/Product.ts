export interface ProductType {
    id: number;
    name: string;
}

export interface Product {
    id: number;
    name: string;
    price: number;
    productTypeId: number;
    count: number;
}