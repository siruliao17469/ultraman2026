document.addEventListener('DOMContentLoaded', () => {
    // 注意：这里获取的是帖子列表的容器，不是个人信息容器
    const userPostsContainer = document.getElementById('post-list'); 
    const messageContainer = document.getElementById('message-container');

    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"'\/]/g, match => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
        }[match]));
    }

    // 【重大修正】重写此函数以匹配 mypage.html 的结构
    const renderUserProfile = (user) => {
        const displayValue = (value) => value ? escapeHTML(value) : '未設定';

        // 逐一获取并填充元素
        const avatar = document.getElementById('profile-avatar');
        if (avatar) {
            // 【修正】使用统一的默认头像
            avatar.src = user.profile_image_path ? user.profile_image_path : 'image/default_avatar.png';
        }

        const username = document.getElementById('profile-username');
        if (username) {
            username.textContent = displayValue(user.username);
        }
        
        // HTML 中没有 email 的位置，所以我们不渲染它

        const age = document.getElementById('profile-age');
        if (age) {
            age.textContent = displayValue(user.age);
        }

        const gender = document.getElementById('profile-gender');
        if (gender) {
            gender.textContent = displayValue(user.gender);
        }

        const region = document.getElementById('profile-region');
        if (region) {
            region.textContent = displayValue(user.region);
        }

        const favorite = document.getElementById('profile-favorite-ultraman');
        if (favorite) {
            favorite.textContent = displayValue(user.favorite_ultraman);
        }

        const bio = document.getElementById('profile-bio');
        if (bio) {
            bio.textContent = displayValue(user.bio);
        }
    };

    const renderUserPosts = (posts) => {
        if (userPostsContainer) {
            if (posts.length > 0) {
                // 【修正】为每个帖子添加作者头像和用户名，与主页保持一致
                const postsHtml = posts.map(post => {
                    const avatarPath = post.profile_image_path ? escapeHTML(post.profile_image_path) : 'image/default_avatar.png';
                    return `
                    <div class="col-md-6 mb-4">
                        <div class="card h-100">
                             <div class="card-header d-flex align-items-center">
                                <img src="${avatarPath}" alt="${escapeHTML(post.username)}" class="rounded-circle me-3" style="width: 50px; height: 50px; object-fit: cover;">
                                <strong>${escapeHTML(post.username)}</strong>
                            </div>
                            <div class="card-body d-flex flex-column">
                                <h5 class="card-title">${escapeHTML(post.title)}</h5>
                                <div class="card-meta text-muted small mb-2">
                                    <span>投稿日: ${new Date(post.created_at).toLocaleDateString()}</span>
                                    <span class="ms-2">|</span>
                                    <span class="ms-2">閲覧数: ${post.views || 0}</span>
                                </div>
                                <p class="card-text flex-grow-1">${escapeHTML(post.content.substring(0, 100))}...</p>
                                <div class="d-flex justify-content-between align-items-center mt-auto">
                                    <a href="view.html?id=${post.id}" class="btn btn-sm btn-outline-primary">続きを読む</a>
                                    <button class="btn btn-sm btn-outline-danger delete-post-btn" data-post-id="${post.id}">削除</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `}).join('');
                userPostsContainer.innerHTML = postsHtml;
            } else {
                userPostsContainer.innerHTML = '<p>まだ投稿がありません。</p>';
            }
        }
    };

    const showMessage = (message, type = 'danger') => {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        }
    };

    fetch('php/mypage.php')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // 【修正】确保 data.user 存在
                if (data.user) {
                    renderUserProfile(data.user);
                }
                renderUserPosts(data.posts);
            } else {
                showMessage(data.message);
                if (data.require_login) {
                    setTimeout(() => window.location.href = 'login.html', 2000);
                }
            }
        })
        .catch(error => {
            showMessage('データの読み込み中にエラーが発生しました。');
        });

    if (userPostsContainer) {
        userPostsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-post-btn')) {
                const postId = e.target.dataset.postId;
                if (confirm('本当にこの投稿を削除しますか？')) {
                    fetch('php/delete_post.php', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ post_id: postId })
                    })
                    .then(response => response.json())
                    .then(result => {
                        if (result.success) {
                            window.location.reload();
                        } else {
                            showMessage(result.message);
                        }
                    })
                    .catch(error => {
                        showMessage('投稿の削除中にエラーが発生しました。');
                    });
                }
            }
        });
    }

    const deleteAccountBtn = document.getElementById('delete-account-btn');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('本当にアカウントを削除しますか？この操作は元に戻せません。')) {
                fetch('php/delete_account.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        alert('アカウントが削除されました。ホームページに戻ります。');
                        window.location.href = 'index.html';
                    } else {
                        showMessage(result.message || 'アカウントの削除中にエラーが発生しました。');
                    }
                })
                .catch(error => {
                    showMessage('アカウントの削除中にエラーが発生しました。');
                });
            }
        });
    }
});
