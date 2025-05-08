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
  danhSachSanPham.push(sp);
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
  danhSachPallet.push(pallet);
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
  e.preventDefault();
  if (danhSachSanPham.length === 0 && danhSachPallet.length === 0 && parseInt(document.getElementById('soLuongKhuon').value) === 0) {
    showMessage('Vui lòng thêm ít nhất 1 sản phẩm hoặc pallet trước khi báo cáo!');
    return;
  }

  const currentTimeVN = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  const baoCao = {
    thoiGianGui: currentTimeVN,
    soLuongKhuon: Math.max(0, document.getElementById('soLuongKhuon').value),
    sanPham: danhSachSanPham,
    pallet: danhSachPallet
  };

  const filename = `baocao-${Date.now()}.json`;
  const githubURL = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${filename}`;

  fetch(githubURL, {
    method: 'PUT',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: `Báo cáo mới lúc ${currentTimeVN}`,
      content: btoa(unescape(encodeURIComponent(JSON.stringify(baoCao))))
    })
  })
  .then(res => res.json())
  .then(data => {
    if (data.content && data.commit) {
      showMessage(`Đã gửi báo cáo lúc ${currentTimeVN}`);
      this.reset();
      danhSachSanPham.length = 0;
      danhSachPallet.length = 0;
      renderSanPham();
      renderPallet();
    } else {
      showMessage('Lỗi gửi báo cáo!');
    }
  })
  .catch(err => {
    console.error(err);
    showMessage('Lỗi gửi báo cáo!');
  });
});
