export default {
  app: {
    title: 'AI增强生命游戏',
    subtitle: '康威生命游戏 + 人工智能助手',
    help: '帮助',
    tabs: {
      ai: 'AI助手',
      patterns: '图案库'
    }
  },
  help: {
    title: '使用说明',
    basicOps: {
      title: '基本操作',
      click: '点击网格绘制细胞，再次点击可擦除',
      drag: '拖拽鼠标可以连续绘制',
      running: '游戏运行时不能编辑'
    },
    aiFeatures: {
      title: 'AI功能',
      textToPattern: '文本到图案：用描述生成生命图案',
      analyze: '图案分析：分析当前图案的特征',
      suggestions: '智能建议：获取AI对当前状态的建议',
      qa: '学习助手：回答生命游戏相关问题'
    },
    config: {
      title: '配置AI',
      description: '要使用AI功能，请在项目根目录创建',
      file: '文件'
    },
    close: '知道了'
  },
  controls: {
    title: '游戏控制',
    start: '开始',
    pause: '暂停',
    step: '一步',
    reset: '重置',
    stats: '游戏统计',
    generation: '代数',
    aliveCells: '存活细胞',
    density: '密度',
    period: '周期',
    speed: '游戏速度',
    gridSettings: '网格设置',
    rows: '行数',
    cols: '列数',
    wrapEdges: '环绕边界',
    quickActions: '快速操作',
    sparseRandom: '稀疏随机',
    mediumRandom: '中等随机',
    denseRandom: '密集随机',
    clear: '清空'
  },
  stability: {
    extinct: '已灭绝',
    static: '静止',
    oscillator: '振荡'
  },
  ai: {
    title: 'AI智能助手',
    connected: 'AI已连接',
    notConfigured: 'AI未配置',
    notConfiguredWarning: 'AI功能未配置',
    configHint: '请在项目中创建 .env 文件并配置OpenAI API密钥：',
    textToPattern: '文本生成图案',
    textToPatternPlaceholder: '描述你想要的图案，如"创建一个螺旋形状"...',
    generate: '生成',
    generating: '生成中...',
    generatingMessage: 'AI正在分析您的描述并生成图案...',
    generatedPattern: '生成的图案',
    applyToGrid: '应用到网格',
    clearResult: '清除',
    patternAnalysis: '图案分析',
    analyzePattern: '分析当前图案',
    analyzing: '分析中...',
    clearAnalysis: '清除分析',
    smartSuggestion: '智能建议',
    getSuggestion: '获取建议',
    thinking: '思考中...',
    clearSuggestion: '清除建议',
    statusSummary: '状态总结',
    running: '游戏运行中',
    summarizeState: 'AI总结当前状态',
    summarizing: '总结中...',
    clearSummary: '清除总结',
    learningAssistant: '学习助手',
    askQuestion: '问关于生命游戏的问题...',
    ask: '提问',
    answering: '回答中...',
    clearAnswer: '清除回答',
    analysisResult: '分析结果：',
    aiSuggestion: 'AI建议：',
    stateSummary: '状态总结：',
    aiAnswer: 'AI回答：',
    errors: {
      generateFailed: '生成图案失败，请检查网络连接和API配置',
      analyzeFailed: '图案分析失败，请检查网络连接和API配置',
      suggestionFailed: '获取建议失败，请检查网络连接和API配置',
      answerFailed: 'AI助手暂时无法回答问题，请稍后再试',
      summarizeFailed: '总结游戏状态失败，请稍后再试'
    }
  },
  patterns: {
    title: '图案库',
    search: '搜索图案...',
    allCategories: '所有类别',
    still: '静止图案',
    oscillator: '振荡器',
    spaceship: '移动物体',
    other: '其他',
    randomPattern: '随机图案',
    loadRandom: '加载随机图案',
    load: '加载',
    noResults: '没有找到匹配的图案',
    clearFilters: '清除筛选',
    category: '类别',
    size: '大小',
    author: '作者',
    unknown: '未知',
    close: '关闭',
    items: {
      block: {
        name: '方块 (Block)',
        description: '一个简单的2x2静止图案'
      },
      beehive: {
        name: '蜂巢 (Beehive)',
        description: '常见的静止图案，类似蜂巢'
      },
      boat: {
        name: '船只 (Boat)',
        description: '一个小船状静止图案'
      },
      blinker: {
        name: '闪烁器 (Blinker)',
        description: '最简单的振荡器，周期为2'
      },
      toad: {
        name: '蟾蜍 (Toad)',
        description: '周期为2的振荡器'
      },
      beacon: {
        name: '信号灯 (Beacon)',
        description: '周期为2的振荡器，由两个方块组成'
      },
      pulsar: {
        name: '脉冲星 (Pulsar)',
        description: '周期为3的复杂振荡器'
      },
      glider: {
        name: '滑翔机 (Glider)',
        description: '最小的移动图案，移动方向为右下'
      },
      lwss: {
        name: '轻型飞船 (LWSS)',
        description: '经典的移动飞船，每4代向右移动一格'
      },
      mwss: {
        name: '中型飞船 (MWSS)',
        description: '中型移动飞船'
      },
      r_pentomino: {
        name: 'R-pentomino',
        description: '著名的较小图案，产生复杂的行为'
      },
      pentadecathlon: {
        name: '培根三角 (Pentadecathlon)',
        description: '周期为15的振荡器'
      },
      bowtie: {
        name: '蝴蝶结 (Bowtie)',
        description: '静止图案，看起来像蝴蝶结'
      }
    }
  },
  footer: {
    builtWith: '基于 Vue 3 + TypeScript + OpenAI 构建',
    description: '康威生命游戏 - 生命游戏规则的计算机模拟'
  }
}
