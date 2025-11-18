<template>
  <div 
    class="game-grid-container"
    :style="{
      width: `${gridSize}px`,
      height: `${gridSize}px`
    }"
  >
    <!-- 加载提示 -->
    <div v-if="!grid || grid.length === 0" class="grid-loading">
      <div class="loading-spinner"></div>
      <p>正在初始化游戏...</p>
    </div>
    
    <!-- 游戏网格 -->
    <div 
      v-else
      class="game-grid"
      :style="{
        gridTemplateColumns: `repeat(${config.cols}, 1fr)`,
        gridTemplateRows: `repeat(${config.rows}, 1fr)`
      }"
    >
      <div
        v-for="(row, rowIndex) in grid"
        :key="`row-${rowIndex}`"
        class="grid-row"
        style="display: contents;"
      >
        <div
          v-for="(cell, colIndex) in row"
          :key="`cell-${rowIndex}-${colIndex}`"
          class="grid-cell"
          :class="{
            'alive': cell,
            'dead': !cell,
            'hover': hoverCell.row === rowIndex && hoverCell.col === colIndex
          }"
          :data-row="rowIndex"
          :data-col="colIndex"
          @mouseenter="handleCellHover(rowIndex, colIndex)"
          @mousedown="handleCellMouseDown($event, rowIndex, colIndex)"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useGameStore } from '../stores/gameStore';

const gameStore = useGameStore();

// 响应式数据
const hoverCell = ref<{ row: number; col: number }>({ row: -1, col: -1 });
const isMouseDown = ref(false);

// 计算属性
const grid = computed(() => gameStore.grid);
const config = computed(() => gameStore.config);

// 网格大小计算
const cellSize = computed(() => {
  // 目标网格总宽度：在大屏幕上显示更大
  const targetSize = Math.min(window.innerWidth * 0.45, window.innerHeight * 0.7, 700);
  const calculatedSize = Math.floor(targetSize / config.value.cols);
  // 最小格子尺寸为6px，最大为20px，确保可见且不会太大
  return Math.max(6, Math.min(calculatedSize, 20));
});

const gridSize = computed(() => {
  const size = config.value.cols * cellSize.value;
  return Math.max(size, 400); // 最小400px确保可见
});

// 事件处理
const handleCellHover = (row: number, col: number) => {
  hoverCell.value = { row, col };
  
  if (isMouseDown.value && !gameStore.isRunning) {
    // 拖拽绘制
    gameStore.toggleCell(row, col);
  }
};

const handleCellMouseDown = (event: MouseEvent, row: number, col: number) => {
  event.preventDefault();
  if (!gameStore.isRunning) {
    isMouseDown.value = true;
    gameStore.toggleCell(row, col);
  }
};

// 全局鼠标事件监听
const handleGlobalMouseUp = () => {
  isMouseDown.value = false;
};

onMounted(() => {
  document.addEventListener('mouseup', handleGlobalMouseUp);
});

onUnmounted(() => {
  document.removeEventListener('mouseup', handleGlobalMouseUp);
});
</script>

<style scoped>
.grid-loading {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #4CAF50;
  font-size: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #333;
  border-top: 4px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.game-grid-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(76, 175, 80, 0.3);
  background-color: #1a1a1a;
  padding: 4px;
}

.game-grid {
  display: grid;
  gap: 1px;
  background-color: #333;
  cursor: crosshair;
  user-select: none;
  width: 100%;
  height: 100%;
}

.grid-cell {
  width: 100%;
  height: 100%;
  transition: background-color 0.15s ease, transform 0.1s ease;
  border: none;
  position: relative;
  min-width: 6px;
  min-height: 6px;
}

.grid-cell.alive {
  background-color: #4CAF50;
  box-shadow: inset 0 0 3px rgba(255, 255, 255, 0.2),
              0 0 2px rgba(76, 175, 80, 0.5);
}

.grid-cell.dead {
  background-color: #0a0a0a;
}

.grid-cell.hover:not(.alive) {
  background-color: #333;
}

.grid-cell:hover {
  transform: scale(1.02);
  z-index: 10;
  position: relative;
  box-shadow: 0 0 4px rgba(76, 175, 80, 0.5);
}

/* 暗色主题 */
@media (prefers-color-scheme: dark) {
  .game-grid-container {
    border-color: #555;
  }
  
  .grid-cell.dead {
    background-color: #0a0a0a;
  }
  
  .grid-cell.hover:not(.alive) {
    background-color: #1a1a1a;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .game-grid-container {
    max-width: 95vw;
    max-height: 60vh;
  }
}
</style>
