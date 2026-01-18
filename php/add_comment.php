<?php
session_start();
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'require_login' => false];

// 关键：检查用户是否登录
if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'コメントするにはログインが必要です。';
    $response['require_login'] = true; // 给前端一个明确的标志
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $post_id = $input['post_id'] ?? null;
    $content = $input['content'] ?? '';
    $parent_comment_id = $input['parent_comment_id'] ?? null; // 获取父评论ID
    $user_id = $_SESSION['user_id'];

    if (empty($post_id) || empty($content)) {
        $response['message'] = '内容を入力してください。';
        echo json_encode($response);
        exit;
    }

    try {
        $sql = "INSERT INTO comments (post_id, user_id, content, parent_comment_id) VALUES (:post_id, :user_id, :content, :parent_comment_id)";
        $stmt = $db->prepare($sql);
        $stmt->bindValue(':post_id', $post_id, PDO::PARAM_INT);
        $stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt->bindValue(':content', $content, PDO::PARAM_STR);
        
        // 如果 parent_comment_id 为空，则插入 NULL
        if ($parent_comment_id) {
            $stmt->bindValue(':parent_comment_id', $parent_comment_id, PDO::PARAM_INT);
        } else {
            $stmt->bindValue(':parent_comment_id', null, PDO::PARAM_NULL);
        }

        if ($stmt->execute()) {
            $response['success'] = true;
            $response['message'] = 'コメントが投稿されました。';
        } else {
            $response['message'] = 'コメントの投稿中にエラーが発生しました。';
        }
    } catch (PDOException $e) {
        $response['message'] = 'データベースエラーが発生しました: ' . $e->getMessage();
    }
    echo json_encode($response);
} else {
    $response['message'] = '無効なリクエストです。';
    echo json_encode($response);
}
?>