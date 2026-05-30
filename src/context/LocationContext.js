import {
    createContext,
    useContext,
    useState,
    useEffect,
  } from "react";
  
  import { auth, db } from "../firebase";

  
  
  import {
    doc,
    getDoc,
    updateDoc,
  } from "firebase/firestore";
  
  export const LocationContext = createContext();

export const LocationProvider = ({ children }) => {

  const [location, setLocation] = useState(null);

  // NEW: extra addresses
  const [extraLocations, setExtraLocations] = useState([]);

  // LOAD LOCATION
  useEffect(() => {
    const loadLocation = async () => {
      const saved = localStorage.getItem("userLocation");

      if (saved) {
        setLocation(JSON.parse(saved));
      }

      if (auth.currentUser) {
        const ref = doc(db, "users", auth.currentUser.uid);
        const snap = await getDoc(ref);

        if (snap.exists()) {

          if (snap.data().location) {
            setLocation(snap.data().location);
          }

          if (snap.data().extraLocations) {
            setExtraLocations(snap.data().extraLocations);
          }
        }
      }
    };

    loadLocation();
  }, []);

  // SAVE MAIN LOCATION (UNCHANGED)
  const saveLocation = async (newLocation) => {

    localStorage.setItem("userLocation", JSON.stringify(newLocation));
    setLocation(newLocation);

    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        location: newLocation,
      });
    }

    window.dispatchEvent(new Event("locationUpdated"));
  };

  // ADD EXTRA LOCATION (NEW)
  const addExtraLocation = async (newLocation) => {

    const updated = [...extraLocations, newLocation];

    setExtraLocations(updated);

    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        extraLocations: updated,
      });
    }

    window.dispatchEvent(new Event("locationUpdated"));
  };

  // REMOVE EXTRA LOCATION (OPTIONAL)
  const removeExtraLocation = async (index) => {

    const updated = extraLocations.filter((_, i) => i !== index);

    setExtraLocations(updated);

    if (auth.currentUser) {
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        extraLocations: updated,
      });
    }

    window.dispatchEvent(new Event("locationUpdated"));
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        extraLocations,
        saveLocation,
        addExtraLocation,
        removeExtraLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);