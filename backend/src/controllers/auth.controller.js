const bcrypt = require("bcryptjs");
const UserModel = require("../models/user.model");

async function register(req, res) {
    try {
        const { email, password, first_name, last_name } = req.body;
        if (!email || !password) return res.status(400).json({ message: "email and password required" });

        const existing = await UserModel.findByEmail(email);
        if (!existing.error && existing.data) return res.status(400).json({ message: "User already exists" });

        const password_hash = await bcrypt.hash(password, 10);

        const created = await UserModel.createUser({
            email,
            password_hash,
            first_name,
            last_name,
        });

        if (created.error) return res.status(400).json({ message: created.error.message });
        res.json({ userId: created.data.id, email: created.data.email });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;
        const found = await UserModel.findByEmail(email);
        if (found.error || !found.data) return res.status(400).json({ message: "Invalid credentials" });

        const ok = await bcrypt.compare(password, found.data.password_hash);
        if (!ok) return res.status(400).json({ message: "Invalid credentials" });

        res.json({ userId: found.data.id, email: found.data.email });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
}

module.exports = { register, login };