# Quick Start Guide 🚀

Get the Collab Notes application running in 3 simple steps!

## Step 1: Install Dependencies

```bash
cd Colab-Notes-Frontend/frontend
npm install
```

## Step 2: Start the Application

```bash
npm run dev
```

The application will start at: **http://localhost:5173**

## Step 3: Login

Use the demo account:

**Email:** `demo@example.com`  
**Password:** `demo123`

## That's It! 🎉

You now have a fully functional collaborative notes application with:

✅ Instance management  
✅ Note editing with auto-save  
✅ Friend system  
✅ Notifications  
✅ Search functionality  
✅ Responsive design  
✅ AI features (mock)  

## What You Can Do

### Create Instances
1. Click "Create Instance" on dashboard
2. Enter a name
3. Start organizing your notes

### Create Notes
1. Open an instance
2. Create a container
3. Add notes with markdown support
4. Auto-save keeps your work safe

### Manage Friends
1. Go to Friends page
2. Send friend requests
3. Accept pending requests
4. Share notes with friends

### Explore Features
- Search across instances
- View notifications
- Check online status
- Try AI summarization
- Test on mobile devices

## Demo Accounts

| Email | Password |
|-------|----------|
| demo@example.com | demo123 |
| john@example.com | john123 |
| jane@example.com | jane123 |
| alice@example.com | alice123 |

## Need Help?

- **Full Guide**: See `DUMMY_BACKEND_GUIDE.md`
- **Testing**: See `TESTING_SUMMARY.md`
- **Implementation**: See `IMPLEMENTATION_COMPLETE.md`

## Run Tests

```bash
# Install Playwright
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

## Important Notes

⚠️ **Mock Backend**: The application uses a mock backend by default  
⚠️ **Data Persistence**: Data resets on page refresh  
⚠️ **Real-time Sync**: Requires actual backend (not available in mock)  

To use a real backend:
```bash
# Edit .env file
VITE_USE_MOCK_BACKEND=false
VITE_API_BASE_URL=https://your-backend-url.com
```

## Enjoy! 🎊

Start exploring the application and all its features!
