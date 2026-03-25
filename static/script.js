/* =========================================
   1. GLOBAL VARIABLES & PRODUCT DATA
   ========================================= */
let currentBasePrice = 0;
const scriptURL = '/submit-order'; 

const products = [
    { id: 1, name: "৭ দিনের কোর্স", price: 500, slug: "7-days-course", images: ["static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg"] },
    { id: 2, name: "ওয়েট লস প্যাক", price: 850, slug: "weight-loss", images: ["static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg"] },
    { id: 3, name: "এলার্জি রেমিডি", price: 850, slug: "allergy-remedy", images: ["static/Image/Allergy Remidy.png", "static/Image/Allergy Remidy.png", "static/Image/Allergy Remidy.png", "static/Image/Allergy Remidy.png", "static/Image/Allergy Remidy.png"] },
    { id: 4, name: "গ্যাস্ট্র কেয়ার", price: 600, slug: "gastro-care", images: ["static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg", "static/Image/Wet Loss.jpg"] },
    { id: 5, name: "বাদাম চাটনি", price: 950, slug: "badam-chatni", special: true, images: ["static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png"] },
    { id: 6, name: "আমাশা কেয়ার", price: 900, slug: "amasha-care", images:["static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png"] },
    { id: 7, name: "ফিমেল কেয়ার", price: 900, slug: "female-care", images: ["static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png", "static/Image/Badam Chatni.png"] }
];


/* =========================================
   2. RENDERING & SLIDERS
   ========================================= */
const productContainer = document.getElementById('product-list');

if (productContainer) {
    let productHTML = "";
    products.forEach((p, index) => {
        let imagesHtml = p.images.map(img => `<div class="swiper-slide"><img src="/${img}" alt="${p.name}"></div>`).join('');
        productHTML += `
            <div class="product-card">
                <div class="card-image-area">
                    <div class="swiper inner-swiper swiper-p-${index}">
                        <div class="swiper-wrapper">${imagesHtml}</div>
                    </div>
                </div>
                <div class="card-content-area">
                    <h3>${p.name}</h3>
                    <div class="button-grid">
                        <div class="btn-card btn-price">মূল্য: ${p.price} টাকা</div>
                        <button class="btn-card btn-order" onclick="openOrderModal('${p.name}', ${p.price}, ${p.special || false})">অর্ডার করুন</button>
                        <a href="/product/${p.slug}" class="btn-card btn-info">বিস্তারিত</a>
                    </div>
                </div>
            </div>`;
    });
    productContainer.innerHTML = productHTML;

 // Initialize Product Swipers
    products.forEach((p, index) => {
        let isReversed = Math.floor(index / 2) % 2 === 0;
        new Swiper(`.swiper-p-${index}`, {
            loop: true,
            autoplay: { delay: 3000,
            disableOnInteraction: false,
            reverseDirection: isReversed },
            speed: 800
        });
    });
}




/* ====================================================
   Product Showcase Data (Left-Right Alternating) Start
   ==================================================== */


