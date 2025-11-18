<template>
  <div class="ai-assistant">
    <div class="ai-header">
      <h3>🤖 {{ $t('ai.title') }}</h3>
      <div class="ai-status" :class="{ 'connected': isConfigured }">
        <span class="status-indicator" :class="{ 'online': isConfigured }"></span>
        {{ statusMessage }}
      </div>
    </div>

    <!-- AI配置提示 -->
    <div v-if="!isConfigured" class="config-warning">
      <p>⚠️ {{ $t('ai.notConfiguredWarning') }}</p>
      <p class="config-hint">
        {{ $t('ai.configHint') }}
      </p>
      <pre class="config-example">OPENAI_API_KEY=your_api_key_here
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4-turbo-preview</pre>
    </div>

    <div v-if="isConfigured" class="ai-content">
      <!-- 文本到图案生成 -->
      <div class="ai-section">
        <h4>🎨 {{ $t('ai.textToPattern') }}</h4>
        <div class="input-group">
          <input 
            v-model="patternDescription" 
            @keyup.enter="generatePattern"
            :placeholder="$t('ai.textToPatternPlaceholder')"
            class="text-input"
            :disabled="isGenerating"
          />
          <button 
            @click="generatePattern" 
            :disabled="isGenerating || !patternDescription.trim()"
            class="btn btn-primary"
          >
            {{ isGenerating ? $t('ai.generating') : $t('ai.generate') }}
          </button>
        </div>
        
        <!-- 生成进度 -->
        <div v-if="isGenerating" class="generating">
          <div class="spinner"></div>
          <span>{{ $t('ai.generatingMessage') }}</span>
        </div>

        <!-- 生成结果 -->
        <div v-if="generatedPattern" class="result">
          <h5>{{ generatedPattern.pattern?.name || $t('ai.generatedPattern') }}</h5>
          <p class="pattern-description">{{ generatedPattern.pattern?.description }}</p>
          <div class="explanation" v-html="formatAIText(generatedPattern.analysis || '')"></div>
          <div class="action-buttons">
            <button 
              @click="applyGeneratedPattern"
              class="btn btn-success"
            >
              {{ $t('ai.applyToGrid') }}
            </button>
            <button 
              @click="clearGeneratedPattern"
              class="btn btn-secondary"
            >
              {{ $t('ai.clearResult') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 图案分析 -->
      <div class="ai-section">
        <h4>🔍 {{ $t('ai.patternAnalysis') }}</h4>
        <button 
          @click="analyzeCurrentPattern" 
          :disabled="isAnalyzing || gameStore.aliveCells === 0"
          class="btn btn-secondary"
        >
          {{ isAnalyzing ? $t('ai.analyzing') : $t('ai.analyzePattern') }}
        </button>
        
        <div v-if="patternAnalysis" class="analysis-result">
          <h5>{{ $t('ai.analysisResult') }}</h5>
          <div class="analysis-content" v-html="formatAIText(patternAnalysis)"></div>
          <button 
            @click="clearAnalysis"
            class="btn btn-secondary btn-small"
          >
            {{ $t('ai.clearAnalysis') }}
          </button>
        </div>
      </div>

      <!-- 智能建议 -->
      <div class="ai-section">
        <h4>💡 {{ $t('ai.smartSuggestion') }}</h4>
        <button 
          @click="getSmartSuggestion" 
          :disabled="isSuggesting"
          class="btn btn-secondary"
        >
          {{ isSuggesting ? $t('ai.thinking') : $t('ai.getSuggestion') }}
        </button>
        
        <div v-if="smartSuggestion" class="suggestion-result">
          <h5>{{ $t('ai.aiSuggestion') }}</h5>
          <div class="suggestion-content" v-html="formatAIText(smartSuggestion)"></div>
          <button 
            @click="clearSuggestion"
            class="btn btn-secondary btn-small"
          >
            {{ $t('ai.clearSuggestion') }}
          </button>
        </div>
      </div>

      <!-- 游戏状态总结 -->
      <div class="ai-section">
        <h4>📊 {{ $t('ai.statusSummary') }}</h4>
        <div class="status-info">
          <div v-if="gameStore.isStable" class="stability-badge" :class="gameStore.stabilityType">
            <span class="badge-icon">{{ getStabilityIcon(gameStore.stabilityType) }}</span>
            <span>{{ getStabilityText(gameStore.stabilityType) }}</span>
          </div>
          <div v-else class="stability-badge running">
            <span class="badge-icon">🔄</span>
            <span>{{ $t('ai.running') }}</span>
          </div>
        </div>
        
        <button 
          @click="summarizeGameState" 
          :disabled="isSummarizing"
          class="btn btn-secondary"
        >
          {{ isSummarizing ? $t('ai.summarizing') : $t('ai.summarizeState') }}
        </button>
        
        <div v-if="gameSummary" class="summary-result">
          <h5>{{ $t('ai.stateSummary') }}</h5>
          <div class="summary-content" v-html="formatAIText(gameSummary)"></div>
          <button 
            @click="clearSummary"
            class="btn btn-secondary btn-small"
          >
            {{ $t('ai.clearSummary') }}
          </button>
        </div>
      </div>

      <!-- 学习助手 -->
      <div class="ai-section">
        <h4>📚 {{ $t('ai.learningAssistant') }}</h4>
        <div class="input-group">
          <input 
            v-model="question" 
            @keyup.enter="answerQuestion"
            :placeholder="$t('ai.askQuestion')"
            class="text-input"
            :disabled="isAnswering"
          />
          <button 
            @click="answerQuestion" 
            :disabled="isAnswering || !question.trim()"
            class="btn btn-secondary"
          >
            {{ isAnswering ? $t('ai.answering') : $t('ai.ask') }}
          </button>
        </div>
        
        <div v-if="aiAnswer" class="answer-result">
          <h5>{{ $t('ai.aiAnswer') }}</h5>
          <div class="answer-content" v-html="formatAIText(aiAnswer)"></div>
          <button 
            @click="clearAnswer"
            class="btn btn-secondary btn-small"
          >
            {{ $t('ai.clearAnswer') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { openaiService } from '../services/openaiService';
import { useI18n } from 'vue-i18n';
import type { AIResponse } from '../types/game';

const gameStore = useGameStore();
const { t } = useI18n();

// 响应式数据
const patternDescription = ref('');
const generatedPattern = ref<AIResponse | null>(null);
const patternAnalysis = ref('');
const smartSuggestion = ref('');
const question = ref('');
const aiAnswer = ref('');
const gameSummary = ref('');

const isGenerating = ref(false);
const isAnalyzing = ref(false);
const isSuggesting = ref(false);
const isAnswering = ref(false);
const isSummarizing = ref(false);

// 计算属性
const isConfigured = computed(() => openaiService.isConfigured());
const statusMessage = computed(() =>
  isConfigured.value ? t('ai.connected') : t('ai.notConfigured')
);// 方法
const generatePattern = async () => {
  if (!patternDescription.value.trim() || isGenerating.value) return;
  
  isGenerating.value = true;
  try {
    console.log('开始生成图案，描述:', patternDescription.value);
    const result = await openaiService.generatePattern(patternDescription.value);
    console.log('AI 返回结果:', result);
    console.log('生成的 pattern:', result.pattern);
    generatedPattern.value = result;
  } catch (error) {
    console.error('Generate pattern failed:', error);
    alert(t('ai.errors.generateFailed'));
  } finally {
    isGenerating.value = false;
  }
};

const analyzeCurrentPattern = async () => {
  if (gameStore.aliveCells === 0 || isAnalyzing.value) return;
  
  isAnalyzing.value = true;
  try {
    const result = await openaiService.analyzePattern(gameStore.grid);
    patternAnalysis.value = result.analysis || result.content;
  } catch (error) {
    console.error('Analyze pattern failed:', error);
    alert(t('ai.errors.analyzeFailed'));
  } finally {
    isAnalyzing.value = false;
  }
};

const getSmartSuggestion = async () => {
  if (isSuggesting.value) return;
  
  isSuggesting.value = true;
  try {
    const result = await openaiService.getSmartSuggestion({
      generation: gameStore.generation,
      aliveCells: gameStore.aliveCells,
      gridSize: Math.max(gameStore.config.rows, gameStore.config.cols)
    });
    smartSuggestion.value = result.content;
  } catch (error) {
    console.error('Get suggestion failed:', error);
    alert(t('ai.errors.suggestionFailed'));
  } finally {
    isSuggesting.value = false;
  }
};

const answerQuestion = async () => {
  if (!question.value.trim() || isAnswering.value) return;
  
  isAnswering.value = true;
  try {
    const result = await openaiService.answerQuestion(question.value);
    aiAnswer.value = result.content;
    question.value = '';
  } catch (error) {
    console.error('Answer question failed:', error);
    alert(t('ai.errors.answerFailed'));
  } finally {
    isAnswering.value = false;
  }
};

// 应用生成的图案
const applyGeneratedPattern = () => {
  console.log('应用图案 - generatedPattern:', generatedPattern.value);
  console.log('应用图案 - pattern 数据:', generatedPattern.value?.pattern);
  
  if (generatedPattern.value?.pattern) {
    const pattern = generatedPattern.value.pattern;
    
    // 验证 pattern 数据
    if (!pattern.cells || !Array.isArray(pattern.cells) || pattern.cells.length === 0) {
      alert('图案数据无效：缺少 cells 数组');
      return;
    }
    
    console.log('图案 cells:', pattern.cells);
    console.log('图案大小:', pattern.cells.length, 'x', pattern.cells[0]?.length);
    
    if (gameStore.isRunning) {
      gameStore.pauseGame();
    }
    
    try {
      gameStore.loadPattern(pattern);
      alert('图案已成功应用到网格！');
      // 不立即清除，让用户看到结果
      // clearGeneratedPattern();
    } catch (error) {
      console.error('应用图案失败:', error);
      alert('应用图案失败: ' + (error as Error).message);
    }
  } else {
    alert('没有可用的图案数据');
  }
};

// 清除方法
const clearGeneratedPattern = () => {
  generatedPattern.value = null;
  patternDescription.value = '';
};

const clearAnalysis = () => {
  patternAnalysis.value = '';
};

const clearSuggestion = () => {
  smartSuggestion.value = '';
};

const clearAnswer = () => {
  aiAnswer.value = '';
};

const clearSummary = () => {
  gameSummary.value = '';
};

// 游戏状态总结
const summarizeGameState = async () => {
  if (isSummarizing.value) return;
  
  isSummarizing.value = true;
  try {
    const context = {
      generation: gameStore.generation,
      aliveCells: gameStore.aliveCells,
      density: gameStore.density,
      gridSize: gameStore.config.rows,
      isStable: gameStore.isStable,
      stabilityType: gameStore.stabilityType,
      oscillatorPeriod: gameStore.oscillatorPeriod,
      grid: gameStore.grid
    };
    
    const result = await openaiService.summarizeGameState(context);
    gameSummary.value = result.content;
  } catch (error) {
    console.error('Summarize state failed:', error);
    alert(t('ai.errors.summarizeFailed'));
  } finally {
    isSummarizing.value = false;
  }
};

// 获取稳定性图标
const getStabilityIcon = (type: string | null) => {
  const icons = {
    extinct: '💀',
    static: '🔒',
    oscillator: '🔄'
  };
  return icons[type as keyof typeof icons] || '❓';
};

// 获取稳定性文本
const getStabilityText = (type: string | null) => {
  const texts = {
    extinct: t('stability.extinct'),
    static: t('stability.static'),
    oscillator: `${t('stability.oscillator')} (${t('controls.period')}${gameStore.oscillatorPeriod})`
  };
  return texts[type as keyof typeof texts] || '';
};

// 格式化AI文本，将换行和markdown标记转换为HTML
const formatAIText = (text: string) => {
  if (!text) return '';
  
  let result = text
    // 转义HTML特殊字符
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  
  // 先处理代码块（避免内容被其他规则影响）
  const codeBlocks: string[] = [];
  result = result.replace(/```([\s\S]*?)```/g, (match, code) => {
    const placeholder = `___CODE_BLOCK_${codeBlocks.length}___`;
    codeBlocks.push(`<pre class="ai-code-block"><code>${code.trim()}</code></pre>`);
    return placeholder;
  });
  
  // 处理行内代码
  const inlineCodes: string[] = [];
  result = result.replace(/`([^`]+)`/g, (match, code) => {
    const placeholder = `___INLINE_CODE_${inlineCodes.length}___`;
    inlineCodes.push(`<code class="ai-inline-code">${code}</code>`);
    return placeholder;
  });
  
  // 分割成行处理
  const lines = result.split('\n');
  const processed: string[] = [];
  let inList = false;
  
  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]?.trim() || '';
    if (!line) {
      if (inList) {
        processed.push('</ul>');
        inList = false;
      }
      processed.push('<br>');
      continue;
    }
    
    // 处理标题 (### 或 #### 或 ##)
    if (/^#{1,4}\s+/.test(line)) {
      if (inList) {
        processed.push('</ul>');
        inList = false;
      }
      line = line.replace(/^#{1,4}\s+(.+)$/, '<h6 class="ai-heading">$1</h6>');
      processed.push(line);
    }
    // 处理无序列表
    else if (/^[-*]\s+/.test(line)) {
      if (!inList) {
        processed.push('<ul class="ai-list">');
        inList = true;
      }
      line = line.replace(/^[-*]\s+(.+)$/, '<li class="ai-list-item">$1</li>');
      processed.push(line);
    }
    // 处理有序列表
    else if (/^\d+\.\s+/.test(line)) {
      if (!inList) {
        processed.push('<ol class="ai-list">');
        inList = true;
      }
      line = line.replace(/^\d+\.\s+(.+)$/, '<li class="ai-list-item">$1</li>');
      processed.push(line);
    }
    // 普通文本
    else {
      if (inList) {
        processed.push('</ul>');
        inList = false;
      }
      // 处理粗体
      line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
      processed.push(`<p class="ai-paragraph">${line}</p>`);
    }
  }
  
  if (inList) {
    processed.push('</ul>');
  }
  
  result = processed.join('\n');
  
  // 恢复代码块和行内代码
  codeBlocks.forEach((code, i) => {
    result = result.replace(`___CODE_BLOCK_${i}___`, code);
  });
  inlineCodes.forEach((code, i) => {
    result = result.replace(`___INLINE_CODE_${i}___`, code);
  });
  
  return result;
};
</script>

<style scoped>
.ai-assistant {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.ai-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #444;
}

.ai-header h3 {
  margin: 0;
  color: #4CAF50;
  font-size: 1.2rem;
}

.ai-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: #ff6b6b;
}

.ai-status.connected {
  color: #4CAF50;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff6b6b;
}

.status-indicator.online {
  background-color: #4CAF50;
  box-shadow: 0 0 4px #4CAF50;
}

.config-warning {
  background-color: #ff6b6b;
  color: white;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.config-hint {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.config-example {
  background-color: rgba(0, 0, 0, 0.3);
  padding: 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  overflow-x: auto;
  margin: 0;
}

.ai-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;
}

.ai-content::-webkit-scrollbar {
  width: 6px;
}

.ai-content::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}

.ai-content::-webkit-scrollbar-thumb {
  background: #4CAF50;
  border-radius: 3px;
}

.ai-content::-webkit-scrollbar-thumb:hover {
  background: #45a049;
}

.ai-section {
  border-bottom: 1px solid #444;
  padding-bottom: 1rem;
}

.ai-section:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.ai-section h4 {
  margin: 0 0 1rem 0;
  color: #64B5F6;
  font-size: 1rem;
}

.input-group {
  display: flex;
  gap: 0.6rem;
  margin-bottom: 1rem;
}

.text-input {
  flex: 1;
  padding: 0.7rem 0.9rem;
  border: 1px solid #555;
  border-radius: 6px;
  background-color: #333;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.4;
  transition: border-color 0.2s ease;
}

.text-input:focus {
  outline: none;
  border-color: #4CAF50;
}

.text-input:disabled {
  opacity: 0.6;
}

.btn {
  padding: 0.7rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
  white-space: nowrap;
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

.btn-success {
  background-color: #2196F3;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #1976D2;
  transform: translateY(-1px);
}

.btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.btn:active:not(:disabled) {
  transform: translateY(0);
}

.generating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem;
  background-color: #333;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #ccc;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #444;
  border-top: 2px solid #4CAF50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.result, .analysis-result, .suggestion-result, .answer-result {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  padding: 1.2rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.result h5, .analysis-result h5, .suggestion-result h5, .answer-result h5 {
  margin: 0 0 1rem 0;
  color: #4CAF50;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.result h5::before, .analysis-result h5::before, 
.suggestion-result h5::before, .answer-result h5::before {
  content: '✨';
  font-size: 1.2rem;
}

.pattern-description {
  color: #ccc;
  font-style: italic;
  margin-bottom: 0.5rem;
}

.explanation, .analysis-content, .suggestion-content, .answer-content {
  color: #e0e0e0;
  line-height: 1.8;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

/* AI文本格式化样式 */
.explanation :deep(p),
.analysis-content :deep(p),
.suggestion-content :deep(p),
.answer-content :deep(p),
.summary-content :deep(p),
.explanation :deep(.ai-paragraph),
.analysis-content :deep(.ai-paragraph),
.suggestion-content :deep(.ai-paragraph),
.answer-content :deep(.ai-paragraph),
.summary-content :deep(.ai-paragraph) {
  margin: 0.5rem 0;
  line-height: 1.8;
  color: #e0e0e0;
}

.explanation :deep(ul),
.analysis-content :deep(ul),
.suggestion-content :deep(ul),
.answer-content :deep(ul),
.summary-content :deep(ul),
.explanation :deep(ol),
.analysis-content :deep(ol),
.suggestion-content :deep(ol),
.answer-content :deep(ol),
.summary-content :deep(ol),
.explanation :deep(.ai-list),
.analysis-content :deep(.ai-list),
.suggestion-content :deep(.ai-list),
.answer-content :deep(.ai-list),
.summary-content :deep(.ai-list) {
  margin: 0.8rem 0;
  padding-left: 0;
}

.explanation :deep(h6),
.analysis-content :deep(h6),
.suggestion-content :deep(h6),
.answer-content :deep(h6),
.summary-content :deep(h6),
.explanation :deep(.ai-heading),
.analysis-content :deep(.ai-heading),
.suggestion-content :deep(.ai-heading),
.answer-content :deep(.ai-heading),
.summary-content :deep(.ai-heading) {
  color: #64B5F6;
  font-size: 1.05rem;
  font-weight: 600;
  margin: 1.2rem 0 0.6rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #444;
  display: block;
}

.explanation :deep(h6:first-child),
.analysis-content :deep(h6:first-child),
.suggestion-content :deep(h6:first-child),
.answer-content :deep(h6:first-child),
.summary-content :deep(h6:first-child),
.explanation :deep(.ai-heading:first-child),
.analysis-content :deep(.ai-heading:first-child),
.suggestion-content :deep(.ai-heading:first-child),
.answer-content :deep(.ai-heading:first-child),
.summary-content :deep(.ai-heading:first-child) {
  margin-top: 0;
}

.explanation :deep(li),
.analysis-content :deep(li),
.suggestion-content :deep(li),
.answer-content :deep(li),
.summary-content :deep(li),
.explanation :deep(.ai-list-item),
.analysis-content :deep(.ai-list-item),
.suggestion-content :deep(.ai-list-item),
.answer-content :deep(.ai-list-item),
.summary-content :deep(.ai-list-item) {
  margin: 0.5rem 0 0.5rem 1.5rem;
  padding-left: 0.5rem;
  color: #ccc;
  list-style: none;
  position: relative;
  line-height: 1.6;
}

.explanation :deep(li)::before,
.analysis-content :deep(li)::before,
.suggestion-content :deep(li)::before,
.answer-content :deep(li)::before,
.summary-content :deep(li)::before,
.explanation :deep(.ai-list-item)::before,
.analysis-content :deep(.ai-list-item)::before,
.suggestion-content :deep(.ai-list-item)::before,
.answer-content :deep(.ai-list-item)::before,
.summary-content :deep(.ai-list-item)::before {
  content: '•';
  position: absolute;
  left: -1rem;
  color: #4CAF50;
  font-weight: bold;
}

.explanation :deep(strong),
.analysis-content :deep(strong),
.suggestion-content :deep(strong),
.answer-content :deep(strong),
.summary-content :deep(strong) {
  color: #4CAF50;
  font-weight: 600;
}

.explanation :deep(pre),
.analysis-content :deep(pre),
.suggestion-content :deep(pre),
.answer-content :deep(pre),
.summary-content :deep(pre),
.explanation :deep(.ai-code-block),
.analysis-content :deep(.ai-code-block),
.suggestion-content :deep(.ai-code-block),
.answer-content :deep(.ai-code-block),
.summary-content :deep(.ai-code-block) {
  background-color: #1a1a1a;
  border-left: 3px solid #4CAF50;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  overflow-x: auto;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  line-height: 1.6;
}

.explanation :deep(code),
.analysis-content :deep(code),
.suggestion-content :deep(code),
.answer-content :deep(code),
.summary-content :deep(code),
.explanation :deep(.ai-inline-code),
.analysis-content :deep(.ai-inline-code),
.suggestion-content :deep(.ai-inline-code),
.answer-content :deep(.ai-inline-code),
.summary-content :deep(.ai-inline-code) {
  background-color: #1a1a1a;
  color: #4CAF50;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
  font-family: 'Courier New', monospace;
  font-size: 0.9em;
}

.explanation :deep(br),
.analysis-content :deep(br),
.suggestion-content :deep(br),
.answer-content :deep(br),
.summary-content :deep(br) {
  display: block;
  margin: 0.2rem 0;
  content: '';
  line-height: 0.4rem;
}

/* 滚动条样式 */
.explanation::-webkit-scrollbar,
.analysis-content::-webkit-scrollbar,
.suggestion-content::-webkit-scrollbar,
.answer-content::-webkit-scrollbar {
  width: 6px;
}

.explanation::-webkit-scrollbar-track,
.analysis-content::-webkit-scrollbar-track,
.suggestion-content::-webkit-scrollbar-track,
.answer-content::-webkit-scrollbar-track {
  background: #1a1a1a;
  border-radius: 3px;
}

.explanation::-webkit-scrollbar-thumb,
.analysis-content::-webkit-scrollbar-thumb,
.suggestion-content::-webkit-scrollbar-thumb,
.answer-content::-webkit-scrollbar-thumb {
  background: #4CAF50;
  border-radius: 3px;
}

.explanation::-webkit-scrollbar-thumb:hover,
.analysis-content::-webkit-scrollbar-thumb:hover,
.suggestion-content::-webkit-scrollbar-thumb:hover,
.answer-content::-webkit-scrollbar-thumb:hover {
  background: #45a049;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.status-info {
  margin-bottom: 1rem;
}

.stability-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
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

.stability-badge.running {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  border: 2px solid #4CAF50;
}

.badge-icon {
  font-size: 1.2rem;
}

.summary-result {
  background: linear-gradient(135deg, #2a2a2a 0%, #1f1f1f 100%);
  padding: 1.2rem;
  border-radius: 8px;
  margin-top: 1rem;
  border: 1px solid #444;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.summary-result h5 {
  margin: 0 0 1rem 0;
  color: #4CAF50;
  font-size: 1.1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.summary-result h5::before {
  content: '✨';
  font-size: 1.2rem;
}

.summary-content {
  color: #e0e0e0;
  line-height: 1.8;
  margin-bottom: 1rem;
  max-height: 400px;
  overflow-y: auto;
  padding: 0.5rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .ai-assistant {
    padding: 1rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
  
  .action-buttons {
    flex-direction: column;
  }
}

/* 暗色主题优化 */
@media (prefers-color-scheme: dark) {
  .ai-assistant {
    background-color: #1a1a1a;
  }
  
  .config-warning {
    background-color: #d32f2f;
  }
  
  .text-input {
    background-color: #2a2a2a;
    border-color: #444;
  }
  
  .text-input:focus {
    border-color: #4CAF50;
  }
  
  .generating {
    background-color: #2a2a2a;
  }
  
  .result, .analysis-result, .suggestion-result, .answer-result {
    background-color: #2a2a2a;
  }
}
</style>
