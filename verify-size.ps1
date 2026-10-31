$ErrorActionPreference = "SilentlyContinue"

function Check-Url($url) {
  $req = [System.Net.HttpWebRequest]::Create($url)
  $req.Method = "GET"
  $req.Timeout = 30000
  $req.Headers["Accept-Encoding"] = "gzip"
  $resp = $req.GetResponse()
  $stream = $resp.GetResponseStream()
  $ms = New-Object System.IO.MemoryStream
  $stream.CopyTo($ms)
  $bytes = $ms.ToArray()
  $result = [PSCustomObject]@{
    Url = $url.Replace("https://zyczyc70.github.io", "")
    Status = [int]$resp.StatusCode
    ContentType = $resp.ContentType
    TransferKB = [math]::Round($bytes.Length / 1KB, 1)
    Encoding = $resp.ContentEncoding
  }
  $resp.Close()
  return $result
}

$urls = @(
  "https://zyczyc70.github.io/img/cover/cover1.webp",
  "https://zyczyc70.github.io/img/cover/cover3.webp",
  "https://zyczyc70.github.io/img/background.webp",
  "https://zyczyc70.github.io/2023/08/31/java/"
)
$results = foreach ($u in $urls) { Check-Url $u }
$results | Format-Table -AutoSize
