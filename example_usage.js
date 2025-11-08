const PostGenerator = require('./postgenerator_advanced');

// Initialize generator
const generator = new PostGenerator('http://localhost:3000', {
  // Custom configuration (optional)
  sportPosition: { x: 250, y: 50 },
  sportFontSize: 48,
  sportColor: '#000000',
  
  facultyPositions: [
    { x: 150, y: 340 },  // Position 1 (faculty[0])
    { x: 150, y: 420 },  // Position 2 (faculty[1])
    { x: 150, y: 500 }   // Position 3 (faculty[2])
  ],
  facultyFontSize: 32,
  facultyColor: '#FFFFFF'
});

// Example 1: Generate a single post
async function example1() {
  console.log('\n=== Example 1: Single Post ===');
  
  try {
    const result = await generator.generatePost(
      'Football',
      ['Engineering Faculty', 'Medical Faculty', 'Arts Faculty']
    );
    
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 2: Generate multiple posts
async function example2() {
  console.log('\n=== Example 2: Multiple Posts ===');
  
  const posts = [
    {
      sport: 'Football',
      faculties: ['Engineering', 'Medical', 'Arts']
    },
    {
      sport: 'Basketball',
      faculties: ['Science', 'Business', 'Law']
    },
    {
      sport: 'Cricket',
      faculties: ['Technology', 'Design', 'Management']
    }
  ];
  
  try {
    const results = await generator.generateMultiplePosts(posts);
    console.log('Results:', results);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 3: Custom positions for different template
async function example3() {
  console.log('\n=== Example 3: Custom Configuration ===');
  
  const customGenerator = new PostGenerator('http://localhost:3000', {
    sportPosition: { x: 300, y: 100 },
    sportFontSize: 52,
    sportColor: '#FF0000',
    
    facultyPositions: [
      { x: 200, y: 400 },
      { x: 200, y: 480 },
      { x: 200, y: 560 }
    ],
    facultyFontSize: 36,
    facultyColor: '#00FF00'
  });
  
  try {
    const result = await customGenerator.generatePost(
      'Swimming',
      ['Physical Education', 'Sports Science', 'Health Studies']
    );
    
    console.log('Result:', result);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Example 4: List all generated posts
async function example4() {
  console.log('\n=== Example 4: List Generated Posts ===');
  
  const posts = generator.getGeneratedPosts();
  console.log(`Found ${posts.length} generated posts:`);
  posts.forEach((post, index) => {
    console.log(`${index + 1}. ${post.filename} (${post.createdAt.toLocaleString()})`);
  });
}

// Run examples
async function runAllExamples() {
  await example1();
  await example2();
  await example3();
  await example4();
}

// Execute
if (require.main === module) {
  runAllExamples()
    .then(() => {
      console.log('\n✅ All examples completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Examples failed:', error);
      process.exit(1);
    });
}

module.exports = {
  example1,
  example2,
  example3,
  example4
};
