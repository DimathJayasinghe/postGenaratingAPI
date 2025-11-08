# 🎯 POST GENERATOR PROJECT - COMPLETE PACKAGE

## What You Got

A complete post generation system that:
- ✅ Takes sport name and faculty array from your server
- ✅ Replaces faculty names on template by array index
- ✅ Adds sport name above the faculty list
- ✅ Generates professional PNG posts
- ✅ Saves locally in generated/ folder
- ✅ Sends to server for client distribution

## 📦 Files Included

### Core Files (Use These)
1. **postgenerator_advanced.js** (9.6KB)
   - Main generator with image processing
   - Uses Sharp library for high-quality output
   - **THIS IS YOUR MAIN FILE**

2. **server.js** (5.7KB)
   - Example server to receive generated posts
   - Includes all API endpoints
   - Ready to integrate with your backend

3. **package.json** (514B)
   - All required dependencies
   - Run `npm install` to set up

### Configuration & Examples
4. **config.template.js** (3.3KB)
   - Configuration guide
   - Shows how to find correct positions
   - Template layout examples

5. **example_usage.js** (3.0KB)
   - 4 different usage examples
   - Shows all features
   - Run with `npm test`

6. **complete_integration.js** (3.9KB)
   - Full workflow demonstration
   - Shows step-by-step process

### Documentation
7. **README.md** (6.1KB)
   - Complete documentation
   - API reference
   - Troubleshooting guide

8. **QUICKSTART.md** (2.5KB)
   - 5-minute setup guide
   - Quick examples
   - Common issues

9. **WORKFLOW_SUMMARY.md** (12KB)
   - Visual workflow diagrams
   - Code integration examples
   - Template layout guide

### Alternative Version
10. **postgenerator.js** (5.7KB)
    - Basic version without image processing
    - Use advanced version instead

## 🚀 Quick Setup

### 1. Install Dependencies
```bash
npm install
```

This installs:
- `axios` - Server communication
- `sharp` - Image processing
- `form-data` - File uploads

### 2. Create Folders
```bash
mkdir templates
mkdir generated
```

### 3. Add Your Template
Place your template image at: `templates/post_template.png`

### 4. Configure Positions
Open `postgenerator_advanced.js` and adjust positions to match your template:

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

## 💻 Usage

### Method 1: In Your Server

```javascript
const PostGenerator = require('./postgenerator_advanced');

const generator = new PostGenerator('http://localhost:3000');

// When you receive data
app.post('/api/generate', async (req, res) => {
  const { sport, faculties } = req.body;
  
  const result = await generator.generatePost(sport, faculties);
  res.json(result);
});
```

### Method 2: Command Line

```bash
node postgenerator_advanced.js "Football" "Engineering" "Medical" "Arts"
```

### Method 3: Direct Call

```javascript
const PostGenerator = require('./postgenerator_advanced');
const generator = new PostGenerator('http://localhost:3000');

await generator.generatePost('Football', [
  'Engineering Faculty',
  'Medical Faculty',
  'Arts Faculty'
]);
```

## 📊 What Happens

```
Input: 
  sport = "Football"
  faculties = ["Engineering", "Medical", "Arts"]

Process:
  1. Read template from templates/post_template.png
  2. Add "Football" at position (250, 50)
  3. Add "Engineering" at position (150, 340) [array index 0]
  4. Add "Medical" at position (150, 420) [array index 1]
  5. Add "Arts" at position (150, 500) [array index 2]
  6. Save to generated/Football_[timestamp].png
  7. Send to http://localhost:3000/api/posts/upload

Output:
  ✓ generated/Football_1234567890.png
  ✓ generated/Football_1234567890_metadata.json
  ✓ Server receives post and can distribute to clients
```

## 🎨 Template Structure

Your template (based on the image you provided) should have:

```
┌───────────────────────────────────┐
│        [Sport Name]               │ ← 250, 50
│                                   │
│  ┌─────────────────────────────┐  │
│  │ 1 [Faculty 1 Name]          │  │ ← 150, 340
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ 2 [Faculty 2 Name]          │  │ ← 150, 420
│  └─────────────────────────────┘  │
│                                   │
│  ┌─────────────────────────────┐  │
│  │ 3 [Faculty 3 Name]          │  │ ← 150, 500
│  └─────────────────────────────┘  │
└───────────────────────────────────┘
```

## 🔧 Server Integration

### Receiving Posts (server.js included)

```javascript
app.post('/api/posts/upload', upload.single('post'), (req, res) => {
  const { sport, faculties } = req.body;
  const file = req.file;
  
  // Save to database
  // Broadcast to clients
  // Send notifications
  
  res.json({ success: true, post: { ... } });
});
```

### API Endpoints

The included server provides:
- `POST /api/posts/upload` - Receive generated posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get specific post
- `GET /api/posts/sport/:sport` - Get posts by sport
- `DELETE /api/posts/:id` - Delete post

## 📁 Folder Structure

```
your-project/
├── postgenerator_advanced.js  ← Main file
├── server.js                  ← Example server
├── package.json              ← Dependencies
├── example_usage.js          ← Examples
├── complete_integration.js   ← Full demo
├── config.template.js        ← Config guide
├── README.md                 ← Full docs
├── QUICKSTART.md            ← Quick guide
├── WORKFLOW_SUMMARY.md      ← Visual guide
├── templates/               ← Add your template here
│   └── post_template.png
└── generated/               ← Generated posts (auto-created)
    ├── Football_1234567890.png
    └── Football_1234567890_metadata.json
```

## ✨ Features

- **Array Index Mapping**: faculties[0] goes to position 1, faculties[1] to position 2, etc.
- **Sport Name Above**: Automatically positioned at the top
- **Local Backup**: All posts saved in generated/ folder
- **Metadata**: JSON file with generation details
- **Server Upload**: Automatic POST to your server
- **Batch Processing**: Generate multiple posts at once
- **Error Handling**: Comprehensive error messages
- **Customizable**: All positions, colors, fonts configurable

## 🎯 Next Steps

1. **Read QUICKSTART.md** for 5-minute setup
2. **Run example_usage.js** to see it in action
3. **Adjust config** to match your template positions
4. **Integrate into your server** using the examples
5. **Generate your first post!**

## 📚 Documentation

- **Quick Setup**: Read QUICKSTART.md
- **Full Details**: Read README.md
- **Visual Guide**: Read WORKFLOW_SUMMARY.md
- **Code Examples**: Run example_usage.js
- **Configuration**: Check config.template.js

## 🆘 Support

If you encounter issues:
1. Check QUICKSTART.md troubleshooting section
2. Review README.md for detailed explanations
3. Run example_usage.js to test setup
4. Check console logs for error messages

## 🎉 You're Ready!

Everything is set up and ready to use. Your post generator will:
1. ✅ Take sport and faculty array from server
2. ✅ Replace template with actual names by array index
3. ✅ Add sport name at the top
4. ✅ Generate professional PNG posts
5. ✅ Save locally for backup
6. ✅ Send to server for distribution

Just run `npm install` and you're good to go! 🚀
