import { useState } from "react";
import { reverseGeocode } from "../Utility/location";

export default function LocationModal({
  closeModal,
  saveLocation,
}) {

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [query, setQuery] =
    useState("");

  const [results, setResults] =
    useState([]);

  const [error, setError] =
    useState("");

  const API_KEY =
    process.env.REACT_APP_LOCATIONIQ_KEY;





  // 🔍 SEARCH
  const handleSearch = async (text) => {

    setQuery(text);
  
    if (text.length < 2) {
      return setResults([]);
    }
  
    try {
  
      const res = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?key=${API_KEY}&q=${text}&countrycodes=ng&limit=12&dedupe=1&normalizecity=1&addressdetails=1&format=json`
      );
  
      const data = await res.json();
  
      if (Array.isArray(data)) {
  
        const sorted = data.sort((a, b) => {
  
          const aName =
            a.display_name.toLowerCase();
  
          const bName =
            b.display_name.toLowerCase();
  
          const queryText =
            text.toLowerCase();
  
          const aStarts =
            aName.startsWith(queryText);
  
          const bStarts =
            bName.startsWith(queryText);
  
          if (aStarts && !bStarts) return -1;
  
          if (!aStarts && bStarts) return 1;
  
          return 0;
  
        });
  
        setResults(sorted);
  
      } else {
  
        setResults([]);
  
      }
  
    } catch (err) {
  
      setError("Search failed");
  
    }
  
  };

    

  // 📍 SELECT LOCATION
  const selectLocation =
    async (item) => {

      setLoading(true);

      const locationData = {
        display_name:
          item.display_name,

        lat: item.lat,

        lng: item.lon,
      };

      await saveLocation(
        locationData
      );

      setLoading(false);

      setSuccess(true);

      setTimeout(() => {
        closeModal();
      }, 1500);

    };

  // 📍 CURRENT LOCATION
  const handleCurrentLocation =
    () => {

      if (!navigator.geolocation) {

        return setError(
          "Geolocation not supported"
        );

      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(

        async (position) => {

          const lat =
            position.coords.latitude;

          const lng =
            position.coords.longitude;

            const geo = await reverseGeocode(lat, lng);

            const locationData = {
              display_name:
                geo.display_name || geo.address,
              lat,
              lng,
            };

          if (locationData) {

            await saveLocation(
              locationData
            );

            setLoading(false);

            setSuccess(true);

            setTimeout(() => {
              closeModal();
            }, 1500);

          } else {

            setError(
              "Could not fetch location"
            );

            setLoading(false);

          }

        },

        () => {

          setError(
            "Location permission denied"
          );

          setLoading(false);

        }

      );

    };

  return (

    <div className="fixed inset-0 z-50 bg-black/50 flex items-end font-montserrat">

      <div className="w-full bg-[#111] rounded-t-3xl p-6 animate-slideUp">

        <h2 className="text-2xl font-bold text-white font-bric">
        <i className="fa-solid fa-location-dot "></i> Set Your Location
        </h2>

        <p className="text-white/50 mt-2">
           Search or use your current
          location
        </p>

        {/* SEARCH */}
        <input
          value={query}
          onChange={(e) =>
            handleSearch(
              e.target.value
            )
          }
          placeholder="Search location..."
          className="w-full mt-4 p-3 rounded-xl bg-white/5 text-white outline-none"
        />

        {/* RESULTS */}
        <div className="max-h-40 overflow-y-auto mt-2 space-y-2">

          {results.map((item, index) => (

            <div
              key={index}
              onClick={() =>
                selectLocation(item)
              }
              className="p-3 bg-white/5 rounded-xl text-white text-sm cursor-pointer hover:bg-white/10"
            >
              <div className="font-medium">
              {item.address?.name ||
                item.address?.road ||
                item.address?.suburb ||
                "Unknown Place"}
            </div>

            <div className="text-white/40 text-xs mt-1">
              {item.address?.city ||
                item.address?.town ||
                item.address?.state ||
                item.address?.county}
            </div>
            </div>

          ))}

        </div>

        {/* BUTTON */}
        <button
          onClick={
            handleCurrentLocation
          }
          disabled={loading}
          className="w-full mt-6 p-4 rounded-2xl bg-orange-500 text-white font-semibold flex items-center justify-center gap-3"
        ><i className="fa-solid fa-location-arrow "></i>
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Saving...
            </>
          ) : success ? (
            "Location Saved ✓"
          ) : (
            "Use Current Location"
          )}

        </button>

        {error && (
          <div className="mt-3 text-red-400 text-sm">
            {error}
          </div>
        )}

        <button
          onClick={closeModal}
          className="w-full mt-3 p-4 rounded-2xl bg-white/5 text-white"
        >
          Cancel
        </button>

      </div>

    </div>

  );

}