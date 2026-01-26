<?php
// --- 数据库连接配置 ---
$servername = "localhost"; // 服务器地址
$username = "root";      // 数据库用户名
$password = "";          // 数据库密码
$dbname = "ultra_db";    // 数据库名
$charset = "utf8mb4";    // 字符集

// --- 创建数据库连接 (使用 PDO) ---
try {
    // 设置数据源名称 (DSN)
    $dsn = "mysql:host=$servername;dbname=$dbname;charset=$charset";
    
    // 创建 PDO 实例
    $db = new PDO($dsn, $username, $password);
    
    // 设置 PDO 错误模式为异常
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 可选：禁用模拟预处理语句，使用真正的预处理语句
    $db->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);

} catch (PDOException $e) {
    // 如果连接失败，则捕获异常并终止程序
    // 在生产环境中，不应向用户显示详细错误
    die("数据库连接失败: " . $e->getMessage());
}
?>