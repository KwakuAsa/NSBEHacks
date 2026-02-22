const supabase = require("../config/supabase");
const supabaseAdmin = require("../config/supabaseAdmin");

function sanitizeFileName(name) {
    return (name || "resume.pdf").replace(/[^\w.\-]+/g, "_");
}

// POST /resumes/:userId  (multipart/form-data with key "resume")
async function uploadResume(req, res) {
    try {
        const { userId } = req.params;

        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded. Use field name 'resume'." });
        }

        // MVP validation (optional)
        const allowedTypes = ["application/pdf"];
        if (!allowedTypes.includes(req.file.mimetype)) {
            return res.status(400).json({ message: "Only PDF resumes are allowed." });
        }

        const safeName = sanitizeFileName(req.file.originalname);
        const storagePath = `${userId}/${Date.now()}_${safeName}`;

        // Upload to Storage
        const { error: uploadError } = await supabaseAdmin.storage
            .from("resumes")
            .upload(storagePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false
            });

        if (uploadError) {
            return res.status(400).json({ message: uploadError.message });
        }

        // Make this resume current:
        // 1) set all previous current resumes to false
        const { error: unsetError } = await supabase
            .from("user_resumes")
            .update({ is_current: false })
            .eq("user_id", userId)
            .eq("is_current", true);

        if (unsetError) {
            return res.status(400).json({ message: unsetError.message });
        }

        // 2) insert new resume row as current
        const { data: resumeRow, error: insertError } = await supabase
            .from("user_resumes")
            .insert([{
                user_id: userId,
                storage_bucket: "resumes",
                storage_path: storagePath,
                file_name: safeName,
                mime_type: req.file.mimetype,
                file_size_bytes: req.file.size,
                is_current: true
            }])
            .select()
            .single();

        if (insertError) {
            return res.status(400).json({ message: insertError.message });
        }

        return res.json({
            message: "Resume uploaded",
            resume: resumeRow
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// GET /resumes/:userId
async function listResumes(req, res) {
    try {
        const { userId } = req.params;

        const { data, error } = await supabase
            .from("user_resumes")
            .select("id,user_id,file_name,mime_type,file_size_bytes,is_current,created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) return res.status(400).json({ message: error.message });

        return res.json({ resumes: data });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// PATCH /resumes/:userId/current/:resumeId
async function setCurrentResume(req, res) {
    try {
        const { userId, resumeId } = req.params;

        // unset old current
        const { error: unsetError } = await supabase
            .from("user_resumes")
            .update({ is_current: false })
            .eq("user_id", userId)
            .eq("is_current", true);

        if (unsetError) return res.status(400).json({ message: unsetError.message });

        // set new current
        const { data, error } = await supabase
            .from("user_resumes")
            .update({ is_current: true })
            .eq("id", resumeId)
            .eq("user_id", userId)
            .select("id,user_id,file_name,is_current,created_at")
            .single();

        if (error) return res.status(400).json({ message: error.message });
        if (!data) return res.status(404).json({ message: "Resume not found" });

        return res.json({ message: "Current resume set", resume: data });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// GET /resumes/:userId/download/:resumeId
async function getResumeDownloadUrl(req, res) {
    try {
        const { userId, resumeId } = req.params;

        // Get resume record (to find storage_path)
        const { data: resume, error } = await supabase
            .from("user_resumes")
            .select("id,user_id,storage_bucket,storage_path,file_name")
            .eq("id", resumeId)
            .eq("user_id", userId)
            .single();

        if (error) return res.status(400).json({ message: error.message });
        if (!resume) return res.status(404).json({ message: "Resume not found" });

        // Create signed URL (private bucket)
        const { data, error: signError } = await supabaseAdmin.storage
            .from(resume.storage_bucket)
            .createSignedUrl(resume.storage_path, 60 * 10); // 10 minutes

        if (signError) return res.status(400).json({ message: signError.message });

        return res.json({
            fileName: resume.file_name,
            signedUrl: data.signedUrl
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = {
    uploadResume,
    listResumes,
    getResumeDownloadUrl,
    setCurrentResume
};