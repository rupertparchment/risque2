# Push Gallery Fix - Use Correct Path

## ✅ Correct Path
```bash
cd ~/OneDrive/Risque/risque-website
```

## Commands to Run

**In Git Bash, run:**

```bash
cd ~/OneDrive/Risque/risque-website
git add app/admin/gallery/page.tsx
git commit -m "Fix gallery page client-side error - use img tag instead of Image component"
git push
```

## What Was Fixed

- ✅ Removed Next.js Image component (was causing client-side errors)
- ✅ Using regular `<img>` tag with error handling
- ✅ Added better error handling for API calls
- ✅ Added error state display

## After Pushing

- Vercel will automatically deploy
- Wait 1-2 minutes
- Visit: https://www.risque2.com/admin/gallery
- Should work without errors!
