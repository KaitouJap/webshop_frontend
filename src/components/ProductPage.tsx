// src/components/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { baseUrl, apiRequest } from '../services/api';
import { Product, ProductType } from '../types/Product';
import NavBar from './NavbarComponent';

const ProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);

  useEffect(() => {
    // Fetch products on component mount
    const fetchData = async () => {
      try {
        const productsData = await apiRequest(baseUrl,{
            method: 'GET',
        });
        const productTypeData = await apiRequest(baseUrl+'/types',{
            method: 'GET',
        });
        setProducts(productsData);
        setProductTypes(productTypeData);
      } catch (err) {
        console.error('Failed to fetch products or product types');
      }
    };
    fetchData();
  }, [products]);

  const handleBuyProduct = async (id: number) => {
    try {
      await apiRequest(baseUrl+`/${id}/buy`, {
        method: 'PATCH',
      });
      const updatedProducts = await apiRequest(baseUrl,{
        method: 'GET',
    });
      setProducts(updatedProducts);
    } catch (err) {
      console.error('Failed to buy product');
    }
  };

  return (
    <div>
    <NavBar/>
      <h2>Product List</h2>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>{product.name}</div>
            <div>{product.price}</div>
            <div>{product.count}</div>
            <div>{productTypes.find((type) => (type.id === product.productType))?.name}</div>
            <button onClick={() => handleBuyProduct(product.id)} disabled={product.count <= 0}>
              Buy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProductPage;
