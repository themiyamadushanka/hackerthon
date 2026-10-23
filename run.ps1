Write-Host "========================================================" -ForegroundColor Cyan
Write-Host "  Starting AidLink: Flask (Backend) + Next.js (Frontend)" -ForegroundColor Green
Write-Host "========================================================" -ForegroundColor Cyan

Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; python app.py"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run dev"

Write-Host "`nBoth servers launched!" -ForegroundColor Yellow
Write-Host "Backend API:  http://localhost:5000/api/health" -ForegroundColor Gray
Write-Host "Frontend UI:  http://localhost:3000" -ForegroundColor Gray
