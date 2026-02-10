const axios = require("axios");
const { fibonacci, isPrime, lcm, hcf } = require("../utils/mathUtils");

exports.healthCheck = (req, res) => {
  return res.status(200).json({
    is_success: true,
    official_email: process.env.OFFICIAL_EMAIL
  });
};

exports.handlePost = async (req, res) => {
  try {
    const body = req.body;
    const keys = Object.keys(body);

    if (keys.length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: process.env.OFFICIAL_EMAIL,
        error: "Exactly one key required"
      });
    }

    const key = keys[0];
    const value = body[key];

    switch (key) {
      case "fibonacci":
        if (typeof value !== "number" || value < 0)
          return badRequest(res);
        return success(res, fibonacci(value));

      case "prime":
        if (!Array.isArray(value))
          return badRequest(res);
        return success(res, value.filter(isPrime));

      case "lcm":
        if (!Array.isArray(value) || value.length === 0)
          return badRequest(res);
        return success(res, lcm(value));

      case "hcf":
        if (!Array.isArray(value) || value.length === 0)
          return badRequest(res);
        return success(res, hcf(value));

      case "AI":
        if (typeof value !== "string")
          return badRequest(res);

        const aiResponse = await callGemini(value);
        return success(res, aiResponse);

      default:
        return res.status(400).json({
          is_success: false,
          official_email: process.env.OFFICIAL_EMAIL,
          error: "Invalid key"
        });
    }
  } catch (err) {
    return res.status(500).json({
      is_success: false,
      official_email: process.env.OFFICIAL_EMAIL,
      error: "Processing error"
    });
  }
};

function success(res, data) {
  return res.status(200).json({
    is_success: true,
    official_email: process.env.OFFICIAL_EMAIL,
    data
  });
}

function badRequest(res) {
  return res.status(400).json({
    is_success: false,
    official_email: process.env.OFFICIAL_EMAIL,
    error: "Invalid input"
  });
}

async function callGemini(question) {
  const response = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: question + " Answer in one word only." }] }]
    }
  );

  return response.data.candidates[0].content.parts[0].text.trim();
}
