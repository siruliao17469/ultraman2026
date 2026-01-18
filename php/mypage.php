<?php
session_start();
require_once 'db_connect.php';
header('Content-Type: application/json');

$response = ['success' => false, 'message' => '', 'posts' => [], 'user' => null];

if (!isset($_SESSION['user_id'])) {
    $response['message'] = 'ログインが必要です。';
    $response['require_login'] = true;
    echo json_encode($response);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $user_id = $_SESSION['user_id'];

    try {
        // 获取用户信息, 增加 email
        $sql_user = "SELECT username, email, age, gender, region, favorite_ultraman, bio, profile_image_path FROM users WHERE id = :user_id";
        $stmt_user = $db->prepare($sql_user);
        $stmt_user->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt_user->execute();
        $user = $stmt_user->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            $response['user'] = $user;
        } else {
            $response['message'] = 'ユーザーが見つかりませんでした。';
            echo json_encode($response);
            exit;
        }

        // 【修正】获取用户的帖子列表，并JOIN users表以获取最新的用户信息
        $sql_posts = "SELECT p.id, p.title, p.content, p.created_at, p.views, u.username, u.profile_image_path 
                      FROM posts p
                      JOIN users u ON p.user_id = u.id
                      WHERE p.user_id = :user_id 
                      ORDER BY p.created_at DESC";
        $stmt_posts = $db->prepare($sql_posts);
        $stmt_posts->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $stmt_posts->execute();
        $posts = $stmt_posts->fetchAll(PDO::FETCH_ASSOC);

        $response['success'] = true;
        $response['posts'] = $posts;

        echo json_encode($response);
        exit;

    } catch (PDOException $e) {
        $response['message'] = 'データベースエラーが発生しました。';
        http_response_code(500);
        echo json_encode($response);
        exit;
    }
}

$response['message'] = '無効なリクエストです。';
echo json_encode($response);
?>