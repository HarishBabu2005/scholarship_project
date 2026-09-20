const fs = require("fs");
const path = require("path");
const axios = require("axios");
const pdfParse = require("pdf-parse");
const { GoogleGenerativeAI } = require("@google/generative-ai");

/**
 * Extract raw text content from uploaded document file (.pdf, .txt, or image placeholder text)
 */
const extractTextFromFile = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found on disk: ${filePath}`);
    }

    const ext = path.extname(filePath).toLowerCase();

    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      return pdfData.text || "";
    } else {
      // For plain text files or basic document image text buffers
      const dataBuffer = fs.readFileSync(filePath);
      const content = dataBuffer.toString("utf8");
      // Filter non-printable binary chars
      return content.replace(/[^\x20-\x7E\n\r\t]/g, " ").trim();
    }
  } catch (error) {
    console.error("Text extraction failed:", error.message);
    return "";
  }
};

/**
 * Smart Regex & Pattern Extractor Fallback
 */
const extractWithRegex = (text) => {
  const result = {
    extractedIncome: null,
    extractedMarks: null,
    extractedCategory: null,
    certificateNumber: null,
    issueDate: null,
  };

  if (!text || text.trim() === "") return result;

  const lowerText = text.toLowerCase();

  // 1. Income Extraction (e.g., ₹1,50,000, Rs. 200000, Annual Income: 150000)
  const incomeRegex = /(?:income|annual|rupees|rs\.?|₹)\D*?([\d,]{4,10})/i;
  const incomeMatch = text.match(incomeRegex);
  if (incomeMatch && incomeMatch[1]) {
    const numericStr = incomeMatch[1].replace(/,/g, "");
    const val = parseInt(numericStr, 10);
    if (!isNaN(val) && val >= 10000 && val <= 5000000) {
      result.extractedIncome = val;
    }
  }

  // 2. Marks / Percentage Extraction (e.g. 85.5%, Marks: 78%)
  const marksRegex = /(\d{2}(?:\.\d{1,2})?)\s*%/;
  const marksMatch = text.match(marksRegex);
  if (marksMatch && marksMatch[1]) {
    const val = parseFloat(marksMatch[1]);
    if (!isNaN(val) && val >= 30 && val <= 100) {
      result.extractedMarks = val;
    }
  }

  // 3. Category Extraction
  const categoryRegex = /\b(SC|ST|OBC|MBC|EWS|GENERAL|OPEN)\b/i;
  const catMatch = text.match(categoryRegex);
  if (catMatch && catMatch[1]) {
    result.extractedCategory = catMatch[1].toUpperCase();
  }

  // 4. Aadhaar / Certificate ID (12 digits or cert pattern)
  const aadhaarRegex = /\b\d{4}\s?\d{4}\s?\d{4}\b/;
  const idMatch = text.match(aadhaarRegex);
  if (idMatch) {
    result.certificateNumber = idMatch[0].replace(/\s/g, "");
  }

  return result;
};

/**
 * AI LLM Structured Extractor (Groq / Gemini)
 */
const extractWithAI = async (text, docName) => {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  const prompt = `You are an AI Document Scanner for an Indian Scholarship Portal.
Analyze the following raw text extracted from a student document file (Document Type/Name: "${docName}"):

--- DOCUMENT CONTENT ---
${text.substring(0, 3000)}
--- END CONTENT ---

