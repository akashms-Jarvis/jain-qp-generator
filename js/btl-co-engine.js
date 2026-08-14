/* Bloom's Taxonomy Level (BTL) & Course Outcome (CO) Mapping Engine */

const BTL_TAXONOMY = {
  1: { level: "Remember", verbs: ["Define", "List", "Mention", "State", "Recall", "What is", "Identify", "Name", "Specify"] },
  2: { level: "Understand", verbs: ["Explain", "Describe", "Discuss", "Outline", "Summarize", "Classify", "Interpret", "Illustrate"] },
  3: { level: "Apply", verbs: ["Calculate", "Compute", "Solve", "Demonstrate", "Apply", "Execute", "Determine", "Implement"] },
  4: { level: "Analyze", verbs: ["Analyze", "Examine", "Compare and contrast", "Differentiate", "Investigate", "Distinguish", "Breakdown"] },
  5: { level: "Evaluate", verbs: ["Evaluate", "Assess", "Critique", "Validate", "Justify", "Appraise", "Review", "Argue"] },
  6: { level: "Create", verbs: ["Design", "Construct", "Formulate", "Develop", "Synthesize", "Propose", "Devise"] }
};

class BTLCOEngine {
  /**
   * Determine BTL level based on question text and mark allocation
   */
  static determineBTL(questionText, marks) {
    const text = questionText.toLowerCase();

    // Check explicit action verbs
    for (let level = 6; level >= 1; level--) {
      const verbs = BTL_TAXONOMY[level].verbs;
      for (let verb of verbs) {
        if (text.startsWith(verb.toLowerCase()) || text.includes(` ${verb.toLowerCase()} `)) {
          return level;
        }
      }
    }

    // Default fallbacks based on question marks
    if (marks <= 2) return Math.random() > 0.5 ? 1 : 2;
    if (marks <= 4) return Math.random() > 0.5 ? 3 : 4;
    return Math.random() > 0.5 ? 4 : 5;
  }

  /**
   * Generate appropriate Jain University question prefix verb for a target BTL level
   */
  static getVerbForBTL(targetBTL) {
    const verbs = BTL_TAXONOMY[targetBTL] ? BTL_TAXONOMY[targetBTL].verbs : BTL_TAXONOMY[1].verbs;
    return verbs[Math.floor(Math.random() * verbs.length)];
  }

  /**
   * Get BTL Descriptor string (e.g., "L1 - Remember")
   */
  static getBTLDescriptor(level) {
    const info = BTL_TAXONOMY[level];
    return info ? `L${level} - ${info.level}` : `L${level}`;
  }

  /**
   * Audit BTL and CO distribution across a question paper set
   */
  static auditSet(questions) {
    const btlCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 };
    const coCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const unitCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    questions.forEach(q => {
      if (q.btl && btlCounts[q.btl] !== undefined) btlCounts[q.btl]++;
      if (q.co && coCounts[q.co] !== undefined) coCounts[q.co]++;
      if (q.unit && unitCounts[q.unit] !== undefined) unitCounts[q.unit]++;
    });

    return {
      btlCounts,
      coCounts,
      unitCounts,
      totalQuestions: questions.length
    };
  }
}
