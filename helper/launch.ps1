param([string]$Url)
# startpage://pick      : fenetre Explorateur, enregistre l'exe choisi, copie startpage://run/ID dans le presse-papiers
# startpage://run/ID    : lance l'exe enregistre sous cet ID (liste blanche %APPDATA%\startpage\apps.json)
$ErrorActionPreference = 'Stop'
$dir = Join-Path $env:APPDATA 'startpage'
$file = Join-Path $dir 'apps.json'

function Load-Apps {
    $h = @{}
    if (Test-Path -LiteralPath $file) {
        $o = Get-Content -LiteralPath $file -Raw | ConvertFrom-Json
        if ($o) { foreach ($p in $o.PSObject.Properties) { $h[$p.Name] = [string]$p.Value } }
    }
    return $h
}

if ($Url -match '^startpage://pick/?$') {
    Add-Type -AssemblyName System.Windows.Forms
    [System.Windows.Forms.Clipboard]::Clear()
    $d = New-Object System.Windows.Forms.OpenFileDialog
    $d.Filter = 'Applications (*.exe)|*.exe'
    $d.Title = 'Choisir une application'
    if ($d.ShowDialog() -ne [System.Windows.Forms.DialogResult]::OK) { exit }
    $apps = Load-Apps
    foreach ($k in @($apps.Keys)) { if (-not (Test-Path -LiteralPath $apps[$k])) { $apps.Remove($k) } }
    do { $id = -join ((1..8) | ForEach-Object { '{0:x}' -f (Get-Random -Maximum 16) }) } while ($apps.ContainsKey($id))
    $apps[$id] = $d.FileName
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
    $apps | ConvertTo-Json | Set-Content -LiteralPath $file -Encoding UTF8
    $name = [IO.Path]::GetFileNameWithoutExtension($d.FileName)
    if ($name.Length -gt 20) { $name = $name.Substring(0, 20) }
    [System.Windows.Forms.Clipboard]::SetText('startpage://run/' + $id + '?n=' + [uri]::EscapeDataString($name))
    exit
}

if ($Url -match '^startpage://run/([a-f0-9]{8})') {
    $apps = Load-Apps
    $p = $apps[$Matches[1]]
    if ($p -and $p.ToLower().EndsWith('.exe') -and (Test-Path -LiteralPath $p -PathType Leaf)) {
        Start-Process -FilePath $p -WorkingDirectory (Split-Path -Parent $p)
    }
}
