const fs = require("fs");
const path = require("path");
const axios = require("axios");
const sharp = require("sharp");

/**
 * Advanced Post Generator with Image Processing
 * Generates posts by overlaying sport and faculty names on template image
 */

class PostGenerator {
  constructor(serverUrl = "http://localhost:3000", config = {}) {
    this.serverUrl = serverUrl;
    this.generatedFolder = path.join(__dirname, "generated");
    this.templatePath = path.join(__dirname, "templates", "post_template.png");

    // Configuration for text positions (customize based on your template)
    this.config = {
      sportPosition: { x: 250, y: 50 }, // Sport name position
      sportFontSize: 48,
      sportColor: "#000000",

      facultyPositions: [
        { x: 150, y: 340 }, // Position 1 (for faculty[0])
        { x: 150, y: 420 }, // Position 2 (for faculty[1])
        { x: 150, y: 500 }, // Position 3 (for faculty[2])
      ],
      facultyFontSize: 32,
      facultyColor: "#FFFFFF",

      ...config,
    };

    // Create generated folder if it doesn't exist
    if (!fs.existsSync(this.generatedFolder)) {
      fs.mkdirSync(this.generatedFolder, { recursive: true });
    }
  }

  /**
   * Generate post from template
   * @param {string} sport - Sport name
   * @param {Array<string>} faculties - Array of faculty names [faculty1, faculty2, faculty3]
   * @returns {Promise<Object>} Generated post info
   */
  async generatePost(sport, faculties) {
    try {
      // Validate input
      if (!sport || !Array.isArray(faculties) || faculties.length === 0) {
        throw new Error(
          "Invalid input: sport and faculties array are required"
        );
      }

      console.log(`\n🎨 Generating post for sport: ${sport}`);
      console.log(`📋 Faculties (${faculties.length}):`, faculties);

      // Create SVG overlays for text
      const svgOverlays = this.createTextOverlays(sport, faculties);

      // Process template with overlays
      const processedImage = await this.processTemplate(svgOverlays);

      // Generate filename
      const timestamp = Date.now();
      const filename = `${sport.replace(/\s+/g, "_")}_${timestamp}.png`;
      const filepath = path.join(this.generatedFolder, filename);

      // Save locally
      await this.savePost(filepath, processedImage, sport, faculties);
      console.log(`✅ Post saved locally: ${filename}`);

      // Send to server
      const serverResponse = await this.sendToServer(
        processedImage,
        sport,
        faculties,
        filename
      );
      console.log("✅ Post sent to server successfully");

      return {
        success: true,
        filename,
        filepath,
        serverResponse,
        sport,
        faculties,
      };
    } catch (error) {
      console.error("❌ Error generating post:", error.message);
      throw error;
    }
  }

  /**
   * Create SVG text overlays for sport and faculties
   */
  createTextOverlays(sport, faculties) {
    const overlays = [];

    // Add sport name overlay
    const sportSvg = `
      <svg width="1000" height="750">
        <style>
          .sport-text { 
            fill: ${this.config.sportColor}; 
            font-size: ${this.config.sportFontSize}px; 
            font-weight: bold; 
            font-family: Arial, sans-serif;
          }
        </style>
        <text x="${this.config.sportPosition.x}" y="${
      this.config.sportPosition.y
    }" class="sport-text">${this.escapeXml(sport)}</text>
      </svg>
    `;

    overlays.push({
      input: Buffer.from(sportSvg),
      top: 0,
      left: 0,
    });

    // Add faculty name overlays based on array index
    faculties.forEach((faculty, index) => {
      if (index < this.config.facultyPositions.length) {
        const position = this.config.facultyPositions[index];
        const facultySvg = `
          <svg width="1000" height="750">
            <style>
              .faculty-text { 
                fill: ${this.config.facultyColor}; 
                font-size: ${this.config.facultyFontSize}px; 
                font-family: Arial, sans-serif;
              }
            </style>
            <text x="${position.x}" y="${
          position.y
        }" class="faculty-text">${this.escapeXml(faculty)}</text>
          </svg>
        `;

        overlays.push({
          input: Buffer.from(facultySvg),
          top: 0,
          left: 0,
        });
      }
    });

    return overlays;
  }

