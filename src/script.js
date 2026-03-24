// PDS Print Card - JavaScript Logic

// --- State Management ---
let formData = {
    rationNo: '',
    nameHindi: '',
    nameEnglish: '',
    fatherName: '',
    districtHindi: '',
    districtEnglish: '',
    block: '',
    village: '',
    dealer: '',
    cardType: 'PH Card (Red/pink Card)',
    members: []
};

let showColor = false;

const districts = [
    { hindi: "बोकारो", english: "Bokaro" },
    { hindi: "चतरा", english: "Chatra" },
    { hindi: "देवघर", english: "Deoghar" },
    { hindi: "धनबाद", english: "Dhanbad" },
    { hindi: "दुमका", english: "Dumka" },
    { hindi: "पूर्वी सिंहभूम", english: "East Singhbhum" },
    { hindi: "गढ़वा", english: "Garhwa" },
    { hindi: "गिरिडीह", english: "Giridih" },
    { hindi: "गोड्डा", english: "Godda" },
    { hindi: "गुमला", english: "Gumla" },
    { hindi: "हज़ारीबाग", english: "Hazaribagh" },
    { hindi: "जामताड़ा", english: "Jamtara" },
    { hindi: "खूंटी", english: "Khunti" },
    { hindi: "कोडरमा", english: "Koderma" },
    { hindi: "लातेहार", english: "Latehar" },
    { hindi: "लोहरदगा", english: "Lohardaga" },
    { hindi: "पाकुड़", english: "Pakur" },
    { hindi: "पलामू", english: "Palamu" },
    { hindi: "रामगढ़", english: "Ramgarh" },
    { hindi: "रांची", english: "Ranchi" },
    { hindi: "साहिबगंज", english: "Sahibganj" },
    { hindi: "सरायकेला खरसावां", english: "Seraikela-Kharsawan" },
    { hindi: "सिमडेगा", english: "Simdega" },
    { hindi: "पश्चिमी सिंहभूम", english: "West Singhbhum" }
];

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide icons
    lucide.createIcons();

    // Populate Districts
    const districtHindiSelect = document.getElementById('districtHindi');
    const districtEnglishSelect = document.getElementById('districtEnglish');
    
    districts.forEach(d => {
        const hindiOpt = document.createElement('option');
        hindiOpt.value = d.hindi;
        hindiOpt.textContent = d.hindi;
        districtHindiSelect.appendChild(hindiOpt);

        const englishOpt = document.createElement('option');
        englishOpt.value = d.english;
        englishOpt.textContent = d.english;
        districtEnglishSelect.appendChild(englishOpt);
    });

    // Event Listeners
    document.getElementById('mobile-menu-btn').addEventListener('click', toggleMobileMenu);
    document.getElementById('demo-btn').addEventListener('click', fillDemoData);
    document.getElementById('add-member-btn').addEventListener('click', addMember);
    document.getElementById('ration-form').addEventListener('submit', handleSubmit);
    document.getElementById('back-btn').addEventListener('click', () => toggleView('form'));
    document.getElementById('enable-color-btn').addEventListener('click', () => updateColor(true));
    document.getElementById('disable-color-btn').addEventListener('click', () => updateColor(false));

    // Handle scaling on resize
    window.addEventListener('resize', updateScaling);
});

// Attach functions to window for global access from HTML
window.removeMember = removeMember;
window.updateMember = updateMember;
window.fillDemoData = fillDemoData;
window.addMember = addMember;
window.toggleView = toggleView;
window.updateColor = updateColor;

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

function toggleView(view) {
    const formView = document.getElementById('form-view');
    const previewView = document.getElementById('preview-view');
    
    if (view === 'preview') {
        formView.classList.add('hidden');
        previewView.classList.remove('hidden');
        previewView.classList.add('flex');
        updatePreview();
        updateScaling();
    } else {
        formView.classList.remove('hidden');
        previewView.classList.add('hidden');
        previewView.classList.remove('flex');
    }
}

