import { parseArgs } from 'node:util';

const { values: { project, apply } } = parseArgs({
  options: { project: { type: 'string' }, apply: { type: 'boolean', default: false } },
});
const accessToken = process.env.FIRESTORE_ACCESS_TOKEN;
if (!project || !/^[a-z0-9-]+$/.test(project) || !accessToken) {
  throw new Error('Set FIRESTORE_ACCESS_TOKEN and run node scripts/remove-firestore-emails.mjs --project PROJECT_ID [--apply].');
}

const endpoint = 'https://firestore.googleapis.com/v1';
const database = `projects/${project}/databases/(default)`;
const fieldsByCollection = {
  users: ['email'],
  reports: ['authorEmail', 'email'],
  verification_requests: ['email'],
  audit_logs: ['actorEmail', 'email'],
};

async function request(path, options) {
  const response = await fetch(`${endpoint}/${path}`, {
    ...options,
    headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(`Firestore request failed with HTTP ${response.status}.`);
  return response.json();
}

for (const [collection, fields] of Object.entries(fieldsByCollection)) {
  let pageToken;
  let count = 0;
  do {
    const options = new URLSearchParams({ pageSize: '250' });
    for (const field of fields) options.append('mask.fieldPaths', field);
    if (pageToken) options.set('pageToken', pageToken);

    const page = await request(`${database}/documents/${collection}?${options}`);
    const writes = (page.documents ?? []).flatMap((document) => {
      const fieldPaths = fields.filter((field) => Object.hasOwn(document.fields ?? {}, field));
      if (!fieldPaths.length) return [];
      return [{
        update: { name: document.name, fields: {} },
        updateMask: { fieldPaths },
        currentDocument: { updateTime: document.updateTime },
      }];
    });
    if (apply && writes.length) {
      await request(`${database}/documents:commit`, {
        method: 'POST',
        body: JSON.stringify({ writes }),
      });
    }
    count += writes.length;
    pageToken = page.nextPageToken;
  } while (pageToken);
  console.log(`${collection}: ${count} documents ${apply ? 'cleaned' : 'contain email fields'}.`);
}
