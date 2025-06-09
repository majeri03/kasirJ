import { getDb } from '../db/database';

export const createTransaction = async (cart, totalAmount) => {
  const db = await getDb();
  
  try {
    const result = await db.withTransactionAsync(async () => {
      // 1. Create transaction record
      const transactionResult = await db.runAsync(
        'INSERT INTO transactions (totalAmount, createdAt) VALUES (?, ?)',
        [totalAmount, new Date().toISOString()]
      );
      const transactionId = transactionResult.lastInsertRowId;

      // 2. Insert transaction items and update stock for each product
      for (const item of cart) {
        // Insert into transaction_items
        await db.runAsync(
          'INSERT INTO transaction_items (transactionId, productId, quantity, price) VALUES (?, ?, ?, ?)',
          [transactionId, item.id, item.quantity, item.price]
        );
        
        // Update product stock
        await db.runAsync(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.id]
        );
      }
      return transactionId;
    });
    return { success: true, transactionId: result };
  } catch (error) {
    console.error("Transaction failed:", error);
    return { success: false, error };
  }
};

export const getAllTransactions = async () => {
    const db = await getDb();
    const query = `
        SELECT 
            t.id, 
            t.totalAmount, 
            t.createdAt,
            (SELECT GROUP_CONCAT(p.name || ' (x' || ti.quantity || ')', '; ') 
             FROM transaction_items ti
             JOIN products p ON ti.productId = p.id
             WHERE ti.transactionId = t.id) as items
        FROM transactions t
        ORDER BY t.createdAt DESC;
    `;
    return await db.getAllAsync(query);
};