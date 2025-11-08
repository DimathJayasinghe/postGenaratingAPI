/**
 * Complete Integration Example
 * Shows the full workflow from server receiving data to post generation
 */

const PostGenerator = require('./postgenerator_advanced');

// Server receives this data
const serverData = {
  sport: 'Football',
  faculties: ['Engineering Faculty', 'Medical Faculty', 'Arts Faculty']
};

console.log('\n╔════════════════════════════════════════════════════════╗');
console.log('║         POST GENERATOR - COMPLETE WORKFLOW            ║');
console.log('╚════════════════════════════════════════════════════════╝\n');

async function completeWorkflow() {
  try {
    // Step 1: Server receives data
    console.log('📥 STEP 1: Server receives data');
    console.log('   Sport:', serverData.sport);
    console.log('   Faculties:', serverData.faculties);
    console.log('');

    // Step 2: Initialize Post Generator
    console.log('⚙️  STEP 2: Initialize Post Generator');
    const generator = new PostGenerator('http://localhost:3000', {
      sportPosition: { x: 250, y: 50 },
      sportFontSize: 48,
      sportColor: '#000000',
      facultyPositions: [
        { x: 150, y: 340 },  // faculty[0]
        { x: 150, y: 420 },  // faculty[1]
        { x: 150, y: 500 }   // faculty[2]
      ],
      facultyFontSize: 32,
      facultyColor: '#FFFFFF'
    });
    console.log('   ✓ Generator initialized');
    console.log('');

    // Step 3: Generate post
    console.log('🎨 STEP 3: Generate post from template');
    console.log('   Processing...');
    
    const result = await generator.generatePost(
      serverData.sport,
      serverData.faculties
    );
    
    console.log('   ✓ Post generated successfully!');
    console.log('');

    // Step 4: Display results
    console.log('📊 STEP 4: Results');
    console.log('   Filename:', result.filename);
    console.log('   Location:', result.filepath);
    console.log('   Sport:', result.sport);
    console.log('   Faculties:');
    result.faculties.forEach((faculty, index) => {
      console.log(`      ${index + 1}. ${faculty}`);
    });
    console.log('');

    // Step 5: Server handling
    console.log('🌐 STEP 5: Server handling');
    console.log('   ✓ Post saved locally in generated/ folder');
    console.log('   ✓ Post sent to server at', 'http://localhost:3000/api/posts/upload');
    console.log('   ✓ Server can now distribute to clients');
    console.log('');

    // Summary
    console.log('╔════════════════════════════════════════════════════════╗');
    console.log('║                   WORKFLOW COMPLETE                   ║');
    console.log('╚════════════════════════════════════════════════════════╝\n');
    
    console.log('✅ The post has been:');
    console.log('   1. Generated with sport name at top');
    console.log('   2. Faculty names placed at positions 1, 2, 3');
    console.log('   3. Saved locally for backup');
    console.log('   4. Sent to server for distribution');
    console.log('');

    return result;

  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    throw error;
  }
}

// Run the complete workflow
if (require.main === module) {
  completeWorkflow()
    .then(() => {
      console.log('🎉 Process completed successfully!\n');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Process failed:', error.message, '\n');
      process.exit(1);
    });
}

module.exports = completeWorkflow;
