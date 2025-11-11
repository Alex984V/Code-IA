/*'use strict';

const token = localStorage.getItem('token');
const fallbackUser = JSON.parse(localStorage.getItem('user'));

// Função para atualizar o HTML
function updateProfile(user) {
    document.getElementById('user-name').textContent = user.name || "Usuário";
    document.getElementById('user-email').textContent = `Email do usuário: ${user.email || "não disponível"}`;
    document.getElementById('user-plano').textContent = `Plano: ${user.plan || "Grátis"}`;
    document.getElementById('user-profile-pic').src = user.profilePic || "https://via.placeholder.com/120";

    const planos = ['grátis', 'mensal', 'anual'];
    planos.forEach(plano => {
        const btn = document.getElementById(`plan-${plano}`);
        if (btn) {
            btn.textContent = (user.plan === plano) ? "Seu Plano Atual" : `Assinar ${plano.charAt(0).toUpperCase() + plano.slice(1)}`;
        }
    });
}

// Usa fallback primeiro
if (fallbackUser) {
    updateProfile(fallbackUser);
}

// Tenta buscar do backend apenas se houver token
if (token) {
    fetch('http://localhost:3000/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => {
        if (res.status === 401) throw new Error("Não autorizado");
        return res.json();
    })
    .then(data => {
        updateProfile({
            name: data.name,
            email: data.email,
            plan: data.plan,
            profilePic: data.profilePicUrl
        });
        // Atualiza fallback
        localStorage.setItem('user', JSON.stringify({
            name: data.name,
            email: data.email,
            plan: data.plan,
            profilePic: data.profilePicUrl
        }));
    })
    .catch(err => {
        console.error(err);
        // Se não tiver fallback, manda pro login
        if (!fallbackUser) {
            localStorage.removeItem('token');
            window.location.href = 'loggin.html';
        }
    });
} else {
    // Se não houver token nem fallback, vai pro login
    if (!fallbackUser) {
        window.location.href = 'loggin.html';
    }
}

// Logout
document.getElementById('logout-link').addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'loggin.html';
});
