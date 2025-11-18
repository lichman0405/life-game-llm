<template>
  <div class="language-switcher" ref="switcherRef">
    <button @click.stop="toggleMenu" class="lang-btn" :title="$t('app.help')">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="currentColor" stroke-width="2"/>
      </svg>
      <span class="lang-text">{{ currentLangName }}</span>
      <svg class="arrow" :class="{ 'open': isOpen }" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 5L6 8L9 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </button>
    
    <transition name="dropdown">
      <div v-if="isOpen" class="lang-dropdown">
        <div 
          v-for="lang in languages" 
          :key="lang.code"
          @click="selectLanguage(lang.code)"
          class="lang-option"
          :class="{ 'active': currentLocale === lang.code }"
        >
          <span class="flag">{{ lang.flag }}</span>
          <span class="name">{{ lang.name }}</span>
          <svg v-if="currentLocale === lang.code" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 4L6 11L3 8" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const isOpen = ref(false);
const switcherRef = ref<HTMLElement | null>(null);

const languages = [
  { code: 'zh-CN', name: '中文简体', flag: '🇨🇳' },
  { code: 'en-US', name: 'English', flag: '🇺🇸' },
  { code: 'ja-JP', name: '日本語', flag: '🇯🇵' }
];

const currentLocale = computed(() => locale.value);

const currentLangName = computed(() => {
  const lang = languages.find(l => l.code === currentLocale.value);
  return lang ? lang.name : '中文简体';
});

const toggleMenu = () => {
  isOpen.value = !isOpen.value;
};

const selectLanguage = (code: string) => {
  locale.value = code;
  localStorage.setItem('language', code);
  isOpen.value = false;
};

const handleClickOutside = (e: MouseEvent) => {
  if (isOpen.value && switcherRef.value && !switcherRef.value.contains(e.target as Node)) {
    isOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<style scoped>
.language-switcher {
  position: relative;
}

.lang-btn {
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

.lang-btn svg {
  width: 20px;
  height: 20px;
}

.lang-text {
  font-size: 0.9rem;
  white-space: nowrap;
}

.arrow {
  width: 12px;
  height: 12px;
  transition: transform 0.3s ease;
}

.arrow.open {
  transform: rotate(180deg);
}

.lang-btn:hover {
  background: rgba(76, 175, 80, 0.2);
  border-color: #45a049;
  color: #45a049;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: #2a2a2a;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 0.5rem;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 6px;
  color: #ccc;
}

.lang-option:hover {
  background: rgba(76, 175, 80, 0.1);
  color: #4CAF50;
}

.lang-option.active {
  background: rgba(76, 175, 80, 0.2);
  color: #4CAF50;
  font-weight: 600;
}

.flag {
  font-size: 1.2rem;
}

.name {
  flex: 1;
  font-size: 0.9rem;
}

/* 下拉动画 */
.dropdown-enter-active, .dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .lang-text {
    display: none;
  }
  
  .lang-btn {
    padding: 0.6rem;
  }
  
  .lang-dropdown {
    right: auto;
    left: 0;
  }
}
</style>
