// script.js
import { Rive } from '@rive-app/canvas';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Rive animation
    const canvas = document.getElementById('riveCanvas');
    const r = new Rive({
        src: './riv/插画.riv', // 使用相对路径，适配 GitHub Pages 部署
        canvas: canvas,
        autoplay: true,
        onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
        },
    });

    // Handle window resize to keep canvas sharp
    window.addEventListener('resize', () => {
        if (r) {
            r.resizeDrawingSurfaceToCanvas();
        }
    });

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('remember');
    
    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const svg = togglePassword.querySelector('.eye-icon');
        if (type === 'text') {
            svg.innerHTML = `
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                <line x1="1" y1="1" x2="23" y2="23"></line>
            `;
        } else {
            svg.innerHTML = `
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
            `;
        }
    });
    
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        
        if (!email) {
            alert('Please enter your email');
            return;
        }
        
        if (!password) {
            alert('Please enter your password');
            return;
        }
        
        if (rememberCheckbox.checked) {
            localStorage.setItem('rememberMe', 'true');
            localStorage.setItem('email', email);
        } else {
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('email');
        }
        
        simulateLogin(email);
    });
    
    function simulateLogin(email) {
        const submitBtn = document.querySelector('.btn-primary');
        const originalText = submitBtn.textContent;
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        setTimeout(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            
            alert(`Welcome back, ${email}!`);
            loginForm.reset();
        }, 1000);
    }
    
    if (localStorage.getItem('rememberMe') === 'true') {
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            emailInput.value = savedEmail;
            rememberCheckbox.checked = true;
        }
    }
});