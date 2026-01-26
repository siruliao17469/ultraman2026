<?php
session_start();
require_once 'db_connect.php';

// 设置响应头为 JSON
header('Content-Type: application/json');

// 准备一个标准的响应结构
$response = ['success' => false, 'message' => ''];

// 检查请求方法是否为 POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    $response['message'] = '無効なリクエストです。';
    echo json_encode($response);
    exit;
}

$json_data = file_get_contents('php://input');
$data = json_decode($json_data, true);

// 检查 JSON 是否成功解析
if (json_last_error() !== JSON_ERROR_NONE) {
    $response['message'] = '無効なデータ形式です。';
    echo json_encode($response);
    exit;
}

$username = $data['username'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';

// 基本的验证
if (empty($username) || empty($email) || empty($password)) {
    $response['message'] = 'すべてのフィールドを入力してください。';
    echo json_encode($response);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $response['message'] = '無効なメールアドレス形式です。';
    echo json_encode($response);
    exit;
}

try {
    // 检查邮箱是否已经存在
    $sql = "SELECT id FROM users WHERE email = :email";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->execute();

    if ($stmt->fetch()) {
        $response['message'] = 'このメールアドレスは既に使用されています。';
        echo json_encode($response);
        exit;
    }

    // 密码哈希处理
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    // 将新用户插入数据库 (现在 email 字段存在了)
    $sql = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $db->prepare($sql);
    $stmt->bindValue(':username', $username, PDO::PARAM_STR);
    $stmt->bindValue(':email', $email, PDO::PARAM_STR);
    $stmt->bindValue(':password', $hashed_password, PDO::PARAM_STR);
    
    if ($stmt->execute()) {
        $response['success'] = true;
        $response['message'] = '登録が成功しました。ログインページに移動します。';
    } else {
        $response['message'] = '登録中にエラーが発生しました。';
    }

} catch (PDOException $e) {
    $response['message'] = 'データベースエラーが発生しました。';
}

echo json_encode($response);
?>