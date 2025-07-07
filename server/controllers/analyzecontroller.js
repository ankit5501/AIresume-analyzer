exports.analyzeResume = async (req, res) => {
//     console.log("🔥 File:", req.file);
//   console.log("📄 Body:", req.body);
  const jobTitle = req.body.jobTitle;
  const resume = req.file;

//   if (!resume || !jobTitle) {
//     return res.status(400).json({ error: "Missing file or job title" });
//   }

  return res.json({
    message: "Resume received",
    filename: resume.originalname,
    jobTitle,
  });
};
