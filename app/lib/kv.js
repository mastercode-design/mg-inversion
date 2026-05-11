import { kv } from '@vercel/kv';

export async function getProducts() {
  try {
    const products = await kv.get('products');
    return products || [];
  } catch (error) {
    console.error('Error KV:', error);
    return [];
  }
}

export async function saveProduct(product) {
  const products = await getProducts();
  const newProduct = { 
    id: Date.now(), 
    ...product,
    price: Number(product.price)
  };
  products.push(newProduct);
  await kv.set('products', products);
  return newProduct;
}

export async function deleteProduct(id) {
  let products = await getProducts();
  products = products.filter(p => p.id !== Number(id));
  await kv.set('products', products);
}