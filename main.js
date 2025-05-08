const danhSachSanPham = [];
const danhSachPallet = [];

function themSanPham() {
  const sp = {
    sanPham: document.getElementById('sanPham').value,
    cuongDoNen: document.getElementById('cuongDoNen').value,
    soLuongKien: document.getElementById('soLuongKien').value,
    chieuCaoKien: document.getElementById('chieuCaoKien').value,
    soLuongHuHong: document.getElementById('soLuongHuHong').value,
    loaiHuHong: document.getElementById('loaiHuHong').value
  };
  if (!sp.sanPham || sp.soLuongKien === '' || sp.soLuongHuHong === '' || sp.soLuongKien < 0 || sp.soLuongHuHong < 0) {
    showMessage('Vui lòng nhập đầy đủ thông tin sản phẩm!');
    return;
  }
  const isDuplicate = danhSachSanPham.some(item => item.sanPham === sp.sanPham && item.cuongDoNen === sp.cuongDoNen);
  if (isDuplicate) {
    showMessage('Sản phẩm đã tồn tại!');
    return;
  }
  danhSachSanPham.push(sp);
  document.getElementById('sanPham').value = '';
  document.getElementById('cuongDoNen').selectedIndex = 0;
  document.getElementById('soLuongKien').value = 0;
  document.getElementById('chieuCaoKien').selectedIndex = 0;
  document.getElementById('soLuongHuHong').value = 0;
  document.getElementById('loaiHuHong').selectedIndex = 0;
  renderSanPham();
}

function renderSanPham() {
  const container = document.getElementById('outputSanPham');
  container.innerHTML = '';
  danhSachSanPham.forEach((sp, index) => {
    const el = document.createElement('div');
    el.innerHTML = `• Sản phẩm: ${sp.sanPham}, Cường độ: ${sp.cuongDoNen}, Số kiện: ${sp.soLuongKien}, Chiều cao kiện: ${sp.chieuCaoKien}, Hư hỏng: ${sp.soLuongHuHong} (Loại: ${sp.loaiHuHong}) <button onclick="xoaSanPham(${index})">Xoá</button>`;
    container.appendChild(el);
  });
}

function xoaSanPham(index) {
  danhSachSanPham.splice(index, 1);
  renderSanPham();
}

function themPallet() {
  const pallet = {
    kichThuoc: document.getElementById('kichThuocPallet').value,
    soLuong: document.getElementById('soLuongPallet').value
  };
  if (!pallet.kichThuoc || pallet.soLuong === '' || pallet.soLuong < 0) {
    showMessage('Vui lòng nhập đầy đủ thông tin pallet!');
    return;
  }
  const isDuplicate = danhSachPallet.some(item => item.kichThuoc === pallet.kichThuoc);
  if (isDuplicate) {
    showMessage('Pallet đã tồn tại!');
    return;
  }
  danhSachPallet.push(pallet);
  document.getElementById('kichThuocPallet').value = '';
  document.getElementById('soLuongPallet').value = 0;
  renderPallet();
}

function renderPallet() {
  const container = document.getElementById('outputPallet');
  container.innerHTML = '';
  danhSachPallet.forEach((p, index) => {
    const el = document.createElement('div');
    el.innerHTML = `• Kích thước: ${p.kichThuoc}, Số lượng: ${p.soLuong} <button onclick="xoaPallet(${index})">Xoá</button>`;
    container.appendChild(el);
  });
}

function xoaPallet(index) {
  danhSachPallet.splice(index, 1);
  renderPallet();
}

function showMessage(msg) {
  document.getElementById('modalMessage').innerText = msg;
  document.getElementById('modal').style.display = 'block';
}

document.getElementById('reportForm').addEventListener('submit', function(e) {
  if (danhSachSanPham.length === 0 && danhSachPallet.length === 0 && parseInt(document.getElementById('soLuongKhuon').value) === 0) {
    showMessage('Vui lòng thêm ít nhất 1 sản phẩm hoặc pallet trước khi báo cáo!');
    return;
  }
  e.preventDefault();
  const currentTimeVN = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const baoCao = {
    thoiGianGui: currentTimeVN,
    soLuongKhuon: Math.max(0, document.getElementById('soLuongKhuon').value),
    sanPham: danhSachSanPham,
    pallet: danhSachPallet
  };
  console.log('Báo cáo đã gửi:', baoCao);
  showMessage(`Đã gửi báo cáo lúc ${currentTimeVN}`);
  this.reset();
  danhSachSanPham.length = 0;
  danhSachPallet.length = 0;
  renderSanPham();
  renderPallet();
});
