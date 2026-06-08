const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const User = require('../models/User');
const Coupon = require('../models/Coupon');

const seedCollections = [
  {
    name: 'The Lucifer Collection',
    description: 'The signature dark luxury collection. Defining modern streetwear.',
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800',
  },
  {
    name: 'Summer Drop 2024',
    description: 'Limited edition summer release. Light fabrics, bold statements.',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=800',
  },
  {
    name: 'Dark Aesthetic',
    description: 'Minimal, dark, and powerful. Built for the night.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800',
  },
];

const seedProducts = (collectionIds) => [
  {
    name: 'LUCIFER OVERSIZED HOODIE',
    price: 89.99,
    category: 'HOODIES',
    description:
      'Premium heavy-weight cotton hoodie with a relaxed fit. Features minimal branding and luxury finish.',
    images: [
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600',
      'https://images.unsplash.com/photo-1578932750294-f5df3b23024c?q=80&w=600',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Charcoal'],
    stock: 50,
    badge: 'NEW ARRIVAL',
    isFeatured: true,
    collection: collectionIds[0],
  },
  {
    name: 'DARK VELVET BOMBER',
    price: 129.99,
    category: 'OUTERWEAR',
    description: 'Elegant velvet bomber jacket with satin lining. Perfect for night-time urban exploration.',
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600',
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?q=80&w=600',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Deep Purple'],
    stock: 30,
    badge: 'BEST SELLER',
    isFeatured: true,
    collection: collectionIds[0],
  },
  {
    name: 'STREET CARGO PANTS',
    price: 75.00,
    category: 'PANTS',
    description: 'Multi-pocket cargo pants designed for utility and style. Adjustable cuffs and reinforced stitching.',
    images: [
      'https://images.unsplash.com/photo-1517438476312-10d79c67750d?q=80&w=600',
      'https://images.unsplash.com/photo-1624372933748-433e21976a44?q=80&w=600',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Olive', 'Black', 'Sand'],
    stock: 40,
    badge: 'LIMITED',
    isFeatured: false,
    collection: collectionIds[1],
  },
  {
    name: 'LUCIFER GRAPHIC TEE',
    price: 45.00,
    category: 'TSHIRT',
    description: '100% organic cotton tee with high-definition screen printed graphics.',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600',
      'https://images.unsplash.com/photo-1562157873-818bc0726f68?q=80&w=600',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['White', 'Black', 'Grey'],
    stock: 100,
    badge: 'TRENDING',
    isFeatured: true,
    collection: collectionIds[1],
  },
  {
    name: 'DISTRESSED SLIM JEANS',
    price: 95.00,
    category: 'JEANS',
    description: 'Signature slim-fit denim with hand-distressed detailing and premium hardware.',
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=600',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Dark Blue', 'Black'],
    stock: 25,
    badge: '',
    isFeatured: false,
    collection: collectionIds[2],
  },
  {
    name: 'URBAN LEATHER BOOTS',
    price: 199.99,
    category: 'SHOES',
    description: 'Italian leather boots with a rugged sole. Built for durability and style.',
    images: [
      'https://images.unsplash.com/photo-1520639889313-72721653e0d4?q=80&w=600',
      'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=600',
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Dark Brown'],
    stock: 15,
    badge: 'PREMIUM',
    isFeatured: true,
    collection: collectionIds[2],
  },
  {
    name: 'MONOCHROME LONG SLEEVE',
    price: 55.00,
    category: 'TSHIRT',
    description: 'Minimalist long sleeve tee in premium combed cotton. A wardrobe essential.',
    images: [
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?q=80&w=600',
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'White'],
    stock: 60,
    badge: 'NEW ARRIVAL',
    isFeatured: false,
    collection: collectionIds[0],
  },
  {
    name: 'SHADOW PUFFER JACKET',
    price: 159.99,
    category: 'OUTERWEAR',
    description: 'Water-resistant puffer jacket with matte finish. Insulated for extreme warmth.',
    images: [
      'https://images.unsplash.com/photo-1543076659-9380d3a65ade?q=80&w=600',
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Black', 'Slate Grey'],
    stock: 20,
    badge: 'BEST SELLER',
    isFeatured: true,
    collection: collectionIds[2],
  },
];

const seedCoupons = [
  {
    code: 'WELCOME20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 500,
    maxUses: 500,
    expiresAt: new Date('2025-12-31'),
  },
  {
    code: 'FLAT100',
    discountType: 'fixed',
    discountValue: 100,
    minOrderAmount: 1000,
    maxUses: 200,
    expiresAt: new Date('2025-12-31'),
  },
];

const seedDB = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await Collection.deleteMany({});
    await User.deleteMany({});
    await Coupon.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Seed collections
    // const collections = await Collection.insertMany(seedCollections);
    const collections = await Promise.all(seedCollections.map(c => Collection.create(c)));
    const collectionIds = collections.map((c) => c._id);
    console.log(`✅ Seeded ${collections.length} collections`);

    // Seed products
    const products = await Product.insertMany(seedProducts(collectionIds));
    console.log(`✅ Seeded ${products.length} products`);

    // Seed admin user
    await User.create({
      name: 'Lucifer Admin',
      email: 'admin@lucifer.com',
      password: 'Admin@1234',
      role: 'admin',
    });
    console.log('✅ Seeded admin user: admin@lucifer.com / Admin@1234');

    // Seed a test user
    await User.create({
      name: 'Test User',
      email: 'user@lucifer.com',
      password: 'User@1234',
      role: 'user',
    });
    console.log('✅ Seeded test user: user@lucifer.com / User@1234');

    // Seed coupons
    await Coupon.insertMany(seedCoupons);
    console.log(`✅ Seeded ${seedCoupons.length} coupons: WELCOME20 (20% off), FLAT100 (₹100 off)`);

    console.log('\n🎉 Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedDB();
