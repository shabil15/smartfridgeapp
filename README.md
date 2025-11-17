# 🧊 SmartFridge AI

> An intelligent fridge dashboard app that tracks stored items and generates AI-powered cooking ideas using Google's Gemini Pro API.

<div align="center">

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

</div>

---

## ✨ Features

- 📱 **Add & Track Items** - Manage your fridge inventory with quantities, units, and expiry dates
- 🎨 **Smart Expiry Indicators** - Color-coded warnings for items expiring soon
- 🤖 **AI Recipe Generator** - Get personalized recipe suggestions using Google Gemini Pro
- 📊 **Dashboard Overview** - See your inventory summary at a glance
- 🗂️ **Categorization** - Organize items by Dairy, Vegetables, Fruits, Meat, etc.
- 💾 **Real-time Sync** - Data stored and synced with Supabase

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ installed
- Expo CLI (installed automatically)
- Supabase account (free tier works great)
- Google Gemini API key (free to get)

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Configure environment variables
# Edit .env file with your credentials
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_anon_key  
EXPO_PUBLIC_GEMINI_API_KEY=your_gemini_key

# 3. Start the app
npm start
```

📖 **Detailed Setup**: See [QUICKSTART.md](./QUICKSTART.md) for step-by-step instructions

## 📱 How to Use

1. **Dashboard** - View your fridge summary and navigate to features
2. **Add Item** - Enter item details (name, quantity, expiry, category)
3. **View Inventory** - See all items with expiry indicators
4. **Generate Recipes** - Let AI suggest recipes based on your ingredients

## 🏗️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React Native** | Cross-platform mobile framework |
| **Expo** | Development platform and tools |
| **TypeScript** | Type-safe JavaScript |
| **Supabase** | PostgreSQL database & real-time subscriptions |
| **Google Gemini Pro** | AI-powered recipe generation |
| **NativeWind** | Tailwind CSS for React Native |

## 📁 Project Structure

```
smartfridgeapp/
├── app/
│   ├── (tabs)/
│   │   └── index.tsx          # Dashboard screen
│   ├── add-item.tsx           # Add new items
│   ├── inventory.tsx          # View all items
│   └── recipes.tsx            # AI recipe generator
├── components/
│   ├── ItemCard.tsx           # Item display component
│   └── RecipeCard.tsx         # Recipe display component
├── lib/
│   ├── supabase.ts            # Supabase configuration
│   └── gemini.ts              # Gemini AI integration
├── .env                       # Environment variables
└── package.json
```

## 🗄️ Database Schema

```sql
CREATE TABLE fridge_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  unit TEXT NOT NULL,
  expiry_date DATE,
  category TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);
```

## 🎯 Key Features in Detail

### Smart Expiry Tracking
- 🟢 **Green**: Fresh (>3 days until expiry)
- 🟠 **Orange**: Expiring soon (1-3 days)
- 🔴 **Red**: Expired

### AI Recipe Generation
Powered by Google Gemini Pro, the app:
- Analyzes your available ingredients
- Suggests 3 personalized recipes
- Provides step-by-step instructions
- Marks missing ingredients if needed

### Category Management
Organize items into:
- 🥛 Dairy
- 🥕 Vegetables
- 🍎 Fruits
- 🥩 Meat
- 🌾 Grains
- 🥤 Beverages
-  Other

## 📝 Available Scripts

```bash
npm start          # Start Expo development server
npm run android    # Run on Android
npm run ios        # Run on iOS
npm run web        # Run in web browser
npm run check-setup # Verify environment configuration
```

## 🔧 Configuration

### Supabase Setup
1. Create project at [supabase.com](https://supabase.com)
2. Run the SQL schema (see SETUP.md)
3. Get Project URL and anon key from Settings → API

### Gemini API Setup
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create new API key
3. Copy to `.env` file

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Failed to load items" | Check Supabase credentials in `.env` |
| "Couldn't generate recipes" | Verify Gemini API key is correct |
| Module errors | Run `rm -rf node_modules && npm install` |
| Cache issues | Run `npx expo start -c` |

## 🚧 Roadmap

- [ ] Edit item functionality
- [ ] Barcode scanning
- [ ] Shopping list feature
- [ ] Recipe favorites
- [ ] Push notifications
- [ ] Dark mode
- [ ] Image upload for items
- [ ] Meal planning

## 📚 Documentation

- [Quick Start Guide](./QUICKSTART.md) - Get up and running in 5 minutes
- [Setup Instructions](./SETUP.md) - Detailed configuration guide
- [Project Summary](./PROJECT_SUMMARY.md) - Technical overview
- [Requirements](./requirments.md) - Original project requirements

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 🙏 Acknowledgments

- Built with [Expo](https://expo.dev)
- Database by [Supabase](https://supabase.com)
- AI powered by [Google Gemini](https://deepmind.google/technologies/gemini/)
- Icons from [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/)

---

<div align="center">

**Made with ❤️ for smarter kitchen management**

[Report Bug](https://github.com/yourusername/smartfridgeapp/issues) · [Request Feature](https://github.com/yourusername/smartfridgeapp/issues)

</div>
