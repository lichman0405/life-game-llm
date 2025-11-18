<template>
  <div id="app">
    <div class="app-container">
      <!-- 应用头部 -->
      <header class="app-header">
        <div class="header-content">
          <h1 class="app-title">
            🧬 {{ $t('app.title') }}
          </h1>
          <p class="app-subtitle">
            {{ $t('app.subtitle') }}
          </p>
        </div>
        <div class="header-actions">
          <LanguageSwitcher />
          <button 
            @click="showInfo = !showInfo" 
            class="info-btn"
            :class="{ 'active': showInfo }"
            :title="$t('app.help')"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 16V12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
              <circle cx="12" cy="8" r="1" fill="currentColor"/>
            </svg>
            <span class="btn-text">{{ $t('app.help') }}</span>
          </button>
        </div>
      </header>

      <!-- 使用说明弹窗 -->
      <div v-if="showInfo" class="info-modal" @click="showInfo = false">
        <div class="info-content" @click.stop>
          <h3>{{ $t('help.title') }}</h3>
          <div class="info-text">
            <h4>🎮 {{ $t('help.basicOps.title') }}</h4>
            <ul>
              <li>{{ $t('help.basicOps.click') }}</li>
              <li>{{ $t('help.basicOps.drag') }}</li>
              <li>{{ $t('help.basicOps.running') }}</li>
            </ul>
            
            <h4>🤖 {{ $t('help.aiFeatures.title') }}</h4>
            <ul>
              <li>{{ $t('help.aiFeatures.textToPattern') }}</li>
              <li>{{ $t('help.aiFeatures.analyze') }}</li>
              <li>{{ $t('help.aiFeatures.suggestions') }}</li>
              <li>{{ $t('help.aiFeatures.qa') }}</li>
            </ul>
            
            <h4>⚙️ {{ $t('help.config.title') }}</h4>
            <p>{{ $t('help.config.description') }} <code>.env</code> {{ $t('help.config.file') }}：</p>
            <pre>VITE_OPENAI_API_KEY=your_api_key_here
VITE_OPENAI_BASE_URL=https://api.openai.com/v1
VITE_OPENAI_MODEL=gpt-4-turbo-preview</pre>
          </div>
          <button @click="showInfo = false" class="btn btn-primary">
            {{ $t('help.close') }}
          </button>
        </div>
      </div>

      <!-- 主要内容区域 -->
      <main class="main-content">
        <!-- 左侧面板 -->
        <div class="left-panel">
          <ControlPanel />
        </div>

        <!-- 中央游戏区域 -->
        <div class="game-area">
          <GameGrid />
        </div>

        <!-- 右侧面板 -->
        <div class="right-panel">
          <!-- 标签页切换 -->
          <div class="panel-tabs">
            <button 
              @click="activeTab = 'ai'"
              :class="{ 'active': activeTab === 'ai' }"
              class="tab-btn"
            >
              🤖 {{ $t('app.tabs.ai') }}
            </button>
            <button 
              @click="activeTab = 'patterns'"
              :class="{ 'active': activeTab === 'patterns' }"
              class="tab-btn"
            >
              🎨 {{ $t('app.tabs.patterns') }}
            </button>
          </div>

          <!-- 标签页内容 -->
          <div class="panel-content">
            <AIAssistant v-if="activeTab === 'ai'" />
            <PatternGallery v-if="activeTab === 'patterns'" />
          </div>
        </div>
      </main>

      <!-- 页脚 -->
      <footer class="app-footer">
        <div class="footer-content">
          <p>{{ $t('footer.builtWith') }}</p>
          <p>{{ $t('footer.description') }}</p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useGameStore } from './stores/gameStore';
import GameGrid from './components/GameGrid.vue';
import ControlPanel from './components/ControlPanel.vue';
import AIAssistant from './components/AIAssistant.vue';
import PatternGallery from './components/PatternGallery.vue';
import LanguageSwitcher from './components/LanguageSwitcher.vue';

const gameStore = useGameStore();

// 响应式数据
const activeTab = ref<'ai' | 'patterns'>('ai');
const showInfo = ref(false);

// 初始化游戏
onMounted(() => {
  gameStore.initializeGame();
});
</script>

