$stamp = Get-Date -Format "HHmmss"
$url = "https://zyczyc70.github.io/?v=$stamp"
try {
  $r = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 30
  $html = $r.Content
  Write-Output ("Status: " + $r.StatusCode)
  $load = [regex]::Matches($html, '(?:src|href)="((?:https?:)?//[^"]+)"') | ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -notmatch 'zyczyc70\.github\.io' }
  Write-Output "External loaded resources (scripts/styles):"
  if ($load) { $load | Sort-Object -Unique } else { Write-Output "  NONE - fully self-contained" }
  Write-Output ("jsdelivr refs: " + ([regex]::Matches($html, 'jsdelivr')).Count)
  Write-Output ("busuanzi refs: " + ([regex]::Matches($html, 'busuanzi')).Count)
  Write-Output ("local pluginsSrc refs: " + ([regex]::Matches($html, '/pluginsSrc/')).Count)
  Write-Output ("loading=lazy: " + ([regex]::Matches($html, "loading='lazy'")).Count)
} catch {
  Write-Output ("FAIL: " + $_.Exception.Message)
}
