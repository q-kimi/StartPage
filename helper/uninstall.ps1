# Retire le protocole startpage:// (la liste d'apps %APPDATA%\startpage\apps.json est conservee).
Remove-Item -Path 'HKCU:\Software\Classes\startpage' -Recurse -Force -ErrorAction SilentlyContinue
Write-Host 'startpage:// retire.'
