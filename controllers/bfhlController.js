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
      return badRequest(res, "Exactly one key required");
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
        return badRequest(res, "Invalid key");
    }

  } catch (err) {
    console.log("SERVER ERROR:", err.message);
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

function badRequest(res, message = "Invalid input") {
  return res.status(400).json({
    is_success: false,
    official_email: process.env.OFFICIAL_EMAIL,
    error: message
  });
}
async function callGemini(question) {
  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            role: "user",
            parts: [{ text: `${question} Answer in one word only.` }]
          }
        ]
      }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No response";

  } catch (error) {
    console.log("FULL GEMINI ERROR:");
    console.log(error.response?.data || error.message);
    throw error;
  }
}
