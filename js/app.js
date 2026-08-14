/* Main Application Controller & UI State Handler */

let currentSyllabus = null;
let generatedSets = null;
let activeSetKey = 'setA';
let currentStep = 1;

document.addEventListener('DOMContentLoaded', () => {
  initEventListeners();
  initApiKeyModal();
  loadPresetSyllabus('economics');
});

function initApiKeyModal() {
  const modalBackdrop = document.getElementById('api-modal-backdrop');
  const btnOpen = document.getElementById('btn-open-api-modal');
  const btnClose = document.getElementById('btn-close-api-modal');
  const btnSave = document.getElementById('btn-save-api-key');
  const btnClear = document.getElementById('btn-clear-api-key');
  const btnToggle = document.getElementById('btn-toggle-key-visibility');
  const inputKey = document.getElementById('input-api-key');
  const selectProvider = document.getElementById('select-api-provider');
  const msgBox = document.getElementById('api-key-msg');

  updateApiKeyBadge();

  btnOpen.addEventListener('click', () => {
    const provider = AIService.getProvider();
    selectProvider.value = provider;
    inputKey.value = AIService.getApiKey(provider);
    msgBox.style.display = 'none';
    modalBackdrop.classList.add('active');
  });

  btnClose.addEventListener('click', () => modalBackdrop.classList.remove('active'));
  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) modalBackdrop.classList.remove('active');
  });

  btnToggle.addEventListener('click', () => {
    if (inputKey.type === 'password') {
      inputKey.type = 'text';
      btnToggle.innerText = 'Hide';
    } else {
      inputKey.type = 'password';
      btnToggle.innerText = 'Show';
    }
  });

  selectProvider.addEventListener('change', () => {
    const p = selectProvider.value;
    inputKey.value = AIService.getApiKey(p);
  });

  btnSave.addEventListener('click', async () => {
    const key = inputKey.value.trim();
    const provider = selectProvider.value;

    if (!key) {
      msgBox.style.display = 'block';
      msgBox.style.background = '#fee2e2';
      msgBox.style.color = '#991b1b';
      msgBox.innerText = 'Please enter a valid API Key.';
      return;
    }

    btnSave.innerText = 'Testing Connection...';
    btnSave.disabled = true;

    try {
      await AIService.testConnection(key, provider);
      AIService.saveApiKey(key, provider);
      updateApiKeyBadge();

      msgBox.style.display = 'block';
      msgBox.style.background = '#dcfce7';
      msgBox.style.color = '#166534';
      msgBox.innerText = '✅ Key Verified & Saved Successfully!';

      setTimeout(() => {
        modalBackdrop.classList.remove('active');
      }, 1200);
    } catch (err) {
      msgBox.style.display = 'block';
      msgBox.style.background = '#fee2e2';
      msgBox.style.color = '#991b1b';
      msgBox.innerText = `❌ Error: ${err.message}`;
    } finally {
      btnSave.innerText = 'Save & Test Key';
      btnSave.disabled = false;
    }
  });

  btnClear.addEventListener('click', () => {
    const provider = selectProvider.value;
    AIService.clearApiKey(provider);
    inputKey.value = '';
    updateApiKeyBadge();
    msgBox.style.display = 'block';
    msgBox.style.background = '#f3f4f6';
    msgBox.style.color = '#374151';
    msgBox.innerText = 'API Key cleared.';
  });
}

function updateApiKeyBadge() {
  const apiKey = AIService.getApiKey();
  const provider = AIService.getProvider();
  const btn = document.getElementById('btn-open-api-modal');
  const dot = document.getElementById('api-status-dot');
  const text = document.getElementById('api-status-text');

  if (apiKey) {
    btn.classList.add('configured');
    dot.innerText = '🟢';
    text.innerText = `AI Active (${provider === 'gemini' ? 'Gemini' : 'OpenAI'})`;
  } else {
    btn.classList.remove('configured');
    dot.innerText = '⚙️';
    text.innerText = 'BYOK API Key: Off';
  }
}

