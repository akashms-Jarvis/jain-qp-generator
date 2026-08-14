/* AI Service Module - Integrates Google Gemini & OpenAI API for Client-Side BYOK */

class AIService {
  static STORAGE_KEY_GEMINI = 'ju_qp_gemini_api_key';
  static STORAGE_KEY_OPENAI = 'ju_qp_openai_api_key';
  static STORAGE_KEY_PROVIDER = 'ju_qp_selected_provider';

  static getProvider() {
    return localStorage.getItem(this.STORAGE_KEY_PROVIDER) || 'gemini';
  }

  static setProvider(provider) {
    localStorage.setItem(this.STORAGE_KEY_PROVIDER, provider);
  }

  static getApiKey(provider = null) {
    const activeProvider = provider || this.getProvider();
    if (activeProvider === 'openai') {
      return localStorage.getItem(this.STORAGE_KEY_OPENAI) || '';
    }
    return localStorage.getItem(this.STORAGE_KEY_GEMINI) || '';
  }

  static saveApiKey(key, provider = 'gemini') {
    if (provider === 'openai') {
      localStorage.setItem(this.STORAGE_KEY_OPENAI, key.trim());
    } else {
      localStorage.setItem(this.STORAGE_KEY_GEMINI, key.trim());
    }
    this.setProvider(provider);
  }

  static clearApiKey(provider = 'gemini') {
    if (provider === 'openai') {
      localStorage.removeItem(this.STORAGE_KEY_OPENAI);
    } else {
      localStorage.removeItem(this.STORAGE_KEY_GEMINI);
    }
  }

  /**
   * Test API key validity
   */
  static async testConnection(key, provider = 'gemini') {
    if (!key || key.trim() === '') {
      throw new Error("API Key cannot be empty");
    }

    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key.trim()}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "Hello! Respond with OK." }] }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Invalid Gemini API Key`);
      }
      return true;
    } else {
      // OpenAI Test
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${key.trim()}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: "Hi" }],
          max_tokens: 5
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error?.message || `HTTP ${response.status}: Invalid OpenAI API Key`);
      }
      return true;
    }
  }

  /**
   * Synthesize 3 Non-Repeating Question Paper Sets (Set A, B, C) via LLM
   */
  static async generateSetsWithAI(syllabus, complexity = 'simple') {
    const provider = this.getProvider();
    const apiKey = this.getApiKey(provider);

    if (!apiKey) {
      throw new Error("No API key found. Please configure your API key in Settings.");
    }

    const systemPrompt = `You are an expert Jain University Examination Paper Setter.
Your task is to generate THREE DISTINCT, NON-OVERLAPPING Question Paper Sets (Set A, Set B, Set C) for Jain University based on the provided syllabus.

EXAM PAPER STRUCTURE SPECIFICATIONS:
- Subject: ${syllabus.title} (${syllabus.code})
- Exam Session: ${syllabus.examDate}
- Program: ${syllabus.program}
- Total Marks: 70 Marks, Time: 3 Hours
- Language & Tone: Clear, direct, simple-to-medium length standard university exam style.

SECTIONS REQUIRED FOR EACH SET (Set A, Set B, Set C):
1. SECTION A (Short Answer): 10 questions (a to j), 2 Marks each.
   - BTL: L1 (Remember) or L2 (Understand).
   - CO: 1 to 5 (2 questions per Unit 1-5).
2. SECTION B (Intermediate): 8 questions (a to h), 4 Marks each.
   - BTL: L3 (Apply) or L4 (Analyze).
   - CO: 1 to 5.
3. SECTION C (Comprehensive Essay): 5 questions (a to e), 10 Marks each.
   - BTL: L4 (Analyze) or L5 (Evaluate).
   - CO: 1 to 5 (1 question per Unit 1-5).

STRICT RULE: Questions across Set A, Set B, and Set C MUST BE 100% NON-REPEATING AND UNIQUE.

SYLLABUS CONTENT:
${JSON.stringify(syllabus.units, null, 2)}

OUTPUT FORMAT REQUIREMENTS:
Return ONLY a strictly valid JSON object with key "sets" containing "setA", "setB", and "setC". Each set must have arrays "sectionA", "sectionB", and "sectionC".
Question object structure:
{
  "label": "a",
  "text": "Question text here...",
  "unit": 1,
  "co": 1,
  "btl": 2,
  "marks": 2,
  "answerKey": "Key answer guidance string..."
}`;

    let jsonResponseText = "";

    if (provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: systemPrompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `Gemini API Error (HTTP ${response.status})`);
      }

      const data = await response.json();
      jsonResponseText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    } else {
      // OpenAI API call
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          response_format: { type: "json_object" },
          messages: [
            { role: "system", content: "You generate JSON examination papers for universities." },
            { role: "user", content: systemPrompt }
          ]
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error?.message || `OpenAI API Error (HTTP ${response.status})`);
      }

      const data = await response.json();
      jsonResponseText = data.choices?.[0]?.message?.content || "";
    }

    // Parse returned JSON
    const parsed = JSON.parse(jsonResponseText);
    const sets = parsed.sets || parsed;

    return this.formatAISets(sets, syllabus);
  }

  static formatAISets(parsedSets, syllabus) {
    const buildSet = (setObj, setName) => ({
      setName: setName,
      title: syllabus.title,
      code: syllabus.code,
      program: syllabus.program,
      department: syllabus.department,
      examDate: syllabus.examDate,
      duration: syllabus.duration,
      maxMarks: syllabus.maxMarks,
      sectionA: setObj.sectionA || [],
      sectionB: setObj.sectionB || [],
      sectionC: setObj.sectionC || [],
      totalQuestions: (setObj.sectionA?.length || 0) + (setObj.sectionB?.length || 0) + (setObj.sectionC?.length || 0)
    });

    return {
      setA: buildSet(parsedSets.setA || parsedSets.SetA || {}, "Set A"),
      setB: buildSet(parsedSets.setB || parsedSets.SetB || {}, "Set B"),
      setC: buildSet(parsedSets.setC || parsedSets.SetC || {}, "Set C")
    };
  }
}