function fillDemoData() {
    formData = {
        rationNo: '202000940048',
        nameHindi: 'हसनबाबू बीबी',
        nameEnglish: 'HASNBABU BIBI',
        fatherName: 'MAKBUL MIYAN',
        districtHindi: 'देवघर',
        districtEnglish: 'Deoghar',
        block: 'PALOJORI',
        village: 'POKHARIA',
        dealer: 'LAKHENDARMURMU',
        cardType: 'PH Card (Red/pink Card)',
        members: [
            { id: Date.now() + 1, name: 'हदीस मियाँ', gender: 'Male', age: '77', relation: 'अन्य' },
            { id: Date.now() + 2, name: 'हसमवानु बीबी', gender: 'Female', age: '57', relation: 'स्वयं' },
            { id: Date.now() + 3, name: 'अब्दुल कुदुस', gender: 'Male', age: '35', relation: 'बेटा' }
        ]
    };

    // Update form fields
    document.getElementById('rationNo').value = formData.rationNo;
    document.getElementById('nameHindi').value = formData.nameHindi;
    document.getElementById('nameEnglish').value = formData.nameEnglish;
    document.getElementById('fatherName').value = formData.fatherName;
    document.getElementById('districtHindi').value = formData.districtHindi;
    document.getElementById('districtEnglish').value = formData.districtEnglish;
    document.getElementById('block').value = formData.block;
    document.getElementById('village').value = formData.village;
    document.getElementById('dealer').value = formData.dealer;
    document.getElementById('cardType').value = formData.cardType;

    renderMembers();
}

function addMember() {
    const member = {
        id: Date.now(),
        name: '',
        gender: 'Male',
        age: '',
        relation: ''
    };
    formData.members.push(member);
    renderMembers();
}

function removeMember(id) {
    formData.members = formData.members.filter(m => m.id !== id);
    renderMembers();
}

function renderMembers() {
    const body = document.getElementById('members-body');
    body.innerHTML = '';

    formData.members.forEach(member => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-4 py-3">
                <input type="text" value="${member.name}" onchange="updateMember(${member.id}, 'name', this.value)" placeholder="Name" required class="w-full px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none">
            </td>
            <td class="px-4 py-3">
                <select onchange="updateMember(${member.id}, 'gender', this.value)" required class="w-full px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none bg-white">
                    <option value="Male" ${member.gender === 'Male' ? 'selected' : ''}>Male</option>
                    <option value="Female" ${member.gender === 'Female' ? 'selected' : ''}>Female</option>
                    <option value="Other" ${member.gender === 'Other' ? 'selected' : ''}>Other</option>
                </select>
            </td>
            <td class="px-4 py-3">
                <input type="number" value="${member.age}" onchange="updateMember(${member.id}, 'age', this.value)" placeholder="Age" min="1" max="120" required class="w-full px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none">
            </td>
            <td class="px-4 py-3">
                <input type="text" value="${member.relation}" onchange="updateMember(${member.id}, 'relation', this.value)" placeholder="Relation" required class="w-full px-3 py-1.5 border border-gray-200 rounded focus:ring-1 focus:ring-blue-500 outline-none">
            </td>
            <td class="px-4 py-3 text-center">
                <button type="button" onclick="removeMember(${member.id})" class="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors">
                    <i data-lucide="trash-2" class="w-5 h-5"></i>
                </button>
            </td>
        `;
        body.appendChild(tr);
    });
    lucide.createIcons();
}

function updateMember(id, field, value) {
    const member = formData.members.find(m => m.id === id);
    if (member) member[field] = value;
}

function handleSubmit(e) {
    e.preventDefault();
    const errorDiv = document.getElementById('error-message');
    errorDiv.classList.add('hidden');

    // Sync form data
    formData.rationNo = document.getElementById('rationNo').value;
    formData.nameHindi = document.getElementById('nameHindi').value;
    formData.nameEnglish = document.getElementById('nameEnglish').value;
    formData.fatherName = document.getElementById('fatherName').value;
    formData.districtHindi = document.getElementById('districtHindi').value;
    formData.districtEnglish = document.getElementById('districtEnglish').value;
    formData.block = document.getElementById('block').value;
    formData.village = document.getElementById('village').value;
    formData.dealer = document.getElementById('dealer').value;
    formData.cardType = document.getElementById('cardType').value;

    // Validation
    if (formData.rationNo.length !== 12) {
        errorDiv.textContent = "Ration Card Number must be exactly 12 digits.";
        errorDiv.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
    }

    if (formData.members.length === 0) {
        errorDiv.textContent = "Please add at least one family member.";
        errorDiv.classList.remove('hidden');
        return;
    }

    toggleView('preview');
}

function updatePreview() {
    document.getElementById('preview-ration-no-left').textContent = `Ration Card No./ राशन कार्ड संख्या: ${formData.rationNo}`;
    document.getElementById('preview-ration-no-right').textContent = `Ration Card No./ राशन कार्ड संख्या: ${formData.rationNo}`;
    document.getElementById('preview-cardholder-name').textContent = `कार्डधारी का नाम: ${formData.nameHindi}`;
    
    const cardTypeHeader = document.getElementById('preview-card-type-header');
    const typeLabel = formData.cardType === 'Green Card' ? 'ग्रीन गृहस्थी योजना' : 'पूर्वविक्ताप्राप्त गृहस्थी योजना';
    cardTypeHeader.textContent = `${typeLabel} - ${formData.districtHindi}`;

    const membersBody = document.getElementById('preview-members-body');
    membersBody.innerHTML = '';
    
    formData.members.forEach((member, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="border border-black p-0.5 text-center">${index + 1}</td>
            <td class="border border-black p-0.5 text-center">${member.name}</td>
            <td class="border border-black p-0.5 text-center">${member.gender === 'Male' ? 'पु.' : 'म.'}</td>
            <td class="border border-black p-0.5 text-center">${member.age}</td>
            <td class="border border-black p-0.5 text-center">${member.relation}</td>
        `;
        membersBody.appendChild(tr);
    });

    // Fill empty rows
    const emptyRows = Math.max(0, 5 - formData.members.length);
    for (let i = 0; i < emptyRows; i++) {
        const tr = document.createElement('tr');
        tr.className = 'h-5';
        tr.innerHTML = `
            <td class="border border-black p-0.5"></td>
            <td class="border border-black p-0.5"></td>
            <td class="border border-black p-0.5"></td>
            <td class="border border-black p-0.5"></td>
            <td class="border border-black p-0.5"></td>
        `;
        membersBody.appendChild(tr);
    }

    document.getElementById('preview-member-count').textContent = `कुल व्यक्तियों की संख्या : ${formData.members.length}`;
    
    // Initial color state
    updateColor(formData.cardType === 'Green Card');
}

