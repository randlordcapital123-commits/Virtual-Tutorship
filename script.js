// -------------------- UTILITY: localStorage DB --------------------
const DB_KEY = 'vurtual_products';
const LOGO_KEY = 'vurtual_logo';

function getProducts() {
    const data = localStorage.getItem(DB_KEY);
    return data ? JSON.parse(data) : [];
}

function saveProducts(products) {
    localStorage.setItem(DB_KEY, JSON.stringify(products));
}

function getLogo() {
    return localStorage.getItem(LOGO_KEY) || ''; // base64 or empty
}

function saveLogo(base64) {
    localStorage.setItem(LOGO_KEY, base64);
}

// -------------------- INITIAL DATA (if empty) --------------------
if (getProducts().length === 0) {
    saveProducts([
        {
            id: '1',
            name: 'Mathematics Tutoring',
            price: '250',
            description: 'Grades 10–12, exam preparation and problem solving.',
            image: '' // will use placeholder
        },
        {
            id: '2',
            name: 'English & Literature',
            price: '200',
            description: 'Reading, writing, and literature analysis for all levels.',
            image: ''
        }
    ]);
}

// -------------------- RENDER PRODUCTS (public) --------------------
function renderPublicProducts() {
    const grid = document.getElementById('productsGrid');
    const products = getProducts();
    if (products.length === 0) {
        grid.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:rgba(255,255,255,0.6);">No services available yet.</p>`;
        return;
    }
    let html = '';
    products.forEach(p => {
        const imgSrc = p.image || 'https://via.placeholder.com/400x200/1a1a4e/00d4ff?text=Service';
        const price = p.price ? `R ${p.price}` : 'Price on request';
        const whatsappMsg = `Hello%20VURTUAL%20TUTORSHIP%2C%20I'm%20interested%20in%20the%20service%3A%20${encodeURIComponent(p.name)}%20(${price})`;
        html += `
            <div class="service-card">
                <img src="${imgSrc}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/400x200/1a1a4e/00d4ff?text=No+Image'">
                <h3>${p.name}</h3>
                <div class="price">${price}</div>
                <p>${p.description || ''}</p>
                <a href="https://wa.me/27767531179?text=${whatsappMsg}" target="_blank" class="btn-whatsapp">
                    <i class="fab fa-whatsapp"></i> Buy on WhatsApp
                </a>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// -------------------- UPDATE LOGO ON ALL PLACES --------------------
function updateLogoUI() {
    const logo = getLogo();
    const imgElements = document.querySelectorAll('#siteLogo, #adminLogoPreview, #footerLogo');
    imgElements.forEach(img => {
        if (logo) {
            img.src = logo;
        } else {
            img.src = 'https://via.placeholder.com/180x50/1a1a4e/00d4ff?text=VURTUAL+TUTORSHIP';
        }
    });
}

// -------------------- ADMIN: PRODUCT LIST --------------------
function renderAdminProducts() {
    const list = document.getElementById('productList');
    const products = getProducts();
    if (products.length === 0) {
        list.innerHTML = `<p style="color:rgba(255,255,255,0.5);">No services added yet.</p>`;
        return;
    }
    let html = '';
    products.forEach(p => {
        const imgSrc = p.image || 'https://via.placeholder.com/60/1a1a4e/00d4ff?text=No+Img';
        html += `
            <div class="product-item" data-id="${p.id}">
                <div class="info">
                    <img src="${imgSrc}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/60/1a1a4e/00d4ff?text=Err'">
                    <div>
                        <h4>${p.name}</h4>
                        <span class="price">R ${p.price || '0'}</span>
                        <p style="font-size:0.85rem; color:rgba(255,255,255,0.5);">${p.description || ''}</p>
                    </div>
                </div>
                <div class="actions">
                    <button class="edit-btn" data-id="${p.id}"><i class="fas fa-edit"></i></button>
                    <button class="delete-btn" data-id="${p.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            </div>
        `;
    });
    list.innerHTML = html;

    // Attach events
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            const product = getProducts().find(p => p.id === id);
            if (product) openEditForm(product);
        });
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = this.dataset.id;
            if (confirm('Delete this service permanently?')) {
                deleteProduct(id);
            }
        });
    });
}

// -------------------- ADMIN: ADD/EDIT FORM --------------------
const formContainer = document.getElementById('productFormContainer');
const formTitle = document.getElementById('formTitle');
const editId = document.getElementById('editId');
const prodName = document.getElementById('prodName');
const prodPrice = document.getElementById('prodPrice');
const prodDesc = document.getElementById('prodDesc');
const prodImage = document.getElementById('prodImage');
const dropArea = document.getElementById('dropArea');
const imagePreview = document.getElementById('imagePreview');
let currentFile = null; // base64 string

function openEditForm(product) {
    formContainer.style.display = 'block';
    formTitle.textContent = 'Edit Service';
    editId.value = product.id;
    prodName.value = product.name;
    prodPrice.value = product.price;
    prodDesc.value = product.description || '';
    if (product.image) {
        imagePreview.innerHTML = `<img src="${product.image}" alt="Current">`;
    } else {
        imagePreview.innerHTML = '';
    }
    currentFile = null;
    prodImage.value = '';
    window.scrollTo({ top: formContainer.offsetTop - 100, behavior: 'smooth' });
}

document.getElementById('showAddForm').addEventListener('click', function() {
    formContainer.style.display = 'block';
    formTitle.textContent = 'Add New Service';
    editId.value = '';
    prodName.value = '';
    prodPrice.value = '';
    prodDesc.value = '';
    imagePreview.innerHTML = '';
    currentFile = null;
    prodImage.value = '';
    window.scrollTo({ top: formContainer.offsetTop - 100, behavior: 'smooth' });
});

document.getElementById('cancelForm').addEventListener('click', function() {
    formContainer.style.display = 'none';
});

// Drag and drop
dropArea.addEventListener('click', () => prodImage.click());

dropArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropArea.classList.add('dragover');
});
dropArea.addEventListener('dragleave', () => {
    dropArea.classList.remove('dragover');
});
dropArea.addEventListener('drop', (e) => {
    e.preventDefault();
    dropArea.classList.remove('dragover');
    if (e.dataTransfer.files.length) {
        const file = e.dataTransfer.files[0];
        if (file.type.startsWith('image/')) {
            handleImageFile(file);
        } else {
            alert('Please drop an image file.');
        }
    }
});

prodImage.addEventListener('change', function() {
    if (this.files.length) {
        handleImageFile(this.files[0]);
    }
});

function handleImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentFile = e.target.result; // base64
        imagePreview.innerHTML = `<img src="${currentFile}" alt="Preview">`;
    };
    reader.readAsDataURL(file);
}

// Submit product form
document.getElementById('productForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const id = editId.value;
    const name = prodName.value.trim();
    const price = prodPrice.value.trim();
    const description = prodDesc.value.trim();

    if (!name) {
        alert('Service name is required.');
        return;
    }

    let products = getProducts();

    if (id) {
        // Update
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index].name = name;
            products[index].price = price;
            products[index].description = description;
            if (currentFile) {
                products[index].image = currentFile;
            }
            saveProducts(products);
            alert('Service updated!');
        } else {
            alert('Product not found.');
            return;
        }
    } else {
        // Add new
        const newProduct = {
            id: Date.now().toString(),
            name: name,
            price: price,
            description: description,
            image: currentFile || ''
        };
        products.push(newProduct);
        saveProducts(products);
        alert('Service added!');
    }

    formContainer.style.display = 'none';
    renderAdminProducts();
    renderPublicProducts();
});

// Delete product
function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    renderAdminProducts();
    renderPublicProducts();
}

// -------------------- ADMIN: LOGO UPLOAD --------------------
document.getElementById('uploadLogoBtn').addEventListener('click', function() {
    const input = document.getElementById('logoInput');
    const file = input.files[0];
    if (!file) {
        alert('Please select an image file.');
        return;
    }
    if (!file.type.startsWith('image/')) {
        alert('Please select an image.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        saveLogo(base64);
        updateLogoUI();
        document.getElementById('logoStatus').innerHTML = `<p style="color:#00d4ff;">Logo updated successfully!</p>`;
        input.value = '';
    };
    reader.readAsDataURL(file);
});

// -------------------- NAVBAR TOGGLE --------------------
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// -------------------- BACK TO TOP --------------------
const backBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
        backBtn.style.display = 'flex';
    } else {
        backBtn.style.display = 'none';
    }
});

backBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// -------------------- CONTACT FORM --------------------
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Your message has been sent! We will respond via WhatsApp or email.');
    this.reset();
});

// -------------------- INIT --------------------
updateLogoUI();
renderPublicProducts();
renderAdminProducts();