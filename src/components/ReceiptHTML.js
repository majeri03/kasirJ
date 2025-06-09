export const getReceiptHtml = (cartItems, total) => {
  const formattedDate = new Date().toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const itemsHtml = cartItems
    .map(
      (item) => `
    <tr>
      <td>${item.name}</td>
      <td class="center">${item.quantity}</td>
      <td class="right">Rp${item.price.toLocaleString('id-ID')}</td>
      <td class="right">Rp${(item.quantity * item.price).toLocaleString('id-ID')}</td>
    </tr>
  `
    )
    .join('');

  return `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; }
          .container { width: 90%; margin: auto; }
          h1 { text-align: center; color: #000; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border-bottom: 1px solid #ddd; padding: 8px; text-align: left; }
          .center { text-align: center; }
          .right { text-align: right; }
          .total-row td { border-top: 2px solid #333; font-weight: bold; font-size: 1.1em; }
          .footer { text-align: center; margin-top: 30px; font-size: 0.8em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Struk Belanja</h1>
          <p>Tanggal: ${formattedDate}</p>
          <table>
            <thead>
              <tr>
                <th>Produk</th>
                <th class="center">Jml</th>
                <th class="right">Harga</th>
                <th class="right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>
          <table>
            <tr class="total-row">
              <td colspan="3">Total</td>
              <td class="right">Rp${total.toLocaleString('id-ID')}</td>
            </tr>
          </table>
          <p class="footer">Terima kasih telah berbelanja!</p>
        </div>
      </body>
    </html>
  `;
};