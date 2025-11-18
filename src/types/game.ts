// 生命游戏相关类型定义

export interface Cell {
  row: number;
  col: number;
  alive: boolean;
}

export interface Grid {
  cells: boolean[][];
  rows: number;
  cols: number;
}

export interface GameConfig {
  rows: number;
  cols: number;
  speed: number; // FPS
  wrap: boolean; // 边界处理方式：true=环绕，false=固定边界
}

export interface GameState {
  grid: Grid;
  config: GameConfig;
  isRunning: boolean;
  generation: number;
  aliveCells: number;
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  cells: boolean[][];
  author?: string;
  category: 'still' | 'oscillator' | 'spaceship' | 'other';
}

export interface AIRequest {
  prompt: string;
  type: 'text-to-pattern' | 'pattern-analysis' | 'smart-suggestion';
  context?: Record<string, unknown>;
}

export interface AIResponse {
  content: string;
  pattern?: Pattern;
  suggestions?: string[];
  analysis?: string;
}

export interface LLMSettings {
  provider: 'openai';
  apiKey: string;
  baseURL: string;
  model: string;
  maxTokens: number;
  temperature: number;
}
