const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Scholarship = require("./models/Scholarship");

dotenv.config();

const initialScholarships = [
  {
    name: "Government of India / Tamil Nadu Post-Matric Scholarship",
    incomeLimit: 250000,
    minMarks: 50,
    category: "SC",
    amount: 250000,
    provider: "Department of Backward Classes Welfare",
    educationLevel: "Undergraduate",
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    description: "Financial assistance for SC/ST students pursuing post-secondary education in recognized institutions.",
  },
  {
    name: "Central Sector Scheme of Scholarships for University Students",
    incomeLimit: 800000,
    minMarks: 80,
    category: "All",
    amount: 20000,
    provider: "Ministry of Education (MoE)",
    educationLevel: "Undergraduate",
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
    description: "Financial support to meritorious students from low-income families to meet day-to-day expenses while pursuing higher studies.",
  },
  {
    name: "Ministry of Minority Affairs (MOMA) Merit-cum-Means Scholarship",
    incomeLimit: 250000,
    minMarks: 50,
    category: "All",
    amount: 30000,
    provider: "Ministry of Minority Affairs",
    educationLevel: "Postgraduate",
    deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    description: "Scholarship awarded to deserving students from minority communities pursuing professional or technical courses.",
  },
  {
    name: "Tamil Nadu Backward Classes & Most Backward Classes Scholarship",
    incomeLimit: 200000,
    minMarks: 50,
    category: "OBC",
    amount: 50000,
    provider: "Government of Tamil Nadu",
    educationLevel: "Undergraduate",
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
    description: "Welfare scheme aimed at uplifting BC/MBC/DNC students through tuition fee reimbursements and maintenance stipends.",
  },
  {
    name: "AICTE Saksham Scholarship Scheme for Differently Abled Students",
    incomeLimit: 800000,
    minMarks: 50,
    category: "All",
    amount: 50000,
    provider: "AICTE",
    educationLevel: "Diploma / Degree",
    deadline: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    description: "Special initiative by AICTE to encourage and assist differently-abled students to pursue technical education.",
  },
  {
    name: "Prime Minister Special Scholarship Scheme (PMSSS for J&K)",
    incomeLimit: 800000,
    minMarks: 60,
    category: "All",
    amount: 125000,
    provider: "AICTE & Ministry of Education",
    educationLevel: "Undergraduate",
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    description: "Scholarship scheme providing tuition and hostel allowance to students of Jammu & Kashmir and Ladakh.",
  },
  {
    name: "AICTE Pragati Scholarship Scheme for Girl Students",
    incomeLimit: 800000,
    minMarks: 50,
    category: "All",
    amount: 50000,
    provider: "AICTE",
    educationLevel: "Undergraduate",
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    description: "Empowering female students to pursue technical education with annual financial support for tuition and learning materials.",
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB for seeding...");
    
    // Clear existing
    await Scholarship.deleteMany({});
    console.log("Cleared existing scholarships.");

    // Insert new
    await Scholarship.insertMany(initialScholarships);
    console.log("Seeded initial scholarships successfully!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seedDB();
