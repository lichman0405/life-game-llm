# 🧬 AI-Enhanced Game of Life

English | [简体中文](./README.md)

An interactive Conway's Game of Life simulator built with Vue 3 + TypeScript + Vite, featuring integrated AI assistant and internationalization support.

![Vue 3](https://img.shields.io/badge/Vue-3.5-4FC08D?logo=vue.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1-646CFF?logo=vite)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🎮 Core Game Features
- **Interactive Grid Editing** - Click or drag to draw/erase cell patterns
- **Game Controls** - Start/Pause/Step/Reset functionality
- **Real-time Statistics** - Generation count, alive cells, density, period detection
- **Stability Analysis** - Automatic detection of extinct, static, and oscillating states
- **Grid Configuration** - Customizable rows, columns, and edge wrapping mode
- **Quick Actions** - Sparse/Medium/Dense random fill, clear all

### 🤖 AI-Powered Features
- **Text to Pattern** - Create custom life patterns from natural language descriptions
- **Pattern Analysis** - AI analyzes current pattern characteristics and behavior
- **Smart Suggestions** - Get AI recommendations for game state optimization
- **Learning Assistant** - Ask questions about Conway's Game of Life
- **State Summary** - AI summarizes the current game state

### 🎨 Pattern Gallery
- **13 Classic Patterns** - Includes still lifes, oscillators, spaceships, and more
  - Still Lifes: Block, Beehive, Boat, Bowtie
  - Oscillators: Blinker, Toad, Beacon, Pulsar, Pentadecathlon
  - Spaceships: Glider, Lightweight Spaceship, Midweight Spaceship
  - Special: R-pentomino
- **Search & Filter** - Quick lookup by name, description, or category
- **Random Pattern** - Load a random classic pattern with one click

### 🌍 Internationalization
- **Multi-language UI** - Support for Simplified Chinese, English, and Japanese
- **Live Switching** - Language changes take effect immediately without refresh
- **Complete Translation** - UI, help docs, and pattern descriptions fully localized

## 🚀 Quick Start

### Requirements
- Node.js >= 20.19.0 or >= 22.12.0
- npm or pnpm

### Installation Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd life-game
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
# Copy the environment template
cp .env.example .env

# Edit .env file and add your OpenAI API key
# VITE_OPENAI_API_KEY=your_api_key_here
# VITE_OPENAI_BASE_URL=https://api.openai.com/v1  # Or DeepSeek, etc.
# VITE_OPENAI_MODEL=gpt-4-turbo-preview
```

4. **Start development server**
```bash
npm run dev
```

5. **Open in browser**
Visit `http://localhost:5173`

### Production Build
```bash
# Type-check + Build
npm run build

# Preview production build
npm run preview
```

## 📖 User Guide

### Basic Operations
1. **Draw Patterns** - Click grid cells to draw/erase cells
2. **Drag Drawing** - Hold and drag mouse for continuous drawing
3. **Load Presets** - Select classic patterns from the gallery
4. **Adjust Speed** - Use speed slider to control evolution rate
5. **Step Through** - Observe pattern changes generation by generation

### Using AI Features
1. **Configure API** - Ensure `.env` file contains a valid API key
2. **Text to Pattern** - Enter descriptions like "create a spiral shape" in the text-to-pattern area
3. **Analyze Pattern** - Click "Analyze Current Pattern" to get AI insights
4. **Get Suggestions** - Click "Get Suggestion" for AI optimization tips
5. **Ask Questions** - Use the learning assistant to ask about Game of Life concepts

### Switch Language
Click the language selector (globe icon) in the top-right corner to choose 中文/English/日本語

## 🛠️ Tech Stack

- **Frontend Framework**: Vue 3.5 (Composition API)
- **Language**: TypeScript 5.9
- **Build Tool**: Vite 7.1
- **State Management**: Pinia 3.0
- **Router**: Vue Router 4.6
- **Internationalization**: Vue I18n 9.14
- **AI Integration**: OpenAI SDK 6.9 (supports OpenAI, DeepSeek, etc.)
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
life-game/
├── src/
│   ├── components/          # Vue components
│   │   ├── AIAssistant.vue       # AI assistant panel
│   │   ├── ControlPanel.vue      # Game control panel
│   │   ├── GameGrid.vue          # Game grid
│   │   ├── PatternGallery.vue    # Pattern gallery
│   │   └── LanguageSwitcher.vue  # Language switcher
│   ├── game/                # Game engine
│   │   └── GameEngine.ts         # Core game logic
│   ├── patterns/            # Pattern data
│   │   └── classicPatterns.ts    # Classic pattern definitions
│   ├── stores/              # Pinia state management
│   │   └── gameStore.ts          # Game state
│   ├── services/            # External services
│   │   └── openaiService.ts      # OpenAI API wrapper
│   ├── i18n/                # Internationalization
│   │   ├── index.ts              # i18n configuration
│   │   └── locales/              # Translation files
│   │       ├── zh-CN.ts          # Simplified Chinese
│   │       ├── en-US.ts          # English
│   │       └── ja-JP.ts          # Japanese
│   ├── types/               # TypeScript type definitions
│   └── App.vue              # Root component
├── .env.example             # Environment variables template
└── package.json             # Project configuration
```

## 🎯 Conway's Game of Life Rules

1. **Birth**: A dead cell with exactly 3 live neighbors becomes alive
2. **Survival**: A live cell with 2-3 live neighbors stays alive
3. **Death**: A live cell with fewer than 2 (loneliness) or more than 3 (overcrowding) neighbors dies

## 🤝 Contributing

Issues and Pull Requests are welcome!

## 📄 License

[MIT License](LICENSE)

## 🔗 Recommended Resources

### IDE Extensions
- [VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

### Browser Extensions
- Chrome/Edge: [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
- Firefox: [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)

### Related Links
- [Conway's Game of Life - Wikipedia](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life)
- [Vite Documentation](https://vite.dev/)
- [Vue 3 Documentation](https://vuejs.org/)
- [OpenAI API Documentation](https://platform.openai.com/docs/api-reference)

---

💚 Made with Vue 3 + TypeScript + AI
