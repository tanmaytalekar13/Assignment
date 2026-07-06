// Lightweight, client-only authentication.
//
// There is no backend in this project (the assessment brief marks backend
// and database as optional), so this module simulates a JWT-based auth flow
// entirely in the browser: accounts are hashed with SHA-256 (Web Crypto)
// and stored in localStorage, and "tokens" are structured exactly like a
// real JWT (base64url header.payload.signature) so the shape of the flow
// mirrors a production setup. This is intentionally NOT secure enough for
// a real product - see the README "Authentication" section for how this
// would be swapped for a real Express + JWT backend.

const USERS_KEY = "lineage-ledger:users";
const SESSION_KEY = "lineage-ledger:session";
const DEMO_SECRET = "lineage-ledger-demo-secret"; // demo only, never do this in production

function base64url(input) {
  return btoa(unescape(encodeURIComponent(input))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sha256Hex(text) {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function signToken(payload) {
  const header = { alg: "HS256-demo", typ: "JWT" };
  const encodedHeader = base64url(JSON.stringify(header));
  const encodedPayload = base64url(JSON.stringify(payload));
  const signature = await sha256Hex(`${encodedHeader}.${encodedPayload}.${DEMO_SECRET}`);
  return `${encodedHeader}.${encodedPayload}.${signature.slice(0, 43)}`;
}

function decodeToken(token) {
  try {
    const [, payload] = token.split(".");
    return JSON.parse(decodeURIComponent(escape(atob(payload.replace(/-/g, "+").replace(/_/g, "/")))));
  } catch {
    return null;
  }
}

function getUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || {};
  } catch {
    return {};
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

export async function signup(username, password) {
  const clean = username.trim().toLowerCase();
  if (clean.length < 3) throw new Error("Username must be at least 3 characters.");
  if (password.length < 4) throw new Error("Password must be at least 4 characters.");

  const users = getUsers();
  if (users[clean]) throw new Error("That username is already taken.");

  const passwordHash = await sha256Hex(password);
  users[clean] = { passwordHash, createdAt: new Date().toISOString() };
  saveUsers(users);

  return login(clean, password);
}

export async function login(username, password) {
  const clean = username.trim().toLowerCase();
  const users = getUsers();
  const record = users[clean];
  if (!record) throw new Error("No account found with that username.");

  const passwordHash = await sha256Hex(password);
  if (passwordHash !== record.passwordHash) throw new Error("Incorrect password.");

  const token = await signToken({ sub: clean, iat: Date.now(), exp: Date.now() + 1000 * 60 * 60 * 12 });
  localStorage.setItem(SESSION_KEY, token);
  return { username: clean, token };
}

export function logout() {
  localStorage.removeItem(SESSION_KEY);
}

export function getSession() {
  const token = localStorage.getItem(SESSION_KEY);
  if (!token) return null;

  const payload = decodeToken(token);
  if (!payload || payload.exp < Date.now()) {
    localStorage.removeItem(SESSION_KEY);
    return null;
  }
  return { username: payload.sub, token };
}