const showcaseData = [
    {
        title: "৭ দিনের বিশেষ কোর্স",
        slug: "7-days-course",
        description: "আমাদের এই কোর্সটি সম্পূর্ণ প্রাকৃতিক ভেষজ উপাদান দিয়ে তৈরি। এটি কোনো পার্শ্বপ্রতিক্রিয়া ছাড়াই আপনার শরীরের ক্লান্তি দূর করে এবং নতুন শক্তি যোগায়। মাত্র ৭ দিনেই আপনি এর কার্যকারিতা অনুভব করবেন ইনশাআল্লাহ্।",
        image: "static/Image/7 Days Course.jpg"
    },
    {
        title: "প্রিমিয়াম বাদাম চাটনি",
        slug: "badam-chatni",
        description: "কাঠবাদাম, কাজুবাদাম এবং পেস্তা বাদামের সাথে খাঁটি মধু ও ঘি মিশিয়ে তৈরি এই চাটনি আপনার স্মৃতিশক্তি বাড়াতে এবং শারীরিক পুষ্টি নিশ্চিত করতে সাহায্য করে। ছোট বড় সবাই এটি আনন্দের সাথে খেতে পারে।",
        image: "static/Image/Badam Chatni.png"
    },
    {
        title: "ওয়েট লস প্যাক",
        slug: "weight-loss",
        description: "অতিরিক্ত ওজন বর্তমান সময়ের একটি বড় স্বাস্থ্য সমস্যা, যা মূলত অস্বাস্থ্যকর খাদ্যাভ্যাস এবং শারীরিক পরিশ্রমের অভাবের কারণে ঘটে। ব্যায়াম বা কঠোর ডায়েট ছাড়াই নিরাপদে ওজন কমাতে আমাদের এই প্যাকটি অত্যন্ত কার্যকর। এটি শরীরের অতিরিক্ত মেদ পুড়িয়ে আপনাকে দেয় একটি সুন্দর ও সুঠাম ফিগার।",
        image: "static/Image/Wet Loss.jpg"
    },
    {
        title: "আমাশা কেয়ার",
        slug: "amasha-care",
        description: "আমাশা শুধু সাধারণ পেটের অসুখ নয়—এটি দীর্ঘদিন চলতে থাকলে শরীরের জন্য ভয়াবহ ক্ষতির কারণ হতে পারে। বিশেষ করে রক্ত আমাশা একটি গুরুতর অন্ত্রের সংক্রমণ। এতে পায়খানার সঙ্গে রক্ত, তীব্র পেটব্যথা, দুর্বলতা ও জ্বর দেখা দিতে পারে। সময়মতো সঠিক চিকিৎসা না নিলে এই রোগ ধীরে ধীরে শরীরকে দুর্বল করে দেয় এবং IBS রুপ ধারন করে।.......",
        image: "static/Image/Wet Loss.jpg"
    },
    {
        title: "ফিমেল কেয়ার",
        slug: "female-care",
        description: "ঋতুস্রাব অনিয়ম, অতিরিক্ত বা কম স্রাব এবং পেটব্যথা—এ ধরনের সমস্যায় ভুগছেন ? স্রাব ঘন, হলুদ বা সবুজ রঙের হয় এবং সাথে তীব্র দুর্গন্ধ কিংবা চুলকানি থাকে, তবে বুঝতে হবে এটি কোনো সংক্রমণের লক্ষণ। প্রধানত ব্যক্তিগত পরিচ্ছন্নতার অভাব, ব্যাকটেরিয়া বা ছত্রাকের আক্রমণ এবং হরমোনের পরিবর্তনের কারণে এই সমস্যাটি দেখা দিয়ে থাকে। এটি দীর্ঘসময় অব্যাহত থাকলে......",
        image: "static/Image/Wet Loss.jpg"
    },
    {
        title: "গ্যাস্ট্র কেয়ার",
        slug: "gastro-care",
        description: "অতিরিক্ত গ্যাস বা পেট ফাঁপা একটি সাধারণ হজমের সমস্যা যা মূলত অতিরিক্ত তেল-মসলাযুক্ত খাবার এবং অনিয়মিত জীবনযাপনের কারণে হয়। এর ফলে পেটে অস্বস্তি, বুক জ্বালাপোড়া এবং পেট ফুলে যাওয়ার মতো যন্ত্রণাদায়ক লক্ষণ দেখা দেয়। দির্ঘদিন গ্যাস এর সমস্যা এবং এর সঠিক চিকিৎসা না করলে শরীরে বিভিন্ন রোগ সৃষ্টি হতে পারে।",
        image: "static/Image/Gastro Care.jpg"
    },
    {
        title: "এলার্জি রেমিডি",
        slug: "allergy-remedy",
        description: "এলার্জি হলো কোনো নির্দিষ্ট বস্তু বা খাবারের প্রতি আমাদের শরীরের রোগ প্রতিরোধ ব্যবস্থার একটি অস্বাভাবিক প্রতিক্রিয়া। সাধারণত ধুলোবালি, ফুলের রেণু এবং নির্দিষ্ট কিছু খাবার যেমন—চিংড়ি, ইলিশ, গরুর মাংস বা বেগুন থেকে এটি বেশি হয়। এর প্রধান লক্ষণগুলোর মধ্যে রয়েছে ত্বকে লাল চাকা হওয়া, প্রচণ্ড চুলকানি, অনবরত হাঁচি এবং চোখ দিয়ে জল পড়া। কোনো কোনো ক্ষেত্রে......",
        image: "static/Image/Allergy Remidy.png"
    }
];

