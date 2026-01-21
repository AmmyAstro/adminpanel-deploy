"use client";

import { useEffect, useState } from "react";

const CSC = ({ value, onChange }) => {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState(value?.country || "");
  const [selectedState, setSelectedState] = useState(value?.state || "");
  const [selectedCity, setSelectedCity] = useState(value?.city || "");

  const [cityQuery, setCityQuery] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);

  /* -------- Sync RHF value → local state -------- */
  useEffect(() => {
    if (!value) return;

    setSelectedCountry(value.country || "");
    setSelectedState(value.state || "");
    setSelectedCity(value.city || "");
    setCityQuery(value.city || "");
  }, [value]);

  /* -------- Fetch Countries -------- */
  useEffect(() => {
    fetch("https://countriesnow.space/api/v0.1/countries/positions")
      .then((res) => res.json())
      .then((data) => {
        setCountries(data.data.map((c) => c.name));
      })
      .catch(() => { });
  }, []);

  /* -------- Fetch States when country changes -------- */
  useEffect(() => {
    if (!selectedCountry) return;

    fetch("https://countriesnow.space/api/v0.1/countries/states", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ country: selectedCountry }),
    })
      .then((res) => res.json())
      .then((data) => {
        setStates(data.data.states.map((s) => s.name));
        setCities([]);
        setSelectedState("");
        setSelectedCity("");

        onChange({
          country: selectedCountry,
          state: "",
          city: "",
        });
      })
      .catch(() => { });
  }, [selectedCountry]);

  /* -------- Fetch Cities when state changes -------- */
  useEffect(() => {
    if (!selectedCountry || !selectedState) return;

    fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        country: selectedCountry,
        state: selectedState,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setCities(data.data);
        setSelectedCity("");

        onChange({
          country: selectedCountry,
          state: selectedState,
          city: "",
        });
      })
      .catch(() => { });
  }, [selectedState]);

  /* -------- City Autocomplete -------- */
  useEffect(() => {
    if (cityQuery.length >= 2) {
      setFilteredCities(
        cities.filter((c) =>
          c.toLowerCase().includes(cityQuery.toLowerCase())
        )
      );
    } else {
      setFilteredCities([]);
    }
  }, [cityQuery, cities]);

  return (
    <div className="flex  gap-6">
      {/* Country */}
      <select
        value={selectedCountry}
        onChange={(e) => setSelectedCountry(e.target.value)}
        className="border px-3 py-2 rounded-full  border-gray-400"
      >
        <option value="">Select Country</option>
        {countries.map((c) => (
          <option key={c} value={c}>
            {c}
          </option>
        ))}
      </select>

      {/* State */}
      {states.length > 0 && (
        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="border px-3 py-2 rounded-full  border-gray-400 "
        >
          <option value="">Select State</option>
          {states.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      )}

      {/* City */}
      {cities.length > 0 && (
        <div className="relative">
          <input
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setSelectedCity("");
            }}
            placeholder="Type city..."
            className="border px-3 py-2 rounded-full  border-gray-400"
          />

          {filteredCities.length > 0 && (
            <ul className="absolute bg-white border w-full rounded-lg mt-1 max-h-48 overflow-y-auto z-10">
              {filteredCities.map((city) => (
                <li
                  key={city}
                  onClick={() => {
                    setSelectedCity(city);
                    setCityQuery(city);
                    setFilteredCities([]);

                    onChange({
                      country: selectedCountry,
                      state: selectedState,
                      city,
                    });
                  }}
                  className="px-3 py-2 hover:bg-purple-100 cursor-pointer"
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
