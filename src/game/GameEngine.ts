import type { GameConfig } from '../types/game';

export class GameEngine {
  private config: GameConfig;
  private grid: boolean[][];
  private aliveCells: number;

  constructor(config: GameConfig) {
    this.config = config;
    this.grid = this.createEmptyGrid();
    this.aliveCells = 0;
  }

  // 创建空网格
  private createEmptyGrid(): boolean[][] {
    const grid: boolean[][] = [];
    for (let row = 0; row < this.config.rows; row++) {
      grid[row] = new Array(this.config.cols).fill(false);
    }
    return grid;
  }

  // 获取细胞状态
  getCell(row: number, col: number): boolean {
    if (row >= 0 && row < this.config.rows && col >= 0 && col < this.config.cols) {
      return this.grid[row]?.[col] ?? false;
    }
    return false;
  }

  // 设置细胞状态
  setCell(row: number, col: number, alive: boolean): void {
    if (row >= 0 && row < this.config.rows && col >= 0 && col < this.config.cols) {
      const wasAlive = this.grid[row]?.[col] ?? false;
      if (this.grid[row]) {
        this.grid[row]![col] = alive;
      }
      if (wasAlive !== alive) {
        this.aliveCells += alive ? 1 : -1;
      }
    }
  }

  // 计算邻居存活细胞数
  private countNeighbors(row: number, col: number): number {
    let count = 0;
    
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        if (dr === 0 && dc === 0) continue;
        
        let r = row + dr;
        let c = col + dc;
        
        if (this.config.wrap) {
          // 环绕边界
          r = (r + this.config.rows) % this.config.rows;
          c = (c + this.config.cols) % this.config.cols;
        } else {
          // 固定边界，超出范围视为死亡
          if (r < 0 || r >= this.config.rows || c < 0 || c >= this.config.cols) {
            continue;
          }
        }
        
        if (this.grid[r]?.[c]) {
          count++;
        }
      }
    }
    
    return count;
  }

  // 计算下一代状态
  computeNextGeneration(): void {
    const newGrid: boolean[][] = this.createEmptyGrid();
    let newAliveCount = 0;

    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const isAlive = this.grid[row]?.[col] ?? false;
        const neighbors = this.countNeighbors(row, col);
        
        let shouldLive = false;
        
        if (isAlive) {
          // 存活细胞的生存规则
          shouldLive = neighbors === 2 || neighbors === 3;
        } else {
          // 死亡细胞的出生规则
          shouldLive = neighbors === 3;
        }
        
        if (newGrid[row]) {
          newGrid[row]![col] = shouldLive;
        }
        if (shouldLive) {
          newAliveCount++;
        }
      }
    }

    this.grid = newGrid;
    this.aliveCells = newAliveCount;
  }

  // 随机生成初始状态
  generateRandom(density: number = 0.3): void {
    this.clear();
    
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        if (Math.random() < density) {
          this.setCell(row, col, true);
        }
      }
    }
  }

  // 清空网格
  clear(): void {
    this.grid = this.createEmptyGrid();
    this.aliveCells = 0;
  }

  // 加载图案
  loadPattern(pattern: boolean[][], startRow: number = 0, startCol: number = 0): void {
    for (let r = 0; r < pattern.length; r++) {
      const patternRow = pattern[r];
      if (patternRow) {
        for (let c = 0; c < patternRow.length; c++) {
          const gridRow = startRow + r;
          const gridCol = startCol + c;
          if (gridRow < this.config.rows && gridCol < this.config.cols) {
            this.setCell(gridRow, gridCol, patternRow[c] ?? false);
          }
        }
      }
    }
  }

  // 获取当前网格状态
  getGrid(): boolean[][] {
    return this.grid.map(row => [...row]);
  }

  // 获取存活细胞数量
  getAliveCells(): number {
    return this.aliveCells;
  }

  // 更新配置
  updateConfig(newConfig: Partial<GameConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    // 如果网格大小改变了，需要重新创建网格
    if (newConfig.rows !== undefined || newConfig.cols !== undefined) {
      const oldGrid = this.getGrid();
      this.grid = this.createEmptyGrid();
      this.aliveCells = 0;
      
      // 尽量保留原有状态
      const rows = Math.min(this.config.rows, oldGrid.length);
      const cols = Math.min(this.config.cols, oldGrid[0]?.length || 0);
      
      for (let r = 0; r < rows; r++) {
        const oldRow = oldGrid[r];
        if (oldRow) {
          for (let c = 0; c < cols; c++) {
            this.setCell(r, c, oldRow[c] ?? false);
          }
        }
      }
    }
  }

  // 获取配置
  getConfig(): GameConfig {
    return { ...this.config };
  }
}
