'use strict';
/**
 * Append-only audit trail (M21). Every state transition and every issue lands
 * here in the same transaction as the change itself, so the trail can never
 * disagree with the data. UPDATE and DELETE are revoked at the database.
 */
async function record(client, { actorId, sampleId, action, detail }) {
  await client.query(
    `INSERT INTO txn_event (actor_id, sample_id, action, detail) VALUES ($1,$2,$3,$4)`,
    [actorId ?? null, sampleId ?? null, action, detail ? JSON.stringify(detail) : null]);
}
module.exports = { record };
