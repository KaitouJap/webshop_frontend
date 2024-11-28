// src/components/AdminPage.tsx
import React, { useState, useEffect } from 'react';
import { baseUrl, apiRequest} from '../services/api';
import { Product, ProductType } from '../types/Product';
import NavBar from './NavbarComponent';
import { useAuth } from '../AuthContext';

const AdminPage = () => {
  const [productTypeNames, setProductTypeNames] = useState<ProductType[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [productTypeId, setProductTypeId] = useState<number>(0);
  const [count, setCount] = useState<number>(0);
  const [error, setError] = useState<string>('');
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
        body: JSON.stringify({ name, price, productTypeId, count }),
      },authToken!);
      setName('');
      setPrice(0);
      setProductTypeId(1);
      setCount(0);
      // Refresh product list
      const updatedProducts = await apiRequest(baseUrl,{
        method: 'GET',
      });
      setProducts(updatedProducts);
    } catch (err) {
      if(err instanceof Error)
        setError(err.message);
    }
  };

  const handleUpdateProduct = async (id: number) => {
    try {
        await apiRequest(baseUrl+`/${id}`,{
            method: 'PATCH',
            body: JSON.stringify({ name, price, productTypeId, count }),
        },authToken!);
      // Refresh product list after update
      const updatedProducts = await apiRequest(baseUrl,{
        method: 'GET',
      });
      setProducts(updatedProducts);
    } catch (err) {
      if(err instanceof Error)
        setError(err.message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try{
        await apiRequest(baseUrl+`/${id}`, {
            method: 'DELETE',
        },authToken!);
        const updatedProducts = await apiRequest(baseUrl,{
            method: 'GET',
        });
        setProducts(updatedProducts);
    }catch(err){
      if(err instanceof Error)
        setError(err.message);
    }
  };

  return (
    <div>
        <NavBar/>
      <h2>Admin Product Management</h2>
      {error && <div className='error'>{error}</div>}

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
          <select value={productTypeId} onChange={(e) => setProductTypeId(parseInt(e.target.value))}>
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

      <div className='container'>
        <h3>Existing Products</h3>
          <ul className='admin-product-list'>
            {products.map((product) => (
              <li className='admin-product-item' key={product.id}>
                <h3>{product.name}</h3>
                <p>Price: {product.price}</p>
                <p>Left: {product.count}</p>
                <p>Type: {productTypeNames.find((type) => (type.id === product.productTypeId))?.name}</p>
                <button onClick={() => handleUpdateProduct(product.id)}>Update</button>
                <button className='delete-btn' onClick={() => handleDeleteProduct(product.id)}>Delete</button>
              </li>
            ))}
          </ul>
      </div>
    </div>
  );
};

export default AdminPage;
