/**
 * Role helper utility for Civic Paete.
 * Evaluates whether the current active session belongs to an official
 * (Municipal Administrator or Provincial Governor).
 */
export function isUserAdminOrGovernor(user?: {
  email?: string | null;
  displayName?: string | null;
} | null): boolean {
  if (typeof window !== "undefined") {
    // 1. Check local storage administrative session
    try {
      const stored = localStorage.getItem("civic_paete_admin_session");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.role === "admin" || parsed?.role === "governor") {
          return true;
        }
      }
    } catch {
      // Ignore parse errors
    }

    // 2. Check role cookies
    if (
      document.cookie.includes("civic_paete_role=admin") ||
      document.cookie.includes("civic_paete_role=governor")
    ) {
      return true;
    }
  }

  // 3. Check Firebase Auth user email domain / credentials
  if (user?.email) {
    const email = user.email.toLowerCase().trim();
    if (
      email.endsWith("@paete.gov.ph") ||
      email.endsWith("@laguna.gov.ph") ||
      email.includes("admin") ||
      email.includes("governor")
    ) {
      return true;
    }
  }

  // 4. Check display name hints
  if (user?.displayName) {
    const name = user.displayName.toLowerCase().trim();
    if (
      name.includes("administrator") ||
      name.includes("governor") ||
      name.includes("provincial governor")
    ) {
      return true;
    }
  }

  return false;
}
