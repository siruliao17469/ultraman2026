document.addEventListener('DOMContentLoaded', function() {
    const profileForm = document.getElementById('edit-profile-form');
    const messageContainer = document.getElementById('form-message');
    const loadingSpinner = document.getElementById('loading-spinner');
    const avatarPreview = document.getElementById('avatar-preview');
    const profileImageInput = document.getElementById('profile_image');
    const avatarSelectionContainer = document.getElementById('avatar-selection-container');
    const avatarModalEl = document.getElementById('avatarModal');
    let avatarModal;
    if (avatarModalEl) {
        avatarModal = new bootstrap.Modal(avatarModalEl);
    }


    function showMessage(text, type = 'danger') {
        if (messageContainer) {
            messageContainer.innerHTML = `<div class="alert alert-${type}">${text}</div>`;
        }
    }

    // Function to load preset avatars into the modal
    function loadPresetAvatars() {
        if (!avatarSelectionContainer) return;
        fetch('php/get_avatars.php')
            .then(response => response.json())
            .then(data => {
                if (data.success && data.avatars.length > 0) {
                    avatarSelectionContainer.innerHTML = ''; // Clear previous content
                    data.avatars.forEach(avatarPath => {
                        const col = document.createElement('div');
                        col.className = 'col-3 mb-3 text-center';
                        
                        const img = document.createElement('img');
                        img.src = avatarPath;
                        img.alt = 'Avatar';
                        img.className = 'img-thumbnail';
                        img.style.cursor = 'pointer';
                        img.style.width = '100px';
                        img.style.height = '100px';
                        img.style.objectFit = 'cover';

                        img.addEventListener('click', () => {
                            avatarPreview.src = avatarPath;
                            // Create a hidden input to store the selected avatar path
                            let hiddenInput = document.getElementById('selected_avatar_path');
                            if (!hiddenInput) {
                                hiddenInput = document.createElement('input');
                                hiddenInput.type = 'hidden';
                                hiddenInput.id = 'selected_avatar_path';
                                hiddenInput.name = 'selected_avatar_path';
                                profileForm.appendChild(hiddenInput);
                            }
                            hiddenInput.value = avatarPath;
                            
                            // Clear the file input if a preset is chosen
                            profileImageInput.value = '';

                            if(avatarModal) {
                                avatarModal.hide();
                            }
                        });

                        col.appendChild(img);
                        avatarSelectionContainer.appendChild(col);
                    });
                } else {
                    avatarSelectionContainer.innerHTML = '<p>プリセットのアバターを読み込めませんでした。</p>';
                }
            })
            .catch(error => {
                console.error('Error loading preset avatars:', error);
                avatarSelectionContainer.innerHTML = '<p>アバターの読み込み中にエラーが発生しました。</p>';
            });
    }

    fetch('php/profile.php')
        .then(response => {
            if (response.status === 401) {
                window.location.href = 'login.html';
                return Promise.reject('Unauthorized');
            }
            if (!response.ok) {
                throw new Error('Network response was not ok.');
            }
            return response.json();
        })
        .then(data => {
            if (loadingSpinner) loadingSpinner.classList.add('d-none');
            if (profileForm) profileForm.classList.remove('d-none');

            if (data.success) {
                if (data.profile_image_path) {
                    avatarPreview.src = data.profile_image_path;
                } else {
                    // 【修正】使用统一的默认头像
                    avatarPreview.src = 'image/default_avatar.png';
                }
                document.getElementById('username').value = data.username || '';
                document.getElementById('age').value = data.age || '';
                document.getElementById('gender').value = data.gender || '';
                document.getElementById('region').value = data.region || '';
                document.getElementById('favorite_ultraman').value = data.favorite_ultraman || '';
                document.getElementById('bio').value = data.bio || '';
            } else {
                showMessage(data.message || 'プロファイルデータの読み込みに失敗しました。');
            }
        })
        .catch(error => {
            if (error.name !== 'TypeError' && error !== 'Unauthorized') {
                console.error('Fetch Error:', error);
            }
            if (loadingSpinner) loadingSpinner.classList.add('d-none');
            showMessage('プロファイルデータの読み込み中にエラーが発生しました。');
            console.error('An error occurred during the fetch operation:', error);
        });

    if (profileImageInput && avatarPreview) {
        profileImageInput.addEventListener('change', function(event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    avatarPreview.src = e.target.result;
                    // Clear the selected preset avatar path if a file is chosen
                    const hiddenInput = document.getElementById('selected_avatar_path');
                    if (hiddenInput) {
                        hiddenInput.value = '';
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }

    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(profileForm);

            fetch('php/profile.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(result => {
                console.log('Server response:', result);

                if (result.success) {
                    const cachedUser = localStorage.getItem('ultra_user');
                    if (cachedUser) {
                        try {
                            const userData = JSON.parse(cachedUser);
                            if (result.new_avatar_path) {
                                userData.profile_image_path = result.new_avatar_path;
                                localStorage.setItem('ultra_user', JSON.stringify(userData));

                                // --- 核心修改 ---
                                // 1. 立即通知当前页面的 auth.js 更新视图
                                if (window.forceUpdateUserDisplay) {
                                    window.forceUpdateUserDisplay();
                                }
                                // 2. 并且通知其他打开的页面也更新
                                localStorage.setItem('avatar_updated', Date.now());
                                // --- 修改结束 ---
                            }
                        } catch (e) {
                            console.error('Error updating cached user data:', e);
                        }
                    }
                    showMessage(result.message || 'プロフィールが正常に更新されました。', 'success');
                    // 新增：短暂延迟后跳转到个人主页
                    setTimeout(() => {
                        window.location.href = 'mypage.html';
                    }, 1500); // 延迟1.5秒，以便用户可以看到成功消息
                    
                } else {
                    showMessage(result.message || '更新に失敗しました。');
                }
            })
            .catch(error => {
                console.error('Submit Error:', error);
                showMessage('更新中に通信エラーが発生しました。');
            });
        });
    }

    // Load avatars when the modal is about to be shown
    if (avatarModalEl) {
        avatarModalEl.addEventListener('show.bs.modal', function () {
            loadPresetAvatars();
        });
    }
});