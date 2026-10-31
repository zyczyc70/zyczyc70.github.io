$stamp = Get-Date -Format "HHmmss"
$url = "https://zyczyc70.github.io/?v=$stamp"
try {
  $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  $html = $r.Content
  Write-Output ("线上首页状态: " + $r.StatusCode)
  Write-Output ("HTML 大小: " + [math]::Round($r.RawContentLength / 1KB, 1) + "KB")
  Write-Output ("WebP 封面引用数: " + ([regex]::Matches($html, '/img/cover/cover\d+\.webp')).Count)
  Write-Output ("loading=lazy 数: " + ([regex]::Matches($html, "loading='lazy'")).Count)
  Write-Output ("旧 jpg 封面引用数: " + ([regex]::Matches($html, 'cover\d+\.jpg')).Count)
  Write-Output "---- 旧特效残留检查（应全为 0）----"
  foreach ($p in @('canvas-nest', 'click_heart', 'live2d', 'snow', 'fireworks')) {
    Write-Output ($p + " : " + ([regex]::Matches($html, [regex]::Escape($p))).Count)
  }
} catch {
  Write-Output ("访问失败: " + $_.Exception.Message)
}
