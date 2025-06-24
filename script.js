// script.js এর শুরুতে যোগ করুন
const expirationUnit = document.getElementById('expirationUnit');
const expirationInputs = document.getElementById('expirationInputs');

expirationUnit.addEventListener('change', () => {
    const unit = expirationUnit.value;
    expirationInputs.innerHTML = ''; // আগের ইনপুট মুছে দিন

    if (unit === 'hours') {
        expirationInputs.innerHTML = '<input type="number" id="expirationValue" placeholder="Enter Hours (1-24)">';
    } else if (unit === 'date') {
        expirationInputs.innerHTML = '<input type="date" id="expirationValue">';
    }
});



document.getElementById('generateBtn').addEventListener('click', async () => {
    const longUrl = document.getElementById('longUrl').value;
    const customName = document.getElementById('customName').value;
    const resultDiv = document.getElementById('result');

    // আপনার হোস্ট করা ব্যাকএন্ড সার্ভারের URL
    const backendApiUrl = 'https://devil-x-url-shortener-backend.onrender.com/api/create';

    if (!longUrl) {
        resultDiv.innerHTML = `<p class="error">অনুগ্রহ করে একটি লিংক দিন।</p>`;
        return;
    }

    // fetch করার আগে যোগ করুন
const unit = expirationUnit.value;
const valueInput = document.getElementById('expirationValue');
let expiration = null;

if (unit !== 'permanent' && valueInput && valueInput.value) {
    expiration = {
        unit: unit,
        value: valueInput.value
    };
}

// এখন body অংশটি আপডেট করুন
const body = {
    longUrl: longUrl,
    customName: customName,
    expiration: expiration // <-- নতুন তথ্য যোগ করা হলো
};
// --- এই try-catch ব্লকটি সম্পূর্ণ রিপ্লেস করুন ---
try {
    const response = await fetch(backendApiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)({
            longUrl: longUrl,
            customName: customName
        })
    });

    const data = await response.json();

    // --- পরিবর্তন শুরু ---
    const resultContainer = document.getElementById('result');
    const errorDisplay = document.querySelector('.result-container p');
    const shortUrlInput = document.getElementById('shortUrlInput');
    const copyBtn = document.getElementById('copyBtn');

    if (response.ok) {
        // সফল হলে রেজাল্ট বক্স দেখান
        errorDisplay.textContent = 'আপনার শর্ট লিঙ্ক তৈরি হয়েছে:';
        errorDisplay.style.color = '#ccc';
        shortUrlInput.value = data.shortUrl;
        resultContainer.style.display = 'block';

        // কপি বাটনে ইভেন্ট লিসেনার যোগ করা
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(shortUrlInput.value).then(() => {
                // সফলভাবে কপি হলে
                const originalIcon = copyBtn.innerHTML;
                copyBtn.innerHTML = 'কপি হয়েছে!';
                copyBtn.classList.add('copied');

                setTimeout(() => {
                    copyBtn.innerHTML = originalIcon;
                    copyBtn.classList.remove('copied');
                }, 2000); // ২ সেকেন্ড পর আগের অবস্থায় ফিরে আসবে
            });
        };

    } else {
        // এরর হলে এরর মেসেজ দেখান
        errorDisplay.textContent = data.message || 'কিছু একটা সমস্যা হয়েছে';
        errorDisplay.style.color = '#e74c3c'; // লাল রঙ
        document.querySelector('.result-box').style.display = 'none'; // ইনপুট বক্স লুকিয়ে ফেলুন
        resultContainer.style.display = 'block';
    }
    // --- পরিবর্তন শেষ ---

} catch (error) {
    // --- এই অংশটিও আপডেট করুন ---
    const resultContainer = document.getElementById('result');
    const errorDisplay = document.querySelector('.result-container p');
    errorDisplay.textContent = 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না।';
    errorDisplay.style.color = '#e74c3c';
    document.querySelector('.result-box').style.display = 'none';
    resultContainer.style.display = 'block';
}
});