const supabase = require("../config/supabase");

async function findByEmail(email) {
    return await supabase.from("users").select("*").eq("email", email).single();
}

async function createUser(user) {
    return await supabase.from("users").insert([user]).select().single();
}

async function findById(id) {
    return await supabase.from("users").select("*").eq("id", id).single();
}

module.exports = { findByEmail, createUser, findById };