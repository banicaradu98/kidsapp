@echo off
cd C:\Users\banic\proiecte\kidsapp
taskkill /F /IM node.exe 2>nul
rd /s /q .next 2>nul
npm run dev
