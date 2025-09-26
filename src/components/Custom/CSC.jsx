"use client";
import { useState, useEffect } from "react";

const CSC = () => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  const [cityQuery, setCityQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions");
      const data = await res.json();
      setCountries(data.data.map((c) => c.name));
    };
    fetchCountries();
  }, []);

  // Fetch states when country changes
  useEffect(() => {
    if (!selectedCountry) return;
    const fetchStates = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry }),
      });
      const data = await res.json();
      setStates(data.data.states.map((s) => s.name));
      setCities([]); // reset cities
      setSelectedState("");
      setSelectedCity("");
    };
    fetchStates();
  }, [selectedCountry]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;
    const fetchCities = async () => {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: selectedCountry, state: selectedState }),
      });
      const data = await res.json();
      setCities(data.data);
      setSelectedCity("");
    };
    fetchCities();
  }, [selectedState]);

  // Filter cities when typing (autocomplete)
  useEffect(() => {
    if (cityQuery.length >= 2) {
      setFilteredCities(
        cities.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase()))
      );
    } else {
      setFilteredCities([]);
    }
  }, [cityQuery, cities]);

  return (
    <div className="grid col-span-3 grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Country</label>
        <select
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="">Select Country</option>
          {countries.map((country, idx) => (
            <option key={idx} value={country}>
              {country}
            </option>
          ))}
        </select>
      </div>

      {states.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-gray-500 mb-1">State</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="">Select State</option>
            {states.map((state, idx) => (
              <option key={idx} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
      )}

      {cities.length > 0 && (
        <div className="relative">
          <label className="block text-sm font-medium text-gray-500 mb-1">City</label>
          <input
            type="text"
            value={cityQuery || selectedCity}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setSelectedCity("");
            }}
            placeholder="Type city..."
            className="w-full border rounded-lg px-3 py-2"
          />
          {filteredCities.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              {filteredCities.map((city, idx) => (
                <li
                  key={idx}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityQuery(city);
                    setFilteredCities([]);
                  }}
                  className="px-3 py-2 cursor-pointer hover:bg-purple-100"
                >
                  {city}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default CSC;
