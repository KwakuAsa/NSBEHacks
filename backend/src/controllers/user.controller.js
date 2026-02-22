const supabase = require("../config/supabase");

async function updateUserProfile(req, res) {
    try {
        const userId = req.params.id;

        if (!userId) return res.status(400).json({ message: "Missing user id" });

        const allowed = ["first_name", "last_name", "city", "education_level", "graduation_year", "dob"];

        // Build updates from only allowed keys that were actually sent
        const updates = {};
        for (const key of allowed) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                updates[key] = req.body[key]; // can be null if you want to clear a field
            }
        }

        if (Object.keys(updates).length === 0) {
            return res.status(400).json({ message: "No valid fields provided" });
        }

        const { data, error } = await supabase
            .from("users")
            .update(updates)
            .eq("id", userId)
            .select("id,email,first_name,last_name,city,education_level,graduation_year,created_at,dob")
            .single();

        if (error) return res.status(400).json({ message: error.message });
        if (!data) return res.status(404).json({ message: "User not found" });

        return res.json({ user: data });
    } catch (e) {
        return res.status(500).json({ message: e.message });
    }
}

module.exports = { updateUserProfile };