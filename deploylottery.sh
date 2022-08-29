rsync -r src/ docs/
rsync -r public/ docs/
git add .
git commit -m "Compile assets for Github Pages"
git push
