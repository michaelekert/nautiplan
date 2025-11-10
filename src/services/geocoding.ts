export async function getPlaceName([lon, lat]: [number, number]): Promise<string | null> {
  const apiKey = import.meta.env.VITE_MAPTILER_API_KEY;
  const url = `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${apiKey}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data?.features?.length) return null;

    const place =
      data.features.find((f: any) => f.place_type?.includes("municipal_district")) ||
      data.features.find((f: any) => f.place_type?.includes("region")) ||
      data.features[3];

    return place?.text || place?.place_name || null;
  } catch (e) {
    console.error("Błąd reverse geocodingu:", e);
    return null;
  }
}
