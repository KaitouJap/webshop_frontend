// src/components/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { baseUrl, apiRequest, authUrl} from '../services/api';
import { Product, ProductType } from '../types/Product';
import { Outlet } from 'react-router-dom';
import NavBar from './NavbarComponent';
import { useAuth } from '../AuthContext';

const AdminPage = () => {
  const [productTypeNames, setProductTypeNames] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [productType, setProductType] = useState(1);
  const [count, setCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const { authToken } = useAuth();

  useEffect(() => {
    // Fetch products on component mount
    const fetchData = async () => {
      try {
        const productsData = await apiRequest(baseUrl,{
            method: 'GET',
        });
        const productTypeNames = await apiRequest(baseUrl+'/types',{
            method: 'GET',
        });
        setProducts(productsData);
        setProductTypeNames(productTypeNames);
      } catch (err) {
        setError('Failed to fetch products or product Types');
      }
    };
    fetchData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiRequest(baseUrl,{
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ name, price, productType, count }),
      });
      setName('');
      setPrice(0);
      setProductType(1);
      setCount(0);
      // Refresh product list
      const updatedProducts = await apiRequest(baseUrl,{
        method: 'GET',
      });
      setProducts(updatedProducts);
    } catch (err) {
      setError('Failed to create product');
    }
  };

  const handleUpdateProduct = async (id: number) => {
    try {
        await apiRequest(baseUrl+`/${id}`,{
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
            body: JSON.stringify({ name, price, productType, count }),
        });
      // Refresh product list after update
      const updatedProducts = await apiRequest(baseUrl,{
        method: 'GET',
      });
      setProducts(updatedProducts);
    } catch (err) {
      setError('Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try{
        await apiRequest(baseUrl+`/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authToken}`,
            },
        });
        const updatedProducts = await apiRequest(baseUrl,{
            method: 'GET',
        });
        setProducts(updatedProducts);
    }catch(err){
        setError('Failed to delete product');
    }
  };

  return (
    <div>
        <NavBar/>
      <h2>Admin Product Management</h2>
      {error && <div style={{ color: 'red' }}>{error}</div>}

      <form onSubmit={handleCreateProduct}>
        <div>
          <label>Name: </label>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label>Price: </label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Product Type: </label>
          <select value={productType} onChange={(e) => setProductType(parseInt(e.target.value))}>
            <option value='' disabled>
                Select Product Type
            </option>
            {productTypeNames.map((type) => (
                <option key={type.id} value={type.id}>
                    {type.name}
                </option>
            ))}
          </select>
        </div>
        <div>
          <label>Count: </label>
          <input
            type="number"
            value={count}
            onChange={(e) => setCount(Number(e.target.value))}
          />
        </div>
        <button type="submit">Create Product</button>
      </form>

      <h3>Existing Products</h3>
      <ul>
        {products.map((product) => (
          <li key={product.id}>
            <div>{product.name}</div>
            <div>{product.price}</div>
            <div>{product.count}</div>
            <button onClick={() => handleUpdateProduct(product.id)}>Update</button>
            <button onClick={() => handleDeleteProduct(product.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Outlet/>
    </div>
  );
};

export default AdminPage;
