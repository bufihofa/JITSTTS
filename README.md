# JITSTTS - Hệ thống Quản lý kho hàng

- [JITSTTS - Hệ thống Quản lý Tồn kho](#jitstts---hệ-thống-quản-lý-tồn-kho)
  - [Backend (Sails.js)](#backend-sailsjs)
    - [Cài đặt môi trường](#cài-đặt-môi-trường)
    - [Thiết lập `.env`](#thiết-lập-env)
    - [Chạy ứng dụng](#chạy-ứng-dụng)
    - [Models](#models)
    - [API](#tài-liệu-api)
      - [1. Xác thực](#1-xác-thực)
      - [2. Sản phẩm](#2-sản-phẩm)
  - [Frontend (React + Vite)](#frontend-react--vite)
    - [Cài đặt môi trường](#cài-đặt-môi-trường-1)
    - [Run](#chạy-ứng-dụng-1)
    - [Build](#build-ứng-dụng)
---
# DEMO APP
- [Sails + react + mysql](https://jitscms.up.railway.app/)
- [Sails + react + mongodb](https://jitscms.onrender.com/)

---

# Backend (Sails.js)

## Cài đặt môi trường

1.  **Yêu cầu:**
    *   Node.js
    *   NPM

2.  **Cài đặt:**
    *   Di chuyển vào thư mục backend: `cd backend`
    *   Cài đặt các gói phụ thuộc: `npm install`

## Thiết lập `.env`

Tạo một file `.env` trong thư mục `backend` và điền các biến môi trường cần thiết.

**Template:**
```env
# backend/.env

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRATION=7d

# Email của quản trị viên, tài khoản này sẽ có quyền admin khi đăng ký
ADMIN_EMAIL=admin@example.com

# DB sử dụng, mongodb || mysql
DB_TYPE=mongodb

MYSQL_URI=
MONGODB_URI=
```

## Chạy ứng dụng

Để khởi động máy chủ backend, chạy lệnh sau:

```sh
sails lift
```

Hoặc sử dụng `node app.js` cho môi trường production.
## Models
*   **`User`** (`api/models/User.js`)
    *   `username` (String): Tên đăng nhập, là duy nhất.
    *   `email` (String): Email người dùng, là duy nhất.
    *   `password` (String): Mật khẩu đã được mã hóa.
    *   `role` (String): Vai trò của người dùng (`'admin'` hoặc `'user'`). Mặc định là `'user'`.
    *   `products` (Collection): Liên kết tới các sản phẩm do người dùng này tạo.
    *   `activities` (Collection): Liên kết tới các hoạt động của người dùng này.

*   **`Product`** (`api/models/Product.js`)
    *   `name` (String, optional): Tên sản phẩm.
    *   `price` (Number, optional): Giá sản phẩm.
    *   `quantity` (Number): Số lượng tồn kho (mặc định bằng `0`).
    *   `tag` (String, optional): Thẻ/danh mục của sản phẩm.
    *   `data` (JSON): Tập các trường động do người dùng cấu hình. Các khóa trong `data` được merge vào phản hồi API để thuận tiện truy cập.

*   **`Activity`** (`api/models/Activity.js`)
    *   `type` (String): Loại hành động (ví dụ: `'CREATE'`, `'UPDATE'`, `'DELETE'`).
    *   `content` (String): Mô tả chi tiết về hoạt động.
    *   `detail` (json): Danh sách các sản phẩm sau khi thực hiện hoạt động.
    *   `oldDetail` (json): Danh sách các sản phẩm trước khi thực hiện hoạt động.
    *   `createdAt` (number): Thời gian thực hiện hoạt động.
    *   `owner` (Model): Liên kết tới model `User`, cho biết ai là người thực hiện hoạt động.

## API

Tất cả các API đều yêu cầu `Authorization: Bearer <token>` trong header sau khi đăng nhập, trừ các API xác thực.

### 1. Xác thực

*   **`POST /api/auth/register`**: Đăng ký người dùng mới.
    *   **Controller**: [`backend/api/controllers/auth/register.js`](backend/api/controllers/auth/register.js)
    *   **Request Body**:
        ```json
        {
          "username": "string",
          "email": "string",
          "password": "string"
        }
        ```
    *   **Response (Success)**:
        ```json
        {
          "user": { 
            "username": "string", 
            "role": "string" 
          },
          "token": "string"
        }
        ```

*   **`POST /api/auth/login`**: Đăng nhập.
    *   **Controller**: [`backend/api/controllers/auth/login.js`](backend/api/controllers/auth/login.js)
    *   **Request Body**:
        ```json
        {
          "username": "string",
          "password": "string"
        }
        ```
    *   **Response (Success)**:
        ```json
        {
          "user": { 
            "username": "string", 
            "role": "string" 
          },
          "token": "string"
        }
        ```

*   **`POST /api/auth/google`**: Đăng nhập bằng Google.
    *   **Controller**: [`backend/api/controllers/auth/google.js`](backend/api/controllers/auth/google.js)
    *   **Request Body**:
        ```json
        {
          "token": "google_oauth_token"
        }
        ```
    *   **Response (Success)**:
        ```json
        {
          "user": { 
            "username": 
            "string", 
            "role": "string" 
          },
          "token": "string",
          "message": "string"
        }
        ```

### 2. Sản phẩm

*   **`GET /api/product/list`**: Lấy danh sách tất cả sản phẩm.
    *   **Controller**: [`backend/api/controllers/product/list.js`](backend/api/controllers/product/list.js)
    *   **Header**: `Authorization: Bearer <token>`
    *   **Response (Success)**:
        ```json
        {
          "products": [
            { 
              "id": "number", 
              "name": "string", 
              "price": "number", 
              "quantity": "number", 
              "tag": "string", 
              "owner": "string" 
            }
          ]
        }
        ```
*   **`GET /api/product/search`**: Tìm kiếm và phân trang sản phẩm.
    *   **Controller**: [`backend/api/controllers/product/search.js`](backend/api/controllers/product/search.js)
    
    *   **Header**: `Authorization: Bearer <token>`
    *   **Query Params**: `page`, `limit`, `searchTerm`, `sortBy`, `sortDirection`, `minPrice`, `maxPrice`, `minQuantity`, `maxQuantity`.
    * *Example*
    ```  
    /api/product/search?page=1&limit=10&searchTerm=Socola&sortBy=name&sortDirection=asc&minPrice=0&maxPrice=20000&minQuantity=0&maxQuantity=100
    ```
    *   **Response (Success)**:
        ```json
        {
          "message": "string",
          "data": [
            {
              "id": "number",
              "name": "string",
              "price": "number",
              "quantity": "number",
              "tag": "string",
              "data": { "customField": "any" },
              "customField": "any"
            }
          ],
          "pagination": {
            "page": "number",
            "limit": "number",
            "totalPages": "number",
            "totalItems": "number"
          }
        }
        ```

*   **`POST /api/product/create`**: Tạo sản phẩm mới.
    *   **Controller**: [`backend/api/controllers/product/create.js`](backend/api/controllers/product/create.js)
    *   **Header**: `Authorization: Bearer <token>`
    *   **Request Body**:
        ```json
        {
          "products": [
            {
              "name": "string",
              "price": "number",
              "quantity": "number",
              "tag": "string",
              "data": { "sku": "string" },
              "customField": "any"
            }
          ]
        }
        ```
    *   **Ghi chú**: Các trường tùy chỉnh có thể được gửi trực tiếp (ví dụ `"customField"`) hoặc gói trong `data`. API sẽ lưu trữ toàn bộ và trả về các khóa đó ở cả cấp cao nhất lẫn trong `data`.
    *   **Response (Success)**:
        ```json
        {
          "message": "string",
          "products": [ /* array of created products */ ]
        }
        ```

*   **`PATCH /api/product/update`**: Cập nhật sản phẩm.
    *   **Controller**: [`backend/api/controllers/product/update.js`](backend/api/controllers/product/update.js)
    *   **Header**: `Authorization: Bearer <token>`
    *   **Request Body**:
        ```json
        {
          "products": [
            {
              "id": "number",
              "name": "string",
              "price": "number",
              "quantity": "number",
              "tag": "string",
              "data": { "sku": "string" },
              "customField": "any"
            }
          ]
        }
        ```
    *   **Response (Success)**:
        ```json
        {
          "message": "string",
          "finalProducts": [ /* array of updated products */ ],
          "failedProducts": [ /* array of failed products */ ]
        }
        ```

*   **`DELETE /api/product/delete`**: Xóa sản phẩm.
    *   **Controller**: [`backend/api/controllers/product/delete.js`](backend/api/controllers/product/delete.js)
    *   **Header**: `Authorization: Bearer <token>`
    *   **Request Body**:
        ```json
        {
          "products": [ "productId1", "productId2" ]
        }
        ```
    *   **Response (Success)**:
        ```json
        {
          "message": "string",
          "deletedProducts": [ /* array of deleted products */ ]
        }
        ```

*   **`GET /api/product/data`**: Lấy dữ liệu tổng quan cho dashboard.
    *   **Controller**: [`backend/api/controllers/product/data.js`](backend/api/controllers/product/data.js)
    *   **Response (Success)**:
        ```json
        {
          "distribution": [ 
            { 
              "name": "string", 
              "value": "number" 
            } 
          ],
          "lowStockProducts": [ 
            { 
              "id": "number", 
              "name": "string", 
              "quantity": "number" 
            } 
          ],
          "activities": [ /* array of recent activities */ ]
        }
        ```

---

# Frontend (React + Vite)

## Cài đặt môi trường

1.  **Yêu cầu:**
    *   Node.js
    *   NPM

2.  **Cài đặt:**
    *   Di chuyển vào thư mục frontend: `cd frontend`
    *   Cài đặt các gói phụ thuộc: `npm install`


## Chạy ứng dụng

Để khởi động máy chủ phát triển frontend, chạy lệnh:

```sh
npm run dev
```

## Build ứng dụng

Để build ứng dụng cho môi trường production, chạy lệnh:

```sh
npm run build
```

Kết quả build sẽ nằm trong thư mục `dist`.