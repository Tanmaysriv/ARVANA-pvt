# 📦 STOCK MANAGEMENT SYSTEM - COMPLETE GUIDE

## 🎯 Overview

The Stock Management system allows sellers to manually control inventory quantities for their products. Instead of just marking items as "in stock" or "out of stock", sellers can now:

- Set exact stock quantities for each product (e.g., 100, 20, 5, etc.)
- Monitor inventory levels across all products
- Quickly add/remove stock with one-click buttons
- Filter products by stock status (low, out of stock)
- See real-time stock updates on product cards

---

## 🚀 Key Features

### 1. **Numeric Stock Input**
- Replace "In Stock" checkbox with actual quantity field
- Set any non-negative number (0, 1, 5, 100, 1000+)
- Automatically marks as "Out of Stock" when stock = 0

### 2. **Quick Stock Adjustments**
- **±1 buttons**: Add or remove 1 unit at a time
- **±10 buttons**: Add or remove 10 units quickly
- **Direct input**: Type exact quantity directly

### 3. **Stock Status Indicators**
- 🟢 **Green (> 20 units)**: Healthy stock
- 🟡 **Yellow (1-20 units)**: Low stock warning
- 🔴 **Red (0 units)**: Out of stock

### 4. **Dashboard Statistics**
- Total Products count
- In Stock vs Out of Stock breakdown
- Low Stock alerts (≤20 units)
- Total units across all products

### 5. **Stock Filtering**
- View ALL products
- Filter by LOW STOCK (1-20 units)
- Filter by OUT OF STOCK (0 units)
- Search by product name or brand

---

## 📍 Where to Access Stock Management

### For Sellers:
```
1. Login to seller account
2. Go to Seller Dashboard (sidebar or /seller)
3. Click "Stock Management" in the navigation menu
4. Or visit: http://localhost:5173/seller/stock
```

### For Admins:
- When editing products in Admin Products page
- Stock field visible alongside Price and Rating

---

## 🎮 How to Use

### **Method 1: In Stock Management Page**

#### Add/Remove Stock (Quick Buttons)
```
1. Find the product in the Stock Management table
2. Click buttons:
   [-10]  [-1]  [numeric input]  [+1]  [+10]
3. Changes save instantly
```

#### Direct Input
```
1. Click the numeric input field
2. Type exact number (e.g., 150)
3. Press Enter or click outside
4. Stock updates automatically
```

#### Filter by Status
```
Click filter buttons:
- "All" → Show all products
- "Low Stock" → Show products with 1-20 units
- "Out of Stock" → Show products with 0 units
```

### **Method 2: In My Products Page**

#### While Creating Product
```
1. Click "Add Product" button
2. Scroll to "Stock Quantity" field
3. Enter number (e.g., 100)
4. Complete other fields and save
```

#### While Editing Product
```
1. Click edit (pencil icon) on product
2. Change "Stock Quantity" field
3. Click "Update Product"
4. Stock syncs immediately
```

### **Method 3: In Admin Products**

#### Admin View
```
1. Login as admin
2. Go to Admin → Products
3. Click edit (pencil icon) on product
4. Set "Stock Quantity"
5. Save changes
```

---

## 📊 Stock Management Dashboard

### Statistics Cards

| Card | Shows | Color |
|------|-------|-------|
| **Total Products** | Number of products in catalog | Gray |
| **In Stock** | Products with stock > 0 | Green |
| **Low Stock** | Products with 1-20 units | Yellow |
| **Out of Stock** | Products with 0 units | Red |
| **Total Units** | Sum of all stock quantities | Blue |

### Product Table Layout

```
[Product Image] [Product Name] [Stock Badge] [Quick Buttons]
                [Brand • Category]
                [Price]
```

### Quick Actions

```
Controls per product:
[-10]  [-1]  [150]  [+1]  [+10]
```

**Example Workflow:**
- Current stock: 100 units
- Click [+10] → 110 units
- Click [-1] → 109 units
- Type "150" → 150 units
- Click [-10] → 140 units

---

## 🔄 Auto-Sync with Order System

### How Stock Deduction Works

```
Customer places order with 2 units
         ↓
Order submitted to backend
         ↓
Stock validation (product has ≥2 units?)
         ↓
If YES: Stock reduced by 2 automatically
If NO: Order rejected (out of stock)
         ↓
Product status auto-updates:
- If stock > 0 → Shown as "In Stock"
- If stock ≤ 0 → Shown as "Out of Stock"
```

### Example
- Product has: 50 units
- Customer orders: 20 units
- System deducts: 50 - 20 = 30 units remain
- Product automatically shown as "In Stock" (30 > 0)

---

## ⚙️ Backend Integration

### API Endpoints

**Update Product Stock:**
```
PUT /api/seller/products/:id
{
  "stock": 100
}
```

**Get Seller Products:**
```
GET /api/seller/products
```

Returns all products with:
- `stock`: Current quantity
- `inStock`: Boolean (auto-derived from stock)

### Database Fields

