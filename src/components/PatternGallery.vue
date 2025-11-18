<template>
  <div class="pattern-gallery">
    <div class="gallery-header">
      <h3>🎨 {{ $t('patterns.title') }}</h3>
      <div class="search-controls">
        <input 
          v-model="searchQuery" 
          @input="filterPatterns"
          :placeholder="$t('patterns.search')"
          class="search-input"
        />
        <select v-model="selectedCategory" @change="filterPatterns" class="category-select">
          <option value="">{{ $t('patterns.allCategories') }}</option>
          <option value="still">{{ $t('patterns.still') }}</option>
          <option value="oscillator">{{ $t('patterns.oscillator') }}</option>
          <option value="spaceship">{{ $t('patterns.spaceship') }}</option>
          <option value="other">{{ $t('patterns.other') }}</option>
        </select>
      </div>
    </div>

    <div class="gallery-content">
      <!-- 随机图案 -->
      <div class="section">
        <h4>🎲 {{ $t('patterns.randomPattern') }}</h4>
        <button 
          @click="loadRandomPattern" 
          :disabled="gameStore.isRunning"
          class="btn btn-secondary"
        >
          {{ $t('patterns.loadRandom') }}
        </button>
      </div>

      <!-- 图案列表 -->
      <div class="patterns-grid">
        <div 
          v-for="pattern in filteredPatterns" 
          :key="pattern.name"
          class="pattern-card"
          @click="selectPattern(pattern)"
        >
          <div class="pattern-preview">
            <div 
              class="preview-grid"
              :style="{
                gridTemplateColumns: `repeat(${Math.min(pattern.cells[0]?.length || 1, 8)}, 1fr)`,
                gridTemplateRows: `repeat(${Math.min(pattern.cells.length, 8)}, 1fr)`
              }"
            >
              <div
                v-for="(row, rowIndex) in getPreviewCells(pattern)"
                :key="`preview-cell-${rowIndex}`"
                class="preview-cell"
                :class="{ 'alive': row }"
              />
            </div>
          </div>
          
          <div class="pattern-info">
            <h5 class="pattern-name">{{ getPatternName(pattern) }}</h5>
            <p class="pattern-description">{{ getPatternDescription(pattern) }}</p>
            <div class="pattern-meta">
              <span class="pattern-category">{{ getCategoryName(pattern.category) }}</span>
              <span class="pattern-size">{{ pattern.cells.length }}x{{ pattern.cells[0]?.length || 0 }}</span>
            </div>
          </div>

          <div class="pattern-actions">
            <button 
              @click.stop="loadPattern(pattern)"
              :disabled="gameStore.isRunning"
              class="btn btn-primary btn-sm"
            >
              {{ $t('patterns.load') }}
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="filteredPatterns.length === 0" class="empty-state">
        <p>{{ $t('patterns.noResults') }}</p>
        <button @click="clearFilters" class="btn btn-secondary btn-sm">
          {{ $t('patterns.clearFilters') }}
        </button>
      </div>
    </div>

    <!-- 图案详情模态框 -->
    <div v-if="selectedPattern" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>{{ getPatternName(selectedPattern) }}</h4>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>
        
        <div class="modal-body">
          <div class="pattern-detail">
            <div class="detail-preview">
              <div 
                class="detail-grid"
                :style="{
                  gridTemplateColumns: `repeat(${selectedPattern.cells[0]?.length || 1}, 1fr)`,
                  gridTemplateRows: `repeat(${selectedPattern.cells.length}, 1fr)`
                }"
              >
                <template v-for="(row, rowIndex) in selectedPattern.cells">
                  <div
                    v-for="(cell, colIndex) in row"
                    :key="`detail-cell-${rowIndex}-${colIndex}`"
                    class="detail-cell"
                    :class="{ 'alive': cell }"
                  />
                </template>
              </div>
            </div>
            
            <div class="detail-info">
              <p class="detail-description">{{ getPatternDescription(selectedPattern) }}</p>
              <div class="detail-meta">
                <span class="meta-item">
                  <strong>{{ $t('patterns.category') }}:</strong> {{ getCategoryName(selectedPattern.category) }}
                </span>
                <span class="meta-item">
                  <strong>{{ $t('patterns.size') }}:</strong> {{ selectedPattern.cells.length }}x{{ selectedPattern.cells[0]?.length || 0 }}
                </span>
                <span class="meta-item">
                  <strong>{{ $t('patterns.author') }}:</strong> {{ selectedPattern.author || $t('patterns.unknown') }}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="modal-footer">
          <button 
            @click="loadPattern(selectedPattern)"
            :disabled="gameStore.isRunning"
            class="btn btn-primary"
          >
            {{ $t('patterns.load') }}
          </button>
          <button @click="closeModal" class="btn btn-secondary">
            {{ $t('patterns.close') }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useGameStore } from '../stores/gameStore';
