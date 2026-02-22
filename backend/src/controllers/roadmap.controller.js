const supabase = require("../config/supabase");
const { callAzureRoadmapAI } = require("../services/roadmap-openai.service");
const { getLatestResumeForUser, downloadResumeBuffer, extractResumeText } = require("../services/resume.service");

async function generateRoadmap(req, res) {
    try {
        const { userId, targetTitle, targetType = "career", industry = null, useResume = false } = req.body;

        if (!userId || !targetTitle) {
            return res.status(400).json({ message: "Missing userId or targetTitle" });
        }

        // Load user profile
        const { data: user, error: userErr } = await supabase
            .from("users")
            .select("id,first_name,last_name,city,education_level,graduation_year")
            .eq("id", userId)
            .single();

        if (userErr) return res.status(400).json({ message: userErr.message });

        // Optional resume
        let resumeRow = null;
        let resumeText = null;

        if (useResume) {
            resumeRow = await getLatestResumeForUser(userId);
            if (resumeRow) {
                const buf = await downloadResumeBuffer(resumeRow);
                resumeText = await extractResumeText(buf);
            }
        }

        // 1) AI FIRST — if this fails, we do NOT write to DB
        const aiInput = {
            targetTitle,
            targetType,
            industry,
            userProfile: user,
            resume: resumeText
                ? { provided: true, text: resumeText }
                : { provided: false }
        };

        const roadmapJson = await callAzureRoadmapAI(aiInput);

        // Minimal validation
        if (!roadmapJson?.phases || !Array.isArray(roadmapJson.phases) || roadmapJson.phases.length === 0) {
            return res.status(502).json({ message: "AI returned invalid roadmap structure" });
        }

        const summary = roadmapJson?.startingPoint?.summary || roadmapJson?.summary || "";

        // 2) Store roadmap
        const { data: saved, error: saveErr } = await supabase
            .from("roadmaps")
            .insert([{
                user_id: userId,
                target_title: targetTitle,
                target_type: targetType,
                industry,
                used_resume: !!resumeText,
                resume_id: resumeRow ? resumeRow.id : null,
                summary,
                raw_json: roadmapJson
            }])
            .select()
            .single();

        if (saveErr) return res.status(400).json({ message: saveErr.message });

        return res.json({ roadmap: saved });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

async function getAllRoadMaps(req, res) {
    try {
        const { userId } = req.params;
        if (!userId) return res.status(400).json({ message: "Missing userId" });

        const { data, error } = await supabase
            .from("roadmaps")
            .select("id,user_id,created_at,target_title,target_type,industry,used_resume,resume_id,summary,raw_json")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (error) return res.status(400).json({ message: error.message });

        return res.json({ roadmaps: data || [] });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }


}
async function completeTask(req, res) {
    try {
        const { roadmapId, taskId } = req.params;
        const { phaseId, milestoneId } = req.body;

        if (!roadmapId || !taskId || !phaseId || !milestoneId) {
            return res.status(400).json({ message: "Missing roadmapId/taskId/phaseId/milestoneId" });
        }

        const { data, error } = await supabase.rpc("mark_task_complete", {
            p_roadmap_id: roadmapId,
            p_phase_id: phaseId,
            p_milestone_id: milestoneId,
            p_task_id: taskId
        });

        if (error) return res.status(400).json({ message: error.message });

        return res.json({ message: "Task marked complete", roadmap_json: data });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }

}

module.exports = { generateRoadmap, getAllRoadMaps, completeTask };