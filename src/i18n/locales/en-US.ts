export default {
  app: {
    title: 'AI-Enhanced Game of Life',
    subtitle: "Conway's Game of Life + AI Assistant",
    help: 'Help',
    tabs: {
      ai: 'AI Assistant',
      patterns: 'Pattern Gallery'
    }
  },
  help: {
    title: 'User Guide',
    basicOps: 'Basic Operations',
    basicOpsContent: {
      item1: 'Click grid to draw cells, click again to erase',
      item2: 'Drag mouse to draw continuously',
      item3: 'Cannot edit while game is running'
    },
    aiFeatures: 'AI Features',
    aiFeaturesContent: {
      item1: 'Text to Pattern: Generate life patterns from descriptions',
      item2: 'Pattern Analysis: Analyze current pattern features',
      item3: 'Smart Suggestion: Get AI suggestions for current state',
      item4: 'Learning Assistant: Ask questions about Game of Life'
    },
    configAI: 'Configure AI',
    configAIContent: 'To use AI features, create a .env file in project root:',
    gotIt: 'Got it'
  },
  controls: {
    title: 'Game Controls',
    start: 'Start',
    pause: 'Pause',
    step: 'Step',
    reset: 'Reset',
    stats: 'Game Statistics',
    generation: 'Generation',
    aliveCells: 'Alive Cells',
    density: 'Density',
    period: 'Period',
    speed: 'Game Speed',
    gridSettings: 'Grid Settings',
    rows: 'Rows',
    cols: 'Columns',
    wrapEdges: 'Wrap Edges',
    quickActions: 'Quick Actions',
    sparseRandom: 'Sparse Random',
    mediumRandom: 'Medium Random',
    denseRandom: 'Dense Random',
    clear: 'Clear'
  },
  stability: {
    extinct: 'Extinct',
    static: 'Static',
    oscillator: 'Oscillator'
  },
  ai: {
    title: 'AI Assistant',
    connected: 'AI Connected',
    notConfigured: 'AI Not Configured',
    notConfiguredWarning: 'AI features not configured',
    configHint: 'Please create .env file in your project and configure OpenAI API key:',
    textToPattern: 'Text to Pattern',
    textToPatternPlaceholder: 'Describe your pattern, e.g. "create a spiral shape"...',
    generate: 'Generate',
    generating: 'Generating...',
    generatingMessage: 'AI is analyzing your description and generating pattern...',
    generatedPattern: 'Generated Pattern',
    applyToGrid: 'Apply to Grid',
    clearResult: 'Clear',
    patternAnalysis: 'Pattern Analysis',
    analyzePattern: 'Analyze Current Pattern',
    analyzing: 'Analyzing...',
    clearAnalysis: 'Clear Analysis',
    smartSuggestion: 'Smart Suggestion',
    getSuggestion: 'Get Suggestion',
    thinking: 'Thinking...',
    clearSuggestion: 'Clear Suggestion',
    statusSummary: 'Status Summary',
    running: 'Game Running',
    summarizeState: 'AI Summarize Current State',
    summarizing: 'Summarizing...',
    clearSummary: 'Clear Summary',
    learningAssistant: 'Learning Assistant',
    askQuestion: 'Ask about Game of Life...',
    ask: 'Ask',
    answering: 'Answering...',
    clearAnswer: 'Clear Answer',
    analysisResult: 'Analysis Result:',
    aiSuggestion: 'AI Suggestion:',
    stateSummary: 'State Summary:',
    aiAnswer: 'AI Answer:',
    errors: {
      generateFailed: 'Pattern generation failed, please check network connection and API configuration',
      analyzeFailed: 'Pattern analysis failed, please check network connection and API configuration',
      suggestionFailed: 'Failed to get suggestion, please check network connection and API configuration',
      answerFailed: 'AI assistant is temporarily unable to answer, please try again later',
      summarizeFailed: 'Game state summarization failed, please try again later'
    }
  },
  patterns: {
    title: 'Pattern Gallery',
    search: 'Search patterns...',
    allCategories: 'All Categories',
    still: 'Still Life',
    oscillator: 'Oscillators',
    spaceship: 'Spaceships',
    other: 'Other',
    randomPattern: 'Random Pattern',
    loadRandom: 'Load Random Pattern',
    load: 'Load',
    noResults: 'No matching patterns found',
    clearFilters: 'Clear Filters',
    category: 'Category',
    size: 'Size',
    author: 'Author',
    unknown: 'Unknown',
    close: 'Close',
    items: {
      block: {
        name: 'Block',
        description: 'A simple 2x2 still life pattern'
      },
      beehive: {
        name: 'Beehive',
        description: 'Common still life pattern, resembling a beehive'
      },
      boat: {
        name: 'Boat',
        description: 'A small boat-shaped still life pattern'
      },
      blinker: {
        name: 'Blinker',
        description: 'The simplest oscillator, with period 2'
      },
      toad: {
        name: 'Toad',
        description: 'An oscillator with period 2'
      },
      beacon: {
        name: 'Beacon',
        description: 'A period-2 oscillator consisting of two blocks'
      },
      pulsar: {
        name: 'Pulsar',
        description: 'A complex oscillator with period 3'
      },
      glider: {
        name: 'Glider',
        description: 'The smallest moving pattern, moving diagonally down-right'
      },
      lwss: {
        name: 'Lightweight Spaceship (LWSS)',
        description: 'A classic spaceship that moves right every 4 generations'
      },
      mwss: {
        name: 'Midweight Spaceship (MWSS)',
        description: 'A medium-sized spaceship'
      },
      r_pentomino: {
        name: 'R-pentomino',
        description: 'A famous small pattern that produces complex behavior'
      },
      pentadecathlon: {
        name: 'Pentadecathlon',
        description: 'An oscillator with period 15'
      },
      bowtie: {
        name: 'Bowtie',
        description: 'A still life pattern that looks like a bowtie'
      }
    }
  },
  footer: {
    builtWith: 'Built with Vue 3 + TypeScript + OpenAI',
    description: "Conway's Game of Life - Cellular Automaton Simulation"
  }
}
