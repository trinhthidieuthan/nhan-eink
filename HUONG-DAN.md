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
| `overlay.js` | Lớp ngày giờ động đặt lên mọi mẫu |
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

## Lớp ngày giờ động (Dynamic DateTime Overlay)

Mọi mẫu đều có khối **🕒 Ngày giờ động** trong phần chỉnh sửa, kể cả tranh, tâm trạng, nhiệm vụ của bé, ảnh và Studio. Không cần đổi sang mẫu đồng hồ khác.

- **Vị trí**: 4 góc, giữa cạnh trên, giữa cạnh dưới, hoặc toạ độ X/Y tự chọn.
- **Định dạng**: `21:37` · `28/11` · `T7 28/11` · `28/11 · 21:37` · `T7 28/11 · 21:37` · hai dòng.
- **Tuỳ chỉnh**: cỡ chữ 8–44 px, độ đậm, màu đen hoặc đỏ, nền ô (có viền, không viền, chỉ chữ, đảo đen), khoảng cách tới mép 0–12 px.
- Mỗi mẫu giữ cài đặt riêng. Nút *Dùng cài đặt này cho mọi mẫu* áp dụng chung cho tất cả.
- **Lớp riêng**: ảnh nội dung không bị vẽ giờ vào. Trên web, giờ chỉ hiện ở lớp xem trước phía trên (có khung nét đứt).

### Hai cách cập nhật giờ

1. **Trang web làm mới** — dùng được ngay với mọi đồng hồ.
   - Lúc gửi, trang ghép ô giờ đúng thời điểm đó vào ảnh.
   - Bật **Tự cập nhật** thì trang tự gửi lại theo chu kỳ. Trang phải đang mở, Bluetooth trong tầm.
   - Mỗi lần gửi, toàn màn làm mới (khoảng 30 giây).
2. **Đồng hồ tự chạy (firmware)** — chỉ dùng được khi firmware hỗ trợ. Trang kiểm tra phiên bản khi kết nối và nói rõ giới hạn. Ở chế độ này, trang **không** gửi ô giờ lên màn.

### Firmware hiện có làm được gì

Theo mã của trang gốc `tanhoangphuc842002-rgb.github.io`, bản v62. Tôi chưa thử trên máy thật.

| Phiên bản firmware | Đồng hồ tự chạy kèm ảnh |
|---|---|
| Bản thường (2.13″ ≥ 40, 2.9″ ≥ 30) | Chỉ có “Đồng hồ và ảnh” (lệnh 0x83). Đồng hồ cố định ở **cột phải rộng 102 px**, ảnh 148×128 (2.9″: 194×128). |
| 250–255 | “Đồng hồ tranh” (chế độ 15). Tranh phủ toàn màn, ô giờ + ngày **cố định góc trên phải** 104×72 (2.9″: 120×80). |
| 256–261 | “Đồng hồ tranh”, ô giờ 104×48 (2.9″: 120×48) đặt được ở **4 góc**. |
| 262–300 | “Đồng hồ tranh”, **cột trái cố định** 72×128 (2.9″: 80×128), giờ đỏ và phút đen. |

**Kết luận:**

- Không firmware nào nhận vị trí giữa cạnh, toạ độ tuỳ ý, định dạng, cỡ chữ hay màu do người dùng chọn. Những thứ này firmware tự quyết.
- Giao thức Bluetooth không có lệnh “làm mới một vùng” do trang điều khiển.
- “Đồng hồ tranh” lưu ảnh vào bộ nhớ flash của đồng hồ qua một giao thức riêng có kiểm tra CRC. Trang này **chưa** cài giao thức đó, vì ghi flash sai có thể làm hỏng dữ liệu. Với firmware 256–261, trang có nút *Tải ảnh nền cho Đồng hồ tranh* để bạn đưa ảnh lên bằng trang gốc, chọn cùng góc.

### Đề xuất nâng cấp firmware

Mục tiêu: một ô giờ tự chạy, đặt ở bất kỳ đâu, không cần mở trang.

1. **Lệnh mới `0x36 SET_OVERLAY`**, lưu vào flash. Nội dung gói lệnh:
   - `x, y` (uint16), `w, h` (uint8);
   - `format` (6 kiểu như trên), `font_id`, `size`, `weight`;
   - `color` (0 đen / 1 đỏ), `bg` (0 trong suốt / 1 trắng / 2 trắng viền / 3 đen), `align`.
2. **Lưu ảnh nền** (2 mặt phẳng đen và đỏ, khoảng 4–9,5 KB) vào flash bằng cơ chế ô ảnh có CRC sẵn có. Đặt chế độ hiển thị mới, ví dụ `16 = ảnh + lớp giờ`.
3. **Mỗi phút**, firmware:
   - chép lại vùng `(x, y, w, h)` từ ảnh nền vào RAM màn;
   - vẽ chữ giờ bằng bộ phông có sẵn;
   - **làm mới cục bộ đen/trắng** chỉ vùng đó (SSD1680 / UC8151 có LUT partial);
   - cứ 30–60 phút làm mới toàn màn một lần để chống bóng mờ.
4. **Chữ đỏ** không làm mới cục bộ được trên màn 3 màu: firmware nên ép ô giờ màu đen, hoặc với màu đỏ thì làm mới toàn màn mỗi giờ.
5. **Báo khả năng** qua gói cấu hình, ví dụ một bit “overlay” và kích thước tối đa. Trang chỉ bật tuỳ chọn firmware khi nhận được bit này.

Để làm phần này cần **mã nguồn firmware** đang chạy trên đồng hồ của bạn: bản gốc EPD-nRF5 hay bản sửa của trang gốc. Khi có mã nguồn và số phiên bản trong *Cài đặt → Bluetooth → Nhật ký* (dòng “Phiên bản firmware …”), tôi có thể viết bản nâng cấp và nối trang với lệnh mới.

## Cần phần mềm (firmware) đồng hồ hỗ trợ — chưa làm

Trang chỉ gửi **một ảnh tĩnh** hoặc bật các chế độ firmware đã có (đồng hồ, lịch, “đồng hồ và ảnh”). Những thứ sau cần firmware mới, nên trang **không giả lập**:

- Thú cưng ảo, khu vườn lớn dần: cần lưu trạng thái và tự vẽ lại trên đồng hồ.
- Nhân vật tự đổi hoạt động theo giờ khi **không** mở trang. Hiện nay chỉ làm được khi trang đang mở và bật “Tự cập nhật”.
- Ô giờ tự chạy đặt tuỳ ý trên thiết kế mà không cần mở trang. Xem mục *Đề xuất nâng cấp firmware* ở trên.
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
