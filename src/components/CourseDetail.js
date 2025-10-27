import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

// Small reusable code block with copy button
function CodeBlock({ code, language = 'text' }) {
  const [copied, setCopied] = useState(false);
  const onCopy = async () => {
    try {
      await navigator.clipboard?.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };
  return (
    <div style={{ position: 'relative' }}>
      <pre style={{ margin: 0, background: 'rgba(8,17,27,0.8)', padding: 12, borderRadius: 10, overflowX: 'auto', border: '1px solid rgba(255,255,255,0.08)' }}>
        <code>{code}</code>
      </pre>
      <button
        onClick={onCopy}
        aria-label="Copy code"
        style={{ position: 'absolute', top: 8, right: 8, fontSize: 12, padding: '6px 8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.18)', background: 'rgba(255,255,255,0.06)', cursor: 'pointer' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </button>
    </div>
  );
}

const CourseDetail = () => {
  const { courseId } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState('easy');

  // quiz UI state
  const [quizState, setQuizState] = useState({
    answers: {}, // { qId: optionIndex }
    theory: '',
    submitted: false,
    score: 0,
  });
  const [quizOpen, setQuizOpen] = useState(false);

  // question-by-question flow & hint
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [usedHint, setUsedHint] = useState(false);
  const [eliminated, setEliminated] = useState({}); // { qId: [idx1, idx2] }

  // leaderboard & attempts
  const [playerName, setPlayerName] = useState('');
  const [leaderboard, setLeaderboard] = useState([]); // local leaderboard for course
  const [showShareMsg, setShowShareMsg] = useState('');

  // --- Course & data (kept compact) ---
  const contentDB = {
    'web-basics': {
      summary: 'Foundational HTML, CSS, and JavaScript with hands-on mini projects.',
      usage: ['Websites and portals', 'Internal dashboards', 'Landing pages'],
      howTo: ['Structure with semantic HTML', 'Style with responsive CSS Grid/Flex', 'Enhance UX with JS events and fetch'],
      basics: [
        'HTML: structure pages with semantic tags like <header>, <main>, <footer>.',
        'CSS: layout with Flexbox/Grid; mobile-first responsive design.',
        'JS: variables, functions, DOM events and fetch API.'
      ],
      examples: [
        { title: 'HTML Card', explain: 'A simple content card groups a heading and paragraph. Use semantic tags and consistent spacing to make the layout clear and accessible.' },
        { title: 'Flex Row', explain: 'Flexbox arranges children horizontally or vertically with gaps. Use it to create responsive rows of equal-width columns.' },
        { title: 'Fetch JSON', explain: 'Use the Fetch API to request JSON from an endpoint, then update the UI with the received data to keep content dynamic.' }
      ],
      tutorials: [
        { id: 'html-intro', title: 'HTML Basics', desc: 'Headings, paragraphs, lists, links, images', length: '15 min' },
        { id: 'css-layout', title: 'CSS Layout', desc: 'Flexbox, Grid, responsive design', length: '20 min' },
        { id: 'js-fundamentals', title: 'JavaScript 101', desc: 'Variables, functions, DOM, events', length: '25 min' },
      ],  
      problems: [
        { id: 'pb-landing', title: 'Build a Landing Page', difficulty: 'Easy' },
        { id: 'pb-grid', title: 'Create a Grid Gallery', difficulty: 'Easy' },
        { id: 'pb-todo', title: 'Interactive Todo List', difficulty: 'Intermediate' },
      ],
      resources: [
        { title: 'HTML MDN', href: 'https://developer.mozilla.org/en-US/docs/Web/HTML' },
        { title: 'CSS MDN', href: 'https://developer.mozilla.org/en-US/docs/Web/CSS' },
        { title: 'JavaScript MDN', href: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
      ]
    },
    'react-fundamentals': {
      summary: 'Component-driven UI with state, props, hooks, and routing.',
      usage: ['Single Page Applications', 'Interactive dashboards', 'Admin tools'],
      howTo: ['Break UI into components', 'Manage state with hooks', 'Route with React Router'],
      basics: [
        'Components: functions returning JSX; props for inputs.',
        'State: useState for local state; useEffect for side effects.',
        'Lists & Keys: map arrays and add stable keys.'
      ],
      examples: [
        { title: 'Counter', explain: 'State lets components remember values between renders. A counter demonstrates how clicking updates state and re-renders the UI.' },
        { title: 'Effect', explain: 'Effects run after render for tasks like syncing the document title, fetching data, or subscribing to events.' }
      ],
      tutorials: [
        { id: 'comp-props', title: 'Components & Props', desc: 'Think in components, pass data via props', length: '18 min' },
        { id: 'hooks-basics', title: 'Hooks Basics', desc: 'useState, useEffect with examples', length: '22 min' },
        { id: 'router', title: 'Routing', desc: 'React Router and nested routes', length: '20 min' },
      ],
      problems: [
        { id: 'pb-counter', title: 'Counter with Hooks', difficulty: 'Easy' },
        { id: 'pb-fetch', title: 'Fetch & List Items', difficulty: 'Intermediate' },
        { id: 'pb-form', title: 'Controlled Form', difficulty: 'Intermediate' },
      ],
      resources: [
        { title: 'React Docs', href: 'https://react.dev/learn' },
        { title: 'React Router', href: 'https://reactrouter.com/' },
      ]
    },
    'backend-basics': {
      summary: 'Server-side JavaScript with Express, REST APIs, and databases.',
      usage: ['APIs for web/mobile', 'Back-office systems', 'Microservices'],
      howTo: ['Define REST routes', 'Persist with MongoDB', 'Secure with JWT'],
      basics: [
        'Express app: routes, middleware, error handling.',
        'MongoDB CRUD and Mongoose models.',
        'Auth with JWT and password hashing.'
      ],
      examples: [
        { title: 'Express Route', explain: 'A route handles a specific path and method. Keep handlers small, validate inputs, and return JSON responses consistently.' },
        { title: 'JWT Verify', explain: 'JWT middleware checks the token on each request. Verified requests proceed; invalid tokens return an error status.' }
      ],
      tutorials: [
        { id: 'express-router', title: 'Express Router', desc: 'Routes, params, middleware', length: '16 min' },
        { id: 'crud', title: 'CRUD with MongoDB', desc: 'Create, Read, Update, Delete', length: '24 min' },
        { id: 'auth', title: 'Auth with JWT', desc: 'Signup, login, protect routes', length: '28 min' },
      ],
      problems: [
        { id: 'pb-rest', title: 'Design a REST API', difficulty: 'Intermediate' },
        { id: 'pb-auth', title: 'JWT Auth Flow', difficulty: 'Intermediate' },
      ],
      resources: [
        { title: 'Express Docs', href: 'https://expressjs.com/' },
        { title: 'MongoDB Docs', href: 'https://www.mongodb.com/docs/' },
      ]
    },
    'fullstack-basics': {
      summary: 'Frontend + backend integration with Next.js and APIs.',
      usage: ['SEO-friendly sites', 'Hybrid apps', 'SaaS dashboards'],
      howTo: ['Pick SSR/SSG by page', 'Add API routes', 'Deploy to Vercel/AWS'],
      basics: [
        'SSR vs SSG and client navigation.',
        'API Routes for serverless endpoints.',
        'Env vars and deployment (Vercel/AWS).'
      ],
      examples: [
        { title: 'Next Page', explain: 'Pages map to routes and can be pre-rendered (SSR/SSG) for speed and SEO. Choose the data strategy per page use-case.' },
        { title: 'API Route', explain: 'API routes let you implement backend logic alongside the frontend, ideal for small services and form handlers.' }
      ],
      tutorials: [
        { id: 'next-pages', title: 'Next.js Pages', desc: 'Pages, routing, data fetching', length: '22 min' },
        { id: 'api-routes', title: 'API Routes', desc: 'Serverless functions, handlers', length: '20 min' },
      ],
      problems: [
        { id: 'pb-blog', title: 'Blog with SSR', difficulty: 'Intermediate' },
        { id: 'pb-auth-full', title: 'Full Auth Flow', difficulty: 'Advanced' },
      ],
      resources: [
        { title: 'Next.js Docs', href: 'https://nextjs.org/docs' }
      ]
    },
    'ml-basics': {
      summary: 'Python for data, ML models, metrics, and deployment basics.',
      usage: ['Predictions', 'Recommendations', 'Automation'],
      howTo: ['Prepare data with Pandas', 'Train sklearn models', 'Evaluate and iterate'],
      basics: [
        'NumPy arrays and vectorized ops.',
        'Pandas DataFrame manipulation.',
        'Train/test split and evaluation metrics.'
      ],
      examples: [
        { title: 'NumPy Vector', explain: 'Vectorized operations apply element-wise math efficiently. Prefer arrays over Python loops for performance.' },
        { title: 'scikit-learn Fit', explain: 'Most sklearn estimators follow fit/predict. Prepare features, fit the model, then evaluate with suitable metrics.' }
      ],
      tutorials: [
        { id: 'numpy', title: 'NumPy Arrays', desc: 'Vectors, matrices, operations', length: '18 min' },
        { id: 'pandas', title: 'Pandas DataFrames', desc: 'Load, clean, transform data', length: '24 min' },
        { id: 'sklearn', title: 'scikit-learn', desc: 'Fit, predict, evaluate models', length: '26 min' },
      ],
      problems: [
        { id: 'pb-reg', title: 'House Price Regression', difficulty: 'Intermediate' },
        { id: 'pb-cls', title: 'Iris Classification', difficulty: 'Easy' },
      ],
      resources: [
        { title: 'NumPy Docs', href: 'https://numpy.org/doc/' },
        { title: 'Pandas Docs', href: 'https://pandas.pydata.org/docs/' },
        { title: 'scikit-learn Docs', href: 'https://scikit-learn.org/stable/user_guide.html' },
      ]
    },
    'python-basics': {
  summary: 'Learn Python fundamentals and core syntax used across scripting, web, data, and automation.',
  usage: ['Scripting & automation', 'Web backends & APIs', 'Data analysis & ML'],
  howTo: ['Install Python and a code editor', 'Practice small scripts daily', 'Use virtual environments and pip'],
  basics: [
    'Python HOME — What Python is and where it is used',
    'Python Intro — High-level, interpreted, dynamically typed overview',
    'Python Get Started — Install Python, run scripts, choose an editor',
    'Python Syntax — Indentation defines blocks; colons start suites; case-sensitive names',
    'Syntax Statements — Simple (assign, import), compound (if, for, while, def)',
    'Python Output — print() and f-strings for formatted output',
    'Python Comments — # single-line and triple-quoted docstrings',
    'Python Variables — Names bind to objects; multiple assignment; no declarations',
    'Python Data Types — int, float, bool, str, list, tuple, set, dict, None',
    'Python Numbers — Integer/float math, rounding, math module basics',
    'Python Casting — str(), int(), float(), bool() conversions',
    'Python Strings — Immutable text, slicing, methods, formatting',
    'Python Booleans — Truthy/falsy, comparisons, logical ops',
    'Python Operators — Arithmetic, comparison, logical, membership, identity',
    'Python Lists — Ordered, mutable; indexing, slicing, append, list comps',
    'Python Tuples — Ordered, immutable; packing/unpacking',
    'Python Sets — Unordered unique elements; union/intersection',
    'Python Dictionaries — Key/value mapping; get/update; nesting',
    'Python If...Else — Conditional execution and elif chains',
    'Python Match — Structural pattern matching (3.10+)',
    'Python While Loops — Loop with condition; break/continue; else',
    'Python For Loops — Iterate over iterables; range, enumerate',
    'Python Functions — def, parameters, returns, default/keyword args'
  ],
  examples: [
    { title: 'Syntax & Indentation', explain: 'Blocks are defined by indentation, not braces. A colon starts a new suite and consistent spacing is important.' },
    { title: 'Data Structures', explain: 'Lists, tuples, sets, and dicts cover most everyday needs—from ordered sequences to fast lookups.' }
  ],
  tutorials: [
    { id: 'py-intro', title: 'Getting Started with Python', desc: 'Install, run scripts, and write your first program', length: '15 min' },
    { id: 'py-syntax', title: 'Core Syntax & Types', desc: 'Indentation, variables, data types, and strings', length: '25 min' },
    { id: 'py-flow', title: 'Control Flow', desc: 'If/else, match, loops, and functions', length: '25 min' }
  ],
  problems: [
    { id: 'py-sum', title: 'Sum of Numbers', difficulty: 'Easy' },
    { id: 'py-unique', title: 'Unique Words (Sets)', difficulty: 'Easy' }
  ],
  resources: [
    { title: 'Python Docs', href: 'https://docs.python.org/3/tutorial/' },
    { title: 'Real Python', href: 'https://realpython.com/' }
  ]
}
  };

  const courseData = {
    'web-basics': {
      id: 'web-basics',
      title: 'Web Development Fundamentals',
      description: 'Master the essential building blocks of modern web development.',
      duration: '8 weeks',
      difficulty: 'Beginner',
      instructor: 'Sarah Johnson',
      price: 'Free',
    },
    'react-fundamentals': {
      id: 'react-fundamentals',
      title: 'React.js for Beginners',
      description: 'Dive into the world of modern frontend development with React.js.',
      duration: '6 weeks',
      difficulty: 'Beginner',
      instructor: 'Mike Chen',
      price: '$49',
      curriculum: {
        easy: ['Components, props, state', 'Hooks: useState, useEffect', 'Routing with React Router'],
        intermediate: ['Forms and validation', 'API integration and async data', 'List and key patterns'],
        advanced: ['Performance optimizations', 'State management patterns', 'Testing with Jest + RTL'],
      },
    },
    'backend-basics': {
      id: 'backend-basics',
      title: 'Backend Development Fundamentals',
      description: 'Node.js and Express API fundamentals with authentication and databases.',
      duration: '10 weeks',
      difficulty: 'Beginner',
      instructor: 'Alex Thompson',
      price: 'Free',
      curriculum: {
        easy: ['Node.js basics, npm, modules', 'Express routing and middleware', 'REST fundamentals and Postman'],
        intermediate: ['Authentication with JWT', 'Databases: MongoDB and PostgreSQL CRUD', 'Error handling and logging'],
        advanced: ['Rate limiting, caching, security headers', 'Scalability: clustering, load testing', 'CI/CD and deployment basics'],
      },
    },
    'fullstack-basics': {
      id: 'fullstack-basics',
      title: 'Full Stack Development Bootcamp',
      description: 'Build complete web applications with React, Next.js, APIs, and databases.',
      duration: '16 weeks',
      difficulty: 'Intermediate',
      instructor: 'Jessica Williams',
      price: '$299',
      curriculum: {
        easy: ['Frontend fundamentals (HTML/CSS/JS)', 'Basic React app with routing', 'Intro to REST APIs'],
        intermediate: ['Next.js pages, SSR/SSG, API routes', 'State management patterns', 'Database integration (ORM, migrations)'],
        advanced: ['Auth (JWT/OAuth), role-based access', 'Serverless and edge deployment', 'Performance, caching, observability'],
      },
    },
    'ml-basics': {
      id: 'ml-basics',
      title: 'Machine Learning Fundamentals',
      description: 'Python, NumPy, Pandas, modeling with scikit-learn, and evaluation.',
      duration: '10 weeks',
      difficulty: 'Beginner',
      instructor: 'Dr. Anna Patel',
      price: 'Free',
      curriculum: {
        easy: ['Python syntax and NumPy arrays', 'Pandas dataframes and cleaning', 'Basic EDA and visualization'],
        intermediate: ['Regression and classification with scikit-learn', 'Feature engineering and metrics', 'Train/validation/test splits and cross‑validation'],
        advanced: ['Intro to neural networks (TensorFlow/Keras)', 'Experiment tracking and model monitoring', 'Deployment basics and inference optimization'],
      },
    },
    'python-basics': {
      id: 'python-basics',
      title: 'Python Basics',
      description: 'Core Python concepts: syntax, variables, types, flow control, and functions.',
      duration: '6 weeks',
      difficulty: 'Beginner',
      instructor: 'Priya Sharma',
      price: 'Free',
      curriculum: {
        easy: ['Intro and setup', 'Syntax & statements', 'Variables and data types', 'Strings and numbers', 'Lists, tuples, sets, dicts', 'If/Else & Match', 'Loops', 'Functions'],
        intermediate: ['Comprehensions', 'Modules & packages', 'File I/O', 'Error handling', 'Virtual envs & pip'],
        advanced: ['Iterators & generators', 'Decorators', 'Typing basics']
      }
    }
  };

  const course = courseData[courseId] || {
    id: 'not-found',
    title: 'Course Not Found',
    description: 'The requested course could not be found.',
  };

  const content = contentDB[courseId] || {};

  useEffect(() => {
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    setIsEnrolled(enrolledCourses.some((c) => c.id === course.id));
    const saved = JSON.parse(localStorage.getItem(`courseQuizProgress:${course.id}`) || 'null');
    if (saved && saved.selectedLevel) {
      setSelectedLevel(saved.selectedLevel);
      setQuizState(saved.quizState || { answers: {}, theory: '', submitted: false, score: 0 });
      setUsedHint(saved.usedHint || false);
      setEliminated(saved.eliminated || {});
      setCurrentQIndex(saved.currentQIndex || 0);
    }

    // load leaderboard
    const lb = JSON.parse(localStorage.getItem(`leaderboard:${course.id}`) || '[]');
    setLeaderboard(lb);
  }, [course.id]);

  const handleEnroll = () => {
    setIsEnrolled(true);
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!enrolledCourses.some((c) => c.id === course.id)) {
      enrolledCourses.push(course);
      localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
    }
  };

  // --- Quiz data with short explanations for result breakdown ---
  const quizData = {
    'web-basics': {
      easy: {
        mcq: [
          { id: 'q1', q: 'Which tag is used for the largest heading in HTML?', options: ['<p>', '<h6>', '<h1>', '<title>'], correct: 2, explanation: '<h1> is top-level heading.' },
          { id: 'q2', q: 'Which CSS layout is best for rows and columns?', options: ['Flexbox', 'Floats', 'Tables', 'Inline'], correct: 0, explanation: 'Flexbox is designed for row/column layouts.' },
          { id: 'q3', q: 'HTML stands for?', options: ['HyperText Markup Language', 'HighText Machine Language', 'Hyperlinks Text Mark Language', 'HyperText Markdown Language'], correct: 0, explanation: 'HTML = HyperText Markup Language.' },
          { id: 'q4', q: 'Which attribute adds a tooltip text in HTML?', options: ['title', 'alt', 'tooltip', 'data-info'], correct: 0, explanation: 'title attribute shows a tooltip.' },
          { id: 'q5', q: 'Default display value of <div>?', options: ['inline', 'block', 'flex', 'none'], correct: 1, explanation: '<div> is block by default.' },
        ],
        theoryPrompt: 'Explain the difference between block and inline elements with examples.',
      },
      intermediate: {
        mcq: [
          { id: 'q6', q: 'React uses ___ to describe UI.', options: ['HTML', 'XML', 'JSX', 'TSX'], correct: 2, explanation: 'JSX describes UI in JS files.' },
          { id: 'q7', q: 'Which hook is used for side effects?', options: ['useState', 'useEffect', 'useMemo', 'useRef'], correct: 1, explanation: 'useEffect runs side effects after render.' },
          { id: 'q8', q: 'Keys in React help with?', options: ['Styling', 'Tracking elements in lists', 'Routing', 'API calls'], correct: 1, explanation: 'Keys help React identify elements in lists.' },
          { id: 'q9', q: 'Which attribute binds input value to state?', options: ['value', 'state', 'bind', 'onChange'], correct: 0, explanation: 'value attribute binds state to input.' },
          { id: 'q10', q: 'React fragment shorthand?', options: ['<> </>', '<React.Fragment></React.Fragment>', '<frag></frag>', 'Both 1 & 2'], correct: 3, explanation: 'Both shorthand and full Fragment are valid.' },
        ],
        theoryPrompt: 'Describe state vs props in a typical React component.',
      },
      advanced: {
        mcq: [
          { id: 'q11', q: 'Which improves render performance?', options: ['Inline functions', 'React.memo', 'Heavy context', 'Deep prop drilling'], correct: 1, explanation: 'React.memo avoids unnecessary re-renders.' },
          { id: 'q12', q: 'Lazy loading in React is done using?', options: ['React.lazy', 'Suspense', 'Both', 'useEffect'], correct: 2, explanation: 'React.lazy + Suspense enables lazy loading.' },
          { id: 'q13', q: 'What is a pure component?', options: ['No props', 'No state', 'Renders same output for same props', 'Class only'], correct: 2, explanation: 'Pure components render same output for same props.' },
          { id: 'q14', q: 'When to use useCallback?', options: ['Memoize functions', 'Memoize JSX', 'Trigger re-render', 'Async fetch'], correct: 0, explanation: 'useCallback memoizes a function reference.' },
          { id: 'q15', q: 'Best method to prevent unnecessary re-renders?', options: ['useState', 'React.memo', 'Direct DOM updates', 'Redux only'], correct: 1, explanation: 'React.memo avoids re-renders for unchanged props.' },
        ],
        theoryPrompt: 'Outline steps to optimize a slow React list rendering UI.',
      },
    },
    'react-fundamentals': {
      easy: {
        mcq: [
          { id: 'rf_q1', q: 'A React component name should start with:', options: ['lowercase', 'uppercase', 'number', 'underscore'], correct: 1, explanation: 'Components must start uppercase.' },
          { id: 'rf_q2', q: 'JSX compiles primarily to:', options: ['HTML', 'Function calls', 'XML', 'JSON'], correct: 1, explanation: 'JSX compiles to React.createElement calls.' },
          { id: 'rf_q3', q: 'React components can return:', options: ['Single element', 'Multiple sibling elements', 'Fragment', 'All of these'], correct: 3, explanation: 'Components can return multiple elements via Fragment.' },
          { id: 'rf_q4', q: 'useState hook returns?', options: ['State only', 'Setter only', 'Array of [state,setter]', 'Object with state'], correct: 2, explanation: 'useState returns [state, setter].' },
          { id: 'rf_q5', q: 'Props are?', options: ['Mutable', 'Immutable', 'Methods only', 'State only'], correct: 1, explanation: 'Props are immutable from child’s perspective.' },
        ],
        theoryPrompt: 'Explain how props flow from parent to child with a minimal code example.',
      },
      intermediate: {
        mcq: [
          { id: 'rf_q6', q: 'Which hook stores a mutable value that persists across renders without causing re-render?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], correct: 2, explanation: 'useRef stores a mutable value.' },
          { id: 'rf_q7', q: 'What does React.memo help with?', options: ['Routing', 'Avoiding unnecessary re-renders', 'Fetching data', 'Styling'], correct: 1, explanation: 'React.memo memoizes a component output.' },
          { id: 'rf_q8', q: 'Controlled input must have?', options: ['value prop', 'onChange', 'Both', 'None'], correct: 2, explanation: 'Controlled input needs value + onChange.' },
          { id: 'rf_q9', q: 'Context API avoids?', options: ['Prop drilling', 'State management', 'API calls', 'Routing'], correct: 0, explanation: 'Context avoids prop drilling.' },
          { id: 'rf_q10', q: 'useEffect cleanup runs?', options: ['After mount', 'Before unmount', 'Before every effect', 'After every render'], correct: 2, explanation: 'Cleanup runs before next effect or unmount.' },
        ],
        theoryPrompt: 'Compare controlled vs uncontrolled inputs in React.',
      },
      advanced: {
        mcq: [
          { id: 'rf_q11', q: 'Redux Toolkit slice typically contains:', options: ['reducers', 'actions', 'initialState', 'All of these'], correct: 3, explanation: 'Slice has initialState, reducers, and actions.' },
          { id: 'rf_q12', q: 'Middleware in Redux is used to?', options: ['Intercept actions', 'Dispatch actions', 'Fetch only', 'Store only'], correct: 0, explanation: 'Middleware intercepts actions for side effects.' },
          { id: 'rf_q13', q: 'React.lazy works with?', options: ['Functional components', 'Class components', 'Both', 'Hooks only'], correct: 0, explanation: 'Lazy works with functional components.' },
          { id: 'rf_q14', q: 'When to use useReducer?', options: ['Simple state', 'Complex state logic', 'Async fetch', 'API call'], correct: 1, explanation: 'useReducer is for complex state logic.' },
          { id: 'rf_q15', q: 'Selector in Redux Toolkit does?', options: ['Modify state', 'Extract state', 'Dispatch action', 'None'], correct: 1, explanation: 'Selector extracts specific state.' },
        ],
        theoryPrompt: 'When would you choose Context API over Redux? Justify with trade-offs.',
      },
    },
    // Similarly, you can extend backend-basics, fullstack-basics, ml-basics with 5 MCQs each
  };

  const courseQuiz = quizData[course.id] || quizData['web-basics'];
  const levelQuiz = courseQuiz ? courseQuiz[selectedLevel] : null;
  const mcqs = levelQuiz && levelQuiz.mcq ? levelQuiz.mcq : [];

  // persist progress helpers
  const persistProgress = (opts = {}) => {
    const payload = {
      selectedLevel,
      quizState,
      usedHint,
      eliminated,
      currentQIndex,
      ...opts,
    };
    localStorage.setItem(`courseQuizProgress:${course.id}`, JSON.stringify(payload));
  };

  // navigation between questions (one-per-view to allow animations)
  const goToQuestion = (idx) => {
    if (idx < 0 || idx >= mcqs.length) return;
    setCurrentQIndex(idx);
    persistProgress();
  };

  // hint: eliminate two wrong options for current question (only once per quiz)
  const useHintNow = () => {
    if (usedHint) return;
    const q = mcqs[currentQIndex];
    if (!q) return;
    const wrongIdxs = q.options.map((_, i) => i).filter((i) => i !== q.correct);
    // pick two to eliminate (randomly)
    const shuffled = wrongIdxs.sort(() => 0.5 - Math.random());
    const toElim = shuffled.slice(0, Math.min(2, shuffled.length));
    setEliminated((prev) => ({ ...prev, [q.id]: toElim }));
    setUsedHint(true);
    persistProgress({ usedHint: true, eliminated: { ...eliminated, [q.id]: toElim } });
  };

  // selecting option for question
  const chooseOption = (qId, optIdx) => {
    const next = { ...quizState, answers: { ...quizState.answers, [qId]: optIdx } };
    setQuizState(next);
    persistProgress({ quizState: next });
  };

  // submit quiz: compute score, store leaderboard locally
  const submitQuiz = () => {
    let score = 0;
    mcqs.forEach((q) => {
      if (quizState.answers[q.id] === q.correct) score++;
    });
    const nextState = { ...quizState, submitted: true, score };
    setQuizState(nextState);

    // Save attempt to leaderboard if playerName provided (or "Anonymous")
    const name = playerName && playerName.trim() ? playerName.trim() : 'Anonymous';
    const entry = { name, score, date: new Date().toISOString() };
    const key = `leaderboard:${course.id}`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    existing.push(entry);
    // sort desc and keep top 5
    const sorted = existing.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date)).slice(0, 5);
    localStorage.setItem(key, JSON.stringify(sorted));
    setLeaderboard(sorted);
    persistProgress({ quizState: nextState });
  };

  // reset / retake
  const resetQuiz = () => {
    const next = { answers: {}, theory: '', submitted: false, score: 0 };
    setQuizState(next);
    setUsedHint(false);
    setEliminated({});
    setCurrentQIndex(0);
    persistProgress({ quizState: next, usedHint: false, eliminated: {}, currentQIndex: 0 });
  };

  // share results (copy text to clipboard)
  const shareResults = () => {
    const text = `I scored ${quizState.score}/${mcqs.length} on "${course.title}" (${selectedLevel}) — try it out!`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => {
        setShowShareMsg('Result copied to clipboard!');
        setTimeout(() => setShowShareMsg(''), 2500);
      });
    } else {
      // fallback: select temporary textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        setShowShareMsg('Result copied to clipboard!');
        setTimeout(() => setShowShareMsg(''), 2500);
      } catch {
        setShowShareMsg('Unable to copy — please copy manually.');
        setTimeout(() => setShowShareMsg(''), 2500);
      } finally {
        document.body.removeChild(ta);
      }
    }
  };

  // small helper to show option disabled due to hint elimination
  const isEliminated = (qId, idx) => {
    return Array.isArray(eliminated[qId]) && eliminated[qId].includes(idx);
  };

  // simple animation class toggler: we'll use key on question block to trigger re-render + CSS transition
  const question = mcqs[currentQIndex];

  // --- Styles (small inline <style> tag inside JSX render) ---
  return (
    <div style={{ width: '100vw', minHeight: '100vh', margin: 0, padding: 0 }}>
      <style>{`
        .quiz-wrap { border-radius:14px; padding:16px; margin-bottom:24px; background: linear-gradient(180deg, rgba(23,210,194,0.04), rgba(108,140,255,0.04)); border: 1px solid rgba(108,140,255,0.22); }
        .question-card { background: rgba(255,255,255,0.03); border-radius:10px; padding:12px; margin-bottom:12px; border:1px solid rgba(255,255,255,0.04); }
        .option { display:block; margin:8px 0; padding:8px 10px; border-radius:8px; cursor:pointer; transition: transform .12s ease, background .12s ease; }
        .option:hover { transform: translateY(-3px); }
        .option.selected { box-shadow: 0 4px 14px rgba(108,140,255,0.12); background: rgba(108,140,255,0.06); }
        .option.elim { opacity: 0.35; text-decoration: line-through; cursor: not-allowed; }
        .pager { display:flex; gap:8px; margin-top:10px; align-items:center; }
        .progress { height:8px; background: rgba(255,255,255,0.08); border-radius:6px; overflow:hidden; }
        .progress > .bar { height:100%; background: linear-gradient(90deg, #6C8CFF, #17D2C2); transition: width .3s ease; }
        .fade-enter { opacity:0; transform: translateY(8px); }
        .fade-enter-active { opacity:1; transform: translateY(0); transition: all .28s ease; }
        .fade-exit { opacity:1; transform: translateY(0); }
        .fade-exit-active { opacity:0; transform: translateY(-8px); transition: all .22s ease; }
        .leaderboard { margin-top:12px; padding:12px; background: rgba(0,0,0,0.03); border-radius:8px; }
        .result-breakdown { margin-top:12px; background: rgba(255,255,255,0.02); padding:12px; border-radius:8px; }
        .share-msg { margin-left:8px; color: #9be6c1; font-size:0.95rem; }
      `}</style>

      <Link
        to="/courses"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          marginBottom: '20px',
          color: 'rgba(255, 255, 255, 0.7)',
          textDecoration: 'none',
          fontSize: '16px',
        }}
      >
        ← Back to Courses
      </Link>

      {/* Full-width content area with sidebar + panels */}
      <section style={{ padding: 24 }}>
        <h1 style={{ fontSize: '2.2rem', margin: 0, marginBottom: 8, background: 'var(--gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{course.title}</h1>
        <p style={{ fontSize: 16, lineHeight: 1.6, marginTop: 4 }}>{course.description}</p>

        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 24, alignItems: 'start' }}>
          <nav style={{ position: 'sticky', top: 16, alignSelf: 'start', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontWeight: 800, marginBottom: 10 }}>Contents</div>
            {[
              { k: 'overview', label: 'Overview' },
              { k: 'basics', label: 'Basics' },
              { k: 'examples', label: 'Examples' },
              { k: 'syllabus', label: 'Syllabus' },
              { k: 'tutorials', label: 'Tutorials' },
              { k: 'resources', label: 'Resources' },
              { k: 'quiz', label: 'Quiz' }
            ].map(item => (
              <button
                key={item.k}
                onClick={() => {
                  if (item.k === 'quiz') {
                    document.getElementById('course-quiz')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    return;
                  }
                  setActiveTab(item.k);
                }}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 8,
                  marginBottom: 6,
                  border: '1px solid rgba(255,255,255,0.12)',
                  background: activeTab === item.k ? 'var(--gradient)' : 'rgba(255,255,255,0.04)',
                  color: activeTab === item.k ? '#08111b' : 'var(--text)',
                  cursor: 'pointer',
                  fontWeight: 700
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          <div>
            {activeTab === 'overview' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>Overview</h2>
                <p style={{ color: 'var(--muted)' }}>{content.summary || course.description}</p>
              </div>
            )}

            {activeTab === 'basics' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>Basics</h2>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {(content.basics || []).map((b, i) => (
                    <li key={i} style={{ marginBottom: 8 }}>{b}</li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'examples' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>Examples</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 12 }}>
                  {(content.examples || []).map((ex, i) => (
                    <div key={i} style={{ padding: 16, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10 }}>
                      <div style={{ fontWeight: 800, marginBottom: 6 }}>{ex.title}</div>
                      <p style={{ margin: 0, color: 'var(--muted)' }}>{ex.explain}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>Syllabus</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12 }}>
                  {Object.entries(course.curriculum || {}).map(([lvl, items]) => (
                    <div key={lvl} style={{ padding: 16, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                      <div style={{ fontWeight: 800, marginBottom: 8 }}>{lvl[0].toUpperCase()+lvl.slice(1)}</div>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {(items || []).map((it, i) => (
                          <li key={i} style={{ marginBottom: 6 }}>{it}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tutorials' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>Tutorials</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12 }}>
                  {content.tutorials.map((t) => (
                    <div key={t.id} style={{ padding: 16, border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
                      <div style={{ fontWeight: 800 }}>{t.title}</div>
                      <div style={{ color: 'var(--muted)', margin: '6px 0' }}>{t.desc}</div>
                      <div style={{ fontSize: 12, opacity: 0.8 }}>{t.length}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}


            {activeTab === 'resources' && (
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 20, marginBottom: 16 }}>
                <h2 style={{ marginTop: 0 }}>Resources</h2>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {content.resources.map((r, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      <a href={r.href} target="_blank" rel="noreferrer" style={{ color: 'var(--text)' }}>{r.title}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Quiz section (full width) */}
      <div id="course-quiz" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '30px', marginBottom: '30px' }}>
        {/* Keep quiz title minimal as the main title is above */}
        <h3 style={{ margin: 0, marginBottom: 8 }}>Quiz</h3>
        <p style={{ fontSize: 14, lineHeight: 1.5, marginTop: 0, color: 'var(--muted)' }}>{course.title} — test your understanding</p>

        <div className="quiz-wrap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ margin: 0 }}>Quiz</h3>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <select value={selectedLevel} onChange={(e) => { setSelectedLevel(e.target.value); resetQuiz(); }} style={{ padding: '8px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', color: 'var(--text)', border: '1px solid rgba(255,255,255,0.18)' }}>
                <option value="easy">Easy</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
              <button onClick={() => { setQuizOpen((v) => !v); }} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer', background: 'linear-gradient(90deg,#6C8CFF,#17D2C2)', color: '#08111b', fontWeight: 700, border: 'none' }}>{quizOpen ? 'Close' : 'Open'}</button>
            </div>
          </div>

          {quizOpen ? (
            <div>
              {/* progress bar (based on answered count) */}
              <div style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, alignItems: 'center' }}>
                  <small>Question {Math.min(mcqs.length, Math.max(1, currentQIndex + 1))} of {mcqs.length}</small>
                  <small>{Object.keys(quizState.answers).length}/{mcqs.length} answered</small>
                </div>
                <div className="progress" style={{ width: '100%' }}>
                  <div className="bar" style={{ width: `${mcqs.length ? (Object.keys(quizState.answers).length / mcqs.length) * 100 : 0}%` }} />
                </div>
              </div>

              {/* question area (single-question view for animated transitions) */}
              {question ? (
                <div key={question.id} className="question-card" style={{ minHeight: 120 }}>
                  <div style={{ fontWeight: 700, marginBottom: 8 }}>{currentQIndex + 1}. {question.q}</div>

                  <div>
                    {question.options.map((opt, idx) => {
                      const qId = question.id;
                      const sel = quizState.answers[qId];
                      const eliminatedFlag = isEliminated(qId, idx);
                      const disabled = eliminatedFlag || quizState.submitted;
                      const cls = [
                        'option',
                        sel === idx ? 'selected' : '',
                        eliminatedFlag ? 'elim' : '',
                      ].join(' ');
                      return (
                        <label
                          key={idx}
                          className={cls}
                          onClick={() => {
                            if (disabled) return;
                            chooseOption(qId, idx);
                          }}
                          style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
                        >
                          <input
                            type="radio"
                            name={`mcq-${question.id}`}
                            checked={sel === idx}
                            readOnly
                            style={{ marginRight: 8 }}
                            disabled={disabled}
                          />
                          <span>{opt}</span>
                        </label>
                      );
                    })}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <button onClick={() => goToQuestion(currentQIndex - 1)} disabled={currentQIndex === 0} style={{ padding: '8px 10px', borderRadius: 8, cursor: currentQIndex === 0 ? 'not-allowed' : 'pointer' }}>Prev</button>
                      <button onClick={() => goToQuestion(currentQIndex + 1)} disabled={currentQIndex >= mcqs.length - 1} style={{ padding: '8px 10px', borderRadius: 8, cursor: currentQIndex >= mcqs.length - 1 ? 'not-allowed' : 'pointer' }}>Next</button>
                      <button onClick={useHintNow} disabled={usedHint || quizState.submitted} style={{ padding: '8px 10px', borderRadius: 8, cursor: usedHint ? 'not-allowed' : 'pointer' }}>
                        {usedHint ? 'Hint used' : 'Use Hint (eliminate 2)'}
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      {!quizState.submitted ? (
                        <button onClick={submitQuiz} style={{ background: 'linear-gradient(90deg,#6C8CFF,#17D2C2)', color: '#08111b', fontWeight: 700, padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer' }}>
                          Submit
                        </button>
                      ) : (
                        <>
                          <button onClick={resetQuiz} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Retake</button>
                          <button onClick={shareResults} style={{ padding: '8px 12px', borderRadius: 8, cursor: 'pointer' }}>Share</button>
                          {showShareMsg && <span className="share-msg">{showShareMsg}</span>}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ padding: 12 }}>No questions for this level yet.</div>
              )}

              {/* theory answer */}
              <div style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Theory</div>
                <textarea
                  rows={4}
                  value={quizState.theory}
                  onChange={(e) => { const next = { ...quizState, theory: e.target.value }; setQuizState(next); persistProgress({ quizState: next }); }}
                  placeholder={levelQuiz?.theoryPrompt || 'Write your answer here...'}
                  style={{ width: '100%', padding: 10, borderRadius: 8 }}
                  disabled={quizState.submitted}
                />
              </div>

              {/* after submit: show result breakdown */}
              {quizState.submitted && (
                <div className="result-breakdown">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div><strong>Score:</strong> {quizState.score} / {mcqs.length}</div>
                    <div>
                      <input placeholder="Your name for leaderboard" value={playerName} onChange={(e) => setPlayerName(e.target.value)} style={{ padding: 6, borderRadius: 6, marginRight: 8 }} />
                      <button onClick={() => { /* name is saved on submit already; but allow resubmit to save under new name */ const key = `leaderboard:${course.id}`; const existing = JSON.parse(localStorage.getItem(key) || '[]'); const name = playerName.trim() || 'Anonymous'; const entry = { name, score: quizState.score, date: new Date().toISOString() }; existing.push(entry); const sorted = existing.sort((a, b) => b.score - a.score || new Date(b.date) - new Date(a.date)).slice(0,5); localStorage.setItem(key, JSON.stringify(sorted)); setLeaderboard(sorted); }} style={{ padding: 6, borderRadius: 6 }}>Save Name</button>
                    </div>
                  </div>

                  <div style={{ marginTop: 10 }}>
                    {mcqs.map((q, i) => {
                      const userAns = quizState.answers[q.id];
                      const correct = q.correct;
                      return (
                        <div key={q.id} style={{ padding: 8, borderRadius: 8, background: 'rgba(0,0,0,0.02)', marginBottom: 8 }}>
                          <div style={{ fontWeight: 700 }}>{i + 1}. {q.q}</div>
                          <div style={{ marginTop: 6 }}>
                            <div>Your answer: {typeof userAns === 'number' ? q.options[userAns] : <em>Not answered</em>}</div>
                            <div>Correct answer: <strong>{q.options[correct]}</strong></div>
                            <div style={{ marginTop: 6, fontSize: 13, opacity: 0.9 }}>{q.explanation}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* leaderboard (local) */}
              <div className="leaderboard" style={{ marginTop: 12 }}>
                <div style={{ fontWeight: 700, marginBottom: 8 }}>Leaderboard (Top 5) — local</div>
                {leaderboard.length ? (
                  <ol style={{ margin: 0, paddingLeft: 18 }}>
                    {leaderboard.map((l, idx) => (
                      <li key={idx} style={{ marginBottom: 6 }}>
                        <strong>{l.name}</strong> — {l.score}/{mcqs.length} <span style={{ color: '#9aa', marginLeft: 8, fontSize: 12 }}>{new Date(l.date).toLocaleString()}</span>
                      </li>
                    ))}
                  </ol>
                ) : (
                  <div style={{ opacity: 0.8 }}>No entries yet — be the first to score!</div>
                )}
              </div>
            </div>
          ) : (
            <div style={{ padding: 12, color: 'rgba(255,255,255,0.7)' }}>
              Click "Open" to start the quiz. When opened, you'll see one question at a time, a hint button (one-time), and a local leaderboard that stores top 5 scores in your browser.
            </div>
          )}
        </div>

        {/* Enroll button */}
        <button onClick={handleEnroll} style={{ display: 'inline-block', padding: '12px 24px', background: isEnrolled ? 'rgba(108,140,255,0.3)' : 'var(--gradient)', borderRadius: '8px', color: 'white', border: 'none', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          {isEnrolled ? 'Enrolled' : 'Enroll Now'}
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
