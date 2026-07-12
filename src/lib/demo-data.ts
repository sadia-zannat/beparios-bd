export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "returned";

export type Order = {
  id: string;
  customer: string;
  phone: string;
  product: string;
  qty: number;
  amount: number;
  paymentMethod: "COD" | "bKash" | "Nagad" | "Bank";
  status: OrderStatus;
  date: string; // ISO
  address: string;
};

export type Product = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  lowStockAt: number;
  sold: number;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  city: string;
  orders: number;
  totalSpent: number;
  lastOrder: string;
};

export type Expense = {
  id: string;
  title: string;
  category: "Ads" | "Courier" | "Packaging" | "Salary" | "Other";
  amount: number;
  date: string;
  note?: string;
};

export const salesOverview = [
  { month: "Jan", sales: 142000, profit: 42000 },
  { month: "Feb", sales: 168000, profit: 51000 },
  { month: "Mar", sales: 154000, profit: 46200 },
  { month: "Apr", sales: 192000, profit: 62400 },
  { month: "May", sales: 231000, profit: 74800 },
  { month: "Jun", sales: 218000, profit: 69100 },
  { month: "Jul", sales: 265000, profit: 88300 },
  { month: "Aug", sales: 289000, profit: 95400 },
  { month: "Sep", sales: 274000, profit: 91200 },
  { month: "Oct", sales: 312000, profit: 108500 },
  { month: "Nov", sales: 348000, profit: 121000 },
  { month: "Dec", sales: 402000, profit: 142600 },
];

export const orders: Order[] = [
  {
    id: "SP-10241",
    customer: "Rifat Hasan",
    phone: "01712-345678",
    product: "Cotton Panjabi (L)",
    qty: 1,
    amount: 1850,
    paymentMethod: "COD",
    status: "pending",
    date: "2026-07-11T10:12:00Z",
    address: "House 24, Road 7, Dhanmondi, Dhaka",
  },
  {
    id: "SP-10240",
    customer: "Nusrat Jahan",
    phone: "01911-882140",
    product: "Georgette Three Piece",
    qty: 1,
    amount: 2650,
    paymentMethod: "bKash",
    status: "processing",
    date: "2026-07-11T09:04:00Z",
    address: "Flat 4B, Uttara Sector 10, Dhaka",
  },
  {
    id: "SP-10239",
    customer: "Tanvir Ahmed",
    phone: "01615-771230",
    product: "Leather Wallet (Brown)",
    qty: 2,
    amount: 2400,
    paymentMethod: "COD",
    status: "shipped",
    date: "2026-07-10T14:30:00Z",
    address: "12/A, Agrabad, Chattogram",
  },
  {
    id: "SP-10238",
    customer: "Sabrina Akter",
    phone: "01521-664422",
    product: "Handmade Jute Bag",
    qty: 3,
    amount: 1650,
    paymentMethod: "Nagad",
    status: "delivered",
    date: "2026-07-10T11:11:00Z",
    address: "House 9, Zindabazar, Sylhet",
  },
  {
    id: "SP-10237",
    customer: "Mahmudul Karim",
    phone: "01811-556677",
    product: "Kids Frock Set",
    qty: 1,
    amount: 1200,
    paymentMethod: "COD",
    status: "pending",
    date: "2026-07-10T08:45:00Z",
    address: "Bogura Sadar, Bogura",
  },
  {
    id: "SP-10236",
    customer: "Farzana Islam",
    phone: "01717-990022",
    product: "Silk Saree (Katan)",
    qty: 1,
    amount: 4800,
    paymentMethod: "Bank",
    status: "delivered",
    date: "2026-07-09T16:20:00Z",
    address: "Road 11, Banani, Dhaka",
  },
  {
    id: "SP-10235",
    customer: "Imran Chowdhury",
    phone: "01911-123456",
    product: "Men's Sneakers (42)",
    qty: 1,
    amount: 2150,
    paymentMethod: "COD",
    status: "cancelled",
    date: "2026-07-09T12:00:00Z",
    address: "Khulshi, Chattogram",
  },
  {
    id: "SP-10234",
    customer: "Shirin Sultana",
    phone: "01611-334455",
    product: "Hijab Combo (3pc)",
    qty: 1,
    amount: 950,
    paymentMethod: "bKash",
    status: "delivered",
    date: "2026-07-08T10:15:00Z",
    address: "Mymensingh Sadar",
  },
];