import { CLASSIC_PATTERNS, getRandomPattern } from '../patterns/classicPatterns';
import type { Pattern } from '../types/game';
import { useI18n } from 'vue-i18n';

const gameStore = useGameStore();
const { t } = useI18n();

// 响应式数据
const searchQuery = ref('');
const selectedCategory = ref('');
const selectedPattern = ref<Pattern | null>(null);
const filteredPatterns = ref<Pattern[]>(CLASSIC_PATTERNS);

// 计算属性
const allPatterns = computed(() => CLASSIC_PATTERNS);

// 方法
const getPatternName = (pattern: Pattern) => {
  return t(`patterns.items.${pattern.id}.name`);
};

const getPatternDescription = (pattern: Pattern) => {
  return t(`patterns.items.${pattern.id}.description`);
};

const getCategoryName = (category: Pattern['category']) => {
  const names = {
    still: t('patterns.still'),
    oscillator: t('patterns.oscillator'),
    spaceship: t('patterns.spaceship'),
    other: t('patterns.other')
  };
  return names[category] || category;
};

const getPreviewCells = (pattern: Pattern) => {
  // 获取用于预览的单元格（最多8x8）
  const maxSize = 8;
  const cells = pattern.cells.slice(0, maxSize);
  return cells.map(row => row.slice(0, maxSize)).flat();
};

const filterPatterns = () => {
  let patterns = allPatterns.value;
  
  // 按类别筛选
  if (selectedCategory.value) {
    patterns = patterns.filter(p => p.category === selectedCategory.value);
  }
  
  // 按搜索关键词筛选（支持翻译后的文本）
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase();
    patterns = patterns.filter(p => {
      const name = getPatternName(p).toLowerCase();
      const description = getPatternDescription(p).toLowerCase();
      return name.includes(query) || description.includes(query);
    });
  }
  
  filteredPatterns.value = patterns;
};

const selectPattern = (pattern: Pattern) => {
  selectedPattern.value = pattern;
};

const closeModal = () => {
  selectedPattern.value = null;
};

const loadPattern = (pattern: Pattern) => {
  gameStore.loadPattern(pattern);
  closeModal();
};

const loadRandomPattern = () => {
  const randomPattern = getRandomPattern();
  loadPattern(randomPattern);
};

const clearFilters = () => {
  searchQuery.value = '';
  selectedCategory.value = '';
  filterPatterns();
};

// 初始化
onMounted(() => {
  filterPatterns();
});
</script>

<style scoped>
.pattern-gallery {
  background-color: #2a2a2a;
  border-radius: 12px;
  padding: 1.5rem;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  max-height: 80vh;
  overflow-y: auto;
}

.gallery-header {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #444;
}

.gallery-header h3 {
  margin: 0;
  color: #4CAF50;
  font-size: 1.2rem;
}

.search-controls {
  display: flex;
  gap: 0.5rem;
}

