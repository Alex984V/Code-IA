var signupForm = document.getElementById('signup-form');
signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        document.getElementById('message').innerHTML = data.message;
    } catch (err) {
        document.getElementById('message').innerHTML = 'Erro de conexão';
    }
});

// Login (caso queira)
var loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            document.getElementById('message').innerHTML = data.message;
        } catch (err) {
            document.getElementById('message').innerHTML = 'Erro de conexão';
        }
    });
}
