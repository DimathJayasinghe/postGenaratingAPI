/**
 * Configuration Template
 * Copy this file and adjust positions based on your template image
 */

module.exports = {
  // Server configuration
  serverUrl: 'http://localhost:3000',
  
  // Template path
  templatePath: './templates/post_template.png',
  
  // Output folder
  outputFolder: './generated',
  
  // Sport name configuration
  sport: {
    position: { 
      x: 250,  // X coordinate (pixels from left)
      y: 50    // Y coordinate (pixels from top)
    },
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000000',  // Hex color code
    fontFamily: 'Arial, sans-serif'
  },
  
  // Faculty positions
  // IMPORTANT: Array index matches faculty array index
  // faculties[0] uses facultyPositions[0]
  // faculties[1] uses facultyPositions[1]
  // faculties[2] uses facultyPositions[2]
  faculties: {
    positions: [
      { 
        x: 150,   // Position for first faculty (faculties[0])
        y: 340 
      },
      { 
        x: 150,   // Position for second faculty (faculties[1])
        y: 420 
      },
      { 
        x: 150,   // Position for third faculty (faculties[2])
        y: 500 
      }
    ],
    fontSize: 32,
    fontWeight: 'normal',
    color: '#FFFFFF',
    fontFamily: 'Arial, sans-serif'
  },
  
  // Image output settings
  output: {
    format: 'png',
    quality: 90,
    compression: 6
  }
};

/**
 * HOW TO FIND CORRECT POSITIONS:
 * 
 * 1. Open your template image in an image editor (Photoshop, GIMP, etc.)
 * 2. Enable rulers or coordinate display
 * 3. Hover over the position where you want text to appear
 * 4. Note the X and Y coordinates
 * 5. Update the positions above
 * 
 * TIPS:
 * - X coordinate: Distance from left edge
 * - Y coordinate: Distance from top edge
 * - Text anchor is usually top-left of the text
 * - Add some padding from the placeholder edges
 * - Test with sample data and adjust as needed
 */

/**
 * TEMPLATE GUIDE:
 * 
 * Your template should look like this:
 * 
 * ┌─────────────────────────────────────┐
 * │                                     │
 * │         [SPORT NAME HERE]  ← 250,50│
 * │                                     │
 * │  ┌──────────────────────────────┐  │
 * │  │  1  [Faculty 1]  ← 150,340   │  │
 * │  └──────────────────────────────┘  │
 * │                                     │
 * │  ┌──────────────────────────────┐  │
 * │  │  2  [Faculty 2]  ← 150,420   │  │
 * │  └──────────────────────────────┘  │
 * │                                     │
 * │  ┌──────────────────────────────┐  │
 * │  │  3  [Faculty 3]  ← 150,500   │  │
 * │  └──────────────────────────────┘  │
 * │                                     │
 * └─────────────────────────────────────┘
 */
