const express = require('express');
const cors = require('cors');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const cron = require('node-cron');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Set up storage for Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });

// Directories
const TESTS_DIR = path.join(__dirname, 'tests');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const REPORTS_DIR = path.join(__dirname, 'reports');
const SCHEDULE_FILE = path.join(__dirname, 'scheduled_tests.json');

[TESTS_DIR, UPLOADS_DIR, REPORTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Scheduling State
let activeSchedules = {};

const loadSchedules = () => {
  if (fs.existsSync(SCHEDULE_FILE)) {
    return JSON.parse(fs.readFileSync(SCHEDULE_FILE, 'utf8'));
  }
  return [];
};

const saveSchedules = (schedules) => {
  fs.writeFileSync(SCHEDULE_FILE, JSON.stringify(schedules, null, 2));
};

// Helper to get tests
const getTests = () => {
  const testsFile = path.join(__dirname, 'tests.json');
  if (fs.existsSync(testsFile)) {
    return JSON.parse(fs.readFileSync(testsFile, 'utf8'));
  }
  return [];
};

const saveTests = (tests) => {
  const testsFile = path.join(__dirname, 'tests.json');
  fs.writeFileSync(testsFile, JSON.stringify(tests, null, 2));
};

// API: Get all tests
app.get('/api/tests', (req, res) => {
  res.json(getTests());
});

// API: Record a new test
app.post('/api/record', (req, res) => {
  const { url, testName } = req.body;
  if (!url || !testName) {
    return res.status(400).json({ error: 'URL and testName are required' });
  }

  const testId = Date.now().toString();
  const scriptPath = path.join(TESTS_DIR, `${testId}.spec.js`);

  // We spawn Playwright Codegen
  // Note: For Windows, we might need shell: true
  const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  const child = spawn(npxCommand, ['playwright', 'codegen', url, '-o', scriptPath], {
    stdio: 'inherit',
    shell: true
  });

  child.on('close', (code) => {
    if (code === 0 && fs.existsSync(scriptPath)) {
      // Analyze script for fill/click inputs to parse parameters (Basic attempt)
      const scriptContent = fs.readFileSync(scriptPath, 'utf8');
      
      const tests = getTests();
      tests.push({
        id: testId,
        name: testName,
        url: url,
        createdAt: new Date().toISOString()
      });
      saveTests(tests);
    }
  });

  res.json({ message: 'Recording started. Please interact with the browser and close it when done.', testId });
});

// API: Get Test Script Details
app.get('/api/tests/:id', (req, res) => {
  const { id } = req.params;
  const scriptPath = path.join(TESTS_DIR, `${id}.spec.js`);
  
  if (!fs.existsSync(scriptPath)) {
    return res.status(404).json({ error: 'Test script not found' });
  }

  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  
  // Extract potential inputs (simple regex for fill values)
  const fillRegex = /await page\.getBy.*\.fill\('(.*)'\);/g;
  const inputs = [];
  let match;
  let lineNum = 1;

  const lines = scriptContent.split('\n');
  lines.forEach((line, index) => {
    if (line.includes('.fill(')) {
      // Very basic extraction for UI presentation
      inputs.push({
        line: index + 1,
        code: line.trim()
      });
    }
  });

  res.json({
    script: scriptContent,
    inputs: inputs
  });
});

// API: Delete a test
app.delete('/api/tests/:id', (req, res) => {
  const { id } = req.params;
  console.log(`DELETE request received for test ID: ${id}`);
  const scriptPath = path.join(TESTS_DIR, `${id}.spec.js`);
  
  try {
    // 1. Remove from tests.json
    let tests = getTests();
    const testExists = tests.some(t => t.id === id);
    
    if (!testExists) {
      return res.status(404).json({ error: 'Test not found' });
    }

    tests = tests.filter(t => t.id !== id);
    saveTests(tests);

    // 2. Delete script file
    if (fs.existsSync(scriptPath)) {
      fs.unlinkSync(scriptPath);
    }

    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    console.error('Error deleting test:', error);
    res.status(500).json({ error: 'Failed to delete test' });
  }
});

// API: Download Excel Template
app.get('/api/tests/:id/template', (req, res) => {
  const { id } = req.params;
  const scriptPath = path.join(TESTS_DIR, `${id}.spec.js`);
  
  if (!fs.existsSync(scriptPath)) {
    return res.status(404).json({ error: 'Test script not found' });
  }

  const scriptContent = fs.readFileSync(scriptPath, 'utf8');
  const lines = scriptContent.split('\n');
  const columns = [];
  const initialData = [];
  
  lines.forEach((line, index) => {
    if (line.includes('.fill(')) {
      let colName = 'Input_' + (index + 1);
      
      const nameMatch = line.match(/(?:getByPlaceholder|getByLabel|getByRole|locator)\([^{]*?(?:name:\s*['"](.*?)['"]|['"](.*?)['"])/);
      if (nameMatch) {
        let extracted = nameMatch[1] || nameMatch[2];
        if (extracted) {
          colName = extracted.replace(/[^a-zA-Z0-9_ ]/g, '').trim() || colName;
        }
      }
      columns.push(colName);

      let val = '';
      const fillMatch = line.match(/\.fill\(['"](.*?)['"]\)/);
      if (fillMatch && fillMatch[1]) {
        val = fillMatch[1];
      }
      initialData.push(val);
    }
  });

  if (columns.length === 0) {
    columns.push('SampleColumn1');
    initialData.push('SampleData1');
  }

  const wsData = [columns, initialData];
  const ws = xlsx.utils.aoa_to_sheet(wsData);
  const wb = xlsx.utils.book_new();
  xlsx.utils.book_append_sheet(wb, ws, "Template");
  
  const buffer = xlsx.write(wb, { type: 'buffer', bookType: 'xlsx' });
  
  res.setHeader('Content-Disposition', 'attachment; filename=template_' + id + '.xlsx');
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buffer);
});

// API: Upload Excel Data
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    // Extract column headers
    const columns = data.length > 0 ? Object.keys(data[0]) : [];
    
    res.json({
      filePath: req.file.filename,
      columns,
      rowCount: data.length,
      sampleData: data.slice(0, 3)
    });
  } catch (error) {
    console.error('Error parsing excel:', error);
    res.status(500).json({ error: 'Failed to parse Excel file' });
  }
});



// Function to handle the actual test execution (refactored for reuse)
async function executeTest(runConfig) {
  const { testIds, dataFile, parameterMapping, loopCount = 1 } = runConfig;
  
  const scriptsToRun = [];
  for (const id of testIds) {
    const scriptPath = path.join(TESTS_DIR, `${id}.spec.js`);
    if (fs.existsSync(scriptPath)) {
      scriptsToRun.push({
        id: id,
        content: fs.readFileSync(scriptPath, 'utf8')
      });
    }
  }

  if (scriptsToRun.length === 0) return;

  let testData = [{}];
  if (dataFile) {
    const filePath = path.join(UPLOADS_DIR, dataFile);
    if (fs.existsSync(filePath)) {
       const workbook = xlsx.readFile(filePath);
       testData = xlsx.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);
    }
  }

  const runId = Date.now().toString();
  const runDir = path.join(REPORTS_DIR, runId);
  fs.mkdirSync(runDir, { recursive: true });

  const executorScriptPath = path.join(runDir, 'executor.js');
  
  let runBlocks = [];
  for (const script of scriptsToRun) {
    runBlocks.push(`
        console.log('Running test ${script.id}');
        try {
          ${generateInjectedScript(script.content, parameterMapping)}
        } catch(err) {
          status = 'failed';
          errorMsg = err.message;
          if (!page.isClosed()) {
            try { await page.screenshot({ path: 'screenshot-' + globalIteration + '.png' }); } catch(e) {}
          }
        }
    `);
  }

  let executorCode = `
const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const testData = ${JSON.stringify(testData)};
  const loopCount = ${Number(loopCount)};
  const results = [];
  let browser;

  try {
    browser = await chromium.launch({ headless: false, slowMo: 500 }); 
    let globalIteration = 1;

    for (let loop = 1; loop <= loopCount; loop++) {
      for (let i = 0; i < testData.length; i++) {
        const rowData = testData[i];
        const context = await browser.newContext();
        const page = await context.newPage();
        let status = 'passed';
        let errorMsg = null;
        
        console.log('Running loop ' + loop + ', iteration ' + (i + 1));
        
        ${runBlocks.join('\n')}

        results.push({ 
          iteration: globalIteration, 
          loop: loop,
          dataRow: i + 1,
          data: rowData, 
          status, 
          error: errorMsg 
        });
        
        try { await context.close(); } catch(e) {}
        globalIteration++;
      }
    }
  } catch (err) {
    console.error('Executor error:', err);
  } finally {
    if (browser) await browser.close().catch(() => {});
    fs.writeFileSync('results.json', JSON.stringify(results, null, 2));
  }
})();
  `;

  fs.writeFileSync(executorScriptPath, executorCode);

  const nodeCmd = process.platform === 'win32' ? 'node.exe' : 'node';
  const child = spawn(nodeCmd, [executorScriptPath], {
    cwd: runDir,
    stdio: 'inherit'
  });

  return new Promise((resolve) => {
    child.on('close', (code) => {
      console.log('Run completed with code', code);
      resolve(runId);
    });
  });
}

// API: Schedule or Run Test
app.post('/api/run', async (req, res) => {
  console.log('Incoming run request:', JSON.stringify(req.body, null, 2));
  const { testId, testIds, dataFile, parameterMapping, loopCount = 1, scheduling } = req.body;
  const idsToRun = testIds || (testId ? [testId] : []);

  if (scheduling && scheduling.enabled) {
    const scheduledTime = new Date(scheduling.time);
    if (isNaN(scheduledTime.getTime())) {
      return res.status(400).json({ error: 'Invalid scheduled time' });
    }

    const scheduleId = Date.now().toString();
    const cronTime = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;
    
    console.log(`Scheduling test for: ${scheduledTime.toLocaleString()} (Cron: ${cronTime})`);

    const task = cron.schedule(cronTime, async () => {
      console.log(`Executing scheduled task: ${scheduleId}`);
      await executeTest({ testIds: idsToRun, dataFile, parameterMapping, loopCount });
      
      // Cleanup after run
      let schedules = loadSchedules();
      schedules = schedules.filter(s => s.id !== scheduleId);
      saveSchedules(schedules);
      if (activeSchedules[scheduleId]) {
        activeSchedules[scheduleId].stop();
        delete activeSchedules[scheduleId];
      }
    });

    activeSchedules[scheduleId] = task;
    
    // Persist
    const schedules = loadSchedules();
    schedules.push({ id: scheduleId, config: { testIds: idsToRun, dataFile, parameterMapping, loopCount, scheduling } });
    saveSchedules(schedules);

    return res.json({ message: 'Test scheduled successfully', scheduleId });
  }

  // Immediate run
  const runId = await executeTest({ testIds: idsToRun, dataFile, parameterMapping, loopCount });
  res.json({ message: 'Test execution started', runId });
});

// Startup logic: Reload schedules
const initializeSchedules = () => {
  const schedules = loadSchedules();
  const now = new Date();
  
  schedules.forEach(s => {
    const scheduledTime = new Date(s.config.scheduling.time);
    if (scheduledTime > now) {
      const cronTime = `${scheduledTime.getMinutes()} ${scheduledTime.getHours()} ${scheduledTime.getDate()} ${scheduledTime.getMonth() + 1} *`;
      const task = cron.schedule(cronTime, async () => {
        await executeTest(s.config);
        // Cleanup... (simplified for brevity)
      });
      activeSchedules[s.id] = task;
    }
  });
};
initializeSchedules();

function generateInjectedScript(scriptContent, mapping) {
  // Strip import statement and "test('test', async ({ page }) => {"
  // Keep only the inside content
  let lines = scriptContent.split('\n');
  let insideTest = false;
  let executableLines = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.includes("test('test', async ({ page }) => {")) {
      insideTest = true;
      continue;
    }
    if (insideTest && line.trim() === '});') {
      insideTest = false;
      continue;
    }
    if (insideTest) {
      // If this line has a mapping, replace the string literal with rowData access
      if (mapping && mapping[i + 1]) {
        const column = mapping[i + 1];
        // Match .fill('value')
        // We will do a generic replacement: find the last '...' or "..." inside parenthesis
        // This is a naive regex replacement for demonstration.
        line = line.replace(/\.fill\(['"](.*)['"]\)/, '.fill(String(rowData["' + column + '"]) || "")');
      }
      executableLines.push(line);
    }
  }
  
  return executableLines.join('\n');
}

app.get('/api/reports', (req, res) => {
  const dirs = fs.readdirSync(REPORTS_DIR);
  const reports = dirs.map(dir => {
    const resultFile = path.join(REPORTS_DIR, dir, 'results.json');
    if (fs.existsSync(resultFile)) {
      return {
        runId: dir,
        results: JSON.parse(fs.readFileSync(resultFile, 'utf8'))
      };
    }
    return { runId: dir, status: 'running' };
  });
  res.json(reports);
});

app.listen(PORT, () => {
  console.log("Backend running on http://localhost:" + PORT);
});
