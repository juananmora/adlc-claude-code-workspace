$b64 = "/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAr/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFAEBAAAAAAAAAAAAAAAAAAAAAP/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AL+AAH//2Q=="
$bytes = [Convert]::FromBase64String($b64)
$dir = "apps/web/public/covers/tours"
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$ids = @("world-slavery-tour","monsters-of-rock-86","damaged-justice-tour","clash-of-the-titans","cowboys-from-hell-tour","use-your-illusion-tour","black-album-tour","ozzfest-1996","iowa-world-tour","judas-priest-redeemer")
foreach ($id in $ids) { [IO.File]::WriteAllBytes("$dir/$id.jpg", $bytes) }
Get-ChildItem $dir
