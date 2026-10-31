$ErrorActionPreference = "SilentlyContinue"

function Measure-Url($url) {
  $sw = [System.Diagnostics.Stopwatch]::StartNew()
  $req = [System.Net.HttpWebRequest]::Create($url)
  $req.Method = "GET"
  $req.Timeout = 30000
  $req.ReadWriteTimeout = 30000
  $dns = Measure-Command { $hostName = ([Uri]$url).Host; $ips = [System.Net.Dns]::GetHostAddresses($hostName) }
  try {
    $resp = $req.GetResponse()
    $ttfb = $sw.ElapsedMilliseconds
    $stream = $resp.GetResponseStream()
    $ms = New-Object System.IO.MemoryStream
    $stream.CopyTo($ms)
    $sw.Stop()
    $total = $sw.ElapsedMilliseconds
    $size = [math]::Round($ms.Length / 1KB, 1)
    Write-Output ("{0} | TTFB {1}ms | 总耗时 {2}ms | {3}KB" -f $url, $ttfb, $total, $size)
    $resp.Close()
  } catch {
    Write-Output ("{0} | 失败: {1}" -f $url, $_.Exception.Message)
  }
}

Write-Output "==== 当前 GitHub Pages（境外）多次测试 ===="
1..3 | ForEach-Object { Measure-Url "https://zyczyc70.github.io/" }
Write-Output ""
Write-Output "==== 关键资源 ===="
Measure-Url "https://zyczyc70.github.io/img/background.webp"
Measure-Url "https://zyczyc70.github.io/img/cover/cover1.webp"
Write-Output ""
Write-Output "==== 国内站点对照 ===="
Measure-Url "https://www.baidu.com/"
Measure-Url "https://www.aliyun.com/"
