git init
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
git config user.name "AI Assistant"
git config user.email "assistant@example.com"
git add .
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
git commit -m "Initial commit"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
git branch -M main
git remote add origin https://github.com/JuniorXII-XD/DU-DUANG.git
git push -u origin main
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
