<?php
header('Content-Type: application/json');

function get_image_files($dir) {
    $images = [];
    // 使用递归迭代器来遍历目录及其所有子目录
    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
        if ($file->isFile()) {
            // 检查文件扩展名是否是图片格式
            $ext = strtolower($file->getExtension());
            if (in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'webp'])) {
                // 获取相对于项目根目录的路径
                $rootPath = realpath(__DIR__ . '/../');
                $filePath = realpath($file->getPathname());
                $relativePath = str_replace($rootPath, '', $filePath);
                
                // 转换为 Web 兼容的路径格式 (使用 /)
                $webPath = str_replace(DIRECTORY_SEPARATOR, '/', $relativePath);
                
                // 去除路径开头的斜杠
                $images[] = ltrim($webPath, '/');
            }
        }
    }
    return $images;
}

// 图片目录的路径
$image_dir = __DIR__ . '/../image/avatars';
$avatar_files = get_image_files($image_dir);

// 以 JSON 格式返回图片列表
echo json_encode(['success' => true, 'avatars' => $avatar_files]);
?>