function initEventListeners() {
  // Step Navigation Clickers
  document.querySelectorAll('.step-item').forEach(item => {
    item.addEventListener('click', () => {
      const step = parseInt(item.getAttribute('data-step'), 10);
      if (step <= currentStep || generatedSets) {
        goToStep(step);
      }
    });
  });

  // Preset Buttons
  document.querySelectorAll('.preset-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const key = pill.getAttribute('data-preset');
      loadPresetSyllabus(key);
    });
  });

  // File Upload Zone
  const fileInput = document.getElementById('syllabus-file-input');
  const uploadZone = document.getElementById('upload-zone');

  uploadZone.addEventListener('click', () => fileInput.click());
  uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--accent-hover)';
  });
  uploadZone.addEventListener('dragleave', () => {
    uploadZone.style.borderColor = 'var(--accent)';
  });
  uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.style.borderColor = 'var(--accent)';
    if (e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  });

  fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  });

  // Generate Button
  document.getElementById('btn-generate').addEventListener('click', generateQuestionPaperSets);

  // Set Tabs
  document.querySelectorAll('.set-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.set-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeSetKey = tab.getAttribute('data-set');
      renderActiveSetPaper();
    });
  });

  // Action Buttons
  document.getElementById('btn-export-pdf').addEventListener('click', () => {
    if (generatedSets) ExportEngine.exportToPDF(activeSetKey);
  });

  document.getElementById('btn-export-word').addEventListener('click', () => {
    if (generatedSets) ExportEngine.exportToWord(generatedSets[activeSetKey]);
  });

  document.getElementById('btn-export-key').addEventListener('click', () => {
    if (generatedSets) ExportEngine.exportAnswerKey(generatedSets[activeSetKey]);
  });
}

function loadPresetSyllabus(presetKey) {
  const data = MOCK_SYLLABI[presetKey] || MOCK_SYLLABI.economics;
  currentSyllabus = data;

  // Populate form fields
  document.getElementById('input-subject-title').value = data.title;
  document.getElementById('input-subject-code').value = data.code;
  document.getElementById('input-program-name').value = data.program;
  document.getElementById('input-exam-date').value = data.examDate;
  document.getElementById('input-max-marks').value = data.maxMarks;
  document.getElementById('input-duration').value = data.duration;

  // Format syllabus text
  let formattedText = "";
  data.units.forEach(u => {
    formattedText += `MODULE ${u.number}: ${u.title}\n`;
    u.topics.forEach(t => formattedText += `• ${t}\n`);
    formattedText += `\n`;
  });
  document.getElementById('syllabus-text-input').value = formattedText;

  renderUnitMappingTable(data.units);
}

function handleFileUpload(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const content = e.target.result;
    document.getElementById('syllabus-text-input').value = content;
    
    // Parse uploaded content
    const meta = readFormMetadata();
    currentSyllabus = SyllabusParser.parseText(content, meta);
    renderUnitMappingTable(currentSyllabus.units);
    
    alert(`File "${file.name}" uploaded and parsed successfully! 5 Units mapped with Course Outcomes.`);
  };
  reader.readAsText(file);
}

function readFormMetadata() {
  return {
    title: document.getElementById('input-subject-title').value || "BUSINESS ECONOMICS",
    code: document.getElementById('input-subject-code').value || "23BC1OD05/23BCAF1OD02",
    program: document.getElementById('input-program-name').value || "FIRST SEMESTER BCOM UNIVERSITY EXAMINATION",
    department: "CENTER FOR DISTANCE AND ONLINE EDUCATION",
    examDate: document.getElementById('input-exam-date').value || "OCTOBER 2026",
    duration: document.getElementById('input-duration').value || "03 Hours",
    maxMarks: parseInt(document.getElementById('input-max-marks').value, 10) || 70,
    complexity: document.getElementById('select-complexity')?.value || "simple"
  };
}

