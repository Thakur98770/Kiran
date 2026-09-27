/* ============================================================
   Kiran Cosmetics & Gift Centre
   Application logic (Alpine.js)  ->  js/app.js
   ============================================================ */

function kiranApp() {
return {
mobileNavOpen: false,
cartDrawerOpen: false,
searchOpen: false,
quickViewModalOpen: false,
selectedCategory: 'all',
searchQuery: '',
couponCode: '',
couponApplied: false,
selectedProduct: null,
toastTimer: null,

toast: {
show: false,
message: ''
},

// Cart starts empty on a fresh visit
cart: [],

/* ---------------- Lifecycle ---------------- */
init() {
// Lock background scroll while an overlay is open
this.$watch('cartDrawerOpen', v => document.body.classList.toggle('no-scroll', v));
this.$watch('searchOpen', v => document.body.classList.toggle('no-scroll', v));
this.$watch('quickViewModalOpen', v => document.body.classList.toggle('no-scroll', v));

// Close the mobile drawer if the user rotates / resizes up to desktop
let wasMobile = window.innerWidth < 1024;
window.addEventListener('resize', () => {
const isMobile = window.innerWidth < 1024;
if (wasMobile && !isMobile) this.mobileNavOpen = false;
wasMobile = isMobile;
});
},

openSearch() {
this.searchOpen = true;
this.$nextTick(() => this.$refs.globalSearch?.focus());
},

closeAllOverlays() {
this.cartDrawerOpen = false;
this.searchOpen = false;
this.quickViewModalOpen = false;
this.mobileNavOpen = false;
},

// Single place that builds a wa.me deep link (properly encoded)
openWhatsApp(message) {
window.open('https://wa.me/918699631881?text=' + encodeURIComponent(message), '_blank', 'noopener');
},

/* Lowercase + strip diacritics so "lakme" matches "Lakme-accented",
"loréal" matches "L'Oreal", etc. ASCII-safe source only. */
normalize(str) {
return (str || '')
.toString()
.toLowerCase()
.normalize('NFD')
.replace(/[\u0300-\u036f]/g, '')   // combining accents
.replace(/[\u2018\u2019\u201c\u201d\u0060]/g, '') // smart quotes / backtick
.replace(/[^a-z0-9\s]/g, ' ')
.replace(/\s+/g, ' ')
.trim();
},

// Product Categories
categories: [
{ id: 'all', name: 'All Collection', icon: 'fa-solid fa-border-all' },
{ id: 'skincare', name: 'Skincare & Serums', icon: 'fa-solid fa-droplet' },
{ id: 'makeup', name: 'Makeup & Beauty', icon: 'fa-solid fa-wand-magic-sparkles' },
{ id: 'perfumes', name: 'Perfumes & Fragrance', icon: 'fa-solid fa-spray-can' },
{ id: 'hampers', name: 'Gift Hampers', icon: 'fa-solid fa-gift' },
{ id: 'jewellery', name: 'Artificial Jewellery', icon: 'fa-solid fa-gem' }
],

// Full Products Data
products: [
{
id: 1,
name: "Maybelline Fit Me Matte Foundation",
brand: "Maybelline",
category: "makeup",
price: 549,
originalPrice: 650,
rating: 4.9,
badge: "Bestseller",
image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=500&q=80",
shortDesc: "Lightweight liquid foundation for a natural matte shade blend.",
fullDesc: "Maybelline Fit Me Matte + Poreless Foundation fits skin tone and texture. Ideal for normal to oily skin, refining pores for a natural finish."
},
{
id: 2,
name: "Lakmé Absolute Skin Natural Gel Cream",
brand: "Lakmé",
category: "skincare",
price: 399,
originalPrice: 499,
rating: 4.8,
badge: "Popular",
image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=500&q=80",
shortDesc: "Hydrating skin gel for all-day radiance and moisture.",
fullDesc: "Enriched with real skin nutrients, this non-greasy gel absorbs quickly into skin giving a smooth, fresh texture."
},
{
id: 3,
name: "Bella Vita Luxury Perfume Gift Set",
brand: "Bella Vita",
category: "perfumes",
price: 899,
originalPrice: 1200,
rating: 4.9,
badge: "Top Gift",
image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=500&q=80",
shortDesc: "Set of 4 long-lasting luxury EDP perfumes for women & men.",
fullDesc: "Contains four signature long-lasting fragrance sprays crafted with French perfume oils. Perfect for gifting!"
},
{
id: 4,
name: "Royal Bridal Beauty & Makeup Trunk",
brand: "Kiran Custom",
category: "hampers",
price: 2499,
originalPrice: 3200,
rating: 5.0,
badge: "Bridal Special",
image: "https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=500&q=80",
shortDesc: "Handcrafted trunk filled with branded makeup essentials and floral wraps.",
fullDesc: "Our signature bridal hamper includes lipstick, kajal, compact, nail enamels, face serum, and decorative floral trunk box."
},
{
id: 5,
name: "Minimalist Vitamin C 10% Face Serum",
brand: "Minimalist",
category: "skincare",
price: 699,
originalPrice: 799,
rating: 4.9,
badge: "Trending",
image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=500&q=80",
shortDesc: "Glowing skin serum that reduces dark spots and uneven skin tone.",
fullDesc: "Formulated with pure Vitamin C and Centella water for a luminous glow without irritation."
},
{
id: 6,
name: "Sugar Matte As Hell Crayon Lipstick",
brand: "Sugar",
category: "makeup",
price: 799,
originalPrice: 899,
rating: 4.8,
badge: "15% OFF",
image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=500&q=80",
shortDesc: "Intense matte lipstick crayon with silky smooth application.",
fullDesc: "Highly pigmented lip crayon providing opaque coverage in a single stroke with 12 hour stay duration."
},
{
id: 7,
name: "Kundan Choker Necklace Set",
brand: "Designer Jewellery",
category: "jewellery",
price: 1299,
originalPrice: 1800,
rating: 4.9,
badge: "Festive",
image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=500&q=80",
shortDesc: "Traditional Kundan set with matching earrings for weddings.",
fullDesc: "Premium gold-plated artificial jewellery set crafted for wedding celebrations and traditional outfits."
},
{
id: 8,
name: "Scented Soy Candle & Skincare Duo",
brand: "Kiran Custom",
category: "hampers",
price: 1199,
originalPrice: 1500,
rating: 4.9,
badge: "Gift Box",
image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=500&q=80",
shortDesc: "Aesthetic gift box featuring lavender soy candle & body butter.",
fullDesc: "Includes hand-poured lavender scented candle, organic body wash, and loofah in a pastel ribbon box."
}
],

// Custom Hamper Builder Options
hamperBoxes: [
{ id: 'b1', name: 'Luxury Velvet Box', price: 299, desc: 'Soft touch velvet finish box with magnetic closure' },
{ id: 'b2', name: 'Rustic Willow Basket', price: 349, desc: 'Eco-friendly woven basket wrapped in net fabric' },
{ id: 'b3', name: 'Floral Acrylic Trunk', price: 499, desc: 'Crystal clear acrylic trunk filled with artificial rose petals' }
],

hamperItemOptions: [
{ id: 'h1', name: 'Sugar Matte Lipstick Shade', price: 799, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=150&q=80' },
{ id: 'h2', name: 'Bella Vita Mini Perfume', price: 399, image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=150&q=80' },
{ id: 'h3', name: 'Minimalist Glow Serum', price: 699, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=150&q=80' },
{ id: 'h4', name: 'Handcrafted Scented Candle', price: 299, image: 'https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=150&q=80' },
{ id: 'h5', name: 'Lakmé Eyeconic Kajal Twin', price: 349, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=150&q=80' },
{ id: 'h6', name: 'Pearl Drop Earrings', price: 450, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=150&q=80' }
],

selectedBox: { id: 'b1', name: 'Luxury Velvet Box', price: 299, desc: 'Soft touch velvet finish box with magnetic closure' },
selectedHamperItems: [],
hamperOccasion: 'Birthday Special',
hamperRibbon: 'Rose Gold Satin',
hamperNote: '',

inquiry: {
name: '',
phone: '',
type: 'Product Availability',
message: ''
},

get filteredProducts() {
const q = this.normalize(this.searchQuery);
return this.products.filter(p => {
const matchesCategory = this.selectedCategory === 'all' || p.category === this.selectedCategory;
const haystack = this.normalize(p.name + ' ' + p.brand + ' ' + p.shortDesc);
return matchesCategory && (q === '' || haystack.includes(q));
});
},

get cartItemCount() {
return this.cart.reduce((sum, item) => sum + item.qty, 0);
},

get cartSubtotal() {
return this.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
},

get discountAmount() {
return this.couponApplied ? Math.round(this.cartSubtotal * 0.10) : 0;
},

get cartFinalTotal() {
return this.cartSubtotal - this.discountAmount;
},

get hamperTotalCost() {
const itemsCost = this.selectedHamperItems.reduce((sum, i) => sum + i.price, 0);
return this.selectedBox.price + itemsCost;
},

addToCart(product) {
if (!product) return;
const existing = this.cart.find(item => item.id === product.id);
if (existing) {
existing.qty++;
} else {
this.cart.push({
id: product.id,
name: product.name,
brand: product.brand,
price: product.price,
image: product.image,
qty: 1
});
}
this.showToast(`Added ${product.name} to your bag!`);
},

removeFromCart(id, silent = false) {
this.cart = this.cart.filter(item => item.id !== id);
// Discount should not survive an emptied bag
if (this.cart.length === 0) {
this.couponApplied = false;
this.couponCode = '';
}
if (!silent) this.showToast('Item removed from cart.');
},

updateCartQty(id, delta) {
const item = this.cart.find(i => i.id === id);
if (item) {
item.qty += delta;
if (item.qty <= 0) {
this.removeFromCart(id, true);
this.showToast('Item removed from cart.');
}
}
},

openQuickView(product) {
this.selectedProduct = product;
this.quickViewModalOpen = true;
},

toggleHamperItem(item) {
const idx = this.selectedHamperItems.findIndex(i => i.id === item.id);
if (idx > -1) {
this.selectedHamperItems.splice(idx, 1);
} else {
this.selectedHamperItems.push(item);
}
},

isHamperItemSelected(id) {
return this.selectedHamperItems.some(i => i.id === id);
},

applyCoupon() {
if (this.cart.length === 0) {
this.showToast('Add items to your bag before applying a coupon.');
return;
}
if (this.couponCode.trim().toUpperCase() === 'KIRAN10') {
this.couponApplied = true;
this.showToast('Coupon KIRAN10 Applied! 10% Discount applied.');
} else {
this.couponApplied = false;
this.showToast('Invalid Coupon Code. Try "KIRAN10"');
}
},

showToast(msg) {
this.toast.message = msg;
this.toast.show = true;
clearTimeout(this.toastTimer);
this.toastTimer = setTimeout(() => {
this.toast.show = false;
}, 3000);
},

sendHamperToWhatsApp() {
if (this.selectedHamperItems.length === 0) {
this.showToast('Please select at least 1 beauty item for your hamper.');
return;
}

const itemListStr = this.selectedHamperItems.map(i => `• ${i.name} (₹${i.price})`).join('\n');
const msg = `Hello Kiran Cosmetics! 👋 I want to order a Custom Gift Hamper:\n\n` +
`📦 *Box Style:* ${this.selectedBox.name} (₹${this.selectedBox.price})\n` +
`🎉 *Occasion:* ${this.hamperOccasion}\n` +
`🎀 *Ribbon:* ${this.hamperRibbon}\n\n` +
`💄 *Included Items:*\n${itemListStr}\n\n` +
(this.hamperNote ? `📝 *Card Note:* "${this.hamperNote}"\n\n` : '') +
`💰 *Estimated Total:* ₹${this.hamperTotalCost}\n\n` +
`Please confirm availability and pickup time in Rama Mandi!`;

this.openWhatsApp(msg);
},

checkoutWhatsApp() {
if (this.cart.length === 0) return;

const itemsStr = this.cart.map(i => `• ${i.name} (x${i.qty}) - ₹${i.price * i.qty}`).join('\n');
const msg = `Hello Kiran Cosmetics! 👋 I would like to place an order:\n\n` +
`🛒 *Items in Bag:*\n${itemsStr}\n\n` +
(this.couponApplied ? `🎁 *Coupon:* KIRAN10 (10% OFF)\n` : '') +
`💵 *Total Payable:* ₹${this.cartFinalTotal}\n\n` +
`Please let me know when I can pick this up at Rama Mandi store!`;

this.openWhatsApp(msg);
},

submitInquiryForm() {
const name = this.inquiry.name.trim();
const phone = this.inquiry.phone.trim();
const digits = phone.replace(/\D/g, '');

if (!name) {
this.showToast('Please enter your name.');
return;
}
if (digits.length < 10) {
this.showToast('Please enter a valid 10-digit mobile number.');
return;
}

const msg = `Hello Kiran Cosmetics! I have a store inquiry:\n\n` +
`👤 *Name:* ${name}\n` +
`📞 *Phone:* ${phone}\n` +
`📌 *Type:* ${this.inquiry.type}\n` +
`💬 *Message:* ${this.inquiry.message || 'N/A'}`;

this.openWhatsApp(msg);
this.inquiry = { name: '', phone: '', type: 'Product Availability', message: '' };
}
}
}
