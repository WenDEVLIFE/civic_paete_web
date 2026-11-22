import type { User } from "firebase/auth";
import { doc, onSnapshot, type Firestore } from "firebase/firestore";
import { useEffect, useState } from "react";

function isOfficialRole(role: unknown) {
  return role === "admin" || role === "governor" || role === "official" || role === "department_head";
}

export function useResidencyVerificationVisibility(user: User | null, db: Firestore) {
  const [residentProfile, setResidentProfile] = useState<User | null>(null);
  const [residentClaims, setResidentClaims] = useState<User | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;
    void user.getIdTokenResult().then(({ claims }) => {
      if (active) setResidentClaims(claims.admin === true || isOfficialRole(claims.role) ? null : user);
    }).catch(() => {
      if (active) setResidentClaims(null);
    });

    const unsubscribe = onSnapshot(doc(db, "users", user.uid), (snapshot) => {
      const profile = snapshot.data();
      const isOfficial = isOfficialRole(profile?.role) || profile?.verificationStatus === "municipal_officer";
      setResidentProfile(isOfficial ? null : user);
    }, () => setResidentProfile(null));

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, db]);

  return user !== null && user === residentProfile && user === residentClaims;
}
