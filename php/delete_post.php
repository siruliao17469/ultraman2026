<?php
session_start();
header('Content-Type: application/json');

require 'db_connect.php';

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'ログインが必要です。']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);
$postId = $data['post_id'] ?? null;
$userId = $_SESSION['user_id'];

if (!$postId) {
    echo json_encode(['success' => false, 'message' => '投稿IDが指定されていません。']);
    exit;
}

try {
    $db->beginTransaction();

    // 投稿の所有者を確認
    $stmt = $db->prepare("SELECT user_id FROM posts WHERE id = ?");
    $stmt->execute([$postId]);
    $post = $stmt->fetch();

    if (!$post || $post['user_id'] != $userId) {
        $db->rollBack();
        echo json_encode(['success' => false, 'message' => '権限がありません。']);
        exit;
    }

    // 関連するコメントを削除
    $stmt = $db->prepare("DELETE FROM comments WHERE post_id = ?");
    $stmt->execute([$postId]);

    // 投稿を削除
    $stmt = $db->prepare("DELETE FROM posts WHERE id = ? AND user_id = ?");
    $stmt->execute([$postId, $userId]);

    $db->commit();

    echo json_encode(['success' => true, 'message' => '投稿を削除しました。']);

} catch (PDOException $e) {
    $db->rollBack();
    echo json_encode(['success' => false, 'message' => 'データベースエラーが発生しました。']);
}
?>