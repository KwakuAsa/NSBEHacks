//const pdfParse = require("pdf-parse").default;
const supabase = require("../config/supabase");
const supabaseAdmin = require("../config/supabaseAdmin"); // service role client

async function getLatestResumeForUser(userId) {
    // Prefer current resume if you set is_current
    const { data, error } = await supabase
        .from("user_resumes")
        .select("id,storage_bucket,storage_path,file_name,created_at,is_current")
        .eq("user_id", userId)
        .order("is_current", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (error) throw new Error(error.message);
    return data; // may be null
}

async function downloadResumeBuffer(resumeRow) {
    const { data, error } = await supabaseAdmin.storage
        .from(resumeRow.storage_bucket || "resumes")
        .download(resumeRow.storage_path);

    if (error) throw new Error(error.message);

    // Supabase returns a Blob in many environments; convert to Buffer
    const arrayBuffer = await data.arrayBuffer();
    return Buffer.from(arrayBuffer);
}

const pdfParse = require("pdf-parse");

async function extractResumeText(buffer) {
    const parsed = await pdfParse(buffer);
    const text = (parsed.text || "").replace(/\s+/g, " ").trim();
    return text.slice(0, 8000);
}


module.exports = { getLatestResumeForUser, downloadResumeBuffer, extractResumeText };