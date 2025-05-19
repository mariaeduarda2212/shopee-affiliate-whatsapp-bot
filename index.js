const crypto = require('crypto');
const axios = require('axios');
const wppconnect = require('@wppconnect-team/wppconnect');

// Shopee Affiliate API credentials
const APP_ID = 'SEU_APP_ID';
const SECRET = 'SEU_SECRET_KEY';

// Links dos produtos que você quer promover
const productLinks = [
  'https://shopee.com.br/product/1045085918/20997654582',
  'https://shopee.com.br/product/1045085918/20997654582'
];

// Função de assinatura
function generateSignature(timestamp, body) {
  const payload = `${APP_ID}${timestamp}${body}`;
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

// Função para gerar link de afiliado
async function gerarLinkAfiliado(urlOriginal) {
  const timestamp = Date.now();
  const bodyObj = { url: urlOriginal };
  const body = JSON.stringify(bodyObj);
  const signature = generateSignature(timestamp, body);

  try {
    const response = await axios.post(
      'https://affiliate.shopee.com.br/api/v1/shopify/generate_affiliate_link',
      bodyObj,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `SHA256 Credential=${APP_ID},Timestamp=${timestamp},Signature=${signature}`
        }
      }
    );
    return response.data.data.affiliate_url;
  } catch (error) {
    console.error('❌ Erro ao gerar link de afiliado:', error.response?.data || error.message);
    return null;
  }
}

// Buscar dados do produto a partir do link
async function getProductDetailsFromShopee(link) {
  const timestamp = Date.now();
  const bodyObj = { url: link };
  const body = JSON.stringify(bodyObj);
  const signature = generateSignature(timestamp, body);

  try {
    const response = await axios.post(
      'https://affiliate.shopee.com.br/api/v1/shopify/get_product_details',
      bodyObj,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `SHA256 Credential=${APP_ID},Timestamp=${timestamp},Signature=${signature}`
        }
      }
    );

    const data = response.data.data;

    return {
      title: data.name,
      image: data.image,
      price: `R$ ${data.price}`,
      oldPrice: `R$ ${data.original_price || 'N/A'}`,
      url: data.product_url,
      freteGratis: data.free_shipping === 1,
      cupomDisponivel: data.coupon_status === 1
    };

  } catch (error) {
    console.error('Erro na API da Shopee:', error.response?.data || error.message);
    return null;
  }
}

// Envia pelo WhatsApp
wppconnect.create().then(async (client) => {
  const grupo = 'NOME EXATO DO SEU GRUPO';

  for (let link of productLinks) {
    const produto = await getProductDetailsFromShopee(link);

    if (!produto || !produto.title) {
      console.log(`❌ Produto não encontrado: ${link}`);
      continue;
    }

    // Gerar link de afiliado
    const linkAfiliado = await gerarLinkAfiliado(produto.url);
    if (!linkAfiliado) {
      console.log(`❌ Não foi possível gerar link de afiliado para: ${produto.url}`);
      continue;
    }

    const mensagem = `
🛒 *OFERTA RELÂMPAGO!*

✨ *${produto.title}*

💲 *De:* ~~${produto.oldPrice}~~  
💥 *Por:* ${produto.price}

📦 *Frete:* ${produto.freteGratis ? '✅ Grátis' : '❌ Consulte no site'}  
💳 *Cupom:* ${produto.cupomDisponivel ? '🤑 Disponível!' : '❌ Não encontrado'}

🔗 *Compre agora:* ${linkAfiliado}

⚠️ *Atenção!* Estoque limitado e promoções por tempo limitado.  
🚨 Corra antes que acabe!

#Shopee #Oferta #Achadinhos
    `;

    if (produto.image) {
      await client.sendImage(grupo, produto.image, 'produto.jpg', produto.title);
    }

    await client.sendText(grupo, mensagem);
    console.log(`✅ Mensagem enviada: ${produto.title}`);
    await new Promise(r => setTimeout(r, 15000));
  }
});
