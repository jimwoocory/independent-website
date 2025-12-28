import {cookies} from "next/headers";
import type {NextRequest} from "next/server";

export type AdminRole = "admin" | "editor" | "viewer";

const COOKIE_NAME = "admin_session_v2";
const LEGACY_COOKIE_NAME = "admin_session";

const ROLE_PASSWORDS: Record<AdminRole, string | undefined> = {
  admin: process.env.ADMIN_PASSWORD,
  editor: process.env.EDITOR_PASSWORD,
  viewer: process.env.VIEWER_PASSWORD,
};

const SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET || ROLE_PASSWORDS.admin || ROLE_PASSWORDS.editor || ROLE_PASSWORDS.viewer || "admin-secret";

function isRole(value: string): value is AdminRole {
  return value === "admin" || value === "editor" || value === "viewer";
}

function roleFromPassword(raw: string | undefined): AdminRole | null {
  if (!raw) return null;
  if (raw === ROLE_PASSWORDS.admin) return "admin";
  if (raw === ROLE_PASSWORDS.editor) return "editor";
  if (raw === ROLE_PASSWORDS.viewer) return "viewer";
  return null;
}

function parseToken(cookieValue: string | undefined): AdminRole | null {
  if (!cookieValue) return null;
  const [role, secret] = cookieValue.split("|");
  if (isRole(role) && secret === SESSION_SECRET) {
    return role;
  }
  return roleFromPassword(cookieValue);
}

export function createSessionToken(role: AdminRole) {
  return `${role}|${SESSION_SECRET}`;
}

export function matchPasswordToRole(password: string): AdminRole | null {
  return roleFromPassword(password);
}

export function getRoleFromRequest(req: NextRequest): AdminRole | null {
  const value = req.cookies.get(COOKIE_NAME)?.value || req.cookies.get(LEGACY_COOKIE_NAME)?.value;
  return parseToken(value);
}

export function getRoleFromCookies(): AdminRole | null {
  const store = cookies();
  const value = store.get(COOKIE_NAME)?.value || store.get(LEGACY_COOKIE_NAME)?.value;
  return parseToken(value);
}

const roleRank: Record<AdminRole, number> = {
  viewer: 1,
  editor: 2,
  admin: 3,
};

export function hasRequiredRole(role: AdminRole | null, minRole: AdminRole) {
  if (!role) return false;
  return roleRank[role] >= roleRank[minRole];
}

export function ensureRole(minRole: AdminRole): boolean {
  const role = getRoleFromCookies();
  return hasRequiredRole(role, minRole);
}

export function getCookieName() {
  return COOKIE_NAME;
}

export function getLegacyCookieName() {
  return LEGACY_COOKIE_NAME;
}