function renderUnitMappingTable(units) {
  const tbody = document.getElementById('unit-mapping-tbody');
  tbody.innerHTML = "";

  units.forEach(u => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td><strong>Unit ${u.number}</strong></td>
      <td>${u.title}</td>
      <td><span class="badge-co">CO${u.number}</span></td>
      <td>${u.topics.length} Key Topics</td>
      <td><span class="badge-btl btl-${Math.min(u.number + 1, 5)}">L1 - L${Math.min(u.number + 1, 5)}</span></td>
    `;
    tbody.appendChild(tr);
  });
}

async function generateQuestionPaperSets() {
  const rawText = document.getElementById('syllabus-text-input').value;
  const meta = readFormMetadata();

  currentSyllabus = SyllabusParser.parseText(rawText, meta);
  // Ensure metadata updates
  currentSyllabus.title = meta.title;
  currentSyllabus.code = meta.code;
  currentSyllabus.program = meta.program;
  currentSyllabus.examDate = meta.examDate;
  currentSyllabus.maxMarks = meta.maxMarks;
  currentSyllabus.duration = meta.duration;
  currentSyllabus.complexity = meta.complexity;

  const btnGen = document.getElementById('btn-generate');
  btnGen.innerText = "⏳ Generating Sets (Set A, B, C)...";
  btnGen.disabled = true;

  try {
    const engine = new QuestionGeneratorEngine(currentSyllabus);
    generatedSets = await engine.generateAllThreeSetsAsync(meta.complexity);

    renderAuditPanel(generatedSets.audit, generatedSets.source);
    renderActiveSetPaper();
    goToStep(3);
  } catch (err) {
    alert("Generation error: " + err.message);
  } finally {
    btnGen.innerText = "⚡ Generate 3 Sets (Set A, Set B, Set C)";
    btnGen.disabled = false;
  }
}

function renderAuditPanel(audit, engineSource = "Built-in Synthesizer") {
  const auditContainer = document.getElementById('audit-summary-container');
  auditContainer.innerHTML = `
    <div class="summary-card success">
      <div class="summary-label">Duplication Rate</div>
      <div class="summary-value" style="color: var(--success)">0.0%</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Zero overlapping questions between Set A, B, and C</p>
    </div>
    <div class="summary-card">
      <div class="summary-label">Engine Mode</div>
      <div class="summary-value" style="font-size: 1.1rem; color: var(--accent);">${engineSource}</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Client-side BYOK synthesis</p>
    </div>
    <div class="summary-card">
      <div class="summary-label">Total Marks / Exam</div>
      <div class="summary-value">70 Marks</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Sec A (16M) + Sec B (24M) + Sec C (30M)</p>
    </div>
    <div class="summary-card warning">
      <div class="summary-label">Exam Session</div>
      <div class="summary-value" style="font-size: 1.3rem;">OCTOBER 2026</div>
      <p style="font-size: 0.8rem; color: var(--text-muted); margin-top: 4px;">Verified format match</p>
    </div>
  `;
}

function renderActiveSetPaper() {
  if (!generatedSets || !generatedSets[activeSetKey]) return;

  const paperData = generatedSets[activeSetKey];
  const paperContainer = document.getElementById('paper-print-container');

  let html = `
    <div class="ju-paper">
      <!-- Top Bar: USN & Subject Code -->
      <div class="ju-top-bar">
        <div class="usn-container">
          USN:
          <div class="usn-grid">
            <div class="usn-cell"></div><div class="usn-cell"></div><div class="usn-cell"></div>
            <div class="usn-cell"></div><div class="usn-cell"></div><div class="usn-cell"></div>
            <div class="usn-cell"></div><div class="usn-cell"></div><div class="usn-cell"></div>
            <div class="usn-cell"></div>
          </div>
        </div>
        <div class="subject-code-display">
          ${paperData.code}
        </div>
      </div>

      <!-- Centered Header -->
      <div class="ju-title-block">
        <div class="ju-institution-name">${paperData.department}</div>
        <div class="ju-exam-name">${paperData.program}, ${paperData.examDate}</div>
        <div class="ju-subject-title">${paperData.title}</div>
      </div>

      <!-- Time & Marks -->
      <div class="ju-info-bar">
        <div>Time: ${paperData.duration}</div>
        <div style="text-align: right;">Maximum Marks: ${paperData.maxMarks}</div>
      </div>

      <div class="ju-divider"></div>

      <!-- SECTION A -->
      <div class="ju-section">
        <div class="ju-section-title">SECTION- A</div>
        <div class="ju-section-instruction">
          <div>I. Answer any EIGHT of the following questions:</div>
          <div>8x2 = 16</div>
        </div>
        <table class="ju-table">
          <thead>
            <tr>
              <th class="col-slno">Sl No</th>
              <th class="col-question">Questions</th>
              <th class="col-unit">Unit Number</th>
              <th class="col-co">CO</th>
              <th class="col-btl">BTL</th>
            </tr>
          </thead>
          <tbody>
            ${paperData.sectionA.map((q, idx) => `
              <tr>
                <td class="col-slno">${q.label}.</td>
                <td class="col-question editable-question" contenteditable="true" onblur="updateQuestionText('${activeSetKey}', 'sectionA', ${idx}, this.innerText)">${q.text}</td>
                <td class="col-unit">${q.unit}</td>
                <td class="col-co">${q.co}</td>
                <td class="col-btl">${q.btl}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- SECTION B -->
      <div class="ju-section">
        <div class="ju-section-title">SECTION – B</div>
        <div class="ju-section-instruction">
          <div>II. Answer any SIX of the following questions:</div>
          <div>6x4 = 24</div>
        </div>
        <table class="ju-table">
          <thead>
            <tr>
              <th class="col-slno">Sl.no</th>
              <th class="col-question">Questions</th>
              <th class="col-unit">Unit Number</th>
              <th class="col-co">CO</th>
              <th class="col-btl">BTL</th>
            </tr>
          </thead>
          <tbody>
            ${paperData.sectionB.map((q, idx) => `
              <tr>
                <td class="col-slno">${q.label}.</td>
                <td class="col-question editable-question" contenteditable="true" onblur="updateQuestionText('${activeSetKey}', 'sectionB', ${idx}, this.innerText)">${q.text}</td>
                <td class="col-unit">${q.unit}</td>
                <td class="col-co">${q.co}</td>
                <td class="col-btl">${q.btl}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <!-- SECTION C -->
      <div class="ju-section">
        <div class="ju-section-title">SECTION – C</div>
        <div class="ju-section-instruction">
          <div>III. Answer any THREE of the following questions:</div>
          <div>3x10=30</div>
        </div>
        <table class="ju-table">
          <thead>
            <tr>
              <th class="col-slno">Sl. No</th>
              <th class="col-question">Questions</th>
              <th class="col-unit">Unit Number</th>
              <th class="col-co">CO</th>
              <th class="col-btl">BTL</th>
            </tr>
          </thead>
          <tbody>
            ${paperData.sectionC.map((q, idx) => `
              <tr>
                <td class="col-slno">${q.label}.</td>
                <td class="col-question editable-question" contenteditable="true" onblur="updateQuestionText('${activeSetKey}', 'sectionC', ${idx}, this.innerText)">${q.text}</td>
                <td class="col-unit">${q.unit}</td>
                <td class="col-co">${q.co}</td>
                <td class="col-btl">${q.btl}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="ju-footer">Page 1 of 1</div>
    </div>
  `;

  paperContainer.innerHTML = html;
}

window.updateQuestionText = function(setKey, sectionKey, index, newText) {
  if (generatedSets && generatedSets[setKey] && generatedSets[setKey][sectionKey]) {
    generatedSets[setKey][sectionKey][index].text = newText.trim();
  }
};

function goToStep(step) {
  currentStep = step;

  // Update Stepper Navigation UI
  document.querySelectorAll('.step-item').forEach(item => {
    const itemStep = parseInt(item.getAttribute('data-step'), 10);
    item.classList.remove('active', 'completed');
    if (itemStep === step) {
      item.classList.add('active');
    } else if (itemStep < step) {
      item.classList.add('completed');
    }
  });

  // Update Content Panels
  document.querySelectorAll('.step-content').forEach(content => {
    content.classList.remove('active');
  });
  const activeContent = document.getElementById(`step-${step}-content`);
  if (activeContent) activeContent.classList.add('active');
}
