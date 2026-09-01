param(
    [int]$Port = 5173
)

Write-Host "Starting KisanSetu Persistent Online Tunnel..." -ForegroundColor Green

while ($true) {
    Write-Host "Connecting tunnel to localhost.run (Port $Port)..." -ForegroundColor Cyan
    ssh -o StrictHostKeyChecking=no -o ServerAliveInterval=20 -o ServerAliveCountMax=10 -R 80:127.0.0.1:$Port nokey@localhost.run
    Write-Host "Tunnel disconnected. Reconnecting in 3 seconds..." -ForegroundColor Yellow
    Start-Sleep -Seconds 3
}
