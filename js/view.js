document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('id');

    // 【修正】获取正确的容器元素
    const postDetailContainer = document.getElementById('post-detail');
    const commentsContainer = document.getElementById('comment-list'); // 修正 ID
    const commentForm = document.getElementById('comment-form');
    const messageContainer = document.getElementById('comment-message'); // 修正 ID

    function escapeHTML(str) {
        if (typeof str !== 'string') return '';
        return str.replace(/[&<>"'\/]/g, match => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '/': '&#x2F;'
        }[match]));
    }

    function showMessage(message, type = 'danger') {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
            setTimeout(() => { messageContainer.innerHTML = ''; }, 3000);
        }
    }

    function renderComments(comments, container) {
        container.innerHTML = '';
        comments.forEach(comment => {
            // 【修正】使用统一的默认头像
            const avatarPath = comment.profile_image_path ? escapeHTML(comment.profile_image_path) : 'image/default_avatar.png';
            const commentElement = document.createElement('div');
            commentElement.className = 'comment';
            commentElement.innerHTML = `
                <div class="d-flex align-items-start mb-3">
                    <img src="${avatarPath}" alt="${escapeHTML(comment.username)}" class="rounded-circle me-3" style="width: 75px; height: 75px; object-fit: cover;">
                    <div class="flex-grow-1">
                        <div class="comment-header">
                            <strong>${escapeHTML(comment.username)}</strong>
                            <small class="text-muted ms-2">${new Date(comment.created_at).toLocaleString()}</small>
                        </div>
                        <p class="mb-1">${escapeHTML(comment.content)}</p>
                        <button class="btn btn-sm btn-link reply-btn ps-0" data-comment-id="${comment.id}">返信</button>
                        <div class="reply-form-container" id="reply-form-for-${comment.id}" style="display: none;"></div>
                    </div>
                </div>
            `;

            // 【修正】使用 'comment-replies' class 并正确渲染子评论
            const repliesContainer = document.createElement('div');
            repliesContainer.className = 'comment-replies'; 
            commentElement.appendChild(repliesContainer);

            if (comment.children && comment.children.length > 0) {
                renderComments(comment.children, repliesContainer);
            }
            container.appendChild(commentElement);
        });
    }

    if (postId) {
        fetch(`php/get_post.php?id=${postId}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const post = data.post;
                    // 【修正】使用统一的默认头像
                    const avatarPath = post.profile_image_path ? escapeHTML(post.profile_image_path) : 'image/default_avatar.png';

                    // 【修正】将所有内容动态生成并插入到 post-detail 容器中
                    if (postDetailContainer) {
                        postDetailContainer.innerHTML = `
                            <h2 id="post-title">${escapeHTML(post.title)}</h2>
                            <div id="post-author" class="mb-3">
                                <div class="d-flex align-items-center">
                                    <img src="${avatarPath}" alt="${escapeHTML(post.username)}" class="rounded-circle me-3" style="width: 75px; height: 75px; object-fit: cover;">
                                    <strong>${escapeHTML(post.username)}</strong>
                                </div>
                            </div>
                            <p id="post-meta" class="text-muted">
                                投稿日: ${new Date(post.created_at).toLocaleDateString()} | 閲覧数: ${post.views || 0}
                            </p>
                            <div id="post-content" style="white-space: pre-wrap;">${escapeHTML(post.content)}</div>
                        `;
                    }
                    
                    if (commentsContainer) renderComments(data.comments, commentsContainer);
                } else {
                    showMessage(data.message || '投稿の読み込みに失敗しました。');
                }
            })
            .catch(error => {
                showMessage('投稿の読み込み中にエラーが発生しました。');
            });
    }

    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const content = document.getElementById('comment-content').value;
            fetch('php/add_comment.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ post_id: postId, content: content })
            })
            .then(response => response.json())
            .then(result => {
                    if (result.success) {
                        window.location.reload();
                    } else {
                        showMessage(result.message || 'コメントの投稿に失敗しました。');
                        if (result.require_login) {
                            if (window.confirm('ログインが必要です。ログインページに移動しますか？')) {
                                window.location.href = 'login.html';
                            }
                        }
                    }
                });
        });
    }

    if (commentsContainer) {
        commentsContainer.addEventListener('click', function(e) {
            if (e.target.classList.contains('reply-btn')) {
                const commentId = e.target.dataset.commentId;
                const replyFormContainer = document.getElementById(`reply-form-for-${commentId}`);
                
                if (replyFormContainer.style.display === 'none') {
                    replyFormContainer.style.display = 'block';
                    replyFormContainer.innerHTML = `
                        <form class="reply-form mt-2">
                            <div class="mb-2">
                                <textarea class="form-control" rows="2" required></textarea>
                            </div>
                            <button type="submit" class="btn btn-sm btn-primary">返信を投稿</button>
                            <button type="button" class="btn btn-sm btn-secondary cancel-reply">キャンセル</button>
                        </form>
                    `;
                } else {
                    replyFormContainer.style.display = 'none';
                    replyFormContainer.innerHTML = '';
                }
            }

            if (e.target.classList.contains('cancel-reply')) {
                e.target.closest('.reply-form-container').style.display = 'none';
                e.target.closest('.reply-form-container').innerHTML = '';
            }

            if (e.target.closest('.reply-form')) {
                e.preventDefault();
                const form = e.target.closest('.reply-form');
                const content = form.querySelector('textarea').value;
                const parentId = form.closest('.reply-form-container').id.replace('reply-form-for-', '');

                fetch('php/add_comment.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ post_id: postId, content: content, parent_id: parentId })
                })
                .then(response => response.json())
                .then(result => {
                    if (result.success) {
                        window.location.reload();
                    } else {
                        showMessage(result.message || '返信の投稿に失敗しました。');
                        if (result.require_login) {
                            if (window.confirm('ログインが必要です。ログインページに移動しますか？')) {
                                window.location.href = 'login.html';
                            }
                        }
                    }
                });
            }
        });
    }
});