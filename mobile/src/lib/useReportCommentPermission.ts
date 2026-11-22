import type { User } from 'firebase/auth';
import { doc, onSnapshot, type Firestore } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export function useReportCommentPermission(user: User | null, db: Firestore | null) {
  const [claimUser, setClaimUser] = useState<User | null>(null);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  useEffect(() => {
    if (!user || !db) return;
    let active = true;
    void user.getIdTokenResult().then(({ claims }) => {
      if (active) {
        setClaimUser(
          claims.admin === true || claims.role === 'admin' || claims.role === 'governor'
            ? user : null
        );
      }
    }).catch(() => {
      if (active) setClaimUser(null);
    });

    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
      const role = snapshot.data()?.role;
      setProfileUser(role === 'admin' || role === 'governor' ? user : null);
    }, () => setProfileUser(null));

    return () => {
      active = false;
      unsubscribe();
    };
  }, [user, db]);

  return user !== null && (user === claimUser || user === profileUser);
}
