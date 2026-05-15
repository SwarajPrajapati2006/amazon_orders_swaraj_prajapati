const axios = require("axios");

const BASE_URL = "http://localhost:3000/api/v1/orders";
const SEARCH_URL = "http://localhost:3000/api/v1/orders/search";
const FILTER_URL = "http://localhost:3000/api/v1/orders/filter";

const testOrder = {
  OrderID: "ORD-TEST-001",
  OrderDate: "2024-01-01",
  CustomerID: "CUST000001",
  CustomerName: "Test User",
  ProductID: "P00001",
  ProductName: "Test Product",
  Category: "Electronics",
  Brand: "TestBrand",
  Quantity: "1",
  UnitPrice: "500.00",
  Discount: "0.0",
  Tax: "0.0",
  ShippingCost: "10.00",
  TotalAmount: "510.00",
  PaymentMethod: "UPI",
  OrderStatus: "Pending",
  City: "Mumbai",
  State: "Maharashtra",
  Country: "India",
  SellerID: "SELL00001"
};

let passed = 0;
let failed = 0;
const failures = [];

const logResult = (success, method, endpoint, status, messageOrError) => {
  if (success) {
    passed++;
    console.log(`✅ PASS | ${method} ${endpoint} | Status: ${status} | Message: "${messageOrError}"`);
  } else {
    failed++;
    failures.push(`${method} ${endpoint}`);
    console.log(`❌ FAIL | ${method} ${endpoint} | Status: ${status} | Error: "${messageOrError}"`);
  }
};

const delay = () => new Promise(res => setTimeout(res, 100));

