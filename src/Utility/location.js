export const reverseGeocode = async (
    lat,
    lon
  ) => {
  
    try {
  
      const res = await fetch(
        `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&lat=${lat}&lon=${lon}&format=json`
      );
  
      const data = await res.json();
  
      return {
        address: data.display_name,
  
        state:
          data.address?.state || "",
  
        lga:
          data.address?.county || "",
  
        country:
          data.address?.country || "",
  
        lat,
        lng: lon,
      };
  
    } catch (error) {
  
      console.log(error);
  
      return null;
  
    }
  
  };