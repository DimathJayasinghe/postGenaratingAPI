const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(new Error("Only PNG and JPEG images are allowed"));
    }
  },
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware (if needed)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// In-memory storage for posts (use database in production)
const posts = [];

/**
 * POST /api/posts
 * Simplified JSON endpoint for clients that want to send the post data as JSON.
 * Accepts either `imageBase64` (data URL or raw base64) or `imageUrl` (public URL)
 * Body shape example:
 * {
 *   "sport": "soccer",
 *   "faculties": ["Alice","Bob"],
 *   "imageBase64": "data:image/png;base64,..."  OR "imageUrl": "https://.../img.png",
 *   "metadata": { "source": "auto" }
 * }
 */
app.post("/api/posts", async (req, res) => {
  try {
    const {
      sport,
      faculties,
      timestamp,
      metadata,
      imageBase64,
      imageUrl,
      filename,
    } = req.body;

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    let savedFilename = null;
    let filepath = null;

    if (imageBase64) {
      // imageBase64 can be data URL or raw base64
      const matches = (imageBase64 || "").match(
        /^data:(image\/\w+);base64,(.+)$/
      );
      let ext = "png";
      let data = imageBase64;
      if (matches) {
        ext = matches[1].split("/")[1];
        data = matches[2];
      } else {
        // if a filename was supplied, use its extension
        if (filename) ext = path.extname(filename).replace(".", "") || ext;
      }

      savedFilename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const buffer = Buffer.from(data, "base64");
      filepath = path.join(uploadDir, savedFilename);
      fs.writeFileSync(filepath, buffer);
    } else if (imageUrl) {
      // Download and save
      const resp = await axios.get(imageUrl, { responseType: "arraybuffer" });
      let ext = "png";
      try {
        const urlPath = new URL(imageUrl).pathname;
        const maybe = path.extname(urlPath).split(".").pop();
        if (maybe) ext = maybe;
      } catch (e) {
        // ignore
      }
      savedFilename = `${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      filepath = path.join(uploadDir, savedFilename);
      fs.writeFileSync(filepath, resp.data);
    }

    // Parse faculties: accept array or JSON string
    let facultiesArray = [];
    if (Array.isArray(faculties)) facultiesArray = faculties;
    else if (typeof faculties === "string" && faculties.trim()) {
      try {
        facultiesArray = JSON.parse(faculties);
      } catch (e) {
        facultiesArray = faculties.split(",").map((s) => s.trim());
      }
    }

    // Parse metadata if provided
    let metadataObj = metadata;
    if (typeof metadata === "string" && metadata.trim()) {
      try {
        metadataObj = JSON.parse(metadata);
      } catch (e) {
        metadataObj = null;
      }
    }

    const post = {
      id: Date.now().toString(),
      sport: sport,
      faculties: facultiesArray,
      filename: savedFilename,
      filepath: filepath,
      url: savedFilename ? `/uploads/${savedFilename}` : null,
      size:
        filepath && fs.existsSync(filepath) ? fs.statSync(filepath).size : 0,
      metadata: metadataObj,
      uploadedAt: new Date().toISOString(),
      timestamp: timestamp || Date.now(),
    };

    posts.push(post);

    console.log(`✅ Post received (JSON): ${sport}`);

    res.json({ success: true, post });
  } catch (error) {
    console.error("❌ Error handling JSON upload:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/posts/upload
 * Endpoint to receive generated posts from PostGenerator
 */
app.post("/api/posts/upload", upload.single("post"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    // Parse request data
    const { sport, faculties, timestamp, metadata } = req.body;

    // Parse faculties JSON
    let facultiesArray = [];
    try {
      facultiesArray = JSON.parse(faculties);
    } catch (e) {
      console.error("Error parsing faculties:", e);
    }

    // Parse metadata if provided
    let metadataObj = null;
    if (metadata) {
      try {
        metadataObj = JSON.parse(metadata);
      } catch (e) {
        console.error("Error parsing metadata:", e);
      }
    }

    // Create post object
    const post = {
      id: Date.now().toString(),
      sport: sport,
      faculties: facultiesArray,
      filename: req.file.filename,
      filepath: req.file.path,
      url: `/uploads/${req.file.filename}`,
      size: req.file.size,
      metadata: metadataObj,
      uploadedAt: new Date().toISOString(),
      timestamp: timestamp || Date.now(),
    };

    // Save to storage
    posts.push(post);

    console.log(`✅ Post received: ${sport}`);
    console.log(`   Faculties: ${facultiesArray.join(", ")}`);
    console.log(
      `   File: ${req.file.filename} (${(req.file.size / 1024).toFixed(2)} KB)`
    );

    // Here you can:
    // 1. Save to database
    // 2. Broadcast to connected clients via WebSocket/Socket.io
    // 3. Trigger notifications
    // 4. Process further if needed

    // Example: Broadcast to clients (if using Socket.io)
    // io.emit('new-post', post);

    // Send success response
    res.json({
      success: true,
      message: "Post uploaded successfully",
      post: {
        id: post.id,
        sport: post.sport,
        faculties: post.faculties,
        url: post.url,
        uploadedAt: post.uploadedAt,
      },
    });
  } catch (error) {
    console.error("❌ Error handling upload:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/posts
 * Get all posts
 */
app.get("/api/posts", (req, res) => {
  res.json({
    success: true,
    count: posts.length,
    posts: posts,
  });
});

/**
 * GET /api/posts/:id
 * Get specific post by ID
 */
app.get("/api/posts/:id", (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);

  if (!post) {
    return res.status(404).json({
      success: false,
      error: "Post not found",
    });
  }

  res.json({
    success: true,
    post: post,
  });
});

/**
 * GET /api/posts/sport/:sport
 * Get posts by sport
 */
app.get("/api/posts/sport/:sport", (req, res) => {
  const sportPosts = posts.filter(
    (p) => p.sport.toLowerCase() === req.params.sport.toLowerCase()
  );

  res.json({
    success: true,
    sport: req.params.sport,
    count: sportPosts.length,
    posts: sportPosts,
  });
});

/**
 * DELETE /api/posts/:id
 * Delete a post
 */
app.delete("/api/posts/:id", (req, res) => {
  const index = posts.findIndex((p) => p.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: "Post not found",
    });
  }

  // Delete file
  const post = posts[index];
  if (fs.existsSync(post.filepath)) {
    fs.unlinkSync(post.filepath);
  }

  // Remove from array
  posts.splice(index, 1);

  res.json({
    success: true,
    message: "Post deleted successfully",
  });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    postsCount: posts.length,
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("Server error:", error);
  res.status(500).json({
    success: false,
    error: error.message || "Internal server error",
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📁 Upload endpoint: http://localhost:${PORT}/api/posts/upload`);
  console.log(`📊 View posts: http://localhost:${PORT}/api/posts`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health\n`);
});

module.exports = app;
