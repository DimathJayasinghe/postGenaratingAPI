# 🚀 QUICK START GUIDE

## Setup (5 minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Template Folder
```bash
mkdir templates
```

### 3. Add Your Template
- Place your template image as `templates/post_template.png`
- Template should have 3 areas for faculty names (see image you provided)

### 4. Start Server (Terminal 1)
```bash
node server.js
```
Server runs on: http://localhost:3000

### 5. Generate Post (Terminal 2)

#### Option A: Command Line
```bash
node postgenerator_advanced.js "Football" "Engineering" "Medical" "Arts"
```

#### Option B: Node Script
```javascript
const PostGenerator = require('./postgenerator_advanced');

const generator = new PostGenerator('http://localhost:3000');

await generator.generatePost('Football', [
  'Engineering Faculty',
  'Medical Faculty',
  'Arts Faculty'
]);
```

#### Option C: Test Example
```bash
npm test
```

## What Happens?

```
Input:
  sport: "Football"
  faculties: ["Engineering", "Medical", "Arts"]

Process:
  1. ✅ Read template image
  2. ✅ Add "Football" at top position
  3. ✅ Add "Engineering" at position 1
  4. ✅ Add "Medical" at position 2
  5. ✅ Add "Arts" at position 3
  6. ✅ Save to generated/Football_[timestamp].png
  7. ✅ Send to server at localhost:3000
  8. ✅ Server receives and can distribute to clients

Output:
  - generated/Football_1234567890.png
  - generated/Football_1234567890_metadata.json
```

## Customize Positions

Edit positions in your generator initialization:

```javascript
const generator = new PostGenerator('http://localhost:3000', {
  sportPosition: { x: 250, y: 50 },
  facultyPositions: [
    { x: 150, y: 340 },  // Faculty 1
    { x: 150, y: 420 },  // Faculty 2
    { x: 150, y: 500 }   // Faculty 3
  ]
});
```

## Files Included

- **postgenerator_advanced.js** - Main generator (USE THIS)
- **server.js** - Example server to receive posts
- **example_usage.js** - Usage examples
- **complete_integration.js** - Full workflow demo
- **config.template.js** - Configuration guide
- **README.md** - Full documentation

## Common Issues

### "Cannot find template"
```bash
mkdir templates
# Add your template as templates/post_template.png
```

### "Server connection failed"
```bash
# Make sure server is running
node server.js
```

### "Wrong positions"
- Open config.template.js
- Follow the guide to find correct coordinates
- Update positions in generator initialization

## Need Help?

Check README.md for detailed documentation!
