Option Explicit
' Point d'entree du protocole startpage://. Valide strictement l'argument avant de lancer PowerShell (sans fenetre).
Dim a, re, fso, dir, sh
If WScript.Arguments.Count < 1 Then WScript.Quit 1
a = WScript.Arguments(0)
Set re = New RegExp
re.Pattern = "^startpage://(pick/?|run/[a-f0-9]{8}/?(\?n=[A-Za-z0-9%._~-]{0,200})?)$"
If Not re.Test(a) Then WScript.Quit 1
Set fso = CreateObject("Scripting.FileSystemObject")
dir = fso.GetParentFolderName(WScript.ScriptFullName)
Set sh = CreateObject("WScript.Shell")
sh.Run "powershell.exe -NoProfile -STA -WindowStyle Hidden -ExecutionPolicy Bypass -File """ & dir & "\launch.ps1"" """ & a & """", 0, False
