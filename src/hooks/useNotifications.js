import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

export function useNotifications() {

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {

    const fetch = async () => {

      if (!auth.currentUser) return;

      const ref = doc(db, "users", auth.currentUser.uid);
      const snap = await getDoc(ref);

      if (snap.exists()) {

        const data = snap.data();

        const notes = data.notifications || [];

        // sort by time (newest first)
        const sorted = notes.sort(
          (a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        setNotifications(sorted);

      }

    };

    fetch();

  }, []);

  return { notifications, setNotifications };
}