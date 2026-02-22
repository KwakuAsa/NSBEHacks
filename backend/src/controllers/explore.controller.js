const supabase = require("../config/supabase");
const { callAzureOpenAI } = require("../services/exploration-openai.service");

function cleanInterests(interests) {
    if (!Array.isArray(interests)) return [];
    return interests
        .map((x) => (typeof x === "string" ? x.trim() : ""))
        .filter((x) => x.length > 0)
        .slice(0, 25);
}

// POST /api/explore/run
async function runExplore(req, res) {
    try {
        const {
            userId,
            problem_solving_style,
            public_speaking_preference,
            math_preference,
            work_environment,
            work_with,
            interests
        } = req.body;

        if (!userId) return res.status(400).json({ message: "Missing userId" });

        const interestList = cleanInterests(interests);

        // 1) Call Azure FIRST
        const aiInput = {
            problem_solving_style,
            public_speaking_preference,
            math_preference,
            work_environment,
            work_with,
            interests: interestList
        };

        const aiResult = await callAzureOpenAI(aiInput);

        const summary = aiResult?.summary || "";
        const careers = aiResult?.careers || [];

        if (!Array.isArray(careers) || careers.length === 0) {
            return res.status(502).json({ message: "AI returned no careers. Try again." });
        }

        // 2) Create exploration session
        const { data: session, error: sessionErr } = await supabase
            .from("exploration_sessions")
            .insert([{
                user_id: userId,
                problem_solving_style,
                public_speaking_preference,
                math_preference,
                work_environment,
                work_with
            }])
            .select()
            .single();

        if (sessionErr) return res.status(400).json({ message: sessionErr.message });

        // 3) Insert interests
        if (interestList.length > 0) {
            const rows = interestList.map((interest) => ({
                exploration_session_id: session.id,
                interest
            }));

            const { error: interestsErr } = await supabase
                .from("exploration_interests")
                .insert(rows);

            if (interestsErr) {
                await supabase.from("exploration_sessions").delete().eq("id", session.id);
                return res.status(400).json({ message: interestsErr.message });
            }
        }

        // 4) Store results
        const { data: savedResult, error: saveErr } = await supabase
            .from("exploration_results")
            .insert([{
                exploration_session_id: session.id,
                summary,
                careers
            }])
            .select()
            .single();

        if (saveErr) {
            await supabase.from("exploration_sessions").delete().eq("id", session.id);
            return res.status(400).json({ message: saveErr.message });
        }

        return res.json({
            explorationSession: session,
            interests: interestList,
            result: savedResult
        });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

// GET /api/explore/:sessionId
async function getExploreResult(req, res) {
    try {
        const { sessionId } = req.params;

        const { data: session, error: sErr } = await supabase
            .from("exploration_sessions")
            .select("*")
            .eq("id", sessionId)
            .single();

        if (sErr) return res.status(400).json({ message: sErr.message });

        const { data: interests, error: iErr } = await supabase
            .from("exploration_interests")
            .select("id,interest,created_at")
            .eq("exploration_session_id", sessionId)
            .order("created_at", { ascending: true });

        if (iErr) return res.status(400).json({ message: iErr.message });

        const { data: result, error: rErr } = await supabase
            .from("exploration_results")
            .select("*")
            .eq("exploration_session_id", sessionId)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

        if (rErr) return res.status(400).json({ message: rErr.message });

        return res.json({ explorationSession: session, interests, result });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = { runExplore, getExploreResult };