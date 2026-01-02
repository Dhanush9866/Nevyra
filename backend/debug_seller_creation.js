const axios = require('axios');

const API_URL = 'http://localhost:8000/api/auth';

const run = async () => {
    try {
        const email = `debug_${Date.now()}@test.com`;
        const password = 'Password@123';
        const phone = `999${Math.floor(Math.random() * 10000000)}`;

        console.log(`1. Registering user: ${email}`);
        await axios.post(`${API_URL}/register`, {
            firstName: 'Debug',
            lastName: 'User',
            email,
            password,
            phone,
            address: '123 Test St'
        });

        console.log('2. Logging in...');
        const loginRes = await axios.post(`${API_URL}/login`, { email, password });
        const token = loginRes.data.data.token;
        console.log('   Token received.');

        console.log('3. Creating Seller Profile...');
        try {
            await axios.post(`${API_URL}/create-seller`, {
                storeName: `Debug Store ${Date.now()}`,
                sellerType: 'Individual',
                gstNumber: `29ABC${Math.floor(Math.random() * 10000)}F1${Math.random() > 0.5 ? 'Z' : 'Y'}5`,
                businessAddress: {
                    address: '123 Business St',
                    city: 'Test City',
                    pincode: '123456'
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('   Success! Seller profile created.');
        } catch (e) {
            console.log('   FAILED!');
            if (e.response) {
                console.log('   Status:', e.response.status);
                console.log('   Data:', JSON.stringify(e.response.data, null, 2));
            } else {
                console.log('   Error:', e.message);
            }
        }

    } catch (error) {
        console.error('Script failed:', error.response ? error.response.data : error.message);
    }
};

run();
