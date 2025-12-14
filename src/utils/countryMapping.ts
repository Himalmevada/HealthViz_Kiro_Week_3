// Country code mapping for API calls
export interface CountryInfo {
  name: string;
  code: string;
  iso2: string;
  states?: StateInfo[];
}

export interface StateInfo {
  name: string;
  code: string;
  cities: string[];
}

export const COUNTRY_MAPPING: Record<string, CountryInfo> = {
  'India': {
    name: 'India',
    code: 'IND',
    iso2: 'IN',
    states: [
      {
        name: 'Delhi',
        code: 'DL',
        cities: ['New Delhi', 'Delhi', 'Central Delhi', 'East Delhi', 'North Delhi', 'South Delhi', 'West Delhi']
      },
      {
        name: 'Maharashtra',
        code: 'MH',
        cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik']
      },
      {
        name: 'West Bengal',
        code: 'WB',
        cities: ['Kolkata', 'Howrah', 'Asansol']
      },
      {
        name: 'Tamil Nadu',
        code: 'TN',
        cities: ['Chennai', 'Coimbatore', 'Madurai']
      },
      {
        name: 'Karnataka',
        code: 'KA',
        cities: ['Bangalore', 'Mysore', 'Hubli']
      },
      {
        name: 'Telangana',
        code: 'TG',
        cities: ['Hyderabad', 'Warangal']
      },
      {
        name: 'Gujarat',
        code: 'GJ',
        cities: ['Ahmedabad', 'Surat', 'Vadodara']
      },
      {
        name: 'Rajasthan',
        code: 'RJ',
        cities: ['Jaipur', 'Jodhpur', 'Udaipur']
      },
      {
        name: 'Uttar Pradesh',
        code: 'UP',
        cities: ['Lucknow', 'Kanpur', 'Agra', 'Varanasi']
      }
    ]
  },
  'United States': {
    name: 'United States',
    code: 'USA',
    iso2: 'US',
    states: [
      {
        name: 'California',
        code: 'CA',
        cities: ['Los Angeles', 'San Francisco', 'San Diego', 'Sacramento']
      },
      {
        name: 'New York',
        code: 'NY',
        cities: ['New York', 'Buffalo', 'Rochester']
      },
      {
        name: 'Texas',
        code: 'TX',
        cities: ['Houston', 'Dallas', 'Austin', 'San Antonio']
      },
      {
        name: 'Illinois',
        code: 'IL',
        cities: ['Chicago', 'Aurora', 'Naperville']
      },
      {
        name: 'Florida',
        code: 'FL',
        cities: ['Miami', 'Orlando', 'Tampa', 'Jacksonville']
      }
    ]
  },
  'United Kingdom': {
    name: 'United Kingdom',
    code: 'GBR',
    iso2: 'GB',
    states: [
      {
        name: 'England',
        code: 'ENG',
        cities: ['London', 'Manchester', 'Birmingham', 'Leeds', 'Liverpool']
      },
      {
        name: 'Scotland',
        code: 'SCT',
        cities: ['Edinburgh', 'Glasgow', 'Aberdeen']
      },
      {
        name: 'Wales',
        code: 'WLS',
        cities: ['Cardiff', 'Swansea', 'Newport']
      }
    ]
  },
  'Brazil': {
    name: 'Brazil',
    code: 'BRA',
    iso2: 'BR',
    states: [
      {
        name: 'São Paulo',
        code: 'SP',
        cities: ['São Paulo', 'Campinas', 'Santos']
      },
      {
        name: 'Rio de Janeiro',
        code: 'RJ',
        cities: ['Rio de Janeiro', 'Niterói']
      },
      {
        name: 'Bahia',
        code: 'BA',
        cities: ['Salvador', 'Feira de Santana']
      }
    ]
  },
  'Germany': {
    name: 'Germany',
    code: 'DEU',
    iso2: 'DE',
    states: [
      {
        name: 'Bavaria',
        code: 'BY',
        cities: ['Munich', 'Nuremberg']
      },
      {
        name: 'Berlin',
        code: 'BE',
        cities: ['Berlin']
      },
      {
        name: 'North Rhine-Westphalia',
        code: 'NW',
        cities: ['Cologne', 'Düsseldorf', 'Dortmund']
      }
    ]
  },
  'France': {
    name: 'France',
    code: 'FRA',
    iso2: 'FR',
    states: [
      {
        name: 'Île-de-France',
        code: 'IDF',
        cities: ['Paris', 'Versailles']
      },
      {
        name: 'Provence-Alpes-Côte d\'Azur',
        code: 'PAC',
        cities: ['Marseille', 'Nice']
      },
      {
        name: 'Auvergne-Rhône-Alpes',
        code: 'ARA',
        cities: ['Lyon', 'Grenoble']
      }
    ]
  },
  'Japan': {
    name: 'Japan',
    code: 'JPN',
    iso2: 'JP',
    states: [
      {
        name: 'Tokyo',
        code: '13',
        cities: ['Tokyo', 'Shibuya', 'Shinjuku']
      },
      {
        name: 'Osaka',
        code: '27',
        cities: ['Osaka', 'Sakai']
      },
      {
        name: 'Kyoto',
        code: '26',
        cities: ['Kyoto']
      }
    ]
  },
  'Australia': {
    name: 'Australia',
    code: 'AUS',
    iso2: 'AU',
    states: [
      {
        name: 'New South Wales',
        code: 'NSW',
        cities: ['Sydney', 'Newcastle', 'Wollongong']
      },
      {
        name: 'Victoria',
        code: 'VIC',
        cities: ['Melbourne', 'Geelong']
      },
      {
        name: 'Queensland',
        code: 'QLD',
        cities: ['Brisbane', 'Gold Coast']
      }
    ]
  }
};

// Helper functions
export const getCountryCode = (countryName: string): string => {
  return COUNTRY_MAPPING[countryName]?.iso2 || countryName;
};

export const getCountryISO3 = (countryName: string): string => {
  return COUNTRY_MAPPING[countryName]?.code || countryName;
};

export const getStatesForCountry = (countryName: string): StateInfo[] => {
  return COUNTRY_MAPPING[countryName]?.states || [];
};

export const getCitiesForState = (countryName: string, stateName: string): string[] => {
  const country = COUNTRY_MAPPING[countryName];
  if (!country?.states) return [];

  const state = country.states.find(s => s.name === stateName);
  return state?.cities || [];
};

export const getAllCitiesForCountry = (countryName: string): string[] => {
  const country = COUNTRY_MAPPING[countryName];
  if (!country?.states) return [];

  return country.states.flatMap(state => state.cities);
};

export const getCountryList = (): string[] => {
  return Object.keys(COUNTRY_MAPPING);
};
