<?php
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'posts' => [], 'message' => ''];

try {
    // 使用 LEFT JOIN 和 IFNULL 来处理已删除用户
    $sql = "SELECT p.id, p.title, p.content, p.created_at, p.views, 
                   IFNULL(u.username, '退会したユーザー') as username, 
                   CASE
                       WHEN u.id IS NULL THEN 'image/deleted_user_avatar.png'
                       WHEN u.profile_image_path IS NULL OR u.profile_image_path = '' THEN 'image/default_avatar.png'
                       ELSE u.profile_image_path
                   END as profile_image_path
            FROM posts p
            LEFT JOIN users u ON p.user_id = u.id
            ORDER BY p.created_at DESC";
    
    $stmt = $db->prepare($sql);
    $stmt->execute();
    $posts = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    $response['success'] = true;
    $response['posts'] = $posts;

} catch (PDOException $e) {
    $response['message'] = 'データベースエラーが発生しました: ' . $e->getMessage();
}

echo json_encode($response);
?>