const showcaseContainer = document.getElementById('showcase-container');

if (showcaseContainer) {
    showcaseData.forEach(item => {
        showcaseContainer.innerHTML += `
            <div class="showcase-item">
                <div class="showcase-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="showcase-content">
                    <h3>${item.title}</h3>
                    <p>${item.description}</p>
                    <a href="/product/${item.slug}" class="btn btn-primary" style="margin-top:20px; display:inline-block;">বিস্তারিত দেখুন</a>
                </div>
            </div>
        `;
    });

      
}



/* =========================================
   Dissolve Scroll-Reveal Logic
   ========================================= */

// 1. First, make sure the items are rendered (from previous step)
// 2. Then, run the observer logic:

const revealOnScroll = () => {
    const observerOptions = {
        threshold: 0.1, // Trigger when 15% of the item is visible
        // rootMargin helps trogger the animation slightly before it hits the edge
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // User is looking at the Item -> Dissolve IN
                entry.target.classList.add('appear');
            } else {
                //Item left the screen -> Dissolve OUT (so it can repeat)
                entry.target.classList.remove('appear');

            }
                
            
        });
    }, observerOptions);

    // Watch all showcase items
    const items = document.querySelectorAll('.showcase-item');
    items.forEach(item => {
        observer.observe(item);
    });
};

// Start the reveal logic after the content is loaded
document.addEventListener('DOMContentLoaded', () => {
    // If you are injecting HTML via JS, call revealOnScroll() 
    // immediately after the loop that adds the HTML.
    revealOnScroll();
});


/* ==================================================
   Product Showcase Data (Left-Right Alternating) End
   ================================================== */






