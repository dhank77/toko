<?php
/**
 * Laravel cPanel Setup Script (tanpa mengubah struktur folder)
 *
 * Letakkan project apa adanya, dengan document root domain mengarah ke folder /public
 * (script ini berada di public/laravel.php).
 *
 * Akses:
 *   /laravel.php                 -> cek environment, storage link, permission, cache
 *   /laravel.php?migrate=1       -> ditambah php artisan migrate --force
 *   /laravel.php?seed=1          -> ditambah php artisan db:seed --force
 *   /laravel.php?delete=1        -> hapus script ini setelah selesai (disarankan)
 *
 * Opsional: isi $secretKey lalu akses dengan ?key=ISI_KEY
 */

$secretKey = '';

/// — KONFIGURASI —
$publicPath = __DIR__;
$basePath = dirname(__DIR__);
$logDir = $basePath . '/storage/logs';
$logFile = $logDir . '/laravel-setup.log';

@set_time_limit(300);
header('Content-Type: text/html; charset=utf-8');

if ($secretKey !== '' && !hash_equals($secretKey, (string) ($_GET['key'] ?? ''))) {
    http_response_code(403);
    exit('Forbidden');
}

function writeLog(string $message): void
{
    global $logFile;
    $line = '['.date('Y-m-d H:i:s').'] '.$message."\n";
    if (is_dir(dirname($logFile)) && is_writable(dirname($logFile))) {
        @file_put_contents($logFile, $line, FILE_APPEND);
    }
    echo htmlspecialchars($line, ENT_QUOTES, 'UTF-8');
    @ob_flush();
    flush();
}

echo '<pre>';
writeLog('— MEMULAI SETUP —');
writeLog("Base path   : $basePath");
writeLog("Public path : $publicPath");

/// — 1. CEK STRUKTUR & ENVIRONMENT —
$fatal = false;

if (version_compare(PHP_VERSION, '8.2.0', '<')) {
    writeLog('[ERROR] PHP '.PHP_VERSION.' terlalu lama. Pilih PHP 8.2+ (sesuai composer.json) di cPanel > MultiPHP Manager.');
    $fatal = true;
} else {
    writeLog('[OK] PHP '.PHP_VERSION);
}

foreach (['mbstring', 'openssl', 'pdo', 'tokenizer', 'xml', 'ctype', 'json', 'fileinfo'] as $extension) {
    if (!extension_loaded($extension)) {
        writeLog("[ERROR] Ekstensi PHP '$extension' belum aktif.");
        $fatal = true;
    }
}

foreach (['vendor/autoload.php' => 'folder vendor (upload hasil composer install)', 'bootstrap/app.php' => 'bootstrap/app.php', '.env' => 'file .env'] as $file => $label) {
    if (!file_exists("$basePath/$file")) {
        writeLog("[ERROR] $label tidak ditemukan di $basePath/$file");
        $fatal = true;
    }
}

if (!file_exists("$publicPath/index.php")) {
    writeLog('[ERROR] public/index.php tidak ditemukan.');
    $fatal = true;
}

/// — 2. FOLDER YANG HARUS WRITABLE —
$writableDirs = [
    'storage', 'storage/app', 'storage/app/public', 'storage/framework',
    'storage/framework/cache', 'storage/framework/cache/data', 'storage/framework/sessions',
    'storage/framework/views', 'storage/logs', 'bootstrap/cache',
];

foreach ($writableDirs as $dir) {
    $path = "$basePath/$dir";
    if (!is_dir($path) && !@mkdir($path, 0775, true)) {
        writeLog("[ERROR] Gagal membuat folder $dir");

        continue;
    }
    if (!is_writable($path)) {
        @chmod($path, 0775);
    }
    writeLog(is_writable($path) ? "[OK] Writable: $dir" : "[ERROR] Tidak writable: $dir (set permission 775 via File Manager)");
}

if ($fatal) {
    writeLog('[STOP] Perbaiki error di atas lalu muat ulang halaman ini.');
    echo '</pre>';
    exit;
}

/// — 3. SYMLINK STORAGE (public/storage -> storage/app/public) —
$target = "$basePath/storage/app/public";
$link = "$publicPath/storage";

if (is_link($link) && !file_exists($link)) {
    @unlink($link);
    writeLog('[INFO] Symlink storage rusak (path lama) dihapus.');
}

if (file_exists($link) || is_link($link)) {
    writeLog('[INFO] public/storage sudah ada.');
} elseif (!function_exists('symlink')) {
    writeLog('[WARNING] Fungsi symlink() dinonaktifkan hosting. Buat symlink lewat cPanel Terminal: ln -s '.$target.' '.$link);
} elseif (@symlink($target, $link)) {
    writeLog('[SUCCESS] Symlink storage dibuat.');
} else {
    writeLog('[WARNING] Gagal membuat symlink storage. Coba lewat cPanel Terminal: ln -s '.$target.' '.$link);
}

/// — 4. BOOT LARAVEL & JALANKAN ARTISAN —
try {
    require "$basePath/vendor/autoload.php";
    $app = require "$basePath/bootstrap/app.php";
    $app->usePublicPath($publicPath);
    $kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
    $kernel->bootstrap();

    $artisan = function (string $command, array $parameters = []) use ($kernel): void {
        try {
            $exitCode = $kernel->call($command, $parameters);
            $output = trim($kernel->output());
            writeLog(($exitCode === 0 ? '[SUCCESS] ' : '[ERROR] ')."php artisan $command".($output !== '' ? "\n$output" : ''));
        } catch (Throwable $e) {
            writeLog("[ERROR] php artisan $command: ".$e->getMessage());
        }
    };

    if (blank(config('app.key'))) {
        $artisan('key:generate', ['--force' => true]);
    } else {
        writeLog('[OK] APP_KEY sudah ada.');
    }

    $artisan('optimize:clear');

    if (isset($_GET['migrate'])) {
        $artisan('migrate', ['--force' => true]);
    } else {
        writeLog('[INFO] Migrasi dilewati. Tambahkan ?migrate=1 untuk menjalankannya.');
    }

    if (isset($_GET['seed'])) {
        $artisan('db:seed', ['--force' => true]);
    }

    if (config('app.env') === 'production') {
        $artisan('config:cache');
        $artisan('route:cache');
        $artisan('view:cache');
    } else {
        writeLog('[WARNING] APP_ENV bukan production. Set APP_ENV=production dan APP_DEBUG=false di .env.');
    }
} catch (Throwable $e) {
    writeLog('[ERROR] Gagal memuat Laravel: '.$e->getMessage());
}

/// — 5. HAPUS SCRIPT (OPSIONAL) —
if (isset($_GET['delete'])) {
    writeLog(@unlink(__FILE__) ? '[SUCCESS] laravel.php dihapus.' : '[ERROR] Gagal menghapus laravel.php, hapus manual.');
} else {
    writeLog('[PENTING] Hapus laravel.php setelah selesai (atau buka /laravel.php?delete=1).');
}

writeLog('— SETUP SELESAI —');
echo '</pre>';