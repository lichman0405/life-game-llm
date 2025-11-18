import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { GameState, GameConfig, Pattern } from '../types/game';
import { GameEngine } from '../game/GameEngine';
import { CLASSIC_PATTERNS } from '../patterns/classicPatterns';

export const useGameStore = defineStore('game', () => {
  // 状态
  const gameEngine = ref<GameEngine | null>(null);
  const isRunning = ref(false);
  const generation = ref(0);
  const aliveCells = ref(0);
  const grid = ref<boolean[][]>([]);
  const config = ref<GameConfig>({
    rows: 50,
    cols: 50,
    speed: 10,
    wrap: false
  });

  // 创建初始空网格
  const createEmptyGrid = () => {
    const emptyGrid: boolean[][] = [];
    for (let i = 0; i < config.value.rows; i++) {
      emptyGrid[i] = new Array(config.value.cols).fill(false);
    }
    return emptyGrid;
  };

  // 初始化网格
  grid.value = createEmptyGrid();

  // 历史状态记录（用于检测停止）
  const stateHistory = ref<string[]>([]);
  const maxHistorySize = 10; // 记录最近10代的状态
  const isStable = ref(false); // 是否达到稳定状态
  const stabilityType = ref<'extinct' | 'static' | 'oscillator' | null>(null);
  const oscillatorPeriod = ref(0); // 振荡周期

  // 计算属性
  const density = computed(() => {
    const totalCells = config.value.rows * config.value.cols;
    return totalCells > 0 ? (aliveCells.value / totalCells) * 100 : 0;
  });

  const gameState = computed<GameState>(() => ({
    grid: {
      cells: grid.value,
      rows: config.value.rows,
      cols: config.value.cols
    },
    config: config.value,
    isRunning: isRunning.value,
    generation: generation.value,
    aliveCells: aliveCells.value
  }));

  // 动作
  const initializeGame = () => {
    gameEngine.value = new GameEngine(config.value);
    updateGrid();
    
    // 加载一个默认图案让用户看到效果
    const gliderPattern = CLASSIC_PATTERNS.find(p => p.name.includes('滑翔机'));
    if (gliderPattern) {
      loadPattern(gliderPattern);
    }
  };

  const updateGrid = () => {
    if (gameEngine.value) {
      grid.value = gameEngine.value.getGrid();
      aliveCells.value = gameEngine.value.getAliveCells();
      
      // 检测游戏是否停止
      checkStability();
    }
  };

  // 将网格序列化为字符串（用于比较）
  const serializeGrid = (gridData: boolean[][]): string => {
    return gridData.map(row => row.map(cell => cell ? '1' : '0').join('')).join('|');
  };

  // 检测游戏稳定性
  const checkStability = () => {
    const currentState = serializeGrid(grid.value);
    
    // 检测灭绝
    if (aliveCells.value === 0) {
      if (!isStable.value) {
        isStable.value = true;
        stabilityType.value = 'extinct';
        pauseGame();
      }
      return;
    }
    
    // 添加到历史
    stateHistory.value.push(currentState);
    if (stateHistory.value.length > maxHistorySize) {
      stateHistory.value.shift();
    }
    
    // 需要至少3代才能检测
    if (stateHistory.value.length < 3) {
      return;
    }
    
    // 检测静止状态（连续2代相同）
    if (stateHistory.value.length >= 2) {
      const last = stateHistory.value[stateHistory.value.length - 1];
      const prev = stateHistory.value[stateHistory.value.length - 2];
      if (last === prev && !isStable.value) {
        isStable.value = true;
        stabilityType.value = 'static';
        pauseGame();
        return;
      }
    }
    
    // 检测振荡器（周期为2-5的循环）
    for (let period = 2; period <= Math.min(5, stateHistory.value.length - 1); period++) {
      let isOscillator = true;
      const currentIndex = stateHistory.value.length - 1;
      
      for (let i = 0; i < Math.min(period, Math.floor(stateHistory.value.length / period)); i++) {
        if (stateHistory.value[currentIndex - i] !== stateHistory.value[currentIndex - i - period]) {
          isOscillator = false;
          break;
        }
      }
      
      if (isOscillator && !isStable.value) {
        isStable.value = true;
        stabilityType.value = 'oscillator';
        oscillatorPeriod.value = period;
        pauseGame();
        return;
      }
    }
  };

  // 重置稳定性检测
  const resetStability = () => {
    stateHistory.value = [];
    isStable.value = false;
    stabilityType.value = null;
    oscillatorPeriod.value = 0;
  };

  const startGame = () => {
    if (!gameEngine.value) {
      initializeGame();
    }
    resetStability();
    isRunning.value = true;
  };

  const pauseGame = () => {
    isRunning.value = false;
  };

  const stopGame = () => {
    isRunning.value = false;
    generation.value = 0;
    resetStability();
    if (gameEngine.value) {
      gameEngine.value.clear();
      updateGrid();
    }
  };

  const nextGeneration = () => {
    if (gameEngine.value) {
      gameEngine.value.computeNextGeneration();
      generation.value++;
      updateGrid();
    }
  };

  const toggleCell = (row: number, col: number) => {
    if (gameEngine.value) {
      const currentState = gameEngine.value.getCell(row, col);
      gameEngine.value.setCell(row, col, !currentState);
      updateGrid();
    }
  };

  const generateRandom = (density: number = 0.3) => {
    if (gameEngine.value) {
      isRunning.value = false; // 暂停游戏
      generation.value = 0; // 重置代数
      gameEngine.value.generateRandom(density);
      updateGrid();
    }
  };

  const loadPattern = (pattern: Pattern, startRow?: number, startCol?: number) => {
    if (gameEngine.value) {
      isRunning.value = false; // 暂停游戏
      generation.value = 0; // 重置代数
      const patternWidth = pattern.cells[0]?.length || 0;
      gameEngine.value.loadPattern(
        pattern.cells, 
        startRow ?? Math.floor((config.value.rows - pattern.cells.length) / 2),
        startCol ?? Math.floor((config.value.cols - patternWidth) / 2)
      );
      updateGrid();
    }
  };

  const updateConfig = (newConfig: Partial<GameConfig>) => {
    config.value = { ...config.value, ...newConfig };
    if (gameEngine.value) {
      gameEngine.value.updateConfig(newConfig);
      updateGrid();
    }
  };

  const gameLoop = () => {
    if (isRunning.value && gameEngine.value) {
      nextGeneration();
      const speed = config.value.speed;
      const interval = Math.max(16, 1000 / speed); // 至少16ms间隔
      setTimeout(gameLoop, interval);
    }
  };

  // 启动游戏循环
  const startGameLoop = () => {
    if (isRunning.value) {
      gameLoop();
    }
  };

  // 手动推进一代
  const stepOnce = () => {
    pauseGame();
    nextGeneration();
  };

  return {
    // 状态
    isRunning,
    generation,
    aliveCells,
    grid,
    config,
    isStable,
    stabilityType,
    oscillatorPeriod,
    
    // 计算属性
    density,
    gameState,
    
    // 动作
    initializeGame,
    startGame,
    pauseGame,
    stopGame,
    nextGeneration,
    toggleCell,
    generateRandom,
    loadPattern,
    updateConfig,
    startGameLoop,
    stepOnce
  };
});
