# 🤖 Shopee Affiliate Bot para WhatsApp

Este é um bot automatizado que utiliza a API da Shopee para gerar links de afiliado a partir de URLs de produtos e enviá-los formatados em grupos do WhatsApp via [WPPConnect](https://github.com/wppconnect-team/wppconnect).

## 🚀 Funcionalidades

- Geração de links de afiliado da Shopee
- Busca de informações dos produtos (título, imagem, preço, frete, cupom)
- Envio automático de mensagens promocionais formatadas para um grupo específico no WhatsApp
- Integração com a biblioteca `wppconnect` para controle do WhatsApp Web

## ⚠️ Problema conhecido

Atualmente, o bot retorna o seguinte erro ao tentar buscar os dados dos produtos pela API da Shopee:

```
Erro na API da Shopee: 404 page not found
❌ Produto não encontrado: https://shopee.com.br/product/1045085918/20997654582
```

Esse erro ocorre provavelmente devido a um dos seguintes motivos:

- O endpoint da API foi alterado ou desativado
- O link do produto está incorreto ou não é compatível com a API
- A API da Shopee Brasil possui restrições quanto ao uso ou precisa de configurações adicionais

A função afetada é `getProductDetailsFromShopee`.

## 🛠️ Tecnologias

- Node.js
- Axios
- WPPConnect
- Puppeteer
- API Shopee Afiliados (Brasil)
- Crypto (para assinatura da requisição)

## 📦 Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/shopee-affiliate-bot-whatsapp.git
cd shopee-affiliate-bot-whatsapp
```

2. Instale as dependências:

```bash
npm install
```

3. Configure suas credenciais da Shopee:

No arquivo `index.js`, substitua:

```js
const APP_ID = 'SEU_APP_ID';
const SECRET = 'SEU_SECRET_KEY';
```

4. Execute o bot:

```bash
node index.js
```

## 📷 Exemplo de mensagem enviada

```text
🛒 OFERTA RELÂMPAGO!

✨ Fone Bluetooth XYZ

💲 De: ~~R$ 99,90~~  
💥 Por: R$ 49,90

📦 Frete: ✅ Grátis  
💳 Cupom: 🤑 Disponível!

🔗 Compre agora: https://shopee.com.br/...

⚠️ Atenção! Estoque limitado e promoções por tempo limitado.  
🚨 Corra antes que acabe!
```

## 📌 Requisitos

- Conta no programa de afiliados da Shopee Brasil
- Grupo de WhatsApp criado (com o nome exato configurado no código)
- Node.js instalado (versão LTS recomendada)

## 📧 Contato

Caso queira reportar erros ou contribuir com melhorias, fique à vontade para abrir uma issue ou pull request.

---

**Aviso:** Este projeto é experimental e sem garantias. Use por sua conta e risco, respeitando os termos de uso da Shopee e do WhatsApp.
