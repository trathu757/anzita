LINK: https://anzita.vercel.app/

Anzita API Documentation
Tài liệu này hướng dẫn cách kiểm thử các API của dự án Anzita bằng Postman.

Cài đặt và Chạy Server
Cách 1: Sử dụng Python (Đã cài sẵn trên máy)
Nếu máy bạn chưa có Node.js, bạn có thể dùng Python để chạy server:
1. Mở Terminal tại thư mục dự án.
2. Chạy lệnh: `python3 server.py`
3. Server sẽ chạy tại: `http://localhost:3000`

Cách 2: Sử dụng Node.js (Khuyên dùng cho Backend)
1. Mở Terminal tại thư mục dự án.
2. Chạy lệnh: `npm install`
3. Chạy lệnh: `npm start`
4. Server sẽ chạy tại: `http://localhost:3000`

---

Các API Endpoints
1. Lấy danh sách món ăn (GET All Dishes)
- URL: `http://localhost:3000/api/dishes`
- Method: `GET`
- Phản hồi mong đợi (200 OK):
  ```json
  [
    {
      "id": "1",
      "name": "Trứng Chiên Thịt Bằm",
      ...
    }
  ]
  ```

2. Lấy chi tiết một món ăn (GET Single Dish)
- URL: `http://localhost:3000/api/dishes/1`
- Method: `GET`
- Phản hồi (200 OK): Đối tượng món ăn.
- Phản hồi (404 Not Found): Nếu không tìm thấy ID.

3. Thêm món ăn mới (POST Create Dish)
- URL: `http://localhost:3000/api/dishes`
- Method: `POST`
- Body (JSON):
  ```json
  {
    "name": "Phở Bò",
    "recipe": "Ninh xương ống 8 tiếng...",
    "info": "Món ăn truyền thống Việt Nam"
  }
  ```
- Phản hồi (201 Created): Trả về món ăn vừa tạo kèm ID mới.

4. Cập nhật món ăn (PUT Update Dish)
- URL: `http://localhost:3000/api/dishes/1`
- Method: `PUT`
- Body (JSON):
  ```json
  {
    "name": "Trứng Chiên Thịt Bằm (Cập nhật)",
    "recipe": "Công thức mới..."
  }
  ```
- Phản hồi (200 OK): Trả về món ăn sau khi cập nhật.

5. Xóa món ăn (DELETE Dish)
- URL: `http://localhost:3000/api/dishes/1`
- Method: `DELETE`
- Phản hồi (200 OK): `{"message": "Dish deleted"}`

---

Gợi ý cho Tester
- Test Case 1: Kiểm tra lấy danh sách khi server mới chạy (Happy Path).
- Test Case 2: Thêm món ăn với dữ liệu trống (Kiểm tra validation - server hiện tại chưa validate kỹ, bạn có thể báo bug!).
- Test Case 3: Truy cập ID không tồn tại (Kiểm tra lỗi 404).
- Test Case 4: Xóa một món ăn rồi kiểm tra lại danh sách xem đã mất chưa.
