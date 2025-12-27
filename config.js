/* ==========================================
   FILE CẤU HÌNH CHUNG (config.js)
   Nhiệm vụ: Chứa Key, khởi tạo Supabase và các hàm tiện ích
   ========================================== */

// 1. CẤU HÌNH SUPABASE
const SUPABASE_URL = 'https://renqusdcczlhrglbclhe.supabase.co';
// Lưu ý: Đây là Anon Key (Public), chỉ an toàn khi bạn đã bật RLS (Row Level Security) trong Database
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlbnF1c2RjY3psaHJnbGJjbGhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUwMTIyMzUsImV4cCI6MjA4MDU4ODIzNX0.kF960FS-VvAM2rkNo9kVHfmGAkpwrmlZ5Vf9-QFiC2E';

// Khởi tạo Client (biến toàn cục _supabase để dùng ở mọi nơi)
const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

console.log("✅ Supabase đã được kết nối từ config.js");

// 2. HÀM KIỂM TRA ĐĂNG NHẬP (Dùng cho các trang nội bộ)
function checkAuth() {
    // Bỏ qua kiểm tra nếu đang ở trang login (index.html)
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') return;

    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
        alert("⚠️ Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại!");
        window.location.href = "index.html";
        return null;
    }
    return JSON.parse(userStr);
}

// 3. HÀM HIỆN/ẨN LOADING (Dùng chung)
function showLoading(isLoading) {
    const loader = document.getElementById("loading");
    if (loader) {
        loader.style.display = isLoading ? "block" : "none";
    }
}

// 4. HÀM FORMAT TIỀN TỆ HOẶC NGÀY THÁNG (Ví dụ)
function formatDateVN(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// HÀM HIỆN/ẨN LOADING (Phiên bản đẹp + Tự động tạo HTML)
function showLoading(isLoading, message = "Đang xử lý...") {
    // 1. Kiểm tra xem HTML loading đã có chưa, chưa có thì tạo mới
    let overlay = document.getElementById("loading-overlay");
    
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "loading-overlay";
        overlay.innerHTML = `
            <div class="spinner-box">
                <div class="spinner"></div>
                <div class="loading-text" id="loading-text-content"></div>
            </div>
            <style>
                /* CSS CHO LOADING */
                #loading-overlay {
                    position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                    background: rgba(255, 255, 255, 0.7); /* Nền trắng mờ */
                    backdrop-filter: blur(4px); /* Hiệu ứng mờ kính hiện đại */
                    z-index: 99999;
                    display: none; /* Mặc định ẩn */
                    justify-content: center; align-items: center;
                    animation: fadeIn 0.2s;
                }
                .spinner-box {
                    text-align: center;
                    background: white;
                    padding: 25px 40px;
                    border-radius: 12px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                }
                .spinner {
                    width: 40px; height: 40px;
                    margin: 0 auto 15px auto;
                    border: 4px solid #e5e7eb;
                    border-top: 4px solid #4a90e2; /* Màu xanh chủ đạo */
                    border-radius: 50%;
                    animation: spin 0.8s linear infinite;
                }
                .loading-text {
                    font-family: 'Inter', sans-serif;
                    font-size: 15px; font-weight: 500; color: #374151;
                    animation: pulse 1.5s infinite ease-in-out;
                }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            </style>
        `;
        document.body.appendChild(overlay);
    }

    // 2. Cập nhật nội dung và hiển thị
    const textEl = document.getElementById("loading-text-content");
    
    if (isLoading) {
        if(textEl) textEl.innerText = message;
        overlay.style.display = "flex"; // Dùng flex để căn giữa
    } else {
        // Thêm chút delay để không bị nháy nếu loading quá nhanh
        setTimeout(() => {
            overlay.style.display = "none";
        }, 300); 
    }
}

// --- TỰ ĐỘNG CHẠY KHI FILE ĐƯỢC LOAD ---
// Tự động kiểm tra Auth cho các trang không phải index.html
// checkAuth();
