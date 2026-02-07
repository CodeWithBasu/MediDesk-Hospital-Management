async function testLogin() {
  console.log('Testing login...');
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: 'admin',
        password: 'admin123'
      })
    });
    
    if (response.ok) {
        const data = await response.json();
        console.log('Login Success!');
        console.log('Token:', data.token ? 'Received' : 'Missing');
    } else {
        console.error('Login Failed with status:', response.status);
        const text = await response.text();
        console.error('Response:', text);
    }

  } catch (error: any) {
    console.error('Login Failed!', error);
  }
}

testLogin();
