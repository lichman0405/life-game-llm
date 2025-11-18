import type { Pattern } from '../types/game';

// 经典生命游戏图案库

// 静止图案 - 方块
export const BLOCK: Pattern = {
  id: 'block',
  name: '方块 (Block)',
  description: '一个简单的2x2静止图案',
  cells: [
    [true, true],
    [true, true]
  ],
  category: 'still'
};

// 静止图案 - 蜂巢
export const BEEHIVE: Pattern = {
  id: 'beehive',
  name: '蜂巢 (Beehive)',
  description: '一个经典的六角形静止图案',
  cells: [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, true, false]
  ],
  category: 'still'
};

// 静止图案 - 船只
export const BOAT: Pattern = {
  id: 'boat',
  name: '船只 (Boat)',
  description: '一个小船状静止图案',
  cells: [
    [true, true, false],
    [true, false, true],
    [false, true, false]
  ],
  category: 'still'
};

// 振荡器 - 闪烁器
export const BLINKER: Pattern = {
  id: 'blinker',
  name: '闪烁器 (Blinker)',
  description: '最简单的振荡器，周期为2',
  cells: [
    [true, true, true]
  ],
  category: 'oscillator'
};

// 振荡器 - 蟾蜍
export const TOAD: Pattern = {
  id: 'toad',
  name: '蟾蜍 (Toad)',
  description: '周期为2的振荡器',
  cells: [
    [false, true, true, true],
    [true, true, true, false]
  ],
  category: 'oscillator'
};

// 振荡器 - 信号灯
export const BEACON: Pattern = {
  id: 'beacon',
  name: '信号灯 (Beacon)',
  description: '周期为2的振荡器，由两个方块组成',
  cells: [
    [true, true, false, false],
    [true, true, false, false],
    [false, false, true, true],
    [false, false, true, true]
  ],
  category: 'oscillator'
};

// 振荡器 - 脉冲星
export const PULSAR: Pattern = {
  id: 'pulsar',
  name: '脉冲星 (Pulsar)',
  description: '周期为3的复杂振荡器',
  cells: [
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, true, false, false, false, true, true, true, false, false],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [true, false, false, false, false, true, false, true, false, false, false, false, true],
    [false, false, false, false, false, false, false, false, false, false, false, false, false],
    [false, false, true, true, true, false, false, false, true, true, true, false, false]
  ],
  category: 'oscillator'
};

// 移动物体 - 滑翔机
export const GLIDER: Pattern = {
  id: 'glider',
  name: '滑翔机 (Glider)',
  description: '最小的移动图案，移动方向为右下',
  cells: [
    [false, true, false],
    [false, false, true],
    [true, true, true]
  ],
  category: 'spaceship'
};

// 移动物体 - 轻型飞船
export const LIGHTWEIGHT_SPACESHIP: Pattern = {
  id: 'lwss',
  name: '轻型飞船 (LWSS)',
  description: '经典的移动飞船，每4代向右移动2格',
  cells: [
    [false, true, false, false, true],
    [true, false, false, false, false],
    [true, false, false, false, true],
    [true, true, true, true, false]
  ],
  category: 'spaceship'
};

// 移动物体 - 中型飞船
export const MIDWEIGHT_SPACESHIP: Pattern = {
  id: 'mwss',
  name: '中型飞船 (MWSS)',
  description: '中型移动飞船，每4代向右移动2格',
  cells: [
    [false, false, true, false, false, false],
    [false, true, false, false, true, false],
    [true, false, false, false, false, false],
    [true, false, false, false, true, false],
    [true, true, true, true, false, false]
  ],
  category: 'spaceship'
};

// 特殊图案 - R-pentomino
export const R_PENTOMINO: Pattern = {
  id: 'r_pentomino',
  name: 'R-pentomino',
  description: '著名的混沌图案，经过1103代后稳定，产生6个滑翔机',
  cells: [
    [false, true, true],
    [true, true, false],
    [false, true, false]
  ],
  category: 'other'
};

// 特殊图案 - 十五格振荡器
export const PENTADECATHLON: Pattern = {
  id: 'pentadecathlon',
  name: '十五格振荡器 (Pentadecathlon)',
  description: '周期为15的振荡器',
  cells: [
    [false, false, true, false, false, false, false, true, false, false],
    [true, true, false, true, true, true, true, false, true, true],
    [false, false, true, false, false, false, false, true, false, false]
  ],
  category: 'oscillator'
};

// 特殊图案 - 面包
export const LOAF: Pattern = {
  id: 'loaf',
  name: '面包 (Loaf)',
  description: '常见的静止图案',
  cells: [
    [false, true, true, false],
    [true, false, false, true],
    [false, true, false, true],
    [false, false, true, false]
  ],
  category: 'still'
};

// 所有图案的集合
export const CLASSIC_PATTERNS: Pattern[] = [
  BLOCK,
  BEEHIVE,
  BOAT,
  BLINKER,
  TOAD,
  BEACON,
  PULSAR,
  GLIDER,
  LIGHTWEIGHT_SPACESHIP,
  MIDWEIGHT_SPACESHIP,
  R_PENTOMINO,
  PENTADECATHLON,
  LOAF
];

// 按类别分组的图案
export const PATTERNS_BY_CATEGORY = {
  still: CLASSIC_PATTERNS.filter(p => p.category === 'still'),
  oscillator: CLASSIC_PATTERNS.filter(p => p.category === 'oscillator'),
  spaceship: CLASSIC_PATTERNS.filter(p => p.category === 'spaceship'),
  other: CLASSIC_PATTERNS.filter(p => p.category === 'other')
};

// 获取随机图案
export const getRandomPattern = (): Pattern => {
  const randomIndex = Math.floor(Math.random() * CLASSIC_PATTERNS.length);
  return CLASSIC_PATTERNS[randomIndex]!;
};

// 根据类别获取图案
export const getPatternsByCategory = (category: Pattern['category']): Pattern[] => {
  return CLASSIC_PATTERNS.filter(p => p.category === category);
};

// 搜索图案
export const searchPatterns = (query: string): Pattern[] => {
  const lowerQuery = query.toLowerCase();
  return CLASSIC_PATTERNS.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  );
};
