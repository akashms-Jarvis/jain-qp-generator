/* Syllabus Ingestion & Intelligent Structure Parsing Engine */

class SyllabusParser {
  /**
   * Parse raw text input or unstructured syllabus content into structured units
   */
  static parseText(rawText, defaultMetadata = {}) {
    if (!rawText || typeof rawText !== 'string') {
      return this.createFallbackSyllabus(defaultMetadata);
    }

    const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const units = [];
    let currentUnit = null;

    const unitRegex = /^(unit|module|chapter|part)\s*([0-9ivx]+)[:\s-]*(.*)/i;
    const coRegex = /co[1-5]/i;

    lines.forEach((line) => {
      const match = line.match(unitRegex);
      if (match) {
        if (currentUnit) {
          units.push(currentUnit);
        }
        const unitNum = parseInt(match[2], 10) || (units.length + 1);
        currentUnit = {
          number: Math.min(Math.max(unitNum, 1), 5),
          title: match[3] || `Module ${unitNum}`,
          cos: [`CO${unitNum}`],
          topics: []
        };
      } else if (currentUnit) {
        // Strip bullet markers if present
        const cleaned = line.replace(/^[•\-\*\d\.\)]+\s*/, '').trim();
        if (cleaned.length > 3) {
          currentUnit.topics.push(cleaned);
        }
      }
    });

    if (currentUnit) {
      units.push(currentUnit);
    }

    // If no units were explicitly parsed using regex, split lines evenly into 5 Units
    if (units.length === 0) {
      return this.distributeIntoFiveUnits(lines, defaultMetadata);
    }

    // Ensure exactly 5 units exist for standard Jain University format
    while (units.length < 5) {
      const nextNum = units.length + 1;
      units.push({
        number: nextNum,
        title: `Module ${nextNum} Topics`,
        cos: [`CO${nextNum}`],
        topics: [
          `Fundamental concepts of Module ${nextNum}`,
          `Analytical applications of Module ${nextNum}`,
          `Case studies and problem solving in Module ${nextNum}`
        ]
      });
    }

    return {
      title: defaultMetadata.title || "UNIVERSITY EXAMINATION SUBJECT",
      code: defaultMetadata.code || "23BC1OD05/23BCAF1OD02",
      program: defaultMetadata.program || "FIRST SEMESTER BCOM UNIVERSITY EXAMINATION",
      department: defaultMetadata.department || "CENTER FOR DISTANCE AND ONLINE EDUCATION",
      examDate: defaultMetadata.examDate || "OCTOBER 2026",
      duration: defaultMetadata.duration || "03 Hours",
      maxMarks: defaultMetadata.maxMarks || 70,
      units: units.slice(0, 5)
    };
  }

  static distributeIntoFiveUnits(lines, metadata) {
    const chunkSize = Math.max(1, Math.ceil(lines.length / 5));
    const units = [];

    for (let i = 0; i < 5; i++) {
      const unitLines = lines.slice(i * chunkSize, (i + 1) * chunkSize);
      const title = unitLines[0] ? unitLines[0].replace(/^[•\-\*\d\.\)]+\s*/, '').substring(0, 50) : `Module ${i + 1}`;
      const topics = unitLines.length > 1 
        ? unitLines.slice(1).map(l => l.replace(/^[•\-\*\d\.\)]+\s*/, '')) 
        : [`Core principles of Unit ${i + 1}`, `Advanced mechanisms and applications of Unit ${i + 1}`];

      units.push({
        number: i + 1,
        title: title || `Module ${i + 1}`,
        cos: [`CO${i + 1}`],
        topics: topics.filter(t => t.length > 2)
      });
    }

    return {
      title: metadata.title || "BUSINESS ECONOMICS",
      code: metadata.code || "23BC1OD05/23BCAF1OD02",
      program: metadata.program || "FIRST SEMESTER BCOM UNIVERSITY EXAMINATION",
      department: metadata.department || "CENTER FOR DISTANCE AND ONLINE EDUCATION",
      examDate: metadata.examDate || "OCTOBER 2026",
      duration: metadata.duration || "03 Hours",
      maxMarks: metadata.maxMarks || 70,
      units: units
    };
  }

  static createFallbackSyllabus(metadata) {
    return MOCK_SYLLABI.economics;
  }
}
