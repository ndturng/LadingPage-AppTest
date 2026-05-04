// Scroll Highlighting for Sidebar Dots and Nav Links
const sections = document.querySelectorAll('section');
const dots = document.querySelectorAll('.dot');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (pageYOffset >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  // Update Dots
  dots.forEach((dot, index) => {
    dot.classList.remove('active');
    const parentHref = dot.parentElement.getAttribute('href').substring(1);
    if (parentHref === current) {
      dot.classList.add('active');
    }
  });

  // Update Nav Links
  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href').substring(1) === current) {
      link.classList.add('active');
    }
  });
});

// --- Cascading Dropdown Logic ---
let locationData = {
  "Hà Nội": ["Superbrain Cầu Giấy", "Superbrain Hoàn Kiếm", "Superbrain Long Biên", "Superbrain Hà Đông"],
  "TP. Hồ Chí Minh": ["Superbrain Quận 1", "Superbrain Quận 7", "Superbrain Thủ Đức", "Superbrain Tân Bình"],
  "Đà Nẵng": ["Superbrain Hải Châu", "Superbrain Thanh Khê", "Superbrain Sơn Trà"]
};

const provinceSelect = document.getElementById('province');
const branchSelect = document.getElementById('branch');

// Function to populate Province dropdown
function populateProvinces() {
  if (!provinceSelect) return;
  const currentValue = provinceSelect.value;
  provinceSelect.innerHTML = '<option value="">Chọn Tỉnh/ Thành phố</option>';
  Object.keys(locationData).sort().forEach(province => {
    const option = document.createElement('option');
    option.value = province;
    option.textContent = province;
    provinceSelect.appendChild(option);
  });
  provinceSelect.value = currentValue;
}

// Function to fetch dynamic locations from Google Sheet (via Apps Script or CSV)
async function fetchLocations() {
  try {
    // You can use your Apps Script URL here if you add a doGet() function
    // OR use a published CSV link from Google Sheets
    const DATA_URL = 'https://script.google.com/macros/s/AKfycbxYBXbV76CHZ2yRxUi_p0zKCX7QyRFlgB_CudSz87_TOZEOSvJ0iBdJ7V-C5bB5luzyYg/exec';

    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error('Network response was not ok');

    // If using JSON from Apps Script:
    const dynamicData = await response.json();

    // If using CSV:
    // const text = await response.text();
    // const dynamicData = parseCSVToLocationData(text);

    if (Object.keys(dynamicData).length > 0) {
      locationData = dynamicData;
      populateProvinces();
      console.log('Locations updated from Google Sheet');
    }
  } catch (error) {
    console.warn('Using fallback location data:', error.message);
  }
}

if (provinceSelect && branchSelect) {
  populateProvinces();
  fetchLocations(); // Try to update from cloud on load

  // Handle Province Change
  provinceSelect.addEventListener('change', () => {
    const selectedProvince = provinceSelect.value;
    branchSelect.innerHTML = '<option value="">Chọn Cơ sở</option>';

    if (selectedProvince && locationData[selectedProvince]) {
      branchSelect.disabled = false;
      locationData[selectedProvince].sort().forEach(branch => {
        const option = document.createElement('option');
        option.value = branch;
        option.textContent = branch;
        branchSelect.appendChild(option);
      });
    } else {
      branchSelect.disabled = true;
    }
  });
}

// --- Form Submission to Google Apps Script ---
const form = document.getElementById('registration-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerText;

    // Prepare Data in the format expected by your Apps Script
    const formData = {
      sheet_id: '1G-3pBOfI3y7W6T45Fv7N08m_G_V-9p0U6V1J2K3L4M5', // Update with your real Sheet ID
      sheet_name: 'Sheet1', // Update with your real Sheet Name
      row: [
        new Date().toLocaleString(),
        document.getElementById('parent-name').value,
        document.getElementById('child-name').value,
        document.getElementById('child-age').value,
        document.getElementById('phone').value,
        document.getElementById('province').value,
        document.getElementById('branch').value
      ]
    };

    submitBtn.innerText = 'Đang xử lý...';
    submitBtn.disabled = true;

    try {
      // Replace with your Google Apps Script Web App URL
      const SCRIPT_URL = 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE';

      // Using 'no-cors' if the script doesn't support CORS, 
      // but 'cors' is better if the script handles it.
      // Most Apps Script Web Apps require 'POST' and stringified body.
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Important for many Apps Script setups
        cache: 'no-cache',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Since 'no-cors' doesn't return status, we assume success if no error is thrown
      alert('Đăng ký thành công! Chuyên gia Superbrain sẽ liên hệ với ba mẹ sớm nhất.');
      submitBtn.innerText = 'Gửi thành công!';
      form.reset();
      branchSelect.disabled = true;

      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
      }, 3000);

    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra. Vui lòng thử lại sau hoặc liên hệ Hotline.');
      submitBtn.innerText = originalText;
      submitBtn.disabled = false;
    }
  });
}

console.log('Superbrain Form Logic Initialized');

// Hover effects for cards using JS for extra punch
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transform = 'translateY(-15px) scale(1.02)';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) scale(1)';
  });
});

console.log('Superbrain Landing Page Initialized');

// --- Program Section Carousel ---
(function () {
  const track = document.getElementById('progTrack');
  const viewport = document.getElementById('progViewport');
  const prevBtn = document.getElementById('progPrev');
  const nextBtn = document.getElementById('progNext');
  const dotsContainer = document.getElementById('progDots');

  if (!track || !viewport) return;

  const slides = Array.from(track.children);
  const dots = dotsContainer ? Array.from(dotsContainer.children) : [];
  let current = 0;

  function update(animate) {
    const slideWidth = viewport.offsetWidth;

    if (!animate) track.style.transition = 'none';
    else track.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';

    track.style.transform = `translateX(${-current * slideWidth}px)`;

    slides.forEach((slide, i) => {
      slide.style.minWidth = slideWidth + 'px';
      slide.style.maxWidth = slideWidth + 'px';
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === current);
    });

    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === slides.length - 1;

    // Force reflow when removing transition
    if (!animate) track.getBoundingClientRect();
  }

  if (prevBtn) prevBtn.addEventListener('click', () => { if (current > 0) { current--; update(true); } });
  if (nextBtn) nextBtn.addEventListener('click', () => { if (current < slides.length - 1) { current++; update(true); } });

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => { current = i; update(true); });
  });

  window.addEventListener('resize', () => update(false));

  update(false);
})();
