import OpenAI from 'openai';
import type { AIResponse, LLMSettings } from '../types/game';

export class OpenAIService {
  private client: OpenAI | null = null;
  private settings: LLMSettings | null = null;

  constructor() {
    this.initialize();
  }

  private initialize(): void {
    try {
      // 打印所有环境变量用于调试
      console.log('🔍 环境变量调试信息:');
      console.log('VITE_OPENAI_API_KEY:', import.meta.env.VITE_OPENAI_API_KEY ? '已设置' : '未设置');
      console.log('OPENAI_API_KEY:', import.meta.env.OPENAI_API_KEY ? '已设置' : '未设置');
      console.log('VITE_OPENAI_BASE_URL:', import.meta.env.VITE_OPENAI_BASE_URL);
      console.log('OPENAI_BASE_URL:', import.meta.env.OPENAI_BASE_URL);
      console.log('VITE_OPENAI_MODEL:', import.meta.env.VITE_OPENAI_MODEL);
      console.log('OPENAI_MODEL:', import.meta.env.OPENAI_MODEL);

      // 尝试从多个可能的变量名读取配置
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.OPENAI_API_KEY;
      const baseURL = import.meta.env.VITE_OPENAI_BASE_URL || import.meta.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
      const model = import.meta.env.VITE_OPENAI_MODEL || import.meta.env.OPENAI_MODEL || 'gpt-3.5-turbo';

      console.log('🔧 配置解析结果:');
      console.log('API Key:', apiKey ? `${apiKey.substring(0, 10)}...` : '未设置');
      console.log('Base URL:', baseURL);
      console.log('Model:', model);

      // 检查必要的配置
      if (!apiKey) {
        console.warn('⚠️ API密钥未设置，AI功能将不可用');
        console.warn('请确保在.env文件中设置了 OPENAI_API_KEY 或 VITE_OPENAI_API_KEY');
        return;
      }

      this.settings = {
        provider: 'openai',
        apiKey,
        baseURL,
        model,
        maxTokens: parseInt(import.meta.env.VITE_OPENAI_MAX_TOKENS || import.meta.env.OPENAI_MAX_TOKENS || '2000'),
        temperature: parseFloat(import.meta.env.VITE_OPENAI_TEMPERATURE || import.meta.env.OPENAI_TEMPERATURE || '0.7')
      };

      this.client = new OpenAI({
        apiKey,
        baseURL,
        dangerouslyAllowBrowser: true, // 允许在浏览器中使用（生产环境应使用服务器代理）
      });

      console.log('✅ AI服务初始化成功:', {
        provider: 'openai-compatible',
        model: this.settings.model,
        baseURL: this.settings.baseURL,
        maxTokens: this.settings.maxTokens
      });
    } catch (error) {
      console.error('❌ AI服务初始化失败:', error);
    }
  }

  // 检查配置是否有效
  isConfigured(): boolean {
    return this.client !== null && this.settings !== null;
  }

