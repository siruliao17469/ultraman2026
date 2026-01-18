<?php
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'post' => null, 'comments' => []];
$post_id = $_GET['id'] ?? null;

if (!$post_id) {
    $response['message'] = '投稿IDが指定されていません。';
    echo json_encode($response);
    exit;
}

try {
    // 1. 每次获取帖子详情时，浏览量+1
    $update_views_sql = "UPDATE posts SET views = views + 1 WHERE id = :post_id";
    $stmt_update = $db->prepare($update_views_sql);
    $stmt_update->bindValue(':post_id', $post_id, PDO::PARAM_INT);
    $stmt_update->execute();

    // 1. 【修正】获取帖子信息时，加入 profile_image_path
    $sql_post = "SELECT p.id, p.user_id, p.title, p.content, p.created_at, p.views, 
                        IFNULL(u.username, '退会したユーザー') as username, 
                        CASE
                            WHEN u.id IS NULL THEN 'image/deleted_user_avatar.png'
                            WHEN u.profile_image_path IS NULL OR u.profile_image_path = '' THEN 'image/default_avatar.png'
                            ELSE u.profile_image_path
                        END as profile_image_path
                 FROM posts p 
                 LEFT JOIN users u ON p.user_id = u.id 
                 WHERE p.id = :post_id";
    $stmt_post = $db->prepare($sql_post);
    $stmt_post->bindValue(':post_id', $post_id, PDO::PARAM_INT);
    $stmt_post->execute();
    $post = $stmt_post->fetch(PDO::FETCH_ASSOC);

    if ($post) {
        $response['post'] = $post;

        // 2. 获取帖子的所有评论和评论者用户名
        $sql_comments = "SELECT c.id, c.content, c.created_at, c.parent_comment_id, 
                                IFNULL(u.username, '退会したユーザー') as username, 
                                CASE
                                    WHEN u.id IS NULL THEN 'image/deleted_user_avatar.png'
                                    WHEN u.profile_image_path IS NULL OR u.profile_image_path = '' THEN 'image/default_avatar.png'
                                    ELSE u.profile_image_path
                                END as profile_image_path
                         FROM comments c 
                         LEFT JOIN users u ON c.user_id = u.id 
                         WHERE c.post_id = :post_id 
                         ORDER BY c.created_at ASC";
        $stmt_comments = $db->prepare($sql_comments);
        $stmt_comments->bindValue(':post_id', $post_id, PDO::PARAM_INT);
        $stmt_comments->execute();
        $comments = $stmt_comments->fetchAll(PDO::FETCH_ASSOC);
        
        // 3. 【修正】将评论列表转换为正确的层级结构
        $comment_map = [];
        foreach ($comments as $comment) {
            $comment['children'] = []; // 使用 'children' 键
            $comment_map[$comment['id']] = $comment;
        }

        $comment_tree = [];
        foreach ($comment_map as $id => &$comment_item) { // 使用引用传递
            if ($comment_item['parent_comment_id'] !== null && isset($comment_map[$comment_item['parent_comment_id']])) {
                $comment_map[$comment_item['parent_comment_id']]['children'][] = &$comment_item;
            } else {
                $comment_tree[] = &$comment_item;
            }
        }
        unset($comment_item); // 解除最后一个元素的引用

        $response['comments'] = $comment_tree;
        $response['success'] = true;
    } else {
        $response['message'] = '投稿が見つかりませんでした。';
    }

} catch (PDOException $e) {
    $response['message'] = 'データベースエラーが発生しました: ' . $e->getMessage();
}

echo json_encode($response);
?>