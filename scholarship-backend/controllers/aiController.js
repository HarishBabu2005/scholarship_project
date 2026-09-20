const Scholarship = require("../models/Scholarship");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const axios = require("axios");

/**
 * Smart Fallback Engine when API keys are not configured or offline
 */
const generateLocalFallbackResponse = (userMessage, scholarships) => {
  const msg = userMessage.toLowerCase();

  // Greeting
  if (msg.includes("hello") || msg.includes("hi") || msg.includes("hey") || msg.includes("welcome")) {
    return `Hello! 👋 I am **VidyaBot**, your AI Scholarship Advisor. How can I help you today?\n\nYou can ask me about:\n- Available scholarships & eligibility criteria\n- Required documents for application\n- How to apply or track application status\n- High-value scholarships for your income or marks percentage`;
  }

  // Document requirements
  if (msg.includes("document") || msg.includes("file") || msg.includes("certificate") || msg.includes("upload") || msg.includes("proof")) {
    return `📄 **Required Documents for Scholarship Applications:**\n\n1. **Academic Marksheets** (10th/12th/Semester transcripts showing your marks percentage)\n2. **Income Certificate** (Issued by competent authority, e.g. Tehsildar/Revenue Officer)\n3. **Category / Caste Certificate** (For SC/ST/OBC applicants if applicable)\n4. **Aadhaar Card / Government ID** (For identity & DBTL verification)\n5. **Bank Account Passbook** (Showing Account Number & IFSC code for Direct Benefit Transfer)\n6. **College Fee Receipt / Bonafide Certificate** (Proof of current enrollment)`;
  }

  // Application process / status
  if (msg.includes("apply") || msg.includes("status") || msg.includes("track") || msg.includes("process") || msg.includes("how to")) {
    return `📌 **How to Apply & Track Status on the Portal:**\n\n1. **Browse Scholarships:** Visit the "Scholarships" page to check available schemes and your **Match Score**.\n2. **Fill Application:** Click "Apply Now", fill in your personal, academic, and financial details, and upload PDF/Image documents.\n3. **Submit:** Confirm your details and submit.\n4. **Track Progress:** Go to **"My Applications"** in your student navigation bar to view live status updates (Pending Verification ⏳, Verified ✅, Approved 🎉, or Rejected ❌).\n5. **Notifications:** You will receive real-time push and email notifications whenever your application status changes!`;
  }

  // Criteria / Eligibility / Marks / Income
  if (msg.includes("income") || msg.includes("marks") || msg.includes("eligib") || msg.includes("criteria") || msg.includes("cutoff")) {
    return `🎯 **Scholarship Eligibility Factors:**\n\n- **Academic Performance:** Most merit-based scholarships require a minimum percentage (e.g. 60% to 85%+).\n- **Family Income Limit:** Need-based scholarships cap annual family income (ranging from ₹1,50,000 to ₹6,00,000/year).\n- **Category:** Specific scholarships are dedicated to SC, ST, OBC, EWS, or Open categories.\n\n💡 *Tip: Check your personalized **Match Score** on the Scholarships list page to instantly see which ones you qualify for!*`;
  }

  // Search or recommendation matching in live DB
  if (scholarships && scholarships.length > 0) {
    let matched = scholarships;

    if (msg.includes("merit") || msg.includes("academic") || msg.includes("high score")) {
      matched = scholarships.filter(s => s.minMarks >= 75);
    } else if (msg.includes("need") || msg.includes("low income") || msg.includes("financial")) {
      matched = scholarships.filter(s => s.incomeLimit <= 250000);
    } else if (msg.includes("sc") || msg.includes("st") || msg.includes("obc")) {
      matched = scholarships.filter(s => s.category.toLowerCase().includes("sc") || s.category.toLowerCase().includes("st") || s.category.toLowerCase().includes("obc"));
    }

    if (matched.length > 0) {
      let listStr = matched.map(s => (
        `• **${s.name}**\n  - **Benefit:** ₹${s.amount.toLocaleString("en-IN")}\n  - **Min Marks:** ${s.minMarks}%\n  - **Income Limit:** Up to ₹${s.incomeLimit.toLocaleString("en-IN")}/yr\n  - **Category:** ${s.category}\n  - **Deadline:** ${s.deadline ? new Date(s.deadline).toLocaleDateString("en-IN") : "N/A"}`
      )).join("\n\n");

      return `🎓 **Here are matching scholarships currently active in our portal:**\n\n${listStr}\n\nVisit the Scholarships tab to apply directly!`;
    }
  }

  // General default fallback
  return `I'm here to assist with scholarship queries! You can ask me:\n- "Show available scholarships"\n- "What documents do I need?"\n- "How does income limit work?"\n- "How do I track application status?"\n\nOr check out the active schemes listed on the Scholarships page.`;
};

