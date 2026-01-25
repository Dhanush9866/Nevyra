// Node 18+ has native fetch
async function check() {
    const url = 'http://localhost:8000/api/v1/seller/ping';
    console.log(`Checking ${url}...`);
    try {
        const res = await fetch(url);
        console.log(`Status: ${res.status} ${res.statusText}`);
        const text = await res.text();
        console.log(`Body: ${text.substring(0, 100)}`);
    } catch (err) {
        console.error('Error:', err.message);
    }
}

check();
