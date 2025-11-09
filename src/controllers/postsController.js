const PostGenerator = require('../services/postGeneratorAdvanced');

const generator = new PostGenerator();

async function generate(req, res, next) {
  try {
    const { sport, faculties } = req.body;
    if (!sport || !Array.isArray(faculties) || faculties.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'sport (string) and faculties (array) are required',
      });
    }

    const imageBuffer = await generator.generatePostBuffer(sport, faculties);
    const dataUrl = `data:image/png;base64,${imageBuffer.toString('base64')}`;

    res.json({
      success: true,
      sport,
      faculties,
      imageBase64: dataUrl,
      timestamp: Date.now(),
    });
  } catch (err) {
    next(err);
  }
}

module.exports = { generate };