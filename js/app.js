/**
 * Ứng dụng Quản lý Đặt Vé & Hiển thị Phim (Film Style)
 * Công nghệ: Vanilla JS (DOM, LocalStorage, Fetch API)
 */

const moviesData = {
    showing: [
        { 
            id: "chi-chi-em-em-3",
            title: "Chị Chị Em Em 3", 
            age: "T18", 
            genre: "Tâm Lý, Tình cảm", 
            duration: "122 phút", 
            release: "2026-10-30",
            poster: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
        },
        { 
            id: "an-mang-karaoke",
            title: "Án Mạng Karaoke", 
            age: "T16", 
            genre: "Hài, Hồi hộp", 
            duration: "96 phút", 
            release: "2026-10-26",
            poster: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400"
        },
        { 
            id: "trai-buon-nguoi",
            title: "Trại Buồn Người", 
            age: "T18", 
            genre: "Hành động, Hồi hộp", 
            duration: "135 phút", 
            release: "2026-09-25",
            poster: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400"
        },
        { 
            id: "quy-an-tang-4",
            title: "Quỷ Ăn Tạng 4: Hổ Tinh", 
            age: "T18", 
            genre: "Hài, Kinh dị", 
            duration: "111 phút", 
            release: "2026-10-16",
            poster: "https://images.unsplash.com/photo-1426604966848-d7adac902bff?w=400"
        }
    ],
    upcoming: [
        { 
            id: "bambi",
            title: "Bambi: Lãnh Địa Săn Mồi", 
            age: "T16", 
            genre: "Kinh dị", 
            duration: "80 phút", 
            release: "2026-11-05", 
            poster: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
        }
    ]
};

function switchMovieTab(type) {
    const gridEl = document.getElementById('movie-grid');
    const titleEl = document.getElementById('movie-section-title');
    const btnShowing = document.getElementById('btn-tab-showing');
    const btnUpcoming = document.getElementById('btn-tab-upcoming');

    if (!gridEl) return;
    gridEl.innerHTML = '';

    const list = type === 'showing' ? moviesData.showing : moviesData.upcoming;
    if (type === 'showing') {
        if(titleEl) titleEl.textContent = "Phim Đang Chiếu";
        if(btnShowing) btnShowing.classList.add('active');
        if(btnUpcoming) btnUpcoming.classList.remove('active');
    } else {
        if(titleEl) titleEl.textContent = "Phim Sắp Chiếu";
        if(btnUpcoming) btnUpcoming.classList.add('active');
        if(btnShowing) btnShowing.classList.remove('active');
    }

    list.forEach(movie => {
        const card = document.createElement('div');
        card.classList.add('movie-card');
        card.onclick = () => {
            window.location.href = `movie-detail.html?id=${movie.id}`;
        };

        let ageClass = 'p';
        if (movie.age === 'T18') ageClass = 't18';
        if (movie.age === 'T16') ageClass = 't16';

        card.innerHTML = `
            <div class="movie-poster-wrap">
                <img src="${movie.poster}" alt="${movie.title}">
                <span class="age-badge ${ageClass}">${movie.age}</span>
            </div>
            <div class="movie-info">
                <h4 class="movie-title">${movie.title}</h4>
                <div class="movie-meta">
                    <p><b>Thể loại:</b> ${movie.genre}</p>
                    <p><b>Thời lượng:</b> ${movie.duration}</p>
                    <p><b>Khởi chiếu:</b> ${movie.release}</p>
                </div>
                <button class="btn-buy-ticket">XEM CHI TIẾT</button>
            </div>
        `;
        gridEl.appendChild(card);
    });
}

// --- QUẢN LÝ VÉ (CRUD & LocalStorage) ---
let bookings = JSON.parse(localStorage.getItem('movie_bookings')) || [
    { id: 1712000001, movieName: "Chị Chị Em Em 3", customerName: "Nguyễn Văn A", seatNumber: "A5", showtime: "2026-10-30T18:00", completed: false }
];

const bookingForm = document.getElementById('booking-form');
const bookingIdInput = document.getElementById('booking-id');
const movieNameInput = document.getElementById('movie-name');
const customerNameInput = document.getElementById('customer-name');
const seatNumberInput = document.getElementById('seat-number');
const showtimeInput = document.getElementById('showtime');
const bookingListEl = document.getElementById('booking-list');
const searchInput = document.getElementById('search-input');
const filterSelect = document.getElementById('filter-select');
const quoteContainer = document.getElementById('movie-quote');
const btnSubmit = document.getElementById('btn-submit');
const btnCancel = document.getElementById('btn-cancel');
const formTitle = document.getElementById('form-title');

const totalTicketsEl = document.getElementById('total-tickets');
const completedTicketsEl = document.getElementById('completed-tickets');
const pendingTicketsEl = document.getElementById('pending-tickets');

function saveAndRender() {
    localStorage.setItem('movie_bookings', JSON.stringify(bookings));
    renderBookings(bookings);
    updateStatistics();
}

function updateStatistics() {
    if (!totalTicketsEl) return;
    const total = bookings.length;
    const completed = bookings.filter(b => b.completed).length;
    const pending = total - completed;
    totalTicketsEl.textContent = total;
    completedTicketsEl.textContent = completed;
    pendingTicketsEl.textContent = pending;
}

