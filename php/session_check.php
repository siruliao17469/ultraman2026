<?php
session_start();

header('Content-Type: application/json');

// 【修改】增加 profile_image_path 字段
$response = [
    'logged_in' => false,
    'username' => null,
    'profile_image_path' => null
];

if (isset($_SESSION['user_id']) && isset($_SESSION['username'])) {
    $response['logged_in'] = true;
    $response['username'] = $_SESSION['username'];
    // 【修改】从会话中获取头像路径
    $response['profile_image_path'] = $_SESSION['profile_image_path'] ?? null;
}

session_write_close();

echo json_encode($response);
?>