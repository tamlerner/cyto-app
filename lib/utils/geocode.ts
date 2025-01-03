// lib/utils/geocode.ts
export async function searchAddress(query: string) {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}&addressdetails=1&limit=5`,
        {
          headers: {
            'Accept-Language': 'en-US'
          }
        }
      );
      const data = await response.json();
      return data.map((item: any) => ({
        display_name: item.display_name,
        address: {
          road: item.address.road || '',
          house_number: item.address.house_number || '',
          city: item.address.city || item.address.town || '',
          state: item.address.state || '',
          country: item.address.country || '',
          postcode: item.address.postcode || ''
        }
      }));
    } catch (error) {
      console.error('Error searching address:', error);
      return [];
    }
  }