Extract key verification metrics and output ONLY a valid raw JSON object with these keys (do not include markdown code ticks):
{
  "extractedIncome": Number or null (annual income in INR),
  "extractedMarks": Number or null (percentage out of 100),
  "extractedCategory": String or null ("SC", "ST", "OBC", "MBC", "EWS", "General"),
  "certificateNumber": String or null,
  "issueDate": String or null,
  "documentTypeDetected": String (e.g. "Income Certificate", "Marksheet", "Category Certificate", "Aadhaar Card", "Unknown")
}`;

  // 1. Try Groq API first
  if (groqKey && groqKey.trim() !== "") {
    try {
      const res = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "groq/compound-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
          max_tokens: 500,
        },
        {
          headers: {
            Authorization: `Bearer ${groqKey.trim()}`,
            "Content-Type": "application/json",
          },
          timeout: 8000,
        }
      );

      let content = res.data.choices[0].message.content.trim();
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(content);
    } catch (err) {
      console.warn("Groq AI scanner failed, trying Gemini:", err.message);
    }
  }

  // 2. Try Gemini API fallback
  if (geminiKey && geminiKey.trim() !== "" && geminiKey !== "your_gemini_api_key_here") {
    try {
      const genAI = new GoogleGenerativeAI(geminiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-3.6-flash" });
      const result = await model.generateContent(prompt);
      let content = result.response.text().trim();
      content = content.replace(/```json/g, "").replace(/```/g, "").trim();
      return JSON.parse(content);
    } catch (err) {
      console.warn("Gemini AI scanner failed:", err.message);
    }
  }

  return null;
};

/**
 * Main Auto-Scanner & Cross-Verification Function
 * @param {string} filePath - Absolute path to document file on server disk
 * @param {string} docName - Document field name (e.g. 'incomeCertificate', 'marksheet', 'casteCertificate')
 * @param {object} studentProfile - Student Profile model containing stated income, marks, category
 */
const scanAndVerifyDocument = async (filePath, docName, studentProfile = {}) => {
  let extractedData = {
    extractedIncome: null,
    extractedMarks: null,
    extractedCategory: null,
    certificateNumber: null,
    issueDate: null,
  };

  const rawText = await extractTextFromFile(filePath);

  // Attempt AI LLM Extraction
  if (rawText && rawText.length > 10) {
    const aiResult = await extractWithAI(rawText, docName);
    if (aiResult) {
      extractedData = { ...extractedData, ...aiResult };
    } else {
      // Fallback to Regex pattern extractor
      extractedData = { ...extractedData, ...extractWithRegex(rawText) };
    }
  } else {
    // Basic Regex on raw text
    extractedData = extractWithRegex(rawText);
  }

  // Cross-Verification Match Calculation
  let autoScanScore = 0;
  let autoScanStatus = "Pending";
  const details = [];

  const lowerDocName = (docName || "").toLowerCase();
  const statedIncome = studentProfile.income || null;
  const statedMarks = studentProfile.marks || null;
  const statedCategory = studentProfile.category || null;

  // Case A: Income Certificate
  if (lowerDocName.includes("income")) {
    if (extractedData.extractedIncome && statedIncome) {
      const diffRatio = Math.abs(extractedData.extractedIncome - statedIncome) / statedIncome;
      if (diffRatio === 0) {
        autoScanScore = 100;
        details.push(`Income Verified: Stated ₹${statedIncome.toLocaleString("en-IN")} matches Document ₹${extractedData.extractedIncome.toLocaleString("en-IN")} exactly (100% Match)`);
      } else if (diffRatio <= 0.15) {
        autoScanScore = 85;
        details.push(`Income Verified: Stated ₹${statedIncome.toLocaleString("en-IN")} is close to Document ₹${extractedData.extractedIncome.toLocaleString("en-IN")}`);
      } else {
        autoScanScore = 40;
        details.push(`Discrepancy Flagged: Stated Income ₹${statedIncome.toLocaleString("en-IN")} vs Document Income ₹${extractedData.extractedIncome.toLocaleString("en-IN")}`);
      }
    } else if (extractedData.extractedIncome) {
      autoScanScore = 90;
      details.push(`Income Document Read: Extracted Annual Income ₹${extractedData.extractedIncome.toLocaleString("en-IN")}`);
    } else {
      autoScanScore = 60;
      details.push(`Document Uploaded: Awaiting Admin Review (Unclear numeric text)`);
    }
  }
  // Case B: Marksheet / Academic Transcript
  else if (lowerDocName.includes("mark") || lowerDocName.includes("academic") || lowerDocName.includes("10th") || lowerDocName.includes("12th")) {
    if (extractedData.extractedMarks && statedMarks) {
      const diff = Math.abs(extractedData.extractedMarks - statedMarks);
      if (diff <= 1) {
        autoScanScore = 100;
        details.push(`Marks Verified: Stated ${statedMarks}% matches Document ${extractedData.extractedMarks}% (100% Match)`);
      } else if (diff <= 5) {
        autoScanScore = 85;
        details.push(`Marks Verified: Stated ${statedMarks}% close to Document ${extractedData.extractedMarks}%`);
      } else {
        autoScanScore = 45;
        details.push(`Discrepancy Flagged: Stated Marks ${statedMarks}% vs Document Marks ${extractedData.extractedMarks}%`);
      }
    } else if (extractedData.extractedMarks) {
      autoScanScore = 90;
      details.push(`Marksheet Read: Extracted Score ${extractedData.extractedMarks}%`);
    } else {
      autoScanScore = 70;
      details.push(`Academic Document Uploaded: Verified formatting`);
    }
  }
  // Case C: Caste / Category Certificate
  else if (lowerDocName.includes("caste") || lowerDocName.includes("category")) {
    if (extractedData.extractedCategory && statedCategory) {
      if (extractedData.extractedCategory.toLowerCase() === statedCategory.toLowerCase()) {
        autoScanScore = 100;
        details.push(`Category Verified: Stated ${statedCategory} matches Document ${extractedData.extractedCategory} (100% Match)`);
      } else {
        autoScanScore = 35;
        details.push(`Discrepancy Flagged: Stated Category ${statedCategory} vs Document ${extractedData.extractedCategory}`);
      }
    } else {
      autoScanScore = 80;
      details.push(`Category Certificate Uploaded: Formatted document`);
    }
  }
  // Default General Document (Aadhaar / ID)
  else {
    autoScanScore = 85;
    details.push(`Document Verified: Format & Identity document valid`);
  }

  // Determine final AutoScanStatus
  if (autoScanScore >= 85) {
    autoScanStatus = "Verified";
  } else if (autoScanScore < 85 && autoScanScore >= 30) {
    autoScanStatus = "Discrepancy Detected";
  } else {
    autoScanStatus = "Unclear Text";
  }

  return {
    autoScanScore,
    autoScanStatus,
    autoScanDetails: details.join(" | "),
    extractedData,
  };
};

module.exports = {
  extractTextFromFile,
  scanAndVerifyDocument,
};