// 1. Dynamic Video Data Start (Add more links here in the future)
// 1. Dynamic Video Data (URL + Title)
const productVideos = [
    { id: 1,
        title: "৭ দিনের কোর্স",
        url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F4151099761803652%2F&show_text=0&autoplay=1&mute=1" },
   
    { id: 2,
        title: "ওয়েট লস প্যাক",
        url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1501666217730556%2F&show_text=0&autoplay=1&mute=1" },
   
    { id: 3,
        title: "এলার্জি রেমেডি",
        url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1163202416007751%2F&show_text=0&autoplay=1&mute=1" },
    
    { id: 4,
        title: "গ্যাস্ট্র কেয়ার",
        url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F32672361935744616%2F&show_text=0&autoplay=1&mute=1" },
    
    { id: 5,
        title: "বাদাম চাটনি",
        url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1224869106176632%2F&show_text=0&autoplay=1&mute=1" },
    
    { id: 6,
        title: "বনাজী ফুড",
        url: "https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fbusiness.facebook.com%2Freel%2F1797232634281976%2F&show_text=0&autoplay=1&mute=1" }
];

// 2. Render Videos into Slider
const videoContainer = document.getElementById('video-list');

productVideos.forEach(video => {
    videoContainer.innerHTML += `
        <div class="swiper-slide">
            <div class="video-card">
                <div class="video-frame" onclick="this.classList.add('is-playing')">
                    <!-- Smart Overlay with Play Button -->
                    <div class="video-touch-overlay">
                        <i class="fas fa-play-circle"></i>
                    </div>
                    <iframe src="${video.url}" title="${video.title}" allowfullscreen></iframe>
                </div>
                <div class="video-info">
                    <h4>${video.title}</h4>
                </div>
            </div>
        </div>
    `;
});

// 3. Initialize Video Gallery Swiper
const videoSwiper = new Swiper('.video-slider', {
    slidesPerView: 1.3, // Show a bit of the next video on mobile
    spaceBetween: 15,
    loop: true,
    grabCursor: true, // Shows a hand icon on PC
    simulateTouch: true, // Enables touch simulation

    preventClicks: true,
    preventClicksPropagation: false,
    touchStartPreventDefault: false, // Helps with scrolling
    
    // Improved touch settings
    touchEventsTarget: 'container',
    threshold: 5, // Minimum pixels to move before swiping starts

    centeredSlides: false,
    autoplay: {
        delay: 4000, 
        disableOnInteraction: true, // Stop autoplay when customer interacts with video
    },
    pagination: {
        el: '.video-pagination',
        clickable: true,
    },
    breakpoints: { 
        640: { slidesPerView: 2 }, 
        1024: { slidesPerView: 4 }, // 3 videos on PC
        1400: { slidesPerView: 4 } 
    }
});


// 1. Dynamic Video Data End (Add more links here in the future)

// 1. Review Photos Data Start (Assuming names are review1.jpg, review2.jpg... inside Image folder)

const reviewImages = [
    "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg",
    "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg",
    "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg",
    "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg", "static/Image/7 Days Course.jpg"
];

// 2. Render Reviews into Slider
const reviewContainer = document.getElementById('review-list');
reviewImages.forEach(imgSrc => {
    reviewContainer.innerHTML += `
        <div class="swiper-slide">
            <div class="review-card">
                <img src="${imgSrc}" alt="Customer Review">
            </div>
        </div>
    `;
});

// 3. Initialize Review Slider
const reviewSwiper = new Swiper('.review-slider', {
    slidesPerView: 1.5,
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    autoplay: {
        delay: 3000, // Slides every 2.5 seconds
        disableOnInteraction: false,
    },
    pagination: {
        el: '.review-pagination',
        clickable: true,
    },
    breakpoints: { 
        640: { slidesPerView: 3 }, 
        1024: { slidesPerView: 3 }, 
        1400: { slidesPerView: 5 } 
    }
});

// 1. Review Photos Data End (Assuming names are review1.jpg, review2.jpg... inside Image folder)




/* =========================================
   1. 24-HOUR BLOCK LOGIC
   ========================================= */

function isOrderBlocked() {
    const lastOrder = localStorage.getItem('lastOrderTime');
    const now = new Date().getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    if (lastOrder && (now - lastOrder < twentyFourHours)) {
        alert("আপনি সম্প্রতি একটি অর্ডার করেছেন। পরবর্তী অর্ডারের জন্য কিছুক্ষণ অপেক্ষা করুন। অথবা কল করুনঃ 01912616261,01618985546");
        return true; 
    }
    return false;
}

function checkProStatus() {
    // Only apply discount if the navbar button has the 'verified-member' class
    const isVerified = document.querySelector('.pro-nav-btn.verified-member') !== null;
    return isVerified;
}

function calculateTotal() {
    const isPro = checkProStatus();
    let isBadam = document.getElementById('prodName').value === "বাদাম চাটনি";
    let base = (isBadam) ? parseInt(document.getElementById('prodWeight').value) : currentBasePrice;
    // Apply 20% Discount If Pro Member
    let finalBase = isPro ? (base * 0.8) : base;
    let qty = parseInt(document.getElementById('prodQty').value) || 1;
    let ship = parseInt(document.getElementById('shippingLoc').value) || 0;
    document.getElementById('totalPriceDisplay').innerText = Math.round((finalBase * qty) + ship);
}

function calculateDirectTotal() {
    const isPro = checkProStatus();
    const select = document.getElementById('dirProdSelect');
    if(!select.value) return;
    let isBadam = select.value === "Badam Chatni";
    let base = 0;
    
    // Get Base Price
    if (isBadam) {
        base = parseInt(document.getElementById('dirProdWeight').value);
    } else {
        base = parseInt(select.option[select.selectedIndex].getAttribute('data-price'));
    }

    // Apply 20% Discount if Pro Member
    let finalBase = isPro ? (base * 0.8) : base;

    let qty = parseInt(document.getElementById('dirProdQty').value) || 1;
    let ship = parseInt(document.getElementById('dirShipping').value) || 0;
    document.getElementById('dirTotalDisplay').innerText = Math.round((finalBase * qty) + ship);
}


// --- Pop Up Form Mobile Number Input Limitation Start ---

function checkModalForm() {
    const namepop = document.getElementById('custName').value.trim();
    const mobilepop = document.getElementById('custMobile').value.trim();
    const addresspop = document.getElementById('custAddress').value.trim();
    const submitBtnpop = document.getElementById('modalSubmitBtn');
    const addrWarningpop = document.getElementById('modalAddrWarning');
    const namWarningpop = document.getElementById('modalNamWarning');

    // Validation Conditions
    const isNameValidpop = namepop.length > 2;
    const isMobileValidpop = mobilepop.startsWith('01') && mobilepop.length === 11;
    const isAddressValidpop = addresspop.length >= 10;
    
    if (namepop.length > 0 && namepop.length < 3) {
        namWarningpop.style.display = "block";
    } else {
        namWarningpop.style.display = "none";
    }

    if (addresspop.length > 0 && addresspop.length < 10) {
        addrWarningpop.style.display = "block";
    } else {
        addrWarningpop.style.display = "none";
    }

    if (isNameValidpop && isMobileValidpop && isAddressValidpop) {
        submitBtnpop.disabled = false; // ENABLE BUTTON
        submitBtnpop.style.opacity = "1";
    } else {
        submitBtnpop.disabled = true;  // DISABLE BUTTON
    }
}

/**
 * Re-using your existing Phone Validation logic with a small addition 
 * to check the form state every time someone types.
 */
function validatePhoneRealTime(inputElpop, nextFieldIdpop, warningIdpop) {
    const valpop = inputElpop.value.replace(/\D/g, ''); 
    inputElpop.value = valpop; 
    
    const nextFieldpop = document.getElementById(nextFieldIdpop);
    const warningpop = document.getElementById(warningIdpop);
    const isValidpop = valpop.startsWith('01') && valpop.length === 11;

    if (isValidpop) {
        nextFieldpop.disabled = false;
        nextFieldpop.placeholder = "গ্রাম/বাসা, থানা, জেলা";
        warningpop.style.display = "none";
        inputElpop.style.border = "2px solid #008d0c";
    } else {
        nextFieldpop.disabled = true;
        nextFieldpop.placeholder = "আগে সঠিক মোবাইল নম্বর লিখুন";
        inputElpop.style.border = "2px solid red";
        if (valpop.length > 0) warningpop.style.display = "block";
    }
}

// --- Pop Up Form Mobile Number Input Limitation End ---

// --- Main Form Mobile Number Input Limitation Start ---


/**
 * Monitors the landing page form and enables/disables the button
 */
function checkLandingForm() {
    const name = document.getElementById('dirCustName').value.trim();
    const mobile = document.getElementById('dirCustMobile').value.trim();
    const address = document.getElementById('dirCustAddress').value.trim();
    const submitBtn = document.getElementById('dirSubmitBtn');
    const addrWarning = document.getElementById('addrWarning');
    const namWarning = document.getElementById('namWarning');

    // Validation Conditions
    const isNameValid = name.length > 2;
    const isMobileValid = mobile.startsWith('01') && mobile.length === 11;
    const isAddressValid = address.length >= 10;
    
    if (name.length > 0 && name.length < 3) {
        namWarning.style.display = "block";
    } else {
        namWarning.style.display = "none";
    }

    if (address.length > 0 && address.length < 10) {
        addrWarning.style.display = "block";
    } else {
        addrWarning.style.display = "none";
    }

    if (isNameValid && isMobileValid && isAddressValid) {
        submitBtn.disabled = false; // ENABLE BUTTON
        submitBtn.style.opacity = "1";
    } else {
        submitBtn.disabled = true;  // DISABLE BUTTON
    }
}

/**
 * Re-using your existing Phone Validation logic with a small addition 
 * to check the form state every time someone types.
 */
function validatePhoneRealTime(inputEl, nextFieldId, warningId) {
    const val = inputEl.value.replace(/\D/g, ''); 
    inputEl.value = val; 
    
    const nextField = document.getElementById(nextFieldId);
    const warning = document.getElementById(warningId);
    const isValid = val.startsWith('01') && val.length === 11;

    if (isValid) {
        nextField.disabled = false;
        nextField.placeholder = "গ্রাম/বাসা, থানা, জেলা";
        warning.style.display = "none";
        inputEl.style.border = "2px solid #008d0c";
    } else {
        nextField.disabled = true;
        nextField.placeholder = "আগে সঠিক মোবাইল নম্বর লিখুন";
        inputEl.style.border = "2px solid red";
        if (val.length > 0) warning.style.display = "block";
    }
}


// --- Main Form Mobile Number Input Limitation End ---


/* =========================================
   4. ORDER SUBMISSION
   ========================================= */

function sendOrder(orderObj, btn) {
    const originalText = btn.innerText;
    btn.disabled = true;
    btn.innerText = "অর্ডার কনফার্ম হচ্ছে...";

    fetch('/submit-order', {
    method: 'POST',
    headers: {
        'Content-type': 'application/json'
    },
    body: JSON.stringify(orderObj) // Sending as JSOn string
    })

    .then(res => res.json())
    .then(data => {
        if(data.status === "success") {
            localStorage.setItem('lastOrderTime', new Date().getTime());
            document.getElementById('orderModal').style.display = "none";
            showConfirmation(orderObj.Product, orderObj.Total);
            document.getElementById('orderForm').reset();
            if(document.getElementById('directOrderForm'))
            document.getElementById('directOrderForm').reset();
        }
        else if (data.status === "blocked") {
            alert(data.message);
        }

        btn.disabled = false;
        btn.innerText = originalText;
    })
    .catch((err) => {
        console.error(err);
        alert("ত্রুটি হয়েছে। আবার চেষ্টা করুন।");
        btn.disabled = false;
        btn.innerText = originalText;
    });
}



// Popup Form Submit
document.getElementById('orderForm').onsubmit = function(e) {
    e.preventDefault();
    if (isOrderBlocked()) return;

    const orderObj = {
        CustomerName: document.getElementById('custName').value,
        Address: document.getElementById('custAddress').value,
        Mobile: document.getElementById('custMobile').value,
        Product: document.getElementById('prodName').value,
        Quantity: document.getElementById('prodQty').value,
        ShippingType: document.getElementById('shippingLoc').options[document.getElementById('shippingLoc').selectedIndex].text,
        Weight: document.getElementById('prodName').value.includes("বাদাম") ? document.getElementById('prodWeight').options[document.getElementById('prodWeight').selectedIndex].text : "Standard",
        Total: document.getElementById('totalPriceDisplay').innerText
    };
    sendOrder(orderObj, e.target.querySelector('button'));
};


// Permanent Form Submit
document.getElementById('directOrderForm').onsubmit = function(e) {
    e.preventDefault();
    if (isOrderBlocked()) return;

    const select = document.getElementById('dirProdSelect');
    const orderObj = {
        CustomerName: document.getElementById('dirCustName').value,
        Address: document.getElementById('dirCustAddress').value,
        Mobile: document.getElementById('dirCustMobile').value,
        Product: select.value,
        Quantity: document.getElementById('dirProdQty').value,
        ShippingType: document.getElementById('dirShipping').options[document.getElementById('dirShipping').selectedIndex].text,
        Weight: select.value === "Badam Chatni" ? document.getElementById('dirProdWeight').options[document.getElementById('dirProdWeight').selectedIndex].text : "Standard",
        Total: document.getElementById('dirTotalDisplay').innerText
    };
    sendOrder(orderObj, document.getElementById('dirSubmitBtn'));
};

/* =========================================
   5. UI HELPERS
   ========================================= */
function openOrderModal(name, price, isSpecial) {
    if (isOrderBlocked()) return;
    document.getElementById('prodName').value = name;
    currentBasePrice = price;
    document.getElementById('weightGroup').style.display = isSpecial ? 'block' : 'none';
    document.getElementById('orderModal').style.display = "block";
    calculateTotal();
}

function handleDirectProductChange() {
    const val = document.getElementById('dirProdSelect').value;
    document.getElementById('dirWeightBox').style.display = (val === "Badam Chatni") ? "block" : "none";
    calculateDirectTotal();
}

function showConfirmation(name, total) {
    document.getElementById('orderHistory').innerHTML = `
        <div style="text-align:center; padding: 10px;">
            <div style="font-size: 70px; margin-bottom: 15px; animation: bounce 1s ease infinite;">😊</div>
            <h2 style="color: #008d0c; font-family: 'Tiro Bangla', serif;">অর্ডার সফল হয়েছে!</h2>
            <p>পণ্য: <strong>${name}</strong></p>
            <p>মোট বিল: <strong>${total} টাকা</strong></p>
            <button onclick="closeConfirmModal()" class="confirm-btn-final" style="margin-top:20px; background:#008d0c; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">ঠিক আছে</button>
        </div>`;
    document.getElementById('confirmModal').style.display = "block";
}

function closeConfirmModal() { document.getElementById('confirmModal').style.display = "none"; }
document.querySelector('.close-modal').onclick = () => document.getElementById('orderModal').style.display = "none";

// Event Listeners for Live Calculation
document.getElementById('prodQty').oninput = calculateTotal;
document.getElementById('shippingLoc').onchange = calculateTotal;
document.getElementById('prodWeight').onchange = calculateTotal;
document.getElementById('dirProdQty').oninput = calculateDirectTotal;
document.getElementById('dirShipping').onchange = calculateDirectTotal;
document.getElementById('dirProdWeight').onchange = calculateDirectTotal;



// --- Mobile Menu Toggle Start ---

const mobileToggle = document.querySelector('.mobile-toggle');
const navbarMenu = document.querySelector('.navbar');

if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
        // Toggle the 'active' class on the navbar
        navbarMenu.classList.toggle('active');

        // Optional: Change icon from 'bars' to 'X' when open
        const icon = mobileToggle.querySelector('i');
        if (navbarMenu.classList.contains('active')) {
            icon.classList.replace('fa-bars', 'fa-times');
        } else {
            icon.classList.replace('fa-times', 'fa-bars');
        }
    });
}

// Close menu when a link is clicked (useful for landing pages)
document.querySelectorAll('.navbar a').forEach(link => {
    link.addEventListener('click', () => {
        navbarMenu.classList.remove('active');
        const icon = mobileToggle.querySelector('i');
        icon.classList.replace('fa-times', 'fa-bars');
    });
});

// --- Mobile Menu Toggle END ---





/* ===============================================
   Dissolve Transition Targeted Reveal Logic Start
   =============================================== */

const initTargetedReveal = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px" 
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('appear');
            } else {
                // Remove to make it repeat every time you scroll up/down
                entry.target.classList.remove('appear');
            }
        });
    }, observerOptions);

    // ONLY select elements that have the specific class
    const targetedSections = document.querySelectorAll('.reveal-vibe');
    
    targetedSections.forEach(section => {
        observer.observe(section);
    });
};

document.addEventListener('DOMContentLoaded', initTargetedReveal);



/* =============================================
   Dissolve Transition Targeted Reveal Logic End
   ============================================= */











   document.querySelector('.hero').classList.add('section-appear');