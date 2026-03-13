# Storeify Watches

A complete e-commerce website for a premium lifestyle accessories brand built with HTML, CSS, Vanilla JavaScript, and Supabase.

## Features

### User Side (Public Website)
- **Home Page** - Hero section, featured products, categories, and store information
- **Products Page** - Browse all products with category filtering and search
- **Product Detail Page** - View complete product information with WhatsApp ordering
- **Responsive Design** - Fully optimized for desktop, tablet, and mobile devices

### Admin Panel
- **Secure Login** - Password-protected admin access
- **Dashboard** - Overview with statistics (total products, stock status, featured items)
- **Product Management** - Add, edit, delete products
- **Stock Management** - Update stock quantities
- **Image Upload** - Upload product images to Supabase Storage

### WhatsApp Ordering System
- One-click WhatsApp ordering with pre-filled product details
- Configurable WhatsApp number
- Includes product name, selected color, and price in the message

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend/Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Deployment**: GitHub + Vercel ready

## Project Structure

```
storeify-watches/
├── index.html                 # Home page
├── css/
│   └── styles.css            # Main stylesheet
├── js/
│   ├── main.js               # Main JavaScript utilities
│   └── supabase.js           # Supabase integration
├── config/
│   └── config.js             # Configuration settings
├── pages/
│   ├── products.html         # Products listing page
│   └── product.html          # Single product detail page
├── admin/
│   ├── index.html            # Admin login
│   ├── dashboard.html        # Admin dashboard
│   └── css/
│       └── admin.css         # Admin styles
├── assets/
│   └── images/               # Image assets
└── README.md                 # This file
```

## Setup Instructions

### 1. Supabase Setup

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the following SQL in the SQL Editor to create the products table:

```sql
-- Create products table
CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    product_name TEXT NOT NULL,
    category TEXT NOT NULL,
    product_image_url TEXT,
    colour_options TEXT[] DEFAULT '{}',
    main_price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    short_description TEXT,
    stock_quantity INTEGER DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    product_tags TEXT[] DEFAULT '{}',
    featured BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active'
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy for anonymous read access
CREATE POLICY "Allow anonymous read access" ON products
    FOR SELECT USING (true);

-- Create policy for authenticated users (admin)
CREATE POLICY "Allow authenticated users full access" ON products
    USING (auth.role() = 'authenticated');
```

4. Create a storage bucket called `product-images`:
   - Go to Storage → New Bucket
   - Name: `product-images`
   - Make it public for read access

5. Get your Supabase credentials:
   - Project URL: Settings → API → Project URL
   - Anon Key: Settings → API → Project API Keys → anon/public

### 2. Configuration

1. Open `config/config.js`
2. Update the Supabase credentials:

```javascript
supabase: {
    url: 'YOUR_SUPABASE_PROJECT_URL',
    anonKey: 'YOUR_SUPABASE_ANON_KEY'
}
```

3. Update the WhatsApp number:

```javascript
whatsapp: {
    number: 'YOUR_WHATSAPP_NUMBER_WITH_COUNTRY_CODE',
    message: 'Your custom message',
    enabled: true
}
```

4. Change the admin password (optional but recommended):

```javascript
admin: {
    password: 'your_secure_password',
    sessionDuration: 3600000 // 1 hour
}
```

### 3. Deployment

#### Option A: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Deploy with default settings
4. Your site will be live!

#### Option B: Netlify

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Deploy with default settings

#### Option C: Static Hosting

Simply upload all files to any static web hosting service.

## Admin Panel Access

1. Navigate to `/admin/`
2. Enter the admin password (default: `admin123`)
3. Manage your products from the dashboard

## Customization

### Colors & Theme

Edit `css/styles.css` and update the CSS variables:

```css
:root {
    --primary: #1a1a2e;
    --secondary: #16213e;
    --accent: #e94560;
    --gold: #d4af37;
    --silver: #c0c0c0;
    /* ... */
}
```

### Categories

Edit `config/config.js` to add/modify categories:

```javascript
categories: [
    { id: 'all', name: 'All Products', icon: 'grid' },
    { id: 'watches', name: 'Watches', icon: 'watch' },
    { id: 'your-category', name: 'Your Category', icon: 'star' },
]
```

### Currency

Edit `config/config.js`:

```javascript
currency: {
    symbol: '₹',  // Change to your currency symbol
    code: 'INR',
    position: 'before'
}
```

## API Reference

### SupabaseDB Class Methods

```javascript
// Fetch all products
const products = await supabaseDB.getAllProducts({ category: 'watches', featured: true, limit: 10 });

// Fetch single product
const product = await supabaseDB.getProductById(1);

// Search products
const results = await supabaseDB.searchProducts('watch');

// Add product
const newProduct = await supabaseDB.addProduct({
    product_name: 'New Watch',
    category: 'watches',
    main_price: 2999,
    // ... other fields
});

// Update product
await supabaseDB.updateProduct(1, { stock_quantity: 50 });

// Delete product
await supabaseDB.deleteProduct(1);
```

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues or questions, please contact support@storeifywatches.com

---

Built with ❤️ by Storeify Watches Team
