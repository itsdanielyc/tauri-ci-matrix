# L7 on Windows: install the NSIS bundle silently, launch the installed app,
# confirm it stays alive, uninstall silently, and confirm it is gone. Then the
# same install/uninstall round trip for the MSI.
$ErrorActionPreference = "Stop"
$bundle = Join-Path $PSScriptRoot "..\src-tauri\target\release\bundle"

function Assert($cond, $msg) { if (-not $cond) { Write-Error "FAIL: $msg"; exit 1 } else { Write-Host "ok: $msg" } }

function Find-Installed {
  $roots = @("$env:LOCALAPPDATA\Programs", "$env:LOCALAPPDATA", "$env:ProgramFiles", "${env:ProgramFiles(x86)}")
  foreach ($r in $roots) {
    if (Test-Path $r) {
      $hit = Get-ChildItem -Path $r -Filter "spike.exe" -Recurse -ErrorAction SilentlyContinue -Depth 2 | Select-Object -First 1
      if ($hit) { return $hit.FullName }
    }
  }
  return $null
}

function Smoke-Launch($exe) {
  $p = Start-Process -FilePath $exe -PassThru
  Start-Sleep -Seconds 6
  $alive = -not $p.HasExited
  if ($alive) { Stop-Process -Id $p.Id -Force }
  Assert $alive "installed app launched and stayed alive for 6s ($exe)"
}

# --- NSIS ---------------------------------------------------------------
$setup = Get-ChildItem "$bundle\nsis\*-setup.exe" | Select-Object -First 1
Assert ($null -ne $setup) "NSIS installer exists"
$proc = Start-Process -FilePath $setup.FullName -ArgumentList "/S" -Wait -PassThru
Assert ($proc.ExitCode -eq 0) "NSIS silent install exit code 0"
$exe = Find-Installed
Assert ($null -ne $exe) "spike.exe found after NSIS install"
Smoke-Launch $exe
$uninst = Join-Path (Split-Path $exe) "uninstall.exe"
Assert (Test-Path $uninst) "uninstaller present"
$proc = Start-Process -FilePath $uninst -ArgumentList "/S" -Wait -PassThru
Assert ($proc.ExitCode -eq 0) "NSIS silent uninstall exit code 0"
Start-Sleep -Seconds 3
Assert (-not (Test-Path $exe)) "spike.exe removed after NSIS uninstall"

# --- MSI ----------------------------------------------------------------
$msi = Get-ChildItem "$bundle\msi\*.msi" | Select-Object -First 1
Assert ($null -ne $msi) "MSI installer exists"
$proc = Start-Process -FilePath "msiexec.exe" -ArgumentList "/i `"$($msi.FullName)`" /qn /norestart" -Wait -PassThru
Assert ($proc.ExitCode -eq 0) "MSI silent install exit code 0"
$exe = Find-Installed
Assert ($null -ne $exe) "spike.exe found after MSI install"
Smoke-Launch $exe
$proc = Start-Process -FilePath "msiexec.exe" -ArgumentList "/x `"$($msi.FullName)`" /qn /norestart" -Wait -PassThru
Assert ($proc.ExitCode -eq 0) "MSI silent uninstall exit code 0"
Start-Sleep -Seconds 3
Assert (-not (Test-Path $exe)) "spike.exe removed after MSI uninstall"
Write-Host "installer tests passed (nsis, msi)"
