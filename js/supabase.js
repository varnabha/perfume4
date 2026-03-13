// Storeify Watches - Supabase Integration Module
// Handles all database operations and storage

class SupabaseDB {
    constructor() {
        this.supabaseUrl = CONFIG.supabase.url;
        this.supabaseKey = CONFIG.supabase.anonKey;
        this.baseUrl = `${this.supabaseUrl}/rest/v1`;
        this.storageUrl = `${this.supabaseUrl}/storage/v1`;
        this.headers = {
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        };
    }

    // ===== Product Operations =====
    
    // Fetch all products
    async getAllProducts(options = {}) {
        try {
            const { category, featured, limit = 100, offset = 0 } = options;
            let url = `${this.baseUrl}/products?select=*&order=created_date.desc`;
            
            if (category && category !== 'all') {
                url += `&category=eq.${encodeURIComponent(category)}`;
            }
            
            if (featured) {
                url += `&featured=eq.true`;
            }
            
            url += `&limit=${limit}&offset=${offset}`;
            
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    }

    // Fetch single product by ID
    async getProductById(id) {
        try {
            const url = `${this.baseUrl}/products?id=eq.${id}&select=*`;
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data[0] || null;
        } catch (error) {
            console.error('Error fetching product:', error);
            throw error;
        }
    }

    // Fetch products by category
    async getProductsByCategory(category) {
        return this.getAllProducts({ category });
    }

    // Fetch featured products
    async getFeaturedProducts(limit = 6) {
        return this.getAllProducts({ featured: true, limit });
    }

    // Search products
    async searchProducts(query) {
        try {
            const url = `${this.baseUrl}/products?or=(product_name.ilike.%${encodeURIComponent(query)}%,short_description.ilike.%${encodeURIComponent(query)}%,product_tags.cs.{${encodeURIComponent(query)}})&select=*`;
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error searching products:', error);
            throw error;
        }
    }

    // ===== Admin Operations =====

    // Add new product
    async addProduct(productData) {
        try {
            const url = `${this.baseUrl}/products`;
            const response = await fetch(url, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    // Update product
    async updateProduct(id, productData) {
        try {
            const url = `${this.baseUrl}/products?id=eq.${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(productData)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Delete product
    async deleteProduct(id) {
        try {
            const url = `${this.baseUrl}/products?id=eq.${id}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: this.headers
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Update stock quantity
    async updateStock(id, quantity) {
        try {
            const url = `${this.baseUrl}/products?id=eq.${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify({ stock_quantity: quantity })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error updating stock:', error);
            throw error;
        }
    }

    // ===== Storage Operations =====

    // Upload image to Supabase Storage
    async uploadImage(file, folder = 'product-images') {
        try {
            // Generate unique filename
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 10);
            const fileExt = file.name.split('.').pop().toLowerCase();
            const fileName = `${timestamp}_${randomString}.${fileExt}`;
            const filePath = `${folder}/${fileName}`;
            
            // Upload to Supabase Storage
            const uploadUrl = `${this.storageUrl}/object/${filePath}`;
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'x-upsert': 'true'
                },
                body: file
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Upload error:', errorData);
                throw new Error(`Upload failed: ${errorData.message || response.statusText}`);
            }
            
            // Return the public URL
            const publicUrl = `${this.storageUrl}/object/public/${filePath}`;
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Upload image using base64 (alternative method)
    async uploadImageBase64(base64Data, folder = 'product-images') {
        try {
            // Convert base64 to blob
            const byteCharacters = atob(base64Data.split(',')[1]);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: 'image/jpeg' });
            
            // Create file from blob
            const timestamp = Date.now();
            const randomString = Math.random().toString(36).substring(2, 10);
            const fileName = `${timestamp}_${randomString}.jpg`;
            const filePath = `${folder}/${fileName}`;
            
            // Upload to Supabase Storage
            const uploadUrl = `${this.storageUrl}/object/${filePath}`;
            
            const response = await fetch(uploadUrl, {
                method: 'POST',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`,
                    'Content-Type': 'image/jpeg',
                    'x-upsert': 'true'
                },
                body: blob
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error('Upload error:', errorData);
                throw new Error(`Upload failed: ${errorData.message || response.statusText}`);
            }
            
            // Return the public URL
            const publicUrl = `${this.storageUrl}/object/public/${filePath}`;
            return publicUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }

    // Delete image from storage
    async deleteImage(filePath) {
        try {
            // Extract path from full URL if provided
            let path = filePath;
            if (filePath.includes('/object/public/')) {
                path = filePath.split('/object/public/')[1];
            }
            
            const url = `${this.storageUrl}/object/${path}`;
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'apikey': this.supabaseKey,
                    'Authorization': `Bearer ${this.supabaseKey}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return true;
        } catch (error) {
            console.error('Error deleting image:', error);
            throw error;
        }
    }

    // ===== Statistics =====

    // Get product counts by category
    async getCategoryCounts() {
        try {
            const url = `${this.baseUrl}/products?select=category`;
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            const counts = {};
            
            products.forEach(product => {
                counts[product.category] = (counts[product.category] || 0) + 1;
            });
            
            return counts;
        } catch (error) {
            console.error('Error getting category counts:', error);
            throw error;
        }
    }

    // Get total product count
    async getProductCount() {
        try {
            const url = `${this.baseUrl}/products?select=id`;
            const response = await fetch(url, { headers: this.headers });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const products = await response.json();
            return products.length;
        } catch (error) {
            console.error('Error getting product count:', error);
            throw error;
        }
    }
}

// Initialize Supabase instance
const supabaseDB = new SupabaseDB();
