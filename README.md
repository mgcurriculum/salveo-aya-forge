# Salmara - Authentic Ayurveda Storefront

Salmara is a modern, high-end Ayurvedic e-commerce platform built with React and integrated directly with Shopify.

## Project Architecture

- **Frontend**: React and Vite for a lightning-fast development experience.
- **Styling**: Tailwind CSS for responsive and premium design.
- **State Management**: Zustand for cart and wishlist persistence.
- **Backend/CMS**: Shopify Storefront API for products, categories, and secure checkout.
- **Authentication**: Custom authentication bridge via Shopify Customer API.

## Getting Started

Follow these steps to set up the project locally:

### Prerequisites

- Node.js (v18 or higher)
- npm or bun

### Installation

1. Clone the repository.
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up your environment variables in a `.env` file (see `.env.example`).

### Development

Start the development server:
```sh
npm run dev
```

### Build

Create a production-ready build:
```sh
npm run build
```

## Shopify Configuration

Configuration is handled via environment variables:

```env
VITE_SHOPIFY_STOREFRONT_TOKEN=your_token
VITE_SHOPIFY_STORE_DOMAIN=your_store.myshopify.com
VITE_SHOPIFY_API_VERSION=2025-07
SHOPIFY_ADMIN_API_ACCESS_TOKEN=your_admin_token
```

> [!IMPORTANT]
> **Storefront API Permissions**:
> Ensure the **`unauthenticated_write_customers`** scope is enabled in your Shopify App settings.

## License

© 2026 Salmara. All rights reserved.
