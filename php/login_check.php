<?php
session_start();

header('Content-Type: application/json');
require_once 'db_connect.php';

$response = ['success' => false, 'message' => '不正なリクエストです。'];

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    $login_identifier = $_POST['login_identifier'] ?? '';
    $password = $_POST['password'] ?? '';

    if (empty($login_identifier) || empty($password)) {
        $response['message'] = 'ユーザー名（またはメールアドレス）とパスワードを入力してください。';
    } else {
        try {
            // 【修正】在查询时一并获取 profile_image_path
            $sql = "SELECT id, username, password, profile_image_path FROM users WHERE username = ? OR email = ?";
            $stmt = $db->prepare($sql);
            $stmt->execute([$login_identifier, $login_identifier]);
            $user = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($user && password_verify($password, $user['password'])) {
                session_regenerate_id(true);

                // 【修正】将所有需要的用户信息存入会话
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['username'] = $user['username'];
                $_SESSION['profile_image_path'] = $user['profile_image_path'];

                $response['success'] = true;
                $response['message'] = 'ログインに成功しました。';
            } else {
                $response['message'] = 'ユーザー名、メールアドレス、またはパスワードが正しくありません。';
            }
        } catch (PDOException $e) {
            http_response_code(500);
            $response['message'] = 'データベースエラーが発生しました。';
        }
    }
}

echo json_encode($response);
?>