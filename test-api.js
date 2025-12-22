// Test registration API
const testData = {
    username: "testuser456",
    email: "testuser456@example.com",
    password: "Test123!",
    role: "client"
};

fetch('http://localhost:5000/api/auth/register', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(testData)
})
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
