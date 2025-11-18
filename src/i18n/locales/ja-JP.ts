export default {
  app: {
    title: 'AI強化ライフゲーム',
    subtitle: 'コンウェイのライフゲーム + AI アシスタント',
    help: 'ヘルプ',
    tabs: {
      ai: 'AIアシスタント',
      patterns: 'パターンギャラリー'
    }
  },
  help: {
    title: '使用方法',
    basicOps: '基本操作',
    basicOpsContent: {
      item1: 'グリッドをクリックしてセルを描画、もう一度クリックして消去',
      item2: 'マウスをドラッグして連続描画',
      item3: 'ゲーム実行中は編集不可'
    },
    aiFeatures: 'AI機能',
    aiFeaturesContent: {
      item1: 'テキストからパターン：説明からライフパターンを生成',
      item2: 'パターン分析：現在のパターンの特徴を分析',
      item3: 'スマート提案：現在の状態に対するAI提案を取得',
      item4: '学習アシスタント：ライフゲームに関する質問に回答'
    },
    configAI: 'AI設定',
    configAIContent: 'AI機能を使用するには、プロジェクトルートに.envファイルを作成してください：',
    gotIt: '了解'
  },
  controls: {
    title: 'ゲームコントロール',
    start: '開始',
    pause: '一時停止',
    step: 'ステップ',
    reset: 'リセット',
    stats: 'ゲーム統計',
    generation: '世代',
    aliveCells: '生存セル',
    density: '密度',
    period: '周期',
    speed: 'ゲーム速度',
    gridSettings: 'グリッド設定',
    rows: '行数',
    cols: '列数',
    wrapEdges: 'エッジを折り返す',
    quickActions: 'クイックアクション',
    sparseRandom: 'スパースランダム',
    mediumRandom: 'ミディアムランダム',
    denseRandom: 'デンスランダム',
    clear: 'クリア'
  },
  stability: {
    extinct: '絶滅',
    static: '静止',
    oscillator: '振動'
  },
  ai: {
    title: 'AIアシスタント',
    connected: 'AI接続済み',
    notConfigured: 'AI未設定',
    notConfiguredWarning: 'AI機能が設定されていません',
    configHint: 'プロジェクトに.envファイルを作成し、OpenAI APIキーを設定してください：',
    textToPattern: 'テキストからパターン',
    textToPatternPlaceholder: 'パターンを説明してください、例：「螺旋形状を作成」...',
    generate: '生成',
    generating: '生成中...',
    generatingMessage: 'AIが説明を分析してパターンを生成しています...',
    generatedPattern: '生成されたパターン',
    applyToGrid: 'グリッドに適用',
    clearResult: 'クリア',
    patternAnalysis: 'パターン分析',
    analyzePattern: '現在のパターンを分析',
    analyzing: '分析中...',
    clearAnalysis: '分析をクリア',
    smartSuggestion: 'スマート提案',
    getSuggestion: '提案を取得',
    thinking: '考え中...',
    clearSuggestion: '提案をクリア',
    statusSummary: 'ステータスサマリー',
    running: 'ゲーム実行中',
    summarizeState: 'AI現在の状態を要約',
    summarizing: '要約中...',
    clearSummary: '要約をクリア',
    learningAssistant: '学習アシスタント',
    askQuestion: 'ライフゲームについて質問...',
    ask: '質問',
    answering: '回答中...',
    clearAnswer: '回答をクリア',
    analysisResult: '分析結果：',
    aiSuggestion: 'AI提案：',
    stateSummary: 'ステータス概要：',
    aiAnswer: 'AI回答：',
    errors: {
      generateFailed: 'パターン生成に失敗しました。ネットワーク接続とAPI設定を確認してください',
      analyzeFailed: 'パターン分析に失敗しました。ネットワーク接続とAPI設定を確認してください',
      suggestionFailed: '提案の取得に失敗しました。ネットワーク接続とAPI設定を確認してください',
      answerFailed: 'AIアシスタントは一時的に回答できません。後でもう一度試してください',
      summarizeFailed: 'ゲーム状態の要約に失敗しました。後でもう一度試してください'
    }
  },
  patterns: {
    title: 'パターンギャラリー',
    search: 'パターンを検索...',
    allCategories: 'すべてのカテゴリ',
    still: '静止パターン',
    oscillator: '振動子',
    spaceship: '宇宙船',
    other: 'その他',
    randomPattern: 'ランダムパターン',
    loadRandom: 'ランダムパターンをロード',
    load: 'ロード',
    noResults: '一致するパターンが見つかりません',
    clearFilters: 'フィルターをクリア',
    category: 'カテゴリ',
    size: 'サイズ',
    author: '著者',
    unknown: '不明',
    close: '閉じる',
    items: {
      block: {
        name: 'ブロック',
        description: '2x2の単純な静止パターン'
      },
      beehive: {
        name: 'ビーハイブ',
        description: '蜂の巣に似た一般的な静止パターン'
      },
      boat: {
        name: 'ボート',
        description: '小さなボート型の静止パターン'
      },
      blinker: {
        name: 'ブリンカー',
        description: '周期2の最も単純な振動子'
      },
      toad: {
        name: 'トード',
        description: '周期2の振動子'
      },
      beacon: {
        name: 'ビーコン',
        description: '2つのブロックから成る周期2の振動子'
      },
      pulsar: {
        name: 'パルサー',
        description: '周期3の複雑な振動子'
      },
      glider: {
        name: 'グライダー',
        description: '最小の移動パターン、右下に斜めに移動'
      },
      lwss: {
        name: '軽量宇宙船 (LWSS)',
        description: '4世代ごとに右に移動する古典的な宇宙船'
      },
      mwss: {
        name: '中量宇宙船 (MWSS)',
        description: '中サイズの宇宙船'
      },
      r_pentomino: {
        name: 'R-ペントミノ',
        description: '複雑な挙動を生成する有名な小さなパターン'
      },
      pentadecathlon: {
        name: 'ペンタデカスロン',
        description: '周期15の振動子'
      },
      bowtie: {
        name: '蝶ネクタイ',
        description: '蝶ネクタイのように見える静止パターン'
      }
    }
  },
  footer: {
    builtWith: 'Vue 3 + TypeScript + OpenAI で構築',
    description: 'コンウェイのライフゲーム - セルオートマトンシミュレーション'
  }
}
