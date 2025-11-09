const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { config } = require('../config');

class PostGenerator {
  constructor(custom = {}) {
    this.templatePath = config.templatePath;
    this.generatedFolder = config.generatedDir;

    this.config = {
      sportPosition: { x: 430, y: 460 },
      sportFontSize: 64,
      sportColor: '#c7c7c7ff',
      facultyPositions: [
        { x: 335, y: 640 },
        { x: 335, y: 860 },
        { x: 335, y: 1070 },
      ],
      facultyFontSize: 32,
      facultyColor: '#ebeaeaff',
      ...custom,
    };

    if (!fs.existsSync(this.generatedFolder)) {
      fs.mkdirSync(this.generatedFolder, { recursive: true });
    }
  }

  async generatePostBuffer(sport, faculties) {
    if (!sport || !Array.isArray(faculties) || faculties.length === 0) {
      throw new Error('Invalid input: sport and faculties array are required');
    }
    if (!fs.existsSync(this.templatePath)) {
      throw new Error(
        `Template not found at ${this.templatePath}. Place "post_template.png" under post-generating-api/templates/`
      );
    }

    // Read template dimensions to size overlays correctly
    const meta = await sharp(this.templatePath).metadata();
    const width = meta.width || 1400;
    const height = meta.height || 1400;

    const overlays = this.createTextOverlays(sport, faculties, { width, height });
    return await this.processTemplate(overlays);
  }

  createTextOverlays(sport, faculties, dims) {
    const overlays = [];
    const base = { width: 1400, height: 1400 };
    const tplWidth = dims?.width || base.width;
    const tplHeight = dims?.height || base.height;
    const scaleX = tplWidth / base.width;
    const scaleY = tplHeight / base.height;
    const fontScale = Math.min(scaleX, scaleY);

    const sportSvg = `
      <svg width="${tplWidth}" height="${tplHeight}">
        <style>
          .sport-text {
            fill: ${this.config.sportColor};
            font-size: ${Math.round(this.config.sportFontSize * fontScale)}px;
            font-weight: 700;
            font-family: Inter, Arial, sans-serif;
          }
        </style>
        <text x="${Math.round(this.config.sportPosition.x * scaleX)}" y="${Math.round(this.config.sportPosition.y * scaleY)}" class="sport-text">
          ${this.escapeXml(sport)}
        </text>
      </svg>
    `;
    overlays.push({ input: Buffer.from(sportSvg), top: 0, left: 0 });

    faculties.forEach((faculty, index) => {
      if (index < this.config.facultyPositions.length) {
        const pos = this.config.facultyPositions[index];
        const facultySvg = `
          <svg width="${tplWidth}" height="${tplHeight}">
            <style>
              .faculty-text {
                fill: ${this.config.facultyColor};
                font-size: ${Math.round(this.config.facultyFontSize * fontScale)}px;
                font-weight: 700;
                font-family: Inter, Arial, sans-serif;
              }
            </style>
            <text x="${Math.round(pos.x * scaleX)}" y="${Math.round(pos.y * scaleY)}" class="faculty-text">
              ${this.escapeXml(faculty)}
            </text>
          </svg>
        `;
        overlays.push({ input: Buffer.from(facultySvg), top: 0, left: 0 });
      }
    });

    return overlays;
  }

  escapeXml(unsafe) {
    return String(unsafe).replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }

  async processTemplate(overlays) {
    try {
      return await sharp(this.templatePath).composite(overlays).png().toBuffer();
    } catch (err) {
      const helpful = err?.message?.includes('same dimensions or smaller')
        ? `${err.message}. This usually means your overlay SVG was larger than the template. We've updated code to size SVGs using the template metadata; if you still see this, confirm the template is a valid image and not corrupted.`
        : err.message;
      throw new Error(`Failed to process template: ${helpful}`);
    }
  }

  async savePost(filepath, imageBuffer, sport, faculties) {
    await fs.promises.writeFile(filepath, imageBuffer);
    const metadata = {
      sport,
      faculties: faculties.map((name, i) => ({ position: i + 1, name })),
      generatedAt: new Date().toISOString(),
    };
    const metaPath = filepath.replace('.png', '_metadata.json');
    await fs.promises.writeFile(metaPath, JSON.stringify(metadata, null, 2));
    return filepath;
  }
}

module.exports = PostGenerator;