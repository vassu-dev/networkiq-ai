import type { InventoryRow } from '@/types';

const stores = [
  { Store: 'Hyderabad', Location: 'Telangana' },
  { Store: 'Vijayawada', Location: 'Andhra Pradesh' },
  { Store: 'Visakhapatnam', Location: 'Andhra Pradesh' },
  { Store: 'Bengaluru', Location: 'Karnataka' },
  { Store: 'Chennai', Location: 'Tamil Nadu' },
  { Store: 'Mumbai', Location: 'Maharashtra' },
];

const products: { Product: string; Category: string; Price: number }[] = [
  { Product: 'Rice', Category: 'Grains', Price: 52 },
  { Product: 'Wheat Flour', Category: 'Grains', Price: 45 },
  { Product: 'Cooking Oil', Category: 'Pantry', Price: 140 },
  { Product: 'Sugar', Category: 'Pantry', Price: 44 },
  { Product: 'Milk', Category: 'Dairy', Price: 28 },
  { Product: 'Cheese', Category: 'Dairy', Price: 240 },
  { Product: 'Bread', Category: 'Bakery', Price: 35 },
  { Product: 'Eggs', Category: 'Dairy', Price: 7 },
  { Product: 'Chicken', Category: 'Meat', Price: 180 },
  { Product: 'Tomatoes', Category: 'Produce', Price: 30 },
  { Product: 'Onions', Category: 'Produce', Price: 25 },
  { Product: 'Potatoes', Category: 'Produce', Price: 22 },
  { Product: 'Detergent', Category: 'Household', Price: 95 },
  { Product: 'Soap', Category: 'Household', Price: 35 },
  { Product: 'Shampoo', Category: 'Personal Care', Price: 120 },
  { Product: 'Toothpaste', Category: 'Personal Care', Price: 55 },
  { Product: 'Coffee', Category: 'Beverages', Price: 220 },
  { Product: 'Tea', Category: 'Beverages', Price: 160 },
  { Product: 'Biscuits', Category: 'Snacks', Price: 30 },
  { Product: 'Soft Drinks', Category: 'Beverages', Price: 40 },
];

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateSampleDataset(rows = 60): InventoryRow[] {
  const rand = seeded(42);
  const data: InventoryRow[] = [];
  for (let i = 0; i < rows; i++) {
    const store = stores[Math.floor(rand() * stores.length)];
    const product = products[Math.floor(rand() * products.length)];
    const baseDemand = Math.floor(60 + rand() * 240);
    // Deliberately skew stock vs demand to create overstock & shortage scenarios
    const skew = rand();
    let currentStock: number;
    if (skew < 0.25) currentStock = Math.floor(baseDemand * (0.15 + rand() * 0.25)); // low
    else if (skew < 0.5) currentStock = Math.floor(baseDemand * (1.6 + rand() * 0.8)); // excess
    else currentStock = Math.floor(baseDemand * (0.8 + rand() * 0.4)); // near-optimal

    data.push({
      Store: store.Store,
      Product: product.Product,
      Category: product.Category,
      CurrentStock: currentStock,
      Demand: baseDemand,
      Price: product.Price,
      HoldingCost: Math.round(product.Price * (0.15 + rand() * 0.1) * 100) / 100,
      TransferCost: Math.round((8 + rand() * 22) * 100) / 100,
      Location: store.Location,
    });
  }
  return data;
}
