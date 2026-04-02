// script.js
import { Rive, Layout, Fit, Alignment } from '@rive-app/canvas';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Rive animation
    const canvas = document.getElementById('riveCanvas');
    const r = new Rive({
        src: './riv/插画.riv', // 使用相对路径，适配 GitHub Pages 部署
        canvas: canvas,
        autoplay: true,
        // 使用 Layout 告诉 Rive 引擎如何自适应这个 canvas
        // fit: Fit.Cover 会保证动画内容充满容器，类似 css 的 object-fit: cover
        layout: new Layout({
            fit: Fit.Cover,
            alignment: Alignment.Center,
        }),
        onLoad: () => {
            r.resizeDrawingSurfaceToCanvas();
        },
    });

    // Handle window resize to keep canvas sharp
    window.addEventListener('resize', () => {
        if (r) {
            r.resizeDrawingSurfaceToCanvas();
        }
        if (eyeRive) {
            eyeRive.resizeDrawingSurfaceToCanvas();
        }
    });

    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const rememberCheckbox = document.getElementById('remember');

    // Initialize Eyes Rive animation
    const eyeCanvas = document.getElementById('eyeCanvas');
    let displayInput = null;
    const eyeRive = new Rive({
        src: './riv/eyes.riv',
        canvas: eyeCanvas,
        stateMachines: 'State Machine 1', // 保证正常运行状态机
        autoplay: true,
        // 自动绑定默认的视图模型（如果有的话）
        autoBind: true,
        onLoad: () => {
            eyeRive.resizeDrawingSurfaceToCanvas();
            
            // 获取名为 'Eyes' 的视图模型 (ViewModel)
            const viewModel = eyeRive.viewModelByName('Eyes');
            if (viewModel) {
                // 获取视图模型的默认实例并绑定到画板
                const instance = viewModel.defaultInstance();
                eyeRive.bindViewModelInstance(instance);
                
                // 从视图模型实例中获取名为 'display' 的布尔值
                displayInput = instance.boolean('display');
                
                // 初始状态根据密码框类型设置
                if (displayInput) {
                    const type = passwordInput.getAttribute('type');
                    displayInput.value = (type === 'text');
                }
            }
        },
    });
    
    // 监听全局鼠标移动，传递给 eyeCanvas 以触发 Rive 内部的“跟随触发区域”监听器
    window.addEventListener('mousemove', (e) => {
        // 阻止我们自己派发的合成事件再次触发该监听器，防止无限递归
        if (!e.isTrusted) return;

        if (eyeCanvas) {
            // 构造一个合成的鼠标移动事件并派发到 eyeCanvas
            // Rive 引擎内部已在 canvas 上绑定了 mousemove 监听，这会触发对齐目标
            const fakeEvent = new MouseEvent('mousemove', {
                clientX: e.clientX,
                clientY: e.clientY,
                bubbles: false // 取消冒泡，防止事件循环
            });
            eyeCanvas.dispatchEvent(fakeEvent);
        }
    });

    togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // 切换时更新视图模型中的布尔值
        if (displayInput) {
            displayInput.value = (type === 'text');
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