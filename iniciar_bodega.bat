@echo off
title Servidor Local - Bodega PROTECSA JSD S.A.S.
color 0A
echo ========================================================
echo   INICIANDO SERVIDOR LOCAL PARA BODEGA PROTECSA JSD S.A.S.
echo ========================================================
echo.
echo Iniciando servidor web en http://localhost:8000/ ...
echo Abrir este enlace en Google Chrome o Microsoft Edge.
echo.

powershell -Command "$listener = New-Object System.Net.HttpListener; $listener.Prefixes.Add('http://localhost:8000/'); $listener.Start(); Start-Process 'http://localhost:8000/'; Write-Host 'Servidor activo. Presione Ctrl+C para salir...'; while ($listener.IsListening) { $context = $listener.GetContext(); $request = $context.Request; $response = $context.Response; $localPath = $request.Url.LocalPath; if ($localPath -eq '/') { $localPath = '/index.html' }; $filePath = Join-Path (Get-Location) $localPath.TrimStart('/'); if (Test-Path $filePath -PathType Leaf) { $bytes = [System.IO.File]::ReadAllBytes($filePath); $response.ContentLength64 = $bytes.Length; if ($filePath.EndsWith('.html')) { $response.ContentType = 'text/html; charset=utf-8' } elseIf ($filePath.EndsWith('.css')) { $response.ContentType = 'text/css' } elseIf ($filePath.EndsWith('.js')) { $response.ContentType = 'application/javascript' }; $response.OutputStream.Write($bytes, 0, $bytes.Length) } else { $response.StatusCode = 404 }; $response.OutputStream.Close() }"

pause
