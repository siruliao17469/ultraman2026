document.addEventListener('DOMContentLoaded', () => {
    const authStatusDiv = document.getElementById('auth-status');
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const errorMessageDiv = document.getElementById('error-message');
    const defaultAvatar = 'image/default_avatar.png'; // 使用一个存在的图片作为默认头像

    // 核心：将更新函数和刷新逻辑封装
    const userAuth = {
        // 1. 统一的视图更新函数
        updateDisplay: function(userData) {
            if (!authStatusDiv) return;

            if (userData && userData.logged_in) {
                const username = userData.username || 'ユーザー';
                const avatarPath = userData.profile_image_path || defaultAvatar;
                
                authStatusDiv.innerHTML = `
                    <div class="d-flex align-items-center">
                        <img src="${avatarPath}" alt="${username}" class="rounded-circle me-2" style="width: 50px; height: 50px; object-fit: cover;">
                        <span style="margin-right: 15px;">ようこそ、${username} さん</span>
                        <a href="mypage.html" class="btn btn-sm btn-primary" style="margin-right: 8px;">マイページ</a>
                        <a href="php/logout.php" class="btn btn-sm btn-outline-secondary">ログアウト</a>
                    </div>
                `;
            } else {
                authStatusDiv.innerHTML = `
                    <a href="login.html" class="btn btn-sm btn-primary" style="margin-right: 8px;">ログイン</a>
                    <a href="signup.html" class="btn btn-sm btn-secondary">新規登録</a>
                `;
            }
        },

        // 2. 从 localStorage 读取并更新视图的函数
        refreshFromStorage: function() {
            try {
                const cachedUser = localStorage.getItem('ultra_user');
                this.updateDisplay(cachedUser ? JSON.parse(cachedUser) : null);
            } catch (e) {
                console.error('Error parsing cached user data:', e);
                localStorage.removeItem('ultra_user');
                this.updateDisplay(null);
            }
        },

        // 3. 初始化和从服务器同步的函数
        init: function() {
            // 立即从缓存渲染，消除闪烁
            this.refreshFromStorage();

            // 然后从服务器获取最新状态
            if (authStatusDiv) {
                fetch(`php/session_check.php?_=${new Date().getTime()}`)
                    .then(response => response.ok ? response.json() : Promise.reject(`Network error: ${response.status}`))
                    .then(data => {
                        if (data && typeof data === 'object') {
                            if (data.logged_in) {
                                localStorage.setItem('ultra_user', JSON.stringify(data));
                            } else {
                                localStorage.removeItem('ultra_user');
                            }
                            // 无论登录与否，都用服务器返回的最新状态刷新一次
                            this.refreshFromStorage();
                        } else {
                            throw new Error('Invalid data format from server.');
                        }
                    })
                    .catch(error => {
                        console.error('Error updating auth status:', error);
                        localStorage.removeItem('ultra_user');
                        this.refreshFromStorage();
                    });
            }
        }
    };

    // 立即执行初始化
    userAuth.init();

    // 4. 将刷新函数暴露到全局，以便其他脚本可以调用
    window.forceUpdateUserDisplay = userAuth.refreshFromStorage.bind(userAuth);

    // 5. 监听来自其他页面的 storage 变化
    window.addEventListener('storage', (event) => {
        if (event.key === 'ultra_user' || event.key === 'avatar_updated') {
            userAuth.refreshFromStorage();
        }
    });

    // --- 登录、注册、登出逻辑保持不变 ---

    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(loginForm);

            fetch('php/login_check.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    localStorage.setItem('ultra_user', JSON.stringify(data.user));
                    window.location.href = 'index.html';
                } else {
                    if (errorMessageDiv) {
                        errorMessageDiv.textContent = data.message || 'ログインに失敗しました。';
                        errorMessageDiv.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                console.error('Login error:', error);
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = '通信エラーが発生しました。';
                    errorMessageDiv.style.display = 'block';
                }
            });
        });
    }

    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(signupForm);
            const password = formData.get('password');
            const confirmPassword = formData.get('confirm_password');

            if (password !== confirmPassword) {
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = 'パスワードが一致しません。';
                    errorMessageDiv.style.display = 'block';
                }
                return;
            }

            // FormData をプレーンなオブジェクトに変換
            const data = Object.fromEntries(formData.entries());

            fetch('php/signup_check.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data) // JSONとして送信
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.href = 'login.html';
                } else {
                    if (errorMessageDiv) {
                        errorMessageDiv.textContent = data.message || '登録に失敗しました。';
                        errorMessageDiv.style.display = 'block';
                    }
                }
            })
            .catch(error => {
                console.error('Signup error:', error);
                if (errorMessageDiv) {
                    errorMessageDiv.textContent = '通信エラーが発生しました。';
                    errorMessageDiv.style.display = 'block';
                }
            });
        });
    }
    
    if (authStatusDiv) {
        authStatusDiv.addEventListener('click', function(event) {
            if (event.target.matches('a[href="php/logout.php"]')) {
                localStorage.removeItem('ultra_user');
                localStorage.removeItem('avatar_updated');
            }
        });
    }
});