  /**
   * Escape XML special characters
   */
  escapeXml(unsafe) {
    return unsafe.replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case "<":
          return "&lt;";
        case ">":
          return "&gt;";
        case "&":
          return "&amp;";
        case "'":
          return "&apos;";
        case '"':
          return "&quot;";
      }
    });
  }

  /**
   * Process template with overlays
   */
  async processTemplate(overlays) {
    try {
      // Read template and apply overlays
      const processedImage = await sharp(this.templatePath)
        .composite(overlays)
        .png()
        .toBuffer();

      return processedImage;
    } catch (error) {
      throw new Error(`Failed to process template: ${error.message}`);
    }
  }

  /**
   * Save post locally
   */
  async savePost(filepath, imageBuffer, sport, faculties) {
    return new Promise((resolve, reject) => {
      // Save the image file
      fs.writeFile(filepath, imageBuffer, (err) => {
        if (err) {
          reject(new Error(`Failed to save post: ${err.message}`));
        } else {
          // Also save metadata as JSON
          const metadata = {
            sport,
            faculties: faculties.map((faculty, index) => ({
              position: index + 1,
              name: faculty,
            })),
            generatedAt: new Date().toISOString(),
          };

          const metadataPath = filepath.replace(".png", "_metadata.json");
          fs.writeFileSync(metadataPath, JSON.stringify(metadata, null, 2));
          resolve(filepath);
        }
      });
    });
  }

  /**
   * Send post to server
   */
  async sendToServer(imageBuffer, sport, faculties, filename) {
    try {
      // Prepare form data
      const FormData = require("form-data");
      const formData = new FormData();

      // Append image buffer
      formData.append("post", imageBuffer, {
        filename: filename,
        contentType: "image/png",
      });

      formData.append("sport", sport);
      formData.append("faculties", JSON.stringify(faculties));
      formData.append("timestamp", Date.now().toString());

      // Send to server
      const response = await axios.post(
        `${this.serverUrl}/api/posts/upload`,
        formData,
        {
          headers: {
            ...formData.getHeaders(),
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          `Server error: ${error.response.status} - ${JSON.stringify(
            error.response.data
          )}`
        );
      } else if (error.request) {
        throw new Error(`No response from server: ${this.serverUrl}`);
      } else {
        throw new Error(`Request setup error: ${error.message}`);
      }
    }
  }

  /**
   * Generate multiple posts in batch
   */
  async generateMultiplePosts(postDataArray) {
    console.log(`\n📦 Generating ${postDataArray.length} posts...`);
    const results = [];

    for (let i = 0; i < postDataArray.length; i++) {
      const postData = postDataArray[i];
      console.log(`\n[${i + 1}/${postDataArray.length}] Processing...`);

      try {
        const result = await this.generatePost(
          postData.sport,
          postData.faculties
        );
        results.push(result);
      } catch (error) {
        console.error(`Failed for ${postData.sport}:`, error.message);
        results.push({
          success: false,
          error: error.message,
          sport: postData.sport,
          faculties: postData.faculties,
        });
      }
    }

    console.log(
      `\n✅ Batch complete: ${results.filter((r) => r.success).length}/${
        results.length
      } successful`
    );
    return results;
  }

  /**
   * Get all generated posts
   */
  getGeneratedPosts() {
    const files = fs
      .readdirSync(this.generatedFolder)
      .filter((file) => file.endsWith(".png"))
      .map((file) => ({
        filename: file,
        path: path.join(this.generatedFolder, file),
        createdAt: fs.statSync(path.join(this.generatedFolder, file)).birthtime,
      }))
      .sort((a, b) => b.createdAt - a.createdAt);

    return files;
  }
}

// Export the class
module.exports = PostGenerator;

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length < 2) {
    console.log(`
Usage: node postgenerator.js <sport> <faculty1> <faculty2> <faculty3> [serverUrl]

Example:
  node postgenerator.js "Football" "Engineering" "Medical" "Arts"
  node postgenerator.js "Basketball" "Science" "Business" "Law" "http://localhost:3000"
    `);
    process.exit(1);
  }

  const sport = args[0];
  const faculties = args.slice(1, -1);
  const serverUrl = args[args.length - 1].startsWith("http")
    ? args[args.length - 1]
    : "http://localhost:3000";

  // If last arg is not a URL, it's a faculty name
  if (!args[args.length - 1].startsWith("http")) {
    faculties.push(args[args.length - 1]);
  }

  const generator = new PostGenerator(serverUrl);

  generator
    .generatePost(sport, faculties)
    .then((result) => {
      console.log("\n🎉 Success!");
      console.log(JSON.stringify(result, null, 2));
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n❌ Failed:", error.message);
      process.exit(1);
    });
}
