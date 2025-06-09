import { getDb } from '../db/database';

export const getAllProducts = async (searchQuery = '') => {
  const db = await getDb();
  const query = `SELECT * FROM products WHERE name LIKE ? ORDER BY name;`;
  const params = [`%${searchQuery}%`];
  return await db.getAllAsync(query, params);
};

export const findProductByCode = async (code) => {
  const db = await getDb();
  const query = `SELECT * FROM products WHERE code = ?;`;
  return await db.getFirstAsync(query, [code]);
};

export const addProduct = async (product) => {
  const db = await getDb();
  const { name, price, stock, code } = product;
  const query = `INSERT INTO products (name, price, stock, code) VALUES (?, ?, ?, ?);`;
  const result = await db.runAsync(query, [name, parseFloat(price), parseInt(stock), code]);
  return result.lastInsertRowId;
};

export const updateProduct = async (product) => {
  const db = await getDb();
  const { id, name, price, stock, code } = product;
  const query = `UPDATE products SET name = ?, price = ?, stock = ?, code = ? WHERE id = ?;`;
  return await db.runAsync(query, [name, parseFloat(price), parseInt(stock), code, id]);
};

export const deleteProduct = async (id) => {
  const db = await getDb();
  const query = `DELETE FROM products WHERE id = ?;`;
  return await db.runAsync(query, [id]);
};