function updateColor(enabled) {
    showColor = enabled;
    const cardLeft = document.getElementById('card-left');
    const cardRight = document.getElementById('card-right');
    const previewView = document.getElementById('preview-view');
    const watermarkPreview = document.getElementById('watermark-preview');
    const watermarkPayment = document.getElementById('watermark-payment');

    if (showColor) {
        cardLeft.classList.remove('bg-white');
        cardLeft.classList.add('bg-[#32CD32]');
        cardRight.classList.remove('bg-white');
        cardRight.classList.add('bg-[#32CD32]');
        previewView.style.background = 'linear-gradient(to bottom, #32CD32 50%, #ffffff 50%)';
        watermarkPreview.classList.add('hidden');
        watermarkPayment.classList.add('hidden');
    } else {
        cardLeft.classList.add('bg-white');
        cardLeft.classList.remove('bg-[#32CD32]');
        cardRight.classList.add('bg-white');
        cardRight.classList.remove('bg-[#32CD32]');
        previewView.style.background = 'linear-gradient(to bottom, #bcbcbc 50%, #ffffff 50%)';
        watermarkPreview.classList.remove('hidden');
        watermarkPayment.classList.remove('hidden');
    }
}

function updateScaling() {
    const wrapper = document.getElementById('card-scaling-wrapper');
    const container = document.getElementById('preview-view');
    if (!wrapper || !container) return;

    const containerWidth = container.offsetWidth;
    const cardWidth = 1000; // Total width of two cards + gap
    
    if (containerWidth < cardWidth) {
        const scale = (containerWidth / cardWidth) - 0.05;
        wrapper.style.transform = `scale(${scale})`;
        wrapper.style.height = `${1200 * scale}px`;
    } else {
        wrapper.style.transform = 'scale(1)';
        wrapper.style.height = 'auto';
    }
}
