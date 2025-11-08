# Post Generator

Generate sports posts with faculty names overlaid on template images.

## Features

- ✅ Replace array faculty names with their positions on template
- ✅ Add sport name above the faculty list
- ✅ Generate high-quality PNG posts
- ✅ Send generated posts to server
- ✅ Save posts locally in `generated/` folder
- ✅ Batch processing support
- ✅ Customizable text positions and styling

## Installation

```bash
npm install
```

## Required Dependencies

- `axios` - HTTP client for server communication
- `sharp` - Image processing library
- `form-data` - Multipart form data handling

## Folder Structure

```
project/
├── postgenerator.js          # Basic generator
├── postgenerator_advanced.js # Advanced generator with image processing
├── example_usage.js          # Usage examples
├── package.json              # Dependencies
├── templates/                # Template images folder
│   └── post_template.png    # Your template image
└── generated/                # Output folder (auto-created)
    ├── Football_1234567890.png
    ├── Football_1234567890_metadata.json
    └── ...
```

## Template Setup

1. Place your template image at `templates/post_template.png`
2. The template should have 3 placeholder areas for faculty names
3. Configure positions in the generator constructor

## Configuration

### Text Positions

Based on your template image, you can configure:

```javascript
const generator = new PostGenerator('http://localhost:3000', {
  // Sport name configuration
  sportPosition: { x: 250, y: 50 },  // Top position for sport name
  sportFontSize: 48,
  sportColor: '#000000',
  
  // Faculty positions (matching array indices)
  facultyPositions: [
    { x: 150, y: 340 },  // Position for faculties[0]
    { x: 150, y: 420 },  // Position for faculties[1]
    { x: 150, y: 500 }   // Position for faculties[2]
  ],
  facultyFontSize: 32,
  facultyColor: '#FFFFFF'
});
```

## Usage

### Method 1: Using Node.js

```javascript
const PostGenerator = require('./postgenerator_advanced');

const generator = new PostGenerator('http://localhost:3000');

// Generate a single post
await generator.generatePost('Football', [
  'Engineering Faculty',
  'Medical Faculty', 
  'Arts Faculty'
]);
```

### Method 2: Command Line

```bash
# Basic usage
node postgenerator_advanced.js "Football" "Engineering" "Medical" "Arts"

# With custom server URL
node postgenerator_advanced.js "Basketball" "Science" "Business" "Law" "http://myserver.com:3000"
```

### Method 3: Using Examples

```bash
npm test
```

## API

### `generatePost(sport, faculties)`

Generates a single post.

**Parameters:**
- `sport` (string) - Name of the sport (e.g., "Football")
- `faculties` (Array<string>) - Array of faculty names (e.g., ["Engineering", "Medical", "Arts"])

**Returns:** Promise<Object>
```javascript
{
  success: true,
  filename: "Football_1234567890.png",
  filepath: "/path/to/generated/Football_1234567890.png",
  serverResponse: { ... },
  sport: "Football",
  faculties: ["Engineering", "Medical", "Arts"]
}
```

### `generateMultiplePosts(postDataArray)`

Generates multiple posts in batch.

**Parameters:**
- `postDataArray` (Array<Object>) - Array of post data objects

```javascript
await generator.generateMultiplePosts([
  {
    sport: 'Football',
    faculties: ['Engineering', 'Medical', 'Arts']
  },
  {
    sport: 'Basketball',
    faculties: ['Science', 'Business', 'Law']
  }
]);
```

### `getGeneratedPosts()`

Returns list of all generated posts.

```javascript
const posts = generator.getGeneratedPosts();
// Returns: Array of { filename, path, createdAt }
```

## Server Integration

The generator sends posts to your server with the following data:

**Endpoint:** `POST /api/posts/upload`

**Form Data:**
- `post` - PNG image file
- `sport` - Sport name (string)
- `faculties` - Faculty array (JSON string)
- `timestamp` - Generation timestamp

**Example Server Handler (Express.js):**

```javascript
const express = require('express');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

app.post('/api/posts/upload', upload.single('post'), (req, res) => {
  const { sport, faculties } = req.body;
  const file = req.file;
  
  console.log('Received post:', sport);
  console.log('Faculties:', JSON.parse(faculties));
  console.log('File:', file.filename);
  
  // Process and save to database
  // Send to clients via Socket.io/WebSocket
  
  res.json({ 
    success: true, 
    postId: file.filename 
  });
});
```

## Output

### Generated Image
- **Format:** PNG
- **Location:** `generated/[Sport]_[Timestamp].png`
- **Features:** Sport name + 3 faculty names overlaid on template

### Metadata File
Each generated post includes a metadata JSON file:

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

## Workflow

```
1. Server passes (sport, array[faculty1, faculty2, faculty3])
   ↓
2. PostGenerator receives data
   ↓
3. Read template image
   ↓
4. Create SVG text overlays:
   - Sport name at top position
   - Faculty[0] at position 1
   - Faculty[1] at position 2
   - Faculty[2] at position 3
   ↓
5. Composite overlays onto template using Sharp
   ↓
6. Save locally to generated/ folder
   ↓
7. Send to server via HTTP POST
   ↓
8. Server distributes to clients
```

## Error Handling

The generator includes comprehensive error handling:

```javascript
try {
  const result = await generator.generatePost(sport, faculties);
  console.log('Success:', result);
} catch (error) {
  console.error('Failed:', error.message);
  // Handle error appropriately
}
```

## Troubleshooting

### "Failed to read template"
- Ensure `templates/post_template.png` exists
- Check file permissions

### "Server upload failed"
- Verify server URL is correct
- Ensure server is running
- Check network connectivity

### "Invalid input"
- Ensure sport is a non-empty string
- Ensure faculties is an array with at least 1 element

## License

MIT
