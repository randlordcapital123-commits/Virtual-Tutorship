const WHATSAPP_NUMBER = "27767531179"; // Formatted with SA Country Code

// Default Initial Courses
const defaultCourses = [
    { id: 1, title: "Matric Mathematics Tutoring", price: "450", image: "https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500" },
    { id: 2, title: "Physical Science Mastery", price: "500", image: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=500" }
];

let courses = JSON.parse(localStorage.getItem('vt_courses')) || defaultCourses;
let currentImageBase64 = "";

// Initialize App
document.addEventListener("DOMContentLoaded", () => {
    renderCourses();
    loadLogo();
    setupDragAndDrop();
});

// Render Main Page Courses
function renderCourses() {
    const container = document.getElementById('courseContainer');
    container.innerHTML = "";

    courses.forEach(course => {
        const waMessage = encodeURIComponent(`Hello, I am interested in enrolling for "${course.title}" priced at R${course.price}. Please provide enrollment details.`);
        const waLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`;

        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <img src="${course.image}" alt="${course.title}">
            <div class="course-details">
                <h3>${course.title}</h3>
                <div class="price-tag">R${course.price}</div>
                <a href="${waLink}" target="_blank" class="whatsapp-buy-btn">Order via WhatsApp</a>
            </div>
        `;
        container.appendChild(card);
    });
}

/* Admin Panel Logic */
function openAdminModal() {
    document.getElementById('adminModal').style.display = 'block';
}

function closeAdminModal() {
    document.getElementById('adminModal').style.display = 'none';
}

function authenticateAdmin() {
    const pwd = document.getElementById('adminPassword').value;
    if (pwd === "admin123") {
        document.getElementById('adminAuth').classList.add('hidden');
        document.getElementById('adminControls').classList.remove('hidden');
        renderAdminList();
    } else {
        alert("Incorrect password!");
    }
}

/* Logo Upload Handling */
document.getElementById('logoUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const logoData = event.target.result;
            localStorage.setItem('vt_logo', logoData);
            document.getElementById('siteLogo').src = logoData;
        };
        reader.readAsDataURL(file);
    }
});

function loadLogo() {
    const savedLogo = localStorage.getItem('vt_logo');
    if (savedLogo) {
        document.getElementById('siteLogo').src = savedLogo;
    }
}

/* Drag & Drop Image Handling */
function setupDragAndDrop() {
    const dropZone = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('courseImageInput');

    dropZone.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => handleFile(e.target.files[0]));

    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = '#e8f0fe';
    });

    dropZone.addEventListener('dragleave', () => dropZone.style.backgroundColor = 'transparent');

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.style.backgroundColor = 'transparent';
        if (e.dataTransfer.files.length) {
            handleFile(e.dataTransfer.files[0]);
        }
    });
}

function handleFile(file) {
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            currentImageBase64 = e.target.result;
            document.getElementById('dragDropArea').innerText = "Image Loaded Successfully!";
        };
        reader.readAsDataURL(file);
    }
}

/* Create / Add Course */
function addOrUpdateCourse() {
    const title = document.getElementById('courseTitle').value;
    const price = document.getElementById('coursePrice').value;

    if (!title || !price || !currentImageBase64) {
        alert("Please provide a title, price, and upload an image.");
        return;
    }

    const newCourse = {
        id: Date.now(),
        title: title,
        price: price,
        image: currentImageBase64
    };

    courses.push(newCourse);
    localStorage.setItem('vt_courses', JSON.stringify(courses));
    
    // Reset Form
    document.getElementById('courseTitle').value = "";
    document.getElementById('coursePrice').value = "";
    document.getElementById('dragDropArea').innerText = "Drag & Drop Course Image Here or Click to Upload";
    currentImageBase64 = "";

    renderCourses();
    renderAdminList();
    alert("Course added successfully!");
}

/* Render & Manage Admin Items */
function renderAdminList() {
    const adminList = document.getElementById('adminCourseList');
    adminList.innerHTML = "";

    courses.forEach(c => {
        const item = document.createElement('div');
        item.style.cssText = "display:flex; justify-content:space-between; margin-top:10px; align-items:center;";
        item.innerHTML = `
            <span>${c.title} - R${c.price}</span>
            <button onclick="deleteCourse(${c.id})" style="background:#ff3b30; color:white; border:none; padding:5px 10px; border-radius:6px; cursor:pointer;">Delete</button>
        `;
        adminList.appendChild(item);
    });
}

function deleteCourse(id) {
    courses = courses.filter(c => c.id !== id);
    localStorage.setItem('vt_courses', JSON.stringify(courses));
    renderCourses();
    renderAdminList();
}