.search-input, .category-select {
  padding: 0.6rem;
  border: 1px solid #555;
  border-radius: 6px;
  background-color: #333;
  color: #fff;
  font-size: 0.9rem;
}

.search-input:focus, .category-select:focus {
  outline: none;
  border-color: #4CAF50;
}

.search-input {
  flex: 1;
}

.category-select {
  min-width: 120px;
}

.gallery-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section h4 {
  margin: 0 0 1rem 0;
  color: #64B5F6;
  font-size: 1rem;
}

.patterns-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.pattern-card {
  background-color: #333;
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}

.pattern-card:hover {
  background-color: #3a3a3a;
  border-color: #4CAF50;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(76, 175, 80, 0.2);
}

.pattern-preview {
  margin-bottom: 1rem;
}

.preview-grid {
  display: grid;
  gap: 1px;
  background-color: #666;
  border-radius: 4px;
  padding: 4px;
  width: 80px;
  height: 80px;
}

.preview-cell {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  border-radius: 1px;
}

.preview-cell.alive {
  background-color: #4CAF50;
}

.pattern-info {
  margin-bottom: 1rem;
}

.pattern-name {
  margin: 0 0 0.5rem 0;
  color: #4CAF50;
  font-size: 1rem;
  font-weight: 600;
}

.pattern-description {
  margin: 0 0 0.8rem 0;
  color: #ccc;
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.pattern-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.pattern-category {
  background-color: #555;
  color: #fff;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.7rem;
}

.pattern-size {
  color: #999;
}

.pattern-actions {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-secondary {
  background-color: #666;
  color: white;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  font-size: 0.8rem;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #999;
}

.empty-state p {
  margin: 0 0 1rem 0;
}

/* 模态框样式 */
.modal-overlay {
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
}

.modal-content {
  background-color: #2a2a2a;
  border-radius: 12px;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #444;
}

.modal-header h4 {
  margin: 0;
  color: #4CAF50;
  font-size: 1.2rem;
}

.close-btn {
  background: none;
  border: none;
  color: #ccc;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-btn:hover {
  background-color: #444;
  color: #fff;
}

.modal-body {
  padding: 1.5rem;
}

.pattern-detail {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.detail-preview {
  flex-shrink: 0;
}

.detail-grid {
  display: grid;
  gap: 1px;
  background-color: #666;
  border-radius: 8px;
  padding: 8px;
  width: 200px;
  height: 200px;
}

.detail-cell {
  width: 100%;
  height: 100%;
  background-color: #1a1a1a;
  border-radius: 2px;
}

.detail-cell.alive {
  background-color: #4CAF50;
}

.detail-info {
  flex: 1;
}

.detail-description {
  color: #e0e0e0;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.detail-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.meta-item {
  color: #ccc;
  font-size: 0.9rem;
}

.meta-item strong {
  color: #4CAF50;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1.5rem;
  border-top: 1px solid #444;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .pattern-gallery {
    padding: 1rem;
  }
  
  .patterns-grid {
    grid-template-columns: 1fr;
  }
  
  .search-controls {
    flex-direction: column;
  }
  
  .pattern-detail {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .detail-grid {
    width: 150px;
    height: 150px;
  }
  
  .modal-content {
    width: 95%;
    margin: 0.5rem;
  }
  
  .modal-footer {
    flex-direction: column;
  }
}

/* 暗色主题优化 */
@media (prefers-color-scheme: dark) {
  .pattern-gallery {
    background-color: #1a1a1a;
  }
  
  .pattern-card {
    background-color: #2a2a2a;
  }
  
  .pattern-card:hover {
    background-color: #333;
  }
  
  .modal-content {
    background-color: #1a1a1a;
  }
  
  .search-input, .category-select {
    background-color: #2a2a2a;
    border-color: #444;
  }
  
  .search-input:focus, .category-select:focus {
    border-color: #4CAF50;
  }
}
</style>
