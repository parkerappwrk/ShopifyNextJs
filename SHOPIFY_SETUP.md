# Shopify Storefront API Setup

This project is configured to fetch products from your Shopify store using the Storefront API.

## Setup Instructions

1. **Create a `.env.local` file** in the root directory of your project (if it doesn't exist).

2. **Add your Shopify credentials** to `.env.local`:
   ```env
   SHOPIFY_STORE_DOMAIN=your-store-name.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=4f3deae47b4ee5a9d1484f52febed359
   ```

3. **Replace `your-store-name`** with your actual Shopify store name. For example:
   - If your store URL is `https://my-store.myshopify.com`, use `my-store.myshopify.com`
   - If your store URL is `https://my-store.com`, you still need to use `my-store.myshopify.com` for the API

4. **The Storefront Access Token** is already provided: `4f3deae47b4ee5a9d1484f52febed359`

## How It Works

- The app fetches products from your Shopify store using GraphQL
- Products are displayed on the `/products` page
- Individual product details are shown on `/products/[id]`
- All product data (name, price, images, description) comes from your Shopify store

## Troubleshooting

If products are not loading:

1. **Check your environment variables**: Make sure `.env.local` exists and has the correct values
2. **Verify your store domain**: It should be in the format `store-name.myshopify.com`
3. **Check the access token**: Ensure the Storefront access token is valid and has the correct permissions
4. **Restart your dev server**: After changing `.env.local`, restart with `npm run dev`

## API Permissions

The Storefront access token needs the following permissions:
- `unauthenticated_read_product_listings` - To read products
- `unauthenticated_read_product_inventory` - To read inventory status

Make sure your token has these permissions in your Shopify admin.

