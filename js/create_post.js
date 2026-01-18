document.addEventListener('DOMContentLoaded', function() {
    const categories = {
        'm78': 'M78',
        'l77': 'L77',
        'earth': '地球',
        'o50': 'O-50',
        'u40': 'U-40',
        'z95': 'Z-95',
        'n project': 'N Project',
        'other': 'その他'
    };

    const categorySelect = document.getElementById('category');
    
    if (categorySelect) {
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }

        for (const key in categories) {
            const displayName = categories[key];
            const option = document.createElement('option');
            option.value = displayName;
            option.textContent = displayName;
            categorySelect.appendChild(option);
        }
    }

    const createPostForm = document.getElementById('create-post-form');
    const formMessage = document.getElementById('form-message');

    if (createPostForm) {
        createPostForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = new FormData(this);

            fetch('php/create_post.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    formMessage.textContent = '投稿が成功しました。マイページにリダイレクトします...';
                    formMessage.className = 'alert alert-success';
                    setTimeout(() => {
                        window.location.href = 'mypage.html';
                    }, 2000);
                } else {
                    formMessage.textContent = 'エラー: ' + data.message;
                    formMessage.className = 'alert alert-danger';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                formMessage.textContent = '送信中にエラーが発生しました。';
                formMessage.className = 'alert alert-danger';
            });
        });
    }
});