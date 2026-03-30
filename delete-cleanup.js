const fs = require('fs');
const path = require('path');

const filesToDelete = [
  'SELLER_ASSIGNMENT.md',
  'SELLER_3D_INTEGRATION.md',
  'REFINEMENT_REPORT.md',
  'PAYMENT_VERIFICATION_GUIDE.md',
  'PAYMENT_SETUP_GUIDE.md',
  'PAYMENT_READY.md',
  'ORDER_FLOW_EXPLAINED.md',
  'IMPLEMENTATION_SUMMARY.md',
  'FRONTEND_CODE_ISSUES_REPORT.md',
  'CONSOLE_STATEMENTS_DETAILS.md',
  'CLEANUP_SUMMARY.md',
  'FINAL_FIX_SUMMARY.md',
  'DYNAMIC_MODEL_GENERATION.md',
  'ANALYSIS_SUMMARY.md',
  'copy-qr-now.bat',
  'copy-qr.bat',
  'copy-qr.js',
  'cleanup.js',
  'setup-payment-qr.bat',
  'run-seed.bat',
  'seed-now.bat',
  'start-dev.bat',
  'delete-files.bat',
  'delete-temp-files.bat',
  'do-cleanup.js',
  'clean.js',
  'FIXES_QUICK_REFERENCE.txt',
  'SELLER_FLOW_DIAGRAM.txt',
  'PAYMENT_COMPARISON.txt',
  'delete-files-batch.bat'
];

const cwd = process.cwd();

filesToDelete.forEach(file => {
  const filePath = path.join(cwd, file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✓ Deleted: ${file}`);
    }
  } catch (err) {
    console.log(`✗ Failed to delete ${file}: ${err.message}`);
  }
});

console.log('\n--- Directory Contents After Deletion ---');
const files = fs.readdirSync(cwd).sort();
files.forEach(f => {
  const stat = fs.statSync(path.join(cwd, f));
  console.log(stat.isDirectory() ? `📁 ${f}` : `📄 ${f}`);
});
