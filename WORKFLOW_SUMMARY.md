# 📋 POST GENERATOR - WORKFLOW SUMMARY

## Overview

Your server receives sport name and faculty array, generates a post with names overlaid on template, saves locally, and sends to server for client distribution.

## Input Format

```javascript
{
  sport: "Football",
  faculties: ["Engineering Faculty", "Medical Faculty", "Arts Faculty"]
}
```

## Process Flow

```
┌─────────────────────────────────────────────────────────────┐
│ STEP 1: Server Receives Data                               │
│ ─────────────────────────────────────────────────────────── │
│ sport: "Football"                                           │
│ faculties: ["Engineering", "Medical", "Arts"]               │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 2: Initialize Post Generator                          │
│ ─────────────────────────────────────────────────────────── │
│ const generator = new PostGenerator('http://localhost:3000')│
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 3: Load Template                                      │
│ ─────────────────────────────────────────────────────────── │
│ Read: templates/post_template.png                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 4: Create Text Overlays                               │
│ ─────────────────────────────────────────────────────────── │
│ Sport Name → Position (250, 50)                            │
│ faculties[0] → Position (150, 340)                         │
│ faculties[1] → Position (150, 420)                         │
│ faculties[2] → Position (150, 500)                         │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 5: Generate Final Image                               │
│ ─────────────────────────────────────────────────────────── │
│ Composite all overlays onto template using Sharp           │
│ Output: PNG buffer                                          │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 6: Save Locally                                       │
│ ─────────────────────────────────────────────────────────── │
│ File: generated/Football_1234567890.png                    │
│ Metadata: generated/Football_1234567890_metadata.json      │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 7: Send to Server                                     │
│ ─────────────────────────────────────────────────────────── │
│ POST http://localhost:3000/api/posts/upload                │
│ FormData: { post, sport, faculties, metadata }             │
└─────────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────────┐
│ STEP 8: Server Distributes to Clients                      │
│ ─────────────────────────────────────────────────────────── │
│ Save to database                                            │
│ Broadcast via WebSocket/Socket.io                          │
│ Send notifications                                          │
└─────────────────────────────────────────────────────────────┘
```

## Template Layout

Based on your provided image, the template has this structure:

```
┌───────────────────────────────────────────────┐
│                                               │
│            FOOTBALL                           │  ← Sport name (250, 50)
│         (Sport Name)                          │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  1  Engineering Faculty              │    │  ← faculties[0] at (150, 340)
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  2  Medical Faculty                  │    │  ← faculties[1] at (150, 420)
│  └──────────────────────────────────────┘    │
│                                               │
│  ┌──────────────────────────────────────┐    │
│  │  3  Arts Faculty                     │    │  ← faculties[2] at (150, 500)
│  └──────────────────────────────────────┘    │
│                                               │
└───────────────────────────────────────────────┘
```

## Code Integration

### In Your Server

```javascript
const PostGenerator = require('./postgenerator_advanced');

// Initialize once
const generator = new PostGenerator('http://localhost:3000');

// When you receive data
app.post('/api/generate', async (req, res) => {
  const { sport, faculties } = req.body;
  
  try {
    const result = await generator.generatePost(sport, faculties);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Direct Usage

```javascript
// Generate single post
const result = await generator.generatePost('Football', [
  'Engineering Faculty',
  'Medical Faculty',
  'Arts Faculty'
]);

console.log('Post saved:', result.filepath);
console.log('Server response:', result.serverResponse);
```

### Batch Generation

```javascript
const posts = [
  { sport: 'Football', faculties: ['Engineering', 'Medical', 'Arts'] },
  { sport: 'Basketball', faculties: ['Science', 'Business', 'Law'] },
  { sport: 'Cricket', faculties: ['Tech', 'Design', 'Management'] }
];

const results = await generator.generateMultiplePosts(posts);
console.log(`Generated ${results.length} posts`);
```

## Output

### Generated Image File
- **Path:** `generated/Football_1234567890.png`
- **Format:** PNG
- **Contains:** Template + Sport name + 3 faculty names

### Metadata File
- **Path:** `generated/Football_1234567890_metadata.json`
- **Content:**
```json
{
  "sport": "Football",
  "faculties": [
    { "position": 1, "name": "Engineering Faculty" },
    { "position": 2, "name": "Medical Faculty" },
    { "position": 3, "name": "Arts Faculty" }
  ],
  "generatedAt": "2025-11-08T10:30:00.000Z"
}
```

## Key Features

✅ **Array Index Mapping**
- faculties[0] → Position 1 on template
- faculties[1] → Position 2 on template
- faculties[2] → Position 3 on template

✅ **Sport Name Above**
- Automatically placed at configured position
- Customizable font size, color, position

✅ **Local Backup**
- Every post saved in generated/ folder
- Metadata saved alongside for reference

✅ **Server Integration**
- Automatic upload after generation
- Can be distributed to clients immediately

✅ **Error Handling**
- Comprehensive error messages
- Graceful failure handling
- Detailed logging

## Configuration

All positions are customizable:

```javascript
{
  sportPosition: { x: 250, y: 50 },
  sportFontSize: 48,
  sportColor: '#000000',
  
  facultyPositions: [
    { x: 150, y: 340 },  // Index 0
    { x: 150, y: 420 },  // Index 1
    { x: 150, y: 500 }   // Index 2
  ],
  facultyFontSize: 32,
  facultyColor: '#FFFFFF'
}
```

## Success Response

```javascript
{
  success: true,
  filename: "Football_1234567890.png",
  filepath: "/path/to/generated/Football_1234567890.png",
  serverResponse: {
    success: true,
    post: {
      id: "1234567890",
      sport: "Football",
      faculties: ["Engineering", "Medical", "Arts"],
      url: "/uploads/Football_1234567890.png"
    }
  },
  sport: "Football",
  faculties: ["Engineering", "Medical", "Arts"]
}
```

## That's It!

Your complete post generation system is ready. The generator:
1. ✅ Takes sport and faculty array
2. ✅ Replaces template placeholders by array index
3. ✅ Adds sport name above the list
4. ✅ Generates high-quality PNG
5. ✅ Saves locally in generated/ folder
6. ✅ Sends to server for client distribution

All working correctly! 🎉
