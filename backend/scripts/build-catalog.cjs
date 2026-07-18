/**
 * Generates backend/data/products.json
 */
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'data', 'products.json');

function slugify(str) {
  return String(str).toLowerCase().replace(/[^\w\s-]/g, '').trim().replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
}

function isoDaysAgo(days) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString();
}

function buildUnsplashUrl(id) {
  return `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=900&h=900&q=85`;
}

const EXACT_PRODUCTS = [
  // Electronics
  ['Apple Watch Series 9', 'Electronics', 'Apple', 399, 5, 4.9, 12000, 45, 'FB', 'watch,wearable,apple', 'The ultimate device for a healthy life.', buildUnsplashUrl('1434493789847-2f02b3c2005') /* Fallback if invalid */ || 'https://images.unsplash.com/photo-1434493789847-2f02b3c2005?w=900&q=85'],
  ['AirPods Pro 2nd Gen', 'Electronics', 'Apple', 249, 10, 4.8, 34000, 120, 'B', 'earbuds,audio,apple', 'Active Noise Cancellation and personalized spatial audio.', 'https://images.unsplash.com/photo-1606220588913-b3eea48b7538?w=900&q=85'],
  ['Sony WH-1000XM5', 'Electronics', 'Sony', 349, 0, 4.9, 8500, 60, 'F', 'headphones,music,sony', 'Industry leading noise canceling headphones.', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=900&q=85'],
  ['Razer DeathAdder V3', 'Electronics', 'Razer', 69, 15, 4.6, 4200, 85, 'N', 'mouse,gaming,razer', 'Ultra-lightweight ergonomic esports mouse.', 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=900&q=85'],
  ['ASUS ROG Zephyrus G14', 'Electronics', 'ASUS', 1499, 10, 4.9, 1500, 20, 'F', 'laptop,gaming,asus', '14-inch gaming laptop with AniMe Matrix display.', 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900&q=85'],
  ['Dell XPS 13', 'Electronics', 'Dell', 1199, 0, 4.7, 2100, 50, '', 'laptop,work,dell', 'Stunning InfinityEdge display and premium build.', 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=900&q=85'],
  ['HP Spectre x360', 'Electronics', 'HP', 1399, 5, 4.8, 1600, 30, 'B', 'laptop,touch,hp', 'Versatile 2-in-1 convertible laptop.', 'https://images.unsplash.com/photo-1531297172869-217bd4bb7db9?w=900&q=85'],
  ['Samsung Galaxy S24 Ultra', 'Electronics', 'Samsung', 1299, 0, 4.8, 5600, 30, 'F', 'phone,mobile,samsung', 'Titanium exterior and Galaxy AI features.', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900&q=85'],
  ['Fitbit Charge 6', 'Electronics', 'Fitbit', 159, 0, 4.3, 3100, 90, 'N', 'tracker,health,fitbit', 'Advanced fitness and health tracker.', 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=900&q=85'],
  ['JBL Flip 6', 'Electronics', 'JBL', 129, 20, 4.7, 18000, 40, 'B', 'speaker,portable,jbl', 'Waterproof portable Bluetooth speaker.', 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=900&q=85'],

  // Fashion
  ['Nike Air Force 1', 'Fashion', 'Nike', 115, 0, 4.8, 43000, 150, 'B', 'sneakers,shoes,nike', 'The classic everyday sneaker that never goes out of style.', 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=900&q=85'],
  ['Adidas Ultraboost 1.0', 'Fashion', 'Adidas', 190, 10, 4.9, 21000, 80, '', 'running,shoes,adidas', 'High-performance running shoes with responsive cushioning.', 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb?w=900&q=85'],
  ['Puma Suede Classic', 'Fashion', 'Puma', 75, 20, 4.6, 12000, 110, 'N', 'sneakers,shoes,puma', 'Iconic retro sneakers with premium suede finish.', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900&q=85'],
  ['Levi\'s 501 Original Jeans', 'Fashion', "Levi's", 79, 15, 4.7, 52000, 65, 'FB', 'jeans,denim,levis', 'The original straight fit jeans that started it all.', 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&q=85'],
  ['Dr. Martens 1460 Boots', 'Fashion', 'Dr. Martens', 170, 0, 4.8, 14000, 45, 'F', 'boots,leather', 'Classic 8-eye smooth leather lace-up boots.', 'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&q=85'],
  ['Zara Evening Dress', 'Fashion', 'Zara', 89, 10, 4.5, 950, 35, 'N', 'dress,party,zara', 'Elegant black dress for sophisticated evenings.', 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&q=85'],
  ['Ray-Ban Aviator Classic', 'Fashion', 'Ray-Ban', 160, 0, 4.8, 31000, 140, 'B', 'sunglasses,uv,rayban', 'Iconic teardrop lenses and gold frame.', 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=900&q=85'],
  ['The North Face Borealis', 'Fashion', 'The North Face', 99, 12, 4.7, 4500, 75, '', 'backpack,travel,northface', 'Durable commuter and trail backpack.', 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&q=85'],

  // Beauty
  ['Chanel No.5 Eau de Parfum', 'Beauty', 'Chanel', 160, 0, 4.9, 12000, 40, 'F', 'perfume,scent,chanel', 'The world’s most iconic floral fragrance.', 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=900&q=85'],
  ['CeraVe Daily Moisturizer', 'Beauty', 'CeraVe', 15, 0, 4.8, 28000, 185, 'B', 'cream,skincare,cerave', 'Lightweight, oil-free moisturizer with hyaluronic acid.', 'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=900&q=85'],
  ['MAC Matte Lipstick', 'Beauty', 'MAC', 23, 10, 4.7, 19000, 60, 'N', 'lipstick,makeup,mac', 'Rich, creamy formula with a highly pigmented matte finish.', 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=900&q=85'],
  ['Glossier Cloud Paint', 'Beauty', 'Glossier', 20, 0, 4.8, 11000, 45, 'F', 'blush,makeup,glossier', 'Seamless, buildable gel-cream blush.', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=900&q=85'],

  // Home
  ['YETI Rambler 20 oz', 'Home', 'YETI', 35, 0, 4.9, 54000, 300, 'B', 'mug,coffee,yeti', 'Double-wall vacuum insulated tumbler.', 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=900&q=85'],
  ['Dyson V15 Detect', 'Home', 'Dyson', 749, 15, 4.8, 3800, 40, 'F', 'vacuum,cleaning,dyson', 'Cordless vacuum with laser illumination.', 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=900&q=85'],
  ['Philips Hue Starter Kit', 'Home', 'Philips', 199, 10, 4.7, 8500, 40, 'N', 'lamp,lighting,smart', 'Smart LED bulbs to customize your home lighting.', 'https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=900&q=85']
];

function build() {
  return EXACT_PRODUCTS.map((row, idx) => {
    const [title, category, brand, price, discountPercentage, rating, reviewsCount, stock, flags, tagsCsv, excerpt, imgUrl] = row;

    const isFeatured = flags.includes('F');
    const isNewArrival = flags.includes('N');
    const isBestSeller = flags.includes('B');

    const tags = tagsCsv.split(',').map((t) => t.trim());
    const id = `SKU-${String(idx + 1).padStart(4, '0')}`;
    const slug = `${slugify(title)}-${idx + 1}`;
    const releasedAt = isoDaysAgo((idx % 210) + 10);

    const description = `${excerpt} Designed by ${brand} for everyday use. Authentic quality backed by a fictional 2-year warranty.`;
    const features = [
      'Premium materials inspected for defects',
      '30-day simulated return window',
      'Secure fictional checkout',
    ];

    return {
      id,
      title,
      slug,
      category,
      brand,
      price: Number(price),
      discountPercentage: Number(discountPercentage),
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      stock: Number(stock),
      description,
      features,
      images: [imgUrl, imgUrl], // Use the same image twice for gallery to avoid missing 2nd images
      tags,
      isFeatured,
      isNewArrival,
      isBestSeller,
      releasedAt,
    };
  });
}

fs.writeFileSync(OUT, JSON.stringify(build(), null, 2), 'utf8');
console.log(`Wrote ${EXACT_PRODUCTS.length} products -> ${OUT}`);
