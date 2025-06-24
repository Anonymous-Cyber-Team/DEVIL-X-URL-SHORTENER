// --- script.js ফাইলের নতুন এবং সঠিক কোড ---

document.addEventListener('DOMContentLoaded', () => {
    // প্রয়োজনীয় সব HTML এলিমেন্টগুলোকে একবারেই নিয়ে নেওয়া
    const generateBtn = document.getElementById('generateBtn');
    const longUrlInput = document.getElementById('longUrl');
    const customNameInput = document.getElementById('customName');
    const resultContainer = document.getElementById('result');
    const expirationUnit = document.getElementById('expirationUnit');
    const expirationInputs = document.getElementById('expirationInputs');

    // আপনার হোস্ট করা ব্যাকএন্ড সার্ভারের সঠিক URL
    const backendApiUrl = 'https://devil-x.onrender.com/api/create';

    // ড্রপডাউন পরিবর্তনের জন্য ইভেন্ট লিসেনার
    expirationUnit.addEventListener('change', () => {
        const unit = expirationUnit.value;
        expirationInputs.innerHTML = ''; // আগের ইনপুট মুছে দিন

        if (unit === 'hours') {
            expirationInputs.innerHTML = '<input type="number" id="expirationValue" placeholder="Enter Hours (e.g., 1-24)">';
        } else if (unit === 'date') {
            expirationInputs.innerHTML = '<input type="date" id="expirationValue">';
        }
    });

    // জেনারেট বাটনে ক্লিক করার জন্য ইভেন্ট লিসেনার
    generateBtn.addEventListener('click', async () => {
        const longUrl = longUrlInput.value;
        const customName = customNameInput.value;

        if (!longUrl) {
            alert('অনুগ্রহ করে একটি লিংক দিন।');
            return;
        }

        // এক্সপায়ারেশন তথ্য সংগ্রহ করা
        const unit = expirationUnit.value;
        const valueInput = document.getElementById('expirationValue');
        let expiration = null;

        if (unit !== 'permanent' && valueInput && valueInput.value) {
            expiration = {
                unit: unit,
                value: valueInput.value
            };
        }

        // API-তে পাঠানোর জন্য সঠিক বডি তৈরি করা
        const requestBody = {
            longUrl: longUrl,
            customName: customName,
            expiration: expiration
        };

        try {
            const response = await fetch(backendApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                // ---> এখানে ভুলটি ঠিক করা হয়েছে <---
                body: JSON.stringify(requestBody)
            });

            const data = await response.json();

            // রেজাল্ট দেখানোর জন্য এলিমেন্টগুলো সিলেক্ট করা
            const resultParagraph = resultContainer.querySelector('p');
            const resultBox = resultContainer.querySelector('.result-box');
            const shortUrlInput = document.getElementById('shortUrlInput');

            if (response.ok) {
                // সফল হলে রেজাল্ট বক্স দেখানো
                resultParagraph.textContent = 'আপনার শর্ট লিঙ্ক তৈরি হয়েছে:';
                resultParagraph.style.color = '#ccc';
                shortUrlInput.value = data.shortUrl;
                resultBox.style.display = 'flex';
                resultContainer.style.display = 'block';

                const copyBtn = document.getElementById('copyBtn');
                copyBtn.onclick = () => {
                    navigator.clipboard.writeText(shortUrlInput.value).then(() => {
                        const originalIcon = copyBtn.innerHTML;
                        copyBtn.textContent = 'কপি হয়েছে!';
                        copyBtn.classList.add('copied');
                        setTimeout(() => {
                            copyBtn.innerHTML = originalIcon;
                            copyBtn.classList.remove('copied');
                        }, 2000);
                    });
                };
            } else {
                // সার্ভার থেকে এরর আসলে সেটি দেখানো
                resultParagraph.textContent = data.message || 'কিছু একটা সমস্যা হয়েছে';
                resultParagraph.style.color = '#e74c3c';
                resultBox.style.display = 'none';
                resultContainer.style.display = 'block';
            }
        } catch (error) {
            // নেটওয়ার্ক বা অন্য কোনো কারণে সার্ভারে সংযোগ করতে না পারলে এই বার্তা দেখানো
            const resultParagraph = resultContainer.querySelector('p');
            const resultBox = resultContainer.querySelector('.result-box');
            resultParagraph.textContent = 'সার্ভারের সাথে সংযোগ করা যাচ্ছে না।';
            resultParagraph.style.color = '#e74c3c';
            resultBox.style.display = 'none';
            resultContainer.style.display = 'block';
        }
    });
});