<style>
/* 全局样式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: linear-gradient(135deg, #1a1a1a 0%, #2c2c2c 100%);
  color: #ffffff;
  min-height: 100vh;
  overflow-x: hidden;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* 应用头部 */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #444;
  background: rgba(0, 0, 0, 0.2);
  margin: 0 -1rem;
  padding-left: 1rem;
  padding-right: 1rem;
  backdrop-filter: blur(10px);
}

.header-content {
  flex: 1;
}

.app-title {
  font-size: 2rem;
  font-weight: 700;
  color: #4CAF50;
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
}

.app-subtitle {
  color: #ccc;
  font-size: 0.9rem;
  font-style: italic;
}

.header-actions {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.info-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(76, 175, 80, 0.1);
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #4CAF50;
  font-weight: 500;
}

.info-btn svg {
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease;
}

.info-btn .btn-text {
  font-size: 0.9rem;
}

.info-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #45a049;
  color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.info-btn:hover svg {
  transform: rotate(15deg);
}

.info-btn.active {
  background: #4CAF50;
  color: white;
  border-color: #4CAF50;
}

.info-btn:active {
  transform: translateY(0);
}

/* 使用说明弹窗 */
.info-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 1rem;
}

.info-content {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 2rem;
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.info-content h3 {
  color: #4CAF50;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.info-content h4 {
  color: #64B5F6;
  margin: 1.5rem 0 0.8rem 0;
  font-size: 1.1rem;
}

.info-content ul {
  margin: 0.5rem 0 1rem 1.5rem;
  color: #ccc;
}

.info-content li {
  margin: 0.3rem 0;
  line-height: 1.5;
}

.info-content pre {
  background-color: #1a1a1a;
  padding: 1rem;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #4CAF50;
  overflow-x: auto;
  margin: 1rem 0;
}

.info-content code {
  color: #4CAF50;
  font-family: 'Courier New', monospace;
}

.btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s ease;
  margin-top: 1rem;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
  transform: translateY(-1px);
}

/* 主要内容区域 */
.main-content {
  display: grid;
  grid-template-columns: 300px 1fr 350px;
  gap: 2rem;
  flex: 1;
  padding: 2rem 0;
  min-height: 0;
}

/* 左侧面板 */
.left-panel {
  display: flex;
  flex-direction: column;
}

/* 中央游戏区域 */
.game-area {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 600px;
}

/* 右侧面板 */
.right-panel {
  display: flex;
  flex-direction: column;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 12px;
  overflow: hidden;
}

/* 标签页 */
.panel-tabs {
  display: flex;
  background-color: #1a1a1a;
}

.tab-btn {
  flex: 1;
  padding: 1rem;
  border: none;
  background-color: transparent;
  color: #ccc;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background-color: #2a2a2a;
  color: #4CAF50;
}

.tab-btn.active {
  background-color: #2a2a2a;
  color: #4CAF50;
  border-bottom-color: #4CAF50;
}

.panel-content {
  flex: 1;
  overflow: hidden;
}

/* 页脚 */
.app-footer {
  margin-top: auto;
  padding: 1.5rem 0;
  border-top: 1px solid #444;
  text-align: center;
  color: #999;
}

.footer-content p {
  margin: 0.3rem 0;
  font-size: 0.9rem;
}

.footer-content p:first-child {
  color: #4CAF50;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .main-content {
    grid-template-columns: 280px 1fr 320px;
    gap: 1.5rem;
  }
}

@media (max-width: 1024px) {
  .app-container {
    padding: 0 0.5rem;
  }
  
  .main-content {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto;
    gap: 1rem;
    padding: 1rem 0;
  }
  
  .left-panel, .right-panel {
    max-height: none;
  }
  
  .game-area {
    order: -1;
    min-height: 400px;
  }
  
  .panel-tabs {
    position: sticky;
    top: 0;
    z-index: 10;
  }
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 1rem;
  }
  
  .app-title {
    font-size: 1.5rem;
  }
  
  .header-actions {
    order: -1;
  }
  
  .info-content {
    padding: 1.5rem;
    margin: 0.5rem;
  }
}

@media (max-width: 480px) {
  .app-container {
    padding: 0;
  }
  
  .app-header {
    margin: 0;
    border-radius: 0;
  }
  
  .main-content {
    padding: 0.5rem;
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #1a1a1a;
}

::-webkit-scrollbar-thumb {
  background: #444;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* 暗色主题优化 */
@media (prefers-color-scheme: dark) {
  body {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  }
  
  .app-container {
    background-color: rgba(0, 0, 0, 0.1);
  }
}
</style>
