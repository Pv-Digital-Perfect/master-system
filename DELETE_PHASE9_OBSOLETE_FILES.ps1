$ErrorActionPreference = "Stop"
$paths = @(
  "DELETE_OBSOLETE_FILES.ps1",
  "delete_obsolete_files.sh",
  "DELETED_FILES_AND_FOLDERS.txt",
  "pv-lead-system.zip"
)

foreach ($path in $paths) {
  if (Test-Path $path) {
    Remove-Item -Path $path -Recurse -Force
    Write-Host "Deleted $path"
  }
}

Write-Host "Phase 9 cleanup completed." -ForegroundColor Green