export const products: Product[] = [
  {
    id: "P-001",
    name: "Cotton Panjabi",
    sku: "PNJ-CTN-001",
    category: "Menswear",
    price: 1850,
    cost: 1100,
    stock: 4,
    lowStockAt: 10,
    sold: 128,
  },
  {
    id: "P-002",
    name: "Georgette Three Piece",
    sku: "TPC-GRG-014",
    category: "Womenswear",
    price: 2650,
    cost: 1650,
    stock: 22,
    lowStockAt: 10,
    sold: 96,
  },
  {
    id: "P-003",
    name: "Silk Saree (Katan)",
    sku: "SRE-KTN-007",
    category: "Womenswear",
    price: 4800,
    cost: 3100,
    stock: 3,
    lowStockAt: 5,
    sold: 74,
  },
  {
    id: "P-004",
    name: "Leather Wallet (Brown)",
    sku: "WLT-LTR-002",
    category: "Accessories",
    price: 1200,
    cost: 620,
    stock: 45,
    lowStockAt: 15,
    sold: 210,
  },
  {
    id: "P-005",
    name: "Handmade Jute Bag",
    sku: "BAG-JUT-011",
    category: "Accessories",
    price: 550,
    cost: 260,
    stock: 8,
    lowStockAt: 20,
    sold: 182,
  },
  {
    id: "P-006",
    name: "Kids Frock Set",
    sku: "KDS-FRK-005",
    category: "Kids",
    price: 1200,
    cost: 720,
    stock: 31,
    lowStockAt: 10,
    sold: 64,
  },
  {
    id: "P-007",
    name: "Men's Sneakers",
    sku: "SNK-MEN-020",
    category: "Footwear",
    price: 2150,
    cost: 1400,
    stock: 2,
    lowStockAt: 8,
    sold: 58,
  },
  {
    id: "P-008",
    name: "Hijab Combo (3pc)",
    sku: "HJB-CMB-003",
    category: "Womenswear",
    price: 950,
    cost: 500,
    stock: 60,
    lowStockAt: 15,
    sold: 240,
  },
];

export const customers: Customer[] = [
  {
    id: "C-101",
    name: "Rifat Hasan",
    phone: "01712-345678",
    city: "Dhaka",
    orders: 6,
    totalSpent: 11400,
    lastOrder: "2026-07-11",
  },
  {
    id: "C-102",
    name: "Nusrat Jahan",
    phone: "01911-882140",
    city: "Dhaka",
    orders: 4,
    totalSpent: 9600,
    lastOrder: "2026-07-11",
  },
  {
    id: "C-103",
    name: "Tanvir Ahmed",
    phone: "01615-771230",
    city: "Chattogram",
    orders: 3,
    totalSpent: 5200,
    lastOrder: "2026-07-10",
  },
  {
    id: "C-104",
    name: "Sabrina Akter",
    phone: "01521-664422",
    city: "Sylhet",
    orders: 8,
    totalSpent: 14800,
    lastOrder: "2026-07-10",
  },
  {
    id: "C-105",
    name: "Farzana Islam",
    phone: "01717-990022",
    city: "Dhaka",
    orders: 12,
    totalSpent: 38400,
    lastOrder: "2026-07-09",
  },
  {
    id: "C-106",
    name: "Mahmudul Karim",
    phone: "01811-556677",
    city: "Bogura",
    orders: 2,
    totalSpent: 2400,
    lastOrder: "2026-07-10",
  },
  {
    id: "C-107",
    name: "Shirin Sultana",
    phone: "01611-334455",
    city: "Mymensingh",
    orders: 5,
    totalSpent: 7100,
    lastOrder: "2026-07-08",
  },
];

export const expenses: Expense[] = [
  {
    id: "E-001",
    title: "Facebook Ads — July W1",
    category: "Ads",
    amount: 8500,
    date: "2026-07-07",
    note: "Boost Panjabi campaign",
  },
  {
    id: "E-002",
    title: "Pathao Courier Bill",
    category: "Courier",
    amount: 6200,
    date: "2026-07-06",
  },
  {
    id: "E-003",
    title: "Poly Bags + Bubble Wrap",
    category: "Packaging",
    amount: 1450,
    date: "2026-07-05",
  },
  {
    id: "E-004",
    title: "Packer Salary",
    category: "Salary",
    amount: 9000,
    date: "2026-07-01",
  },
  {
    id: "E-005",
    title: "Instagram Ads — Reels",
    category: "Ads",
    amount: 3200,
    date: "2026-07-04",
  },
];

export const dashboardStats = {
  totalSales: 348000,
  netProfit: 121000,
  pendingOrders: 14,
  pendingCOD: 46200,
  lowStock: 3,
  totalCustomers: 1284,
};
