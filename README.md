# Amazon Orders Management System

A Node.js backend application for managing Amazon orders with Express and MongoDB.

## Backend Folder Structure

```
backend/
├── package.json              # Project dependencies and scripts
├── package-lock.json         # Dependency lock file
├── server.js                 # Application entry point
└── src/
    ├── app.js                # Express app configuration
    ├── config/
    │   └── db.js             # Database connection configuration
    ├── controllers/          # Business logic for handling requests
    ├── middlewares/          # Custom middleware functions
    ├── models/               # MongoDB schema definitions
    ├── routes/               # API endpoint definitions
    └── services/             # Reusable business logic services
```

## Folder Descriptions

### `/backend`
- **package.json** - Defines project metadata, dependencies (express, mongoose, nodemon, dotenv), and npm scripts
- **server.js** - Main entry point that starts the Express server
- **src/** - Source code directory containing all application logic

### `/src`
- **app.js** - Express application setup, middleware configuration, and route integration
- **config/db.js** - MongoDB connection setup and configuration
- **controllers/** - Request handlers that process API calls and return responses
- **middlewares/** - Custom middleware for authentication, validation, error handling, etc.
- **models/** - Mongoose schemas and models for MongoDB documents
- **routes/** - Route definitions that map HTTP methods and paths to controllers
- **services/** - Business logic separated from routes for reusability

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB

### Installation

```bash
cd backend
npm install
```

### Environment Variables
Create a `.env` file in the backend directory:
```
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
```

### Running the Server

**Development mode** (with auto-restart):
```bash
npm run dev
```

**Production mode**:
```bash
npm start
```

## Technologies Used
- **Express.js** - Web framework
- **Mongoose** - MongoDB object modeling
- **Nodemon** - Development auto-reload
- **dotenv** - Environment variable management
- **Axios** - HTTP client (used for API testing)

## Project Architecture
This project follows the MVC (Model-View-Controller) pattern with an additional service layer for a clean, production-ready structure.

## API Documentation (Base URL: `/api/v1/orders`)

### Order Management (CRUD)
- **GET** `/` - Retrieve all orders (Paginated: `?page=1&limit=10`)
- **POST** `/` - Create a new order
- **GET** `/:orderId` - Get a single order by `OrderID`
- **PUT** `/:orderId` - Full replace of an order
- **PATCH** `/:orderId` - Partial update of an order
- **DELETE** `/:orderId` - Permanent deletion of an order

### Specialized Endpoints
- **GET** `/:orderId/exists` - Check if an order exists (`{ exists: true/false }`)
- **GET** `/:orderId/summary` - Get brief summary (OrderID, Customer, Product, Amount, Status)
- **GET** `/:orderId/items` - Get item details only
- **GET** `/:orderId/history` - Get `statusHistory` array
- **GET** `/:orderId/invoice` - Get financial and shipping details for invoicing
- **PATCH** `/:orderId/archive` - Set `isArchived` to `true`
- **PATCH** `/:orderId/restore` - Set `isArchived` to `false`
- **POST** `/:orderId/cancel` - Cancel order and update status history
- **POST** `/:orderId/duplicate` - Clone an existing order with a new unique ID

### Advanced Search API (Base URL: `/api/v1/orders/search`)
All search routes require a `q` query parameter and support pagination (`page`, `limit`).

- **GET** `/` - Global search across all fields
- **GET** `/customer` - Search by Customer Name
- **GET** `/product` - Search by Product Name
- **GET** `/category` - Search by Category
- **GET** `/brand` - Search by Brand
- **GET** `/status` - Search by Order Status
- **GET** `/payment` - Search by Payment Method
- **GET** `/location` - Search across City, State, and Country
- **GET** `/date` - Search by Order Date (partial matches supported)
- **GET** `/tracking` - Search by OrderID (Tracking Reference)
- **GET** `/fuzzy` - Fuzzy search across key fields (matches similar spellings)
- **GET** `/autocomplete?q=...` - Get up to 10 unique suggestions starting with query
- **GET** `/highlight` - Search results with matching text wrapped in `<mark>` tags
- **GET** `/recent` - Get last 10 unique search queries (in-memory)
- **GET** `/popular` - Get top 10 most frequent search queries (in-memory)

### Filtering API (Base URL: `/api/v1/orders/filter`)
All filter routes support pagination (`page`, `limit`).

- **GET** `/status?type=...` - Filter by Order Status (exact match)
- **GET** `/payment?method=...` - Filter by Payment Method
- **GET** `/category?name=...` - Filter by Category
- **GET** `/brand?name=...` - Filter by Brand
- **GET** `/price?min=...&max=...` - Filter by TotalAmount range (numeric conversion handled)
- **GET** `/date?start=...&end=...` - Filter by OrderDate range (YYYY-MM-DD)
- **GET** `/country?name=...` - Filter by Country
- **GET** `/state?name=...` - Filter by State
- **GET** `/city?name=...` - Filter by City
- **GET** `/high-value?amount=...` - Filter orders where TotalAmount >= amount (default: 1000)
- **GET** `/discounted` - Filter orders where Discount > 0
- **GET** `/cancelled` - Filter orders where OrderStatus = "Cancelled"
- **GET** `/refunded` - Filter orders where OrderStatus = "Refunded"
- **GET** `/shipped` - Filter orders where OrderStatus = "Shipped"
- **GET** `/delivered` - Filter orders where OrderStatus = "Delivered"

### Pagination & Listing API (Base URL: `/api/v1/orders`)
Specialized endpoints for advanced listing and pagination.

- **GET** `/paged?page=1&limit=50` - Paged listing with support for optional query filters (`status`, `category`, `brand`, `country`, `city`, `state`)
- **GET** `/infinite?page=1` - Infinite scroll format (returns `nextPage` and `hasMore`)
- **GET** `/recent?page=1&limit=5` - Latest orders sorted by date descending
- **GET** `/cancelled` - Paginated list of cancelled orders
- **GET** `/refunded` - Paginated list of refunded orders
- **GET** `/customer/:customerId` - All orders for a specific customer ID
- **GET** `/product/:productId` - All orders for a specific product ID

### Sorting API (Base URL: `/api/v1/orders/sort`)
Advanced sorting endpoints with pagination support. Numeric fields use aggregation for accurate sorting.

- **GET** `/highest-value` - Orders sorted by `TotalAmount` descending
- **GET** `/lowest-value` - Orders sorted by `TotalAmount` ascending
- **GET** `/latest` - Orders sorted by `OrderDate` descending
- **GET** `/oldest` - Orders sorted by `OrderDate` ascending
- **GET** `/most-items` - Orders sorted by `Quantity` descending
- **GET** `/least-items` - Orders sorted by `Quantity` ascending
- **GET** `/discount` - Orders sorted by `Discount` descending

### Query Parameter Sorting
The base endpoint `GET /api/v1/orders` now supports a `sort` query parameter:
- `?sort=amount` / `-amount` (TotalAmount)
- `?sort=date` / `-date` (OrderDate)
- `?sort=status` (OrderStatus)
- `?sort=customer` (CustomerName)
- `?sort=city` (City)
- `?sort=payment` (PaymentMethod)

## Testing
A comprehensive test suite is included to verify all 45+ API routes.

### Run API Tests
Ensure the server is running on `http://localhost:3000` (or update `BASE_URL` in script), then run:
```bash
node test/route-checker.js
```

## Uniform Response Format
- **Success**: `{ success: true, message: "...", data: [...] }`
- **Error**: `{ success: false, message: "...", error: "..." }`
