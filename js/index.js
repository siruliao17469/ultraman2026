document.addEventListener('DOMContentLoaded', () => {
    const postList = document.getElementById('post-list');
    const messageContainer = document.getElementById('message-container');

    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"'\/]/g, match => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
        }[match]));
    }

    const showMessage = (message, type = 'danger') => {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
        }
    };

    const renderPosts = (posts) => {
        if (!postList) return;

        if (posts.length > 0) {
            const postsHtml = posts.map(post => {
                // 【修正】当用户没有设置头像时，使用统一的默认头像
                const avatarPath = post.profile_image_path ? escapeHTML(post.profile_image_path) : 'image/default_avatar.png';
                return `
                    <div class="col-md-4 mb-4">
                        <div class="card h-100">
                            <div class="card-header d-flex align-items-center">
                                <img src="${avatarPath}" alt="${escapeHTML(post.username)}" class="rounded-circle me-3" style="width: 75px; height: 75px; object-fit: cover;">
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
                                <a href="view.html?id=${post.id}" class="btn btn-primary mt-auto">続きを読む</a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            postList.innerHTML = postsHtml;
        } else {
            postList.innerHTML = '<p>まだ投稿がありません。</p>';
        }
    };

    fetch('php/index.php')
        .then(response => response.json())
        .then(data => {
            // 这个判断现在可以正常工作了
            if (data.success) {
                renderPosts(data.posts);
            } else {
                showMessage(data.message || '投稿の読み込みに失敗しました。');
            }
        })
        .catch(error => {
            showMessage('投稿の読み込み中にエラーが発生しました。');
        });
});