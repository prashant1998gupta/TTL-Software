'use strict';
/**
 * One pool, one transaction helper. Everything that allots a number or moves a
 * state goes through tx(), so partial writes cannot happen (ARC-12: exactly one
 * function executes state transitions — see services/samples.js).
 */
const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.PGHOST || '/tmp',
  database: process.env.LIMS_DB || 'ttl_lims',
  // Local socket auth on the lab server; no password in code (ARC: secrets).
});

// An idle client losing its connection emits 'error' on the pool; with no
// listener that is an uncaught exception and the WHOLE application dies —
// which on this deployment means the laboratory stops. Log and carry on;
// the next checkout replaces the dead client.
pool.on('error', (err) => console.error('pg idle client error:', err.message));

async function tx(fn) {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const out = await fn(client);
    await client.query('COMMIT');
    return out;
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

module.exports = { pool, tx };
