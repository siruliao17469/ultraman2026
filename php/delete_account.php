<?php
session_start();
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => ''];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'ログインが必要です。';
    echo json_encode($response);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $db->beginTransaction();

    // 1. 匿名化用户的帖子
    $sql_posts = "UPDATE posts SET user_id = NULL WHERE user_id = :user_id";
    $stmt_posts = $db->prepare($sql_posts);
    $stmt_posts->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt_posts->execute();

    // 2. 匿名化用户的评论
    $sql_comments = "UPDATE comments SET user_id = NULL WHERE user_id = :user_id";
    $stmt_comments = $db->prepare($sql_comments);
    $stmt_comments->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt_comments->execute();

    // 3. 删除用户
    $sql_user = "DELETE FROM users WHERE id = :user_id";
    $stmt_user = $db->prepare($sql_user);
    $stmt_user->bindValue(':user_id', $user_id, PDO::PARAM_INT);
    $stmt_user->execute();

    $db->commit();

    // 4. 销毁会话并登出
    session_destroy();

    $response['success'] = true;
    $response['message'] = 'アカウントが正常に削除されました。';

} catch (PDOException $e) {
    $db->rollBack();
    $response['message'] = 'データベースエラーが発生しました: ' . $e->getMessage();
}

echo json_encode($response);
?>