/**
 * Controller to handle AI Chat requests
 * POST /api/ai/chat
 */
const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || message.trim() === "") {
      return res.status(400).json({ success: false, message: "Prompt message is required." });
    }

    // Fetch live scholarship records from MongoDB for system context
    const scholarships = await Scholarship.find({}).sort({ amount: -1 });

    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    // Prepare system context prompt with live dataset
    const contextStr = scholarships.map((s, idx) => `
${idx + 1}. Scheme Name: "${s.name}"
   - Award Amount: ₹${s.amount.toLocaleString("en-IN")}
   - Category: ${s.category}
   - Minimum Marks Required: ${s.minMarks}%
   - Max Annual Family Income Limit: ₹${s.incomeLimit.toLocaleString("en-IN")}
   - Education Level: ${s.educationLevel}
   - Deadline: ${s.deadline ? new Date(s.deadline).toLocaleDateString("en-IN") : "Open"}
   - Description: ${s.description || "N/A"}
`).join("\n");

    const systemInstruction = `You are "VidyaBot", an expert AI Scholarship Advisor for the National Scholarship Portal.
Your job is to answer user queries with high precision based on the following real-time database of scholarships currently active on the platform:

--- LIVE SCHOLARSHIPS DATABASE ---
${contextStr}
--- END DATABASE ---

Guidelines for response:
1. Be helpful, polite, concise, and structured.
2. Use markdown formatting like bold text (**term**), bullet points, and numbered lists.
3. Recommend specific scholarships from the database above if the user specifies their marks percentage, family income, category, or degree level.
4. If asked about required documents, list: Marksheets, Income Certificate, Caste Certificate, Aadhaar ID, Bank Passbook, Institution Enrollment Proof.
5. If user input is vague, suggest key questions they can ask.
6. Answer directly based on the dataset above whenever possible.`;

    // 1. Try GROQ API first if key is available
    if (groqKey && groqKey.trim() !== "") {
      try {
        const groqModels = ["groq/compound", "groq/compound-mini", "qwen/qwen3.8-27b", "openai/gpt-oss-120b"];
        for (const model of groqModels) {
          try {
            const groqRes = await axios.post(
              "https://api.groq.com/openai/v1/chat/completions",
              {
                model: model,
                messages: [
                  { role: "system", content: systemInstruction },
                  { role: "user", content: message }
                ],
                temperature: 0.6,
                max_tokens: 1000
              },
              {
                headers: {
                  "Authorization": `Bearer ${groqKey.trim()}`,
                  "Content-Type": "application/json"
                },
                timeout: 10000
              }
            );

            if (groqRes.data && groqRes.data.choices && groqRes.data.choices[0]) {
              return res.json({
                success: true,
                reply: groqRes.data.choices[0].message.content,
                source: "groq",
                model: model
              });
            }
          } catch (mErr) {
            console.warn(`Groq model ${model} attempt failed:`, mErr.message);
          }
        }
      } catch (groqErr) {
        console.error("Groq API failed, attempting Gemini fallback:", groqErr.message);
      }
    }

    // 2. Try Gemini API fallback if key is available
    if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "your_gemini_api_key_here") {
      try {
        const genAI = new GoogleGenerativeAI(geminiKey);
        const modelsToTry = ["gemini-3.6-flash", "gemini-2.5-flash", "gemini-3.1-pro-preview"];
        const fullPrompt = `${systemInstruction}\n\nUser Question: ${message}`;

        for (const modelName of modelsToTry) {
          try {
            const model = genAI.getGenerativeModel({ model: modelName });
            const result = await model.generateContent(fullPrompt);
            const responseText = result.response.text();
            if (responseText) {
              return res.json({
                success: true,
                reply: responseText,
                source: "gemini",
                model: modelName
              });
            }
          } catch (mErr) {
            console.warn(`Gemini model ${modelName} failed:`, mErr.message);
          }
        }
      } catch (geminiErr) {
        console.error("Gemini API failed, using local rule fallback:", geminiErr.message);
      }
    }

    // 3. Smart Local Engine Fallback
    const fallbackReply = generateLocalFallbackResponse(message, scholarships);
    return res.json({
      success: true,
      reply: fallbackReply,
      source: "local-fallback"
    });
  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ success: false, message: "Failed to process AI chat request.", error: error.message });
  }
};

module.exports = {
  chatWithAI,
};
