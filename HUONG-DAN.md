# Diệu Thân · Bảng nhỏ — E-ink Creative Studio

*Little things, little joys – Những điều nhỏ bé, những niềm vui nhỏ*

Trang: https://trinhthidieuthan.github.io/nhan-eink/

## Các tệp

| Tệp | Vai trò |
|---|---|
| `index.html` | Trang chính: Bluetooth, các mẫu cũ, xem trước, gửi, tự cập nhật, hẹn giờ tắt/mở |
| `eink-kit.js` | Bộ vẽ e-ink: chữ tiếng Việt, hình cơ bản, 5 nhân vật (mèo, thỏ, gấu, bé ma, cô gái chibi) |
| `collections.js` | 47 mẫu mới: Little Mood, Emotional Battery, Pixel World, Focus & Work, Little Goals |
| `studio.js` | Studio sáng tạo (thiết kế tự do) |
| `shell.js`, `shell.css` | Khung 5 mục, Yêu thích, Gần đây, Lịch sử gửi, Sao lưu |
| `index-v1.html` | **Bản cũ để quay lại** nếu cần |
| `dua-sao.html` | Vy Viên yêu thương (không đổi) |

## Cập nhật lên GitHub

1. Vào `github.com/trinhthidieuthan/nhan-eink` → **Add file → Upload files**.
2. Kéo các tệp ở bảng trên vào. Chờ tất cả tệp hiện đủ trong danh sách.
3. Bấm **Commit changes**. Chờ 1–2 phút rồi tải lại trang (trên điện thoại: kéo xuống để làm mới).

**Quay lại bản cũ:** mở `…/nhan-eink/index-v1.html`. Dữ liệu dùng chung nên không mất gì. Muốn bản cũ làm trang chính thì tải `index-v1.html` về, đổi tên thành `index.html` rồi tải lên lại.

## Đã làm xong trong đợt này

- Khung mới gồm 5 mục: Trang chủ, Bộ sưu tập, Studio, Yêu thích, Cài đặt. Trên điện thoại có thanh điều hướng ở đáy. Dùng đúng bảng màu và phông chữ đã chọn.
- **Trang chủ**:
  - thương hiệu, trạng thái kết nối, nút chọn 2.13″/2.9″;
  - xem trước đúng điểm ảnh, nút gửi và nút tải PNG;
  - danh sách mẫu dùng gần đây và các bộ sưu tập.
- **47 mẫu mới** có nhân vật đổi biểu cảm và tư thế. Chọn mẫu là sửa được ngay, nội dung tự lưu.
- **Studio sáng tạo**:
  - Phần tử: chữ (phông, cỡ, độ đậm, căn), ảnh (phóng to, dịch, kéo trong khung, sáng, tương phản, 4 kiểu chấm e-ink), nhân vật, 15 hình dán, giờ, ngày (có âm lịch), lịch tháng, thanh tiến độ, pin, danh sách việc, khung.
  - Chỉnh sửa: kéo thả, kéo góc đỏ để đổi cỡ, căn sáu hướng, đảo màu từng khối hoặc cả màn, hoàn tác/làm lại (có Ctrl+Z), nhân bản, lên trên/xuống dưới, nhập toạ độ chính xác.
  - Bố cục nhanh: ảnh trái·giờ phải, giờ trái·ảnh phải, đồng hồ giữa, hai nửa ngang, hai nửa dọc, toàn màn, tự do.
  - Lưu, lưu thành bản mới, mở lại, nhân bản, xoá thiết kế.
- **Yêu thích**: thả tim mẫu; danh sách thiết kế của tôi.
- **Cài đặt**:
  - hiển thị (đỏ, viền, cỡ màn), Bluetooth và nhật ký;
  - hẹn giờ tắt/mở màn, lịch sử gửi;
  - sao lưu ra tệp và khôi phục từ tệp.
- **Lưu trên trình duyệt**, không cần đăng nhập: nội dung từng mẫu, yêu thích, gần đây, thiết kế, lịch sử gửi, cỡ màn, cài đặt.
- **Chức năng cũ giữ nguyên**: giao thức Bluetooth (mã không đổi một dòng), gửi ảnh, gửi kèm đồng hồ tự chạy, đồng hồ/lịch của máy, tự cập nhật, hẹn giờ tắt/mở, xuất PNG.

## Cần phần mềm (firmware) đồng hồ hỗ trợ — chưa làm

Trang chỉ gửi **một ảnh tĩnh** hoặc bật các chế độ firmware đã có (đồng hồ, lịch, “đồng hồ và ảnh”). Những thứ sau cần firmware mới, nên trang **không giả lập**:

- Thú cưng ảo, khu vườn lớn dần: cần lưu trạng thái và tự vẽ lại trên đồng hồ.
- Nhân vật tự đổi hoạt động theo giờ khi **không** mở trang. Hiện nay chỉ làm được khi trang đang mở và bật “Tự cập nhật”.
- Giờ tự chạy **bên trong** một thiết kế Studio. Hiện có giờ tự chạy ở cột phải 102 px qua chế độ 0x83. Giờ trong Studio là giờ lúc gửi.
- Hoạt ảnh, nút bấm trên màn, cảm biến.

## Thử nhanh và xử lý lỗi

- **Không thấy màn:** dùng Chrome/Edge trên máy tính hoặc Android, Bluefy trên iPhone. Đưa đồng hồ lại gần rồi bấm nút trên đồng hồ cho nó thức dậy. Xem *Cài đặt → Bluetooth → Nhật ký*.
- **Màn 2.9″ báo “chưa sẵn sàng”:** ngắt kết nối, kết nối lại rồi gửi lại.
- **Ảnh nhạt hoặc đậm quá:** trong Studio, chọn ảnh rồi chỉnh *Độ sáng*, *Tương phản*. Thử kiểu chấm *Atkinson* cho ảnh chân dung.
- **Báo “bộ nhớ đầy”:** xoá bớt thiết kế có ảnh, hoặc tải bản sao lưu rồi dọn dẹp.
- **Chuyển sang máy khác:** *Cài đặt → Tải bản sao lưu*. Trên máy mới chọn *Khôi phục từ tệp…*.
- **Trang hiển thị lạ sau khi cập nhật:** tải lại trang. Nếu vẫn lỗi, mở `index-v1.html` và báo lại.

## Đợt sau

- Các bộ sưu tập: Little Family, Slow Living, Creative Clock, Special Days, Fun & Random (có QR lời nhắn bí mật).
- Thêm hoạt động theo giờ cho mèo, thỏ, gấu, bé ma. Chọn và đặt tên nhân vật yêu thích.
