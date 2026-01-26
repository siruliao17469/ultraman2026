<?php
session_start();
require_once 'db_connect.php';

header('Content-Type: application/json');

// 统一的响应结构
$response = [
    'success' => false,
    'message' => '',
    'username' => null,
    'email' => null,
    'age' => null,
    'gender' => null,
    'region' => null,
    'favorite_ultraman' => null,
    'bio' => null,
    'profile_image_path' => null
];

// 统一登录验证
if (!isset($_SESSION['user_id'])) {
    $response['message'] = '認証が必要です。ログインしてください。';
    http_response_code(401); // Unauthorized
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];
$method = $_SERVER['REQUEST_METHOD'];

// 根据请求方法执行不同操作
if ($method === 'GET') {
    // 获取当前用户的个人资料
    try {
        $sql = "SELECT username, email, age, gender, region, favorite_ultraman, bio, profile_image_path FROM users WHERE id = :user_id";
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->execute();
        $user_data = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user_data) {
            $response['success'] = true;
            $response = array_merge($response, $user_data);
        } else {
            $response['message'] = 'ユーザーが見つかりません。';
            http_response_code(404);
        }
    } catch (PDOException $e) {
        $response['message'] = 'プロファイルデータの取得中にデータベースエラーが発生しました。';
        http_response_code(500);
    }
} elseif ($method === 'POST') {
    $data = $_POST;
    $username = trim($data['username'] ?? '');

    if (empty($username)) {
        $response['message'] = 'ユーザー名は必須です。';
        echo json_encode($response);
        exit;
    }

    $image_path_for_db = null;

    // --- 头像处理逻辑 ---

    // 获取旧头像路径以便后续可能需要删除
    $sql_old_path = "SELECT profile_image_path FROM users WHERE id = :user_id";
    $stmt_old_path = $db->prepare($sql_old_path);
    $stmt_old_path->execute([':user_id' => $user_id]);
    $old_path = $stmt_old_path->fetchColumn();

    // 1. 优先处理预设头像的选择
    if (!empty($data['selected_avatar_path'])) {
        $image_path_for_db = $data['selected_avatar_path'];
        
        // 如果旧头像是用户上传的，则删除旧文件
        if ($old_path && strpos($old_path, 'uploads/avatars/') === 0 && file_exists('../' . $old_path)) {
            unlink('../' . $old_path);
        }

    // 2. 其次处理文件上传
    } elseif (isset($_FILES['profile_image']) && $_FILES['profile_image']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['profile_image'];
        $upload_dir = '../uploads/avatars/';

        // 验证文件类型和大小
        $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        $file_type = mime_content_type($file['tmp_name']);
        if (!in_array($file_type, $allowed_types)) {
            $response['message'] = '無効なファイル形式です。許可されている形式はJPEG, PNG, GIF, WEBPのみです。';
            echo json_encode($response);
            exit;
        }

        if ($file['size'] > 2 * 1024 * 1024) { // 2MB limit
            $response['message'] = 'ファイルサイズが大きすぎます。2MB以下にしてください。';
            echo json_encode($response);
            exit;
        }

        // 生成唯一文件名
        $extension = pathinfo($file['name'], PATHINFO_EXTENSION);
        $new_filename = 'user_' . $user_id . '_' . uniqid() . '.' . $extension;
        $destination = $upload_dir . $new_filename;

        // 移动文件
        if (move_uploaded_file($file['tmp_name'], $destination)) {
            $image_path_for_db = 'uploads/avatars/' . $new_filename;

            // 如果旧头像是用户上传的，则删除旧文件
            if ($old_path && strpos($old_path, 'uploads/avatars/') === 0 && file_exists('../' . $old_path)) {
                unlink('../' . $old_path);
            }
        } else {
            $response['message'] = 'ファイルのアップロードに失敗しました。';
            http_response_code(500);
            echo json_encode($response);
            exit;
        }
    }
    // --- 头像处理结束 ---

    try {
        // 动态构建SQL更新语句
        $sql_parts = [
            "username = :username",
            "age = :age",
            "gender = :gender",
            "region = :region",
            "favorite_ultraman = :favorite_ultraman",
            "bio = :bio"
        ];
        // 只有在确定了新的头像路径时才更新数据库字段
        if ($image_path_for_db) {
            $sql_parts[] = "profile_image_path = :profile_image_path";
        }
        
        $sql = "UPDATE users SET " . implode(', ', $sql_parts) . " WHERE id = :user_id";
        
        $stmt = $db->prepare($sql);

        $age = !empty($data['age']) ? (int)$data['age'] : null;
        $gender = !empty($data['gender']) ? $data['gender'] : null;
        $region = !empty($data['region']) ? $data['region'] : null;
        $favorite_ultraman = !empty($data['favorite_ultraman']) ? $data['favorite_ultraman'] : null;
        $bio = !empty($data['bio']) ? $data['bio'] : null;

        $stmt->bindValue(':username', $username, PDO::PARAM_STR);
        $stmt->bindValue(':age', $age, $age === null ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->bindValue(':gender', $gender, PDO::PARAM_STR);
        $stmt->bindValue(':region', $region, PDO::PARAM_STR);
        $stmt->bindValue(':favorite_ultraman', $favorite_ultraman, PDO::PARAM_STR);
        $stmt->bindValue(':bio', $bio, PDO::PARAM_STR);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        
        // 只有在确定了新的头像路径时才绑定参数
        if ($image_path_for_db) {
            $stmt->bindValue(':profile_image_path', $image_path_for_db, PDO::PARAM_STR);
        }

        if ($stmt->execute()) {
            // 更新会话中的用户名
            $_SESSION['username'] = $username;
            
            // 再次从数据库查询，获取绝对准确的最新路径
            $sql_new_path = "SELECT profile_image_path FROM users WHERE id = :user_id";
            $stmt_new_path = $db->prepare($sql_new_path);
            $stmt_new_path->execute([':user_id' => $user_id]);
            $new_avatar_path = $stmt_new_path->fetchColumn();

            // --- 最终修复：同步更新服务器会话中的头像路径 ---
            $_SESSION['profile_image_path'] = $new_avatar_path;
            // --- 修复结束 ---

            // 创建一个全新的、干净的响应对象
            $final_response = [
                'success' => true,
                'message' => 'プロフィールが正常に更新されました。',
                'new_avatar_path' => $new_avatar_path
            ];

            // 立刻发送JSON响应，并强制停止脚本
            echo json_encode($final_response);
            exit;


        } else {
            $response['message'] = 'プロフィールの更新に失敗しました。';
            http_response_code(500);
        }
    } catch (PDOException $e) {
        $response['message'] = 'プロフィールの更新中にデータベースエラーが発生しました。';
        if ($e->getCode() == 23000) {
             $response['message'] = 'このユーザー名は既に使用されています。';
        }
        http_response_code(500);
    }
}

echo json_encode($response);
?>