function renderBookings(dataToRender) {
    if (!bookingListEl) return;
    bookingListEl.innerHTML = '';
    if (dataToRender.length === 0) {
        bookingListEl.innerHTML = `<tr><td colspan="7" style="text-align: center; color: #777;">Không tìm thấy dữ liệu vé nào.</td></tr>`;
        return;
    }
    dataToRender.forEach((item, index) => {
        const tr = document.createElement('tr');
        if (item.completed) tr.classList.add('completed');
        const formattedDate = new Date(item.showtime).toLocaleString('vi-VN');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td><strong>${item.movieName}</strong></td>
            <td>${item.customerName}</td>
            <td><span class="badge warning">Ghế: ${item.seatNumber}</span></td>
            <td>${formattedDate}</td>
            <td><span class="badge ${item.completed ? 'success' : 'warning'}">${item.completed ? 'Đã xem' : 'Chưa xem'}</span></td>
            <td>
                <div class="action-btns">
                    <button class="btn-complete" title="Đổi trạng thái" onclick="toggleComplete(${item.id})"><i class="fa-solid ${item.completed ? 'fa-rotate-left' : 'fa-check'}"></i></button>
                    <button class="btn-edit" title="Chỉnh sửa" onclick="editBooking(${item.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="btn-delete" title="Xóa vé" onclick="deleteBooking(${item.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </td>
        `;
        bookingListEl.appendChild(tr);
    });
}

if (bookingForm) {
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();

        // ** KIỂM TRA ĐĂNG NHẬP TRƯỚC KHI CHO PHÉP ĐẶT VÉ **
        const currentUser = JSON.parse(localStorage.getItem('current_user'));
        if (!currentUser) {
            alert('⚠️ Bạn chưa đăng nhập! Vui lòng đăng nhập tài khoản để thực hiện đặt vé.');
            window.location.href = 'login.html';
            return;
        }

        const id = bookingIdInput.value;
        const movieName = movieNameInput.value.trim();
        const customerName = customerNameInput.value.trim();
        const seatNumber = seatNumberInput.value.trim();
        const showtime = showtimeInput.value;

        if (!movieName || !customerName || !seatNumber || !showtime) {
            alert('Vui lòng nhập đầy đủ thông tin!');
            return;
        }

        if (id) {
            bookings = bookings.map(item => item.id == id ? { ...item, movieName, customerName, seatNumber, showtime } : item);
            resetForm();
        } else {
            bookings.push({ id: Date.now(), movieName, customerName, seatNumber, showtime, completed: false });
            bookingForm.reset();
        }
        saveAndRender();
    });
}

function deleteBooking(id) {
    if (confirm('Bạn có chắc chắn muốn hủy / xóa vé này không?')) {
        bookings = bookings.filter(item => item.id !== id);
        saveAndRender();
    }
}

function toggleComplete(id) {
    bookings = bookings.map(item => item.id === id ? { ...item, completed: !item.completed } : item);
    saveAndRender();
}

function editBooking(id) {
    const booking = bookings.find(item => item.id === id);
    if (!booking) return;
    bookingIdInput.value = booking.id;
    movieNameInput.value = booking.movieName;
    customerNameInput.value = booking.customerName;
    seatNumberInput.value = booking.seatNumber;
    showtimeInput.value = booking.showtime;
    formTitle.innerHTML = `<i class="fa-solid fa-pen-to-square"></i> Chỉnh Sửa Vé #${booking.id}`;
    btnSubmit.innerHTML = `<i class="fa-solid fa-sync"></i> Cập Nhật`;
    btnCancel.style.display = 'inline-block';
    bookingForm.scrollIntoView({ behavior: 'smooth' });
}

if (btnCancel) {
    btnCancel.addEventListener('click', resetForm);
}

function resetForm() {
    bookingForm.reset();
    bookingIdInput.value = '';
    formTitle.innerHTML = `<i class="fa-solid fa-plus-circle"></i> Thêm Vé Đặt Mới`;
    btnSubmit.innerHTML = `<i class="fa-solid fa-save"></i> Thêm Vé`;
    btnCancel.style.display = 'none';
}

function handleFilterAndSearch() {
    const keyword = searchInput.value.toLowerCase().trim();
    const filterStatus = filterSelect.value;
    let filtered = bookings.filter(item => {
        const matchesKeyword = item.movieName.toLowerCase().includes(keyword) || item.customerName.toLowerCase().includes(keyword) || item.seatNumber.toLowerCase().includes(keyword);
        let matchesStatus = true;
        if (filterStatus === 'completed') matchesStatus = item.completed;
        if (filterStatus === 'active') matchesStatus = !item.completed;
        return matchesKeyword && matchesStatus;
    });
    renderBookings(filtered);
}

if (searchInput) searchInput.addEventListener('input', handleFilterAndSearch);
if (filterSelect) filterSelect.addEventListener('change', handleFilterAndSearch);

async function fetchMovieQuote() {
    if (!quoteContainer) return;
    try {
        const res = await fetch('https://api.quotable.io/random?tags=famous-quotes');
        const data = await res.json();
        quoteContainer.innerHTML = `"${data.content}" — <strong>${data.author}</strong>`;
    } catch (e) {
        quoteContainer.innerHTML = `"Điện ảnh là một mẩu đời được cắt ra." — <i>(Chế độ ngoại tuyến)</i>`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    saveAndRender();
    switchMovieTab('showing');
    fetchMovieQuote();

    const urlParams = new URLSearchParams(window.location.search);
    const movieParam = urlParams.get('movie');
    const showtimeParam = urlParams.get('showtime');
    if (movieParam && showtimeParam) {
        document.getElementById('movie-name').value = decodeURIComponent(movieParam);
        document.getElementById('showtime').value = showtimeParam;
        document.getElementById('manage').scrollIntoView({ behavior: 'smooth' });
    }
});