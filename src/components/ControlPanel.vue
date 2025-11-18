<template>
  <div class="control-panel">
    <!-- 游戏控制 -->
    <div class="section">
      <h3>{{ $t('controls.title') }}</h3>
      <div class="control-buttons">
        <button 
          @click="startGame" 
          :disabled="gameStore.isRunning"
          class="btn btn-primary"
        >
          ▶️ {{ $t('controls.start') }}
        </button>
        <button 
          @click="pauseGame" 
          :disabled="!gameStore.isRunning"
          class="btn btn-secondary"
        >
          ⏸️ {{ $t('controls.pause') }}
        </button>
        <button 
          @click="stepOnce" 
          :disabled="gameStore.isRunning"
          class="btn btn-secondary"
        >
          ⏭️ {{ $t('controls.step') }}
        </button>
        <button 
          @click="stopGame" 
          class="btn btn-danger"
        >
          ⏹️ {{ $t('controls.reset') }}
        </button>
      </div>
    </div>

    <!-- 游戏统计 -->
    <div class="section">
      <h3>{{ $t('controls.stats') }}</h3>
      <div class="stats">
        <div class="stat">
          <span class="label">{{ $t('controls.generation') }}:</span>
          <span class="value">{{ gameStore.generation }}</span>
        </div>
        <div class="stat">
          <span class="label">{{ $t('controls.aliveCells') }}:</span>
          <span class="value">{{ gameStore.aliveCells }}</span>
        </div>
        <div class="stat">
          <span class="label">{{ $t('controls.density') }}:</span>
          <span class="value">{{ gameStore.density.toFixed(1) }}%</span>
        </div>
        <div v-if="gameStore.isStable" class="stat stability-indicator">
          <span class="stability-badge" :class="gameStore.stabilityType">
            {{ getStabilityText() }}
          </span>
        </div>
      </div>
    </div>

    <!-- 速度控制 -->
    <div class="section">
      <h3>{{ $t('controls.speed') }}</h3>
      <div class="speed-control">
        <input 
          type="range" 
          min="1" 
          max="60" 
          v-model="speedValue"
          @input="updateSpeed"
          class="slider"
        />
        <span class="speed-value">{{ speedValue }} FPS</span>
      </div>
    </div>

    <!-- 网格设置 -->
    <div class="section">
      <h3>{{ $t('controls.gridSettings') }}</h3>
      <div class="grid-settings">
        <div class="setting-item">
          <label>{{ $t('controls.rows') }}:</label>
          <input 
            type="number" 
            min="10" 
            max="200" 
            v-model="rowsValue"
            @change="updateGridSize"
            class="number-input"
          />
        </div>
        <div class="setting-item">
          <label>{{ $t('controls.cols') }}:</label>
          <input 
            type="number" 
            min="10" 
            max="200" 
            v-model="colsValue"
            @change="updateGridSize"
            class="number-input"
          />
        </div>
        <div class="setting-item">
          <label class="checkbox-label">
            <input 
              type="checkbox" 
              v-model="wrapValue"
              @change="updateWrap"
            />
            {{ $t('controls.wrapEdges') }}
          </label>
        </div>
      </div>
    </div>

    <!-- 快速操作 -->
    <div class="section">
      <h3>{{ $t('controls.quickActions') }}</h3>
      <div class="quick-actions">
        <button 
          @click="generateRandom(0.2)" 
          :disabled="gameStore.isRunning"
          class="btn btn-secondary"
        >
          🎲 {{ $t('controls.sparseRandom') }}
        </button>
        <button 
          @click="generateRandom(0.35)" 
          :disabled="gameStore.isRunning"
          class="btn btn-secondary"
        >
          🎲 {{ $t('controls.mediumRandom') }}
        </button>
        <button 
          @click="generateRandom(0.55)" 
          :disabled="gameStore.isRunning"
          class="btn btn-secondary"
        >
          🎲 {{ $t('controls.denseRandom') }}
        </button>
        <button 
          @click="clearGrid" 
          :disabled="gameStore.isRunning"
          class="btn btn-danger"
        >
          🗑️ {{ $t('controls.clear') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { useI18n } from 'vue-i18n';

const gameStore = useGameStore();
const { t } = useI18n();

// 响应式数据
const speedValue = ref(gameStore.config.speed);
const rowsValue = ref(gameStore.config.rows);
const colsValue = ref(gameStore.config.cols);
const wrapValue = ref(gameStore.config.wrap);

// 监听游戏配置变化
watch(() => gameStore.config, (newConfig) => {
  speedValue.value = newConfig.speed;
  rowsValue.value = newConfig.rows;
  colsValue.value = newConfig.cols;
  wrapValue.value = newConfig.wrap;
}, { deep: true });

// 方法
const startGame = () => {
  gameStore.startGame();
  gameStore.startGameLoop();
};

const pauseGame = () => {
  gameStore.pauseGame();
};

const stepOnce = () => {
  gameStore.stepOnce();
};

const stopGame = () => {
  gameStore.stopGame();
};

const updateSpeed = () => {
  gameStore.updateConfig({ speed: speedValue.value });
};

const updateGridSize = () => {
  gameStore.updateConfig({ 
    rows: rowsValue.value, 
    cols: colsValue.value 
  });
};

const updateWrap = () => {
  gameStore.updateConfig({ wrap: wrapValue.value });
};

const generateRandom = (density: number) => {
  gameStore.generateRandom(density);
};

const clearGrid = () => {
  gameStore.stopGame();
};

// 获取稳定性文本
const getStabilityText = () => {
  if (!gameStore.isStable) return '';
  
  const texts = {
    extinct: `🔴 ${t('stability.extinct')}`,
    static: `🔵 ${t('stability.static')}`,
    oscillator: `🟡 ${t('stability.oscillator')} (${t('controls.period')}${gameStore.oscillatorPeriod})`
  };
  return texts[gameStore.stabilityType as keyof typeof texts] || '';
};
</script>

<style scoped>
.control-panel {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background-color: #2a2a2a;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  color: #ffffff;
}

.section {
  border-bottom: 1px solid #444;
  padding-bottom: 1rem;
}

.section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.section h3 {
  margin: 0 0 1rem 0;
  color: #4CAF50;
  font-size: 1.1rem;
  font-weight: 600;
}

.control-buttons {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #45a049;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: #666;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #777;
  transform: translateY(-1px);
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover:not(:disabled) {
  background-color: #da190b;
  transform: translateY(-1px);
}

.stats {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #333;
}

.stat:last-child {
  border-bottom: none;
}

.stability-indicator {
  display: flex;
  justify-content: center;
  padding: 0.8rem 0;
}

.stability-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

.stability-badge.extinct {
  background: rgba(244, 67, 54, 0.2);
  color: #ff6b6b;
  border: 2px solid #ff6b6b;
}

.stability-badge.static {
  background: rgba(33, 150, 243, 0.2);
  color: #64B5F6;
  border: 2px solid #64B5F6;
}

.stability-badge.oscillator {
  background: rgba(255, 152, 0, 0.2);
  color: #ffb74d;
  border: 2px solid #ffb74d;
}

.label {
  color: #ccc;
  font-weight: 500;
}

.value {
  color: #4CAF50;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.speed-control {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.slider {
  flex: 1;
  height: 6px;
  border-radius: 3px;
  background: #444;
  outline: none;
  -webkit-appearance: none;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4CAF50;
  cursor: pointer;
  border: none;
}

.speed-value {
  min-width: 60px;
  text-align: right;
  color: #4CAF50;
  font-weight: 600;
  font-family: 'Courier New', monospace;
}

.grid-settings {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-item label {
  color: #ccc;
  font-weight: 500;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  transform: scale(1.2);
  cursor: pointer;
}

.number-input {
  width: 80px;
  padding: 0.4rem;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #333;
  color: #fff;
  text-align: center;
}

.number-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.quick-actions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .control-panel {
    padding: 1rem;
    gap: 1rem;
  }
  
  .control-buttons {
    grid-template-columns: 1fr 1fr;
  }
  
  .quick-actions {
    grid-template-columns: 1fr;
  }
  
  .btn {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
  }
}

/* 暗色主题优化 */
@media (prefers-color-scheme: dark) {
  .control-panel {
    background-color: #1a1a1a;
  }
  
  .section {
    border-bottom-color: #333;
  }
  
  .number-input {
    background-color: #2a2a2a;
    border-color: #444;
  }
  
  .number-input:focus {
    border-color: #4CAF50;
  }
}
</style>
