# Enregistre le protocole startpage:// pour l'utilisateur courant (pas de droits admin).
# Le dossier helper doit rester a son emplacement : relancer ce script s'il est deplace.
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
$vbs = Join-Path $dir 'launch.vbs'
$k = 'HKCU:\Software\Classes\startpage'
New-Item -Path $k -Force | Out-Null
Set-ItemProperty -Path $k -Name '(default)' -Value 'URL:Startpage'
New-ItemProperty -Path $k -Name 'URL Protocol' -Value '' -Force | Out-Null
New-Item -Path "$k\shell\open\command" -Force | Out-Null
Set-ItemProperty -Path "$k\shell\open\command" -Name '(default)' -Value ('wscript.exe //B //Nologo "{0}" "%1"' -f $vbs)
Write-Host 'startpage:// installe.'