```javascript
Product Schema:
{
  stock: Number,      // Quantity (0, 1, 2, ...)
  inStock: Boolean,   // Auto-derived from stock > 0
  
  // Auto-update on save:
  pre('save'): inStock = stock > 0
}
```

---

## 💡 Best Practices

### 1. **Inventory Planning**
```
✓ Set realistic stock levels based on sales
✓ Use Low Stock filter to reorder frequently
✓ Monitor trends using dashboard stats
```

### 2. **Low Stock Management**
```
✓ Review products with ≤20 units weekly
✓ Set minimum stock thresholds per product
✓ Use "Low Stock" filter to plan restocks
```

### 3. **Out of Stock Handling**
```
✓ Remove out-of-stock items from promotions
✓ Set stock to >0 when restocked
✓ Monitor "Out of Stock" filter regularly
```

### 4. **Quick Adjustments**
```
✓ Use [±10] buttons for large changes
✓ Use [±1] buttons for fine-tuning
✓ Use direct input for bulk updates
```

---

## 🎨 UI Components

### Stock Status Badge

```
🟢 Green:  ">20" units   → Healthy stock
🟡 Yellow: "1-20" units  → Low stock warning
🔴 Red:    "0" units     → Out of stock
```

### Stock Display on Product Cards

```
Product Image
  ↓
[Seller Catalog]
  📦 45 in stock        ← Shows actual count

[Admin/Seller View]
  [Edit] [Delete]
  "45 left" badge      ← Green status
```

---

## 📱 Responsive Design

### Mobile (< 640px)
- Single column layout
- Buttons stack vertically
- Swipe-friendly controls

### Tablet (640px - 1024px)
- 2 column product grid
- Horizontal button layout

### Desktop (> 1024px)
- Full table view
- Side-by-side controls
- Optimized spacing

---

## 🔒 Security & Validation

### Input Validation
```
✓ Only non-negative numbers allowed
✓ Prevents negative stock (-1, -5, etc.)
✓ Minimum value: 0
✓ No upper limit (supports 999,999+ units)
```

### Authorization
```
✓ Sellers can only update their own products
✓ Admins can update any product
✓ Customers cannot modify stock
```

### Real-time Sync
```
✓ Changes save immediately
✓ No manual save button needed
✓ Auto-update inStock boolean
✓ Updates reflect in all views
```

---

## 🐛 Common Issues & Solutions

### Issue 1: Stock not updating
**Solution:**
```
1. Refresh page (F5)
2. Check product is fully loaded
3. Verify seller approval status
4. Check browser console for errors
```

### Issue 2: "Out of Stock" appears but stock > 0
**Solution:**
```
1. Stock value may be corrupted
2. Refresh page
3. Re-enter stock value
4. Contact admin if persists
```

### Issue 3: Cannot modify stock
**Solution:**
```
1. Verify you're logged in as seller
2. Check seller status is "approved"
3. Verify internet connection
4. Try different browser
```

### Issue 4: Negative numbers appear
**Solution:**
```
1. This shouldn't happen - backend prevents it
2. Refresh page
3. Clear browser cache
4. Report to admin
```

---

## 📈 Analytics & Reporting

### Dashboard Stats Usage

```
Total Products: 50
In Stock: 45
Low Stock: 3
Out of Stock: 2
Total Units: 1,250

Interpretation:
- 90% of inventory is healthy (45/50)
- 6% needs attention (3 products low)
- 4% is unavailable (2 products out)
```

### Stock Monitoring Workflow

```
Daily:   Check "Low Stock" filter
Weekly:  Review total units trend
Monthly: Plan inventory restocks
Quarterly: Analyze slow-moving items
```

---

## 🔗 Related Features

### Integrated With:
- ✅ Product Creation/Editing
- ✅ Order Processing (auto-deduction)
- ✅ Admin Dashboard
- ✅ Seller Dashboard
- ✅ Product Filtering

### Works With:
- ✅ Multiple payment methods
- ✅ Multi-seller orders
- ✅ Category management
- ✅ Product search

---

## 📞 Support & Help

### For Sellers:
- Contact admin for approval status
- Check "My Products" for quick edit
- Use Stock Management for detailed view

### For Admins:
- Approve sellers to enable stock management
- Monitor seller product inventory
- Update platform products directly

### Troubleshooting:
1. Clear browser cache (Ctrl+Shift+Del)
2. Hard refresh page (Ctrl+F5)
3. Check network tab for API errors
4. Contact system admin if issues persist

---

## ✅ Checklist

### Setup
- [ ] Seller account created
- [ ] Seller approved by admin
- [ ] Can access seller dashboard
- [ ] Stock Management menu visible

### Usage
- [ ] Set stock for all products
- [ ] Test quick buttons (±1, ±10)
- [ ] Filter by low stock
- [ ] Check dashboard statistics
- [ ] Place test order to verify deduction

### Ongoing
- [ ] Review stock weekly
- [ ] Update quantities as needed
- [ ] Monitor low stock alerts
- [ ] Plan restocks based on trends

---

**Stock Management is now fully integrated into ARVANA!** 🎉

For questions or issues, check this guide or contact your admin.
