/* Pre-loaded Jain University Syllabi for 1-Click Generation & Testing */

const MOCK_SYLLABI = {
  economics: {
    title: "BUSINESS ECONOMICS",
    code: "23BC1OD05/23BCAF1OD02",
    program: "FIRST SEMESTER BCOM UNIVERSITY EXAMINATION",
    department: "CENTER FOR DISTANCE AND ONLINE EDUCATION",
    examDate: "OCTOBER 2026",
    duration: "03 Hours",
    maxMarks: 70,
    units: [
      {
        number: 1,
        title: "Introduction to Business Economics & Scarcity",
        cos: ["CO1"],
        topics: [
          "Nature of economics as a science",
          "Scarcity and choice in economics",
          "Economic profit definition and concepts",
          "Organization of an economy and role of natural resources and firms",
          "Micro vs Macro economics principles"
        ]
      },
      {
        number: 2,
        title: "Demand, Production & Market Structures",
        cos: ["CO2"],
        topics: [
          "Elasticity of demand types and measurement",
          "Short-run and long-run costs in production",
          "Price determination in a monopolistic market",
          "Monopoly vs monopolistic market comparison and contrast",
          "Law of diminishing marginal utility"
        ]
      },
      {
        number: 3,
        title: "Corporate Governance & Firm Theory",
        cos: ["CO3"],
        topics: [
          "Roles of Board of Directors in corporate governance",
          "Stakeholder Theory concepts and applications",
          "Remuneration and nomination committees in corporate governance",
          "Corporate Governance and Agency problems in modern firms",
          "Business ethics and managerial accountability"
        ]
      },
      {
        number: 4,
        title: "Macroeconomic Variables & Fiscal Policy",
        cos: ["CO4"],
        topics: [
          "Price index definition and calculations",
          "Circular flow of income in two, three, and four sector models",
          "Fiscal policy definitions and instruments",
          "Savings and investment role in economic growth",
          "Causes and consequences of inflation and deflation",
          "Regional Economic Problems and policy solutions"
        ]
      },
      {
        number: 5,
        title: "International Trade & Foreign Exchange",
        cos: ["CO5"],
        topics: [
          "Exchange rate definition and determination",
          "International trade organizations apart from World Bank and IMF",
          "Impact of globalization on international trade",
          "Role of WTO in developing economies",
          "Balance of Payments and exchange rate policies"
        ]
      }
    ]
  },

  computer_science: {
    title: "DATA STRUCTURES AND ALGORITHMS",
    code: "23CS1OD04/23BCA1OD01",
    program: "FIRST SEMESTER BCA UNIVERSITY EXAMINATION",
    department: "FACULTY OF ENGINEERING & TECHNOLOGY",
    examDate: "OCTOBER 2026",
    duration: "03 Hours",
    maxMarks: 70,
    units: [
      {
        number: 1,
        title: "Introduction to Data Structures & Arrays",
        cos: ["CO1"],
        topics: [
          "Definition of abstract data types (ADT)",
          "Time and space complexity notation (Big-O)",
          "Array representations and address calculation",
          "Sparse matrices representation",
          "Dynamic memory allocation algorithms"
        ]
      },
      {
        number: 2,
        title: "Stacks and Queues",
        cos: ["CO2"],
        topics: [
          "Stack operations: Push, Pop, Peek",
          "Infix to postfix and prefix conversion algorithms",
          "Queue operations: Circular Queue, Double-ended Queue (Deque)",
          "Priority Queue implementation using arrays and heaps",
          "Applications of stack in recursion and backtracking"
        ]
      },
      {
        number: 3,
        title: "Linked Lists",
        cos: ["CO3"],
        topics: [
          "Singly linked list insertion, deletion, and reversal",
          "Doubly linked list structures and pointer operations",
          "Circular linked list applications",
          "Polynomial arithmetic using linked list",
          "Header linked lists and memory management"
        ]
      },
      {
        number: 4,
        title: "Trees and Binary Search Trees",
        cos: ["CO4"],
        topics: [
          "Binary tree traversals: Preorder, Inorder, Postorder",
          "Binary Search Tree (BST) insertion, search, and deletion",
          "AVL Tree rotation algorithms and balance factors",
          "B-Trees and B+ Trees indexing properties",
          "Expression trees construction"
        ]
      },
      {
        number: 5,
        title: "Graphs and Sorting Algorithms",
        cos: ["CO5"],
        topics: [
          "Graph representation: Adjacency matrix and list",
          "Graph traversals: Breadth First Search (BFS) and Depth First Search (DFS)",
          "Dijkstra's shortest path algorithm",
          "Quick sort vs Merge sort algorithm performance analysis",
          "Hash tables, collision resolution techniques (Chaining, Open Addressing)"
        ]
      }
    ]
  },

  artificial_intelligence: {
    title: "ARTIFICIAL INTELLIGENCE & MACHINE LEARNING",
    code: "23AI1OD01/23BCSE1OD05",
    program: "THIRD SEMESTER BTECH UNIVERSITY EXAMINATION",
    department: "SCHOOL OF COMPUTER SCIENCE & INFORMATION TECHNOLOGY",
    examDate: "OCTOBER 2026",
    duration: "03 Hours",
    maxMarks: 70,
    units: [
      {
        number: 1,
        title: "Foundations of AI & Problem Solving",
        cos: ["CO1"],
        topics: [
          "Turing Test and foundations of artificial intelligence",
          "State space search formulation",
          "Uninformed search strategies: BFS, DFS, Uniform Cost Search",
          "Heuristic search strategies: A* Search, Greedy Best First Search",
          "Constraint Satisfaction Problems (CSP)"
        ]
      },
      {
        number: 2,
        title: "Knowledge Representation & Reasoning",
        cos: ["CO2"],
        topics: [
          "Propositional logic and First-Order Predicate Logic (FOL)",
          "Forward and backward chaining inference rules",
          "Ontological engineering and semantic networks",
          "Bayesian Networks and probabilistic reasoning",
          "Decision trees and entropy measures"
        ]
      },
      {
        number: 3,
        title: "Supervised & Unsupervised Machine Learning",
        cos: ["CO3"],
        topics: [
          "Linear regression and logistic regression models",
          "Support Vector Machines (SVM) and kernel methods",
          "K-Nearest Neighbors (KNN) classification",
          "K-Means clustering and hierarchical clustering algorithms",
          "Overfitting, regularization (L1/L2), and bias-variance tradeoff"
        ]
      },
      {
        number: 4,
        title: "Neural Networks & Deep Learning",
        cos: ["CO4"],
        topics: [
          "Perceptron architecture and activation functions",
          "Multilayer Perceptron (MLP) and Backpropagation algorithm",
          "Convolutional Neural Networks (CNN) architecture for image analysis",
          "Recurrent Neural Networks (RNN) and LSTM for sequence modeling",
          "Optimization algorithms: SGD, Adam, Momentum"
        ]
      },
      {
        number: 5,
        title: "Ethical AI, NLP & Reinforcement Learning",
        cos: ["CO5"],
        topics: [
          "Natural Language Processing tokenization and sentiment analysis",
          "Q-Learning and Markov Decision Processes (MDP)",
          "Ethical considerations in AI, bias, and fairness",
          "Generative AI models and LLM fundamentals",
          "Applications of AI in healthcare and smart autonomous systems"
        ]
      }
    ]
  }
};
