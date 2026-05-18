$env:ADMIN_BASIC_USER = 'admin'
$env:ADMIN_BASIC_PASSWORD = 'admin787'
$env:ADMIN_BASIC_AUTH_DISABLED = 'true'
Start-Process -FilePath 'cmd.exe' `
  -ArgumentList '/c','npx next dev --webpack -p 3088 > .tmp\next-dev-pw6.out.log 2> .tmp\next-dev-pw6.err.log' `
  -WorkingDirectory (Get-Location) `
  -WindowStyle Hidden
