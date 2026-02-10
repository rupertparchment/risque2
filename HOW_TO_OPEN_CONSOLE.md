# How to Open Browser Console - Step by Step

## Why We Need the Console

The console shows JavaScript errors and debugging messages that help us figure out why the form isn't working.

## Step-by-Step: Open Console

### Method 1: Keyboard Shortcut (Easiest)

1. **Make sure you're on the gallery page:** https://www.risque2.com/admin/gallery
2. **Press F12** on your keyboard
3. **A panel will open** at the bottom or side of your browser
4. **Click the "Console" tab** at the top of that panel

### Method 2: Right-Click Menu

1. **Right-click anywhere on the page**
2. **Click "Inspect"** or "Inspect Element"
3. **Click the "Console" tab** at the top

### Method 3: Browser Menu

**Chrome/Edge:**
- Click the three dots (⋮) in top right
- More Tools → Developer Tools
- Click "Console" tab

**Firefox:**
- Click the three lines (☰) in top right
- More Tools → Web Developer Tools
- Click "Console" tab

## What You'll See

**The Console tab shows:**
- Red text = Errors (these are important!)
- Black text = Regular messages
- Blue text = Links/URLs

## What to Look For

**When you click "Add Image", you should see:**

1. **"Button clicked!"** - Means the button works
2. **"Form submitted!"** - Means the form is submitting
3. **"Submitting: ..."** - Shows what data is being sent
4. **Any RED errors** - These tell us what's wrong

## Screenshot Guide

**The Console looks like this:**
```
┌─────────────────────────────────────┐
│ Elements  Console  Sources  ...    │ ← Click "Console" tab
├─────────────────────────────────────┤
│ > Button clicked!                   │ ← Messages appear here
│ > Form submitted!                   │
│ > Submitting: {url: "...", ...}     │
│                                     │
│ ❌ Error: ...                       │ ← Red = Error!
└─────────────────────────────────────┘
```

## Quick Test

**To test if console is working:**

1. Open console (F12)
2. Type: `console.log("Hello!")`
3. Press Enter
4. You should see "Hello!" appear

If that works, the console is ready!

## After Opening Console

1. **Keep console open**
2. **Fill out the gallery form**
3. **Click "Add Image"**
4. **Look at the console** - what messages/errors do you see?
5. **Tell me what you see** (especially any red errors)

## Common Issues

**"Console tab not showing":**
- Make sure Developer Tools panel is open (F12)
- Look for tabs: Elements, Console, Sources, Network, etc.
- Click "Console"

**"Nothing appears when I click":**
- Make sure you're on the right page
- Refresh the page (F5)
- Try clicking the button again

## Need Help?

If you can't find the console, tell me:
- What browser are you using? (Chrome, Firefox, Edge, etc.)
- What happens when you press F12?

I can give you browser-specific instructions!
