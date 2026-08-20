'use strict';
/**
 * Sessions and roles. Deliberately small: scrypt for passwords (built in, no
 * dependency), an HttpOnly SameSite=Strict cookie, an in-memory session table —
 * one server, LAN only, per ARC-01. Business rules are re-checked on the server
 * for every action (ARC-11); the role gate here is the first door, not the only one.
 */
const crypto = require('node:crypto');
const { pool } = require('./db');

const sessions = new Map(); // sid -> { userId, username, fullName, role }

function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

async function login(username, password) {
  const { rows } = await pool.query(
    `SELECT * FROM mst_user WHERE username=$1 AND is_active`, [username]);
  if (!rows.length) return null;
  const u = rows[0];
  const hash = hashPassword(password, u.pass_salt);
  if (!crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(u.pass_hash))) return null;
  const sid = crypto.randomBytes(32).toString('base64url');
  sessions.set(sid, { userId: Number(u.id), username: u.username, fullName: u.full_name, role: u.role });
  return sid;
}

function logout(sid) { sessions.delete(sid); }

function userFromRequest(req) {
  const m = /(?:^|;\s*)sid=([A-Za-z0-9_-]+)/.exec(req.headers.cookie || '');
  return m ? sessions.get(m[1]) || null : null;
}

/**
 * Express middleware: require a signed-in user, optionally of given roles.
 * The user row is re-read on every request, so deactivating an account or
 * changing a role takes effect immediately — a session is a login, not a
 * grant that outlives the register. One indexed read; LAN volumes.
 */
function requireUser(...roles) {
  return async (req, res, next) => {
    const sess = userFromRequest(req);
    if (!sess) return res.redirect('/login');
    const { rows } = await pool.query(
      `SELECT full_name, role FROM mst_user WHERE id=$1 AND is_active`, [sess.userId]);
    if (!rows.length) { return res.redirect('/login'); }
    const user = { ...sess, fullName: rows[0].full_name, role: rows[0].role };
    if (roles.length && !roles.includes(user.role) && user.role !== 'admin') {
      return res.status(403).send('Not permitted for your role. (This is also enforced on every action.)');
    }
    req.user = user;
    next();
  };
}

module.exports = { login, logout, userFromRequest, requireUser, hashPassword };