async function runTests() {
  console.log("Starting Route Tests...\n");

  // SECTION 1 - BASIC CRUD ROUTES
  try {
    const r1 = await axios.get(`${BASE_URL}`);
    logResult(r1.data.success, "GET", "/api/v1/orders", r1.status, r1.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r2 = await axios.get(`${BASE_URL}/ORD0000001`);
    logResult(r2.data.success && r2.data.data.OrderID === "ORD0000001", "GET", "/api/v1/orders/ORD0000001", r2.status, r2.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders/ORD0000001", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r3 = await axios.post(`${BASE_URL}`, testOrder);
    logResult(r3.data.success, "POST", "/api/v1/orders", r3.status, r3.data.message);
  } catch (e) { logResult(false, "POST", "/api/v1/orders", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r4 = await axios.put(`${BASE_URL}/ORD-TEST-001`, { ...testOrder, CustomerName: "Updated User" });
    logResult(r4.data.success, "PUT", "/api/v1/orders/ORD-TEST-001", r4.status, r4.data.message);
  } catch (e) { logResult(false, "PUT", "/api/v1/orders/ORD-TEST-001", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r5 = await axios.patch(`${BASE_URL}/ORD-TEST-001`, { City: "Delhi" });
    logResult(r5.data.success, "PATCH", "/api/v1/orders/ORD-TEST-001", r5.status, r5.data.message);
  } catch (e) { logResult(false, "PATCH", "/api/v1/orders/ORD-TEST-001", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r6 = await axios.get(`${BASE_URL}/ORD-TEST-001/exists`);
    logResult(r6.data.success && r6.data.data.exists === true, "GET", "/api/v1/orders/ORD-TEST-001/exists", r6.status, r6.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders/ORD-TEST-001/exists", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r7 = await axios.get(`${BASE_URL}/ORD-TEST-001/summary`);
    logResult(r7.data.success, "GET", "/api/v1/orders/ORD-TEST-001/summary", r7.status, r7.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders/ORD-TEST-001/summary", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r8 = await axios.get(`${BASE_URL}/ORD-TEST-001/items`);
    logResult(r8.data.success, "GET", "/api/v1/orders/ORD-TEST-001/items", r8.status, r8.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders/ORD-TEST-001/items", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r9 = await axios.get(`${BASE_URL}/ORD-TEST-001/history`);
    logResult(r9.data.success, "GET", "/api/v1/orders/ORD-TEST-001/history", r9.status, r9.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders/ORD-TEST-001/history", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r10 = await axios.patch(`${BASE_URL}/ORD-TEST-001/archive`);
    logResult(r10.data.success, "PATCH", "/api/v1/orders/ORD-TEST-001/archive", r10.status, r10.data.message);
  } catch (e) { logResult(false, "PATCH", "/api/v1/orders/ORD-TEST-001/archive", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r11 = await axios.patch(`${BASE_URL}/ORD-TEST-001/restore`);
    logResult(r11.data.success, "PATCH", "/api/v1/orders/ORD-TEST-001/restore", r11.status, r11.data.message);
  } catch (e) { logResult(false, "PATCH", "/api/v1/orders/ORD-TEST-001/restore", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r12 = await axios.post(`${BASE_URL}/ORD-TEST-001/cancel`);
    logResult(r12.data.success, "POST", "/api/v1/orders/ORD-TEST-001/cancel", r12.status, r12.data.message);
  } catch (e) { logResult(false, "POST", "/api/v1/orders/ORD-TEST-001/cancel", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r13 = await axios.post(`${BASE_URL}/ORD-TEST-001/duplicate`);
    logResult(r13.data.success, "POST", "/api/v1/orders/ORD-TEST-001/duplicate", r13.status, r13.data.message);
  } catch (e) { logResult(false, "POST", "/api/v1/orders/ORD-TEST-001/duplicate", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r14 = await axios.get(`${BASE_URL}/ORD-TEST-001/invoice`);
    logResult(r14.data.success, "GET", "/api/v1/orders/ORD-TEST-001/invoice", r14.status, r14.data.message);
  } catch (e) { logResult(false, "GET", "/api/v1/orders/ORD-TEST-001/invoice", e.response?.status || 500, e.message); }
  await delay();

  try {
    const r15 = await axios.delete(`${BASE_URL}/ORD-TEST-001`);
    logResult(r15.data.success, "DELETE", "/api/v1/orders/ORD-TEST-001", r15.status, r15.data.message);
    const list = await axios.get(BASE_URL);
    const dup = list.data.data.find(o => o.OrderID.includes("ORD-TEST-001-COPY"));
    if (dup) await axios.delete(`${BASE_URL}/${dup.OrderID}`);
  } catch (e) { logResult(false, "DELETE", "/api/v1/orders/ORD-TEST-001", e.response?.status || 500, e.message); }
  await delay();

  // SECTION 2 - SEARCH ROUTES
  const searches = [
    { name: "Global", path: "?q=laptop" },
    { name: "Customer", path: "/customer?q=Vihaan" },
    { name: "Product", path: "/product?q=Drone" },
    { name: "Category", path: "/category?q=Books" },
    { name: "Brand", path: "/brand?q=BrightLux" },
    { name: "Status", path: "/status?q=Delivered" },
    { name: "Payment", path: "/payment?q=Debit" },
    { name: "Location", path: "/location?q=Washington" },
    { name: "Date", path: "/date?q=2023-01" },
    { name: "Tracking", path: "/tracking?q=ORD0000001" },
    { name: "Fuzzy", path: "/fuzzy?q=headfone" },
    { name: "Autocomplete", path: "/autocomplete?q=Dro" },
    { name: "Highlight", path: "/highlight?q=Drone" },
    { name: "Recent", path: "/recent" },
    { name: "Popular", path: "/popular" }
  ];

  for (let i = 0; i < searches.length; i++) {
    const s = searches[i];
    try {
      const r = await axios.get(`${SEARCH_URL}${s.path}`);
      logResult(r.data.success, "GET", `/search${s.path}`, r.status, r.data.message || "Success");
    } catch (e) { logResult(false, "GET", `/search${s.path}`, e.response?.status || 500, e.message); }
    await delay();
  }

  // SECTION 3 - FILTER ROUTES
  const filters = [
    { name: "Status", path: "/status?type=Delivered" },
    { name: "Payment", path: "/payment?method=Debit Card" },
    { name: "Category", path: "/category?name=Books" },
    { name: "Brand", path: "/brand?name=BrightLux" },
    { name: "Price", path: "/price?min=100&max=500" },
    { name: "Date", path: "/date?start=2023-01-01&end=2023-12-31" },
    { name: "Country", path: "/country?name=India" },
    { name: "State", path: "/state?name=DC" },
    { name: "City", path: "/city?name=Washington" },
    { name: "HighValue", path: "/high-value?amount=300" },
    { name: "Discounted", path: "/discounted" },
    { name: "Cancelled", path: "/cancelled" },
    { name: "Refunded", path: "/refunded" },
    { name: "Shipped", path: "/shipped" },
    { name: "Delivered", path: "/delivered" }
  ];

  for (let i = 0; i < filters.length; i++) {
    const f = filters[i];
    try {
      const r = await axios.get(`${FILTER_URL}${f.path}`);
      logResult(r.data.success, "GET", `/filter${f.path}`, r.status, r.data.message || "Success");
    } catch (e) { logResult(false, "GET", `/filter${f.path}`, e.response?.status || 500, e.message); }
    await delay();
  }

  console.log("\n==========================================");
  console.log(`TOTAL: 45 | ✅ PASSED: ${passed} | ❌ FAILED: ${failed}`);
  console.log("==========================================");
  if (failures.length > 0) {
    console.log("\nFAILED ROUTES:");
    failures.forEach(f => console.log(`- ${f}`));
  }
}

runTests();
