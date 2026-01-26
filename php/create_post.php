<?php
session_start();
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

// 检查用户是否登录
if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'ログインが必要です。';
    echo json_encode($response);
    exit;
}

// 只处理 POST 请求
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $title = $_POST['title'] ?? '';
    $content = $_POST['content'] ?? '';
    $category = $_POST['category'] ?? ''; // 接收 category 数据
    $user_id = $_SESSION['user_id'];

    if (empty($title) || empty($content) || empty($category)) {
        $response['message'] = 'タイトル、内容、カテゴリーを入力してください。'; // 更新验证信息
        echo json_encode($response);
        exit;
    }

    try {
        // 更新 SQL 插入语句
        $sql = "INSERT INTO posts (user_id, title, content, category) VALUES (:user_id, :title, :content, :category)";
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':title', $title, PDO::PARAM_STR);
        $stmt->bindValue(':content', $content, PDO::PARAM_STR);
        $stmt->bindValue(':category', $category, PDO::PARAM_STR); // 绑定 category 参数

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = '投稿が成功しました。';
        } else {
            $response['message'] = '投稿中にエラーが発生しました。';
        }
    } catch (PDOException $e) {
        // error_log($e->getMessage()); // 建议在生产环境中记录日志
        $response['message'] = 'データベースエラーが発生しました。';
    }
    echo json_encode($response);
    exit;
}

// 如果不是 POST 请求
$response['message'] = '無効なリクエストです。';
echo json_encode($response);
?>