  // 生成文本
  async generateText(prompt: string): Promise<string> {
    if (!this.client || !this.settings) {
      throw new Error('OpenAI服务未配置');
    }

    try {
      const response = await this.client.chat.completions.create({
        model: this.settings.model,
        messages: [
          {
            role: 'system',
            content: '你是一个专业的生命游戏专家，专注于分析图案和生成描述。请用中文回答。'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: this.settings.maxTokens,
        temperature: this.settings.temperature,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('生成文本失败:', error);
      throw new Error('AI文本生成失败');
    }
  }

  // 文本到图案生成
  async generatePattern(description: string): Promise<AIResponse> {
    if (!this.client || !this.settings) {
      throw new Error('OpenAI服务未配置');
    }

    const prompt = `
请根据以下描述生成一个生命游戏图案，返回格式必须是JSON：

描述：${description}

请返回以下JSON格式：
{
  "pattern": {
    "name": "图案名称",
    "description": "图案描述",
    "cells": [[细胞状态数组]],
    "category": "still|oscillator|spaceship|other"
  },
  "explanation": "详细的生成说明"
}

要求：
1. cells 是一个二维数组，使用 true 表示存活细胞，false 表示死亡细胞
2. 图案大小建议在 5x5 到 20x20 之间
3. 确保 cells 数组的每一行长度相同
4. category 必须是 "still"、"oscillator"、"spaceship" 或 "other" 之一
`;

    try {
      const response = await this.generateText(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // 验证并补全 pattern 数据
        if (parsed.pattern && parsed.pattern.cells && Array.isArray(parsed.pattern.cells)) {
          const generatedPattern = {
            id: `ai-generated-${Date.now()}`, // 自动生成唯一 ID
            name: parsed.pattern.name || '生成的图案',
            description: parsed.pattern.description || description,
            cells: parsed.pattern.cells,
            category: ['still', 'oscillator', 'spaceship', 'other'].includes(parsed.pattern.category) 
              ? parsed.pattern.category 
              : 'other',
            author: 'AI Generated'
          };
          
          return {
            content: response,
            pattern: generatedPattern,
            analysis: parsed.explanation || '图案已生成'
          };
        } else {
          return {
            content: response,
            analysis: '无法解析AI生成的图案结构，请重试'
          };
        }
      } else {
        return {
          content: response,
          analysis: '无法从AI响应中提取JSON数据，请重试'
        };
      }
    } catch (error) {
      console.error('生成图案失败:', error);
      return {
        content: 'AI图案生成失败，请检查配置和网络连接',
        analysis: '生成失败的原因可能是：网络问题、API密钥无效、或模型服务不可用'
      };
    }
  }

  // 分析图案
  async analyzePattern(cells: boolean[][]): Promise<AIResponse> {
    if (!this.client || !this.settings) {
      throw new Error('OpenAI服务未配置');
    }

    // 简化为字符矩阵以减少token使用
    const gridString = cells.map(row => 
      row.map(cell => cell ? '●' : '○').join('')
    ).join('\n');

    const prompt = `
分析以下生命游戏图案：
${gridString}

请分析这个图案：
1. 类型分类（静止、振荡器、移动物体等）
2. 行为特征
3. 可能的发展趋势
4. 教育价值或趣味性

请用中文详细回答。
`;

    try {
      const analysis = await this.generateText(prompt);
      return {
        content: analysis,
        analysis
      };
    } catch (error) {
      console.error('图案分析失败:', error);
      return {
        content: '图案分析失败',
        analysis: '无法分析当前图案，可能是因为AI服务配置问题'
      };
    }
  }

  // 智能建议
  async getSmartSuggestion(context: { generation: number; aliveCells: number; gridSize: number }): Promise<AIResponse> {
    if (!this.client || !this.settings) {
      throw new Error('OpenAI服务未配置');
    }

    const { generation, aliveCells, gridSize } = context;
    const density = aliveCells / (gridSize * gridSize);

    const prompt = `
当前生命游戏状态：
- 第${generation}代
- 存活细胞：${aliveCells}个
- 网格大小：${gridSize}x${gridSize}
- 密度：${(density * 100).toFixed(1)}%

请给出以下方面的建议：
1. 当前状态分析
2. 接下来可能发生什么
3. 改进建议（如果有的话）
4. 是否有已知的模式特征

请用中文回答。
`;

    try {
      const suggestion = await this.generateText(prompt);
      return {
        content: suggestion,
        suggestions: [suggestion]
      };
    } catch (error) {
      console.error('获取智能建议失败:', error);
      return {
        content: '无法获取智能建议',
        suggestions: ['AI服务暂时不可用，请稍后再试']
      };
    }
  }

  // 学习助手回答问题
  async answerQuestion(question: string): Promise<AIResponse> {
    if (!this.client || !this.settings) {
      throw new Error('OpenAI服务未配置');
    }

    const prompt = `
作为生命游戏专家，请回答以下问题：

问题：${question}

请提供：
1. 直接回答
2. 相关背景知识
3. 实际例子（如果适用）

请用中文详细回答。
`;

    try {
      const answer = await this.generateText(prompt);
      return {
        content: answer
      };
    } catch (error) {
      console.error('回答问题失败:', error);
      return {
        content: 'AI助手暂时无法回答问题，请稍后再试'
      };
    }
  }

  // 总结游戏状态
  async summarizeGameState(context: {
    generation: number;
    aliveCells: number;
    density: number;
    gridSize: number;
    isStable: boolean;
    stabilityType: string | null;
    oscillatorPeriod: number;
    grid: boolean[][];
  }): Promise<AIResponse> {
    if (!this.client || !this.settings) {
      throw new Error('OpenAI服务未配置');
    }

    const { generation, aliveCells, density, gridSize, isStable, stabilityType, oscillatorPeriod, grid } = context;
    
    let statusText = '';
    if (isStable) {
      if (stabilityType === 'extinct') {
        statusText = '所有细胞已灭绝';
      } else if (stabilityType === 'static') {
        statusText = '达到静止状态（所有细胞不再变化）';
      } else if (stabilityType === 'oscillator') {
        statusText = `检测到振荡器（周期为${oscillatorPeriod}代）`;
      }
    } else {
      statusText = '游戏仍在运行中';
    }

    // 简化网格为字符表示
    const gridString = grid.slice(0, 30).map((row: boolean[]) => 
      row.slice(0, 30).map((cell: boolean) => cell ? '●' : '○').join('')
    ).join('\n');

    const prompt = `
请总结以下生命游戏的当前状态：

### 基本信息
- 运行代数：${generation}
- 存活细胞数：${aliveCells}
- 密度：${density.toFixed(2)}%
- 网格大小：${gridSize}x${gridSize}
- 状态：${statusText}

### 当前网格（前30x30区域）
${gridString}

请提供详细的总结，包括：
1. **状态分析**：当前的整体状态和特征
2. **演化历程**：从开始到现在经历了什么
3. **图案识别**：是否识别出已知的生命游戏图案
4. **教育意义**：这个演化过程展示了什么原理

请用markdown格式，用中文详细回答。
`;

    try {
      const summary = await this.generateText(prompt);
      return {
        content: summary
      };
    } catch (error) {
      console.error('总结游戏状态失败:', error);
      return {
        content: 'AI总结失败，请稍后再试'
      };
    }
  }

  // 获取服务状态
  getStatus() {
    return {
      configured: this.isConfigured(),
      provider: this.settings?.provider || 'unknown',
      model: this.settings?.model || 'unknown',
      baseURL: this.settings?.baseURL || 'unknown'
    };
  }
}

// 创建全局实例
export const openaiService = new OpenAIService();
