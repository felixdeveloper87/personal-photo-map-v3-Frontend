/**
 * Map.jsx
 *
 * Renders a world map with dynamic highlighting for countries,
 * supporting interactive navigation and visual feedback based on login state.
 */


import React, { useEffect, useContext, useCallback, useState } from 'react';
import { MapContainer, GeoJSON, Rectangle } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import countriesData from '../map/countries.json';
import { AuthContext } from '../context/AuthContext';
import { CountriesContext } from '../context/CountriesContext';
import { Box, useColorModeValue } from '@chakra-ui/react';
import '../styles/tooltip.css';

const Map = () => {
  // Navigation hook to route to a country detail page on click
  const navigate = useNavigate();

  // Auth and Countries context
  const { isLoggedIn } = useContext(AuthContext);
  const { countriesWithPhotos, loading } = useContext(CountriesContext);

  // State controlling highlight animation for users not logged in
  const [highlightedCountries, setHighlightedCountries] = useState([]);
  const [isEffectActive, setIsEffectActive] = useState(!isLoggedIn);
  const oceanColor = useColorModeValue('rgba(179, 229, 252, 1)', 'rgba(16, 62, 135, 0.4)');

  /**
   * Track changes to the logged in state: if user logs in,
   * stop random highlighting; if user logs out, start highlighting again.
   */
  useEffect(() => {
    setIsEffectActive(!isLoggedIn);
  }, [isLoggedIn]);

  /**
   * Periodically select and highlight random countries
   * if the user is not logged in. This effect runs every 2 seconds.
   */
  useEffect(() => {
    let interval;

    if (isEffectActive && !isLoggedIn) {
      interval = setInterval(() => {
        const selectRandomCountries = (numCountries) => {
          const allCountries = countriesData.features.map(
            (country) => country.properties.iso_a2.toLowerCase()
          );
          const maxCountries = Math.min(numCountries, allCountries.length);
          const shuffled = allCountries.sort(() => 0.5 - Math.random());
          return shuffled.slice(0, maxCountries);
        };

        // Highlight up to 15 random countries for visual effect
        const randomCountries = selectRandomCountries(15);
        setHighlightedCountries(randomCountries);
      }, 2000);
    }

    return () => clearInterval(interval);
  }, [isEffectActive, isLoggedIn]);

  /**
   * Dynamically style each country:
   * - Highlight countries if user is not logged in (random pick).
   * - Fill green if the user is logged in and has photos for that country.
   * - Default fill for others.
   */
  const countryStyle = useCallback(
    (feature) => {
      const countryId = feature.properties.iso_a2.toLowerCase();
      const hasPhotos = countriesWithPhotos.some((country) => country.id === countryId);
      const isHighlighted = highlightedCountries.includes(countryId);

      // Random effect for logged-out users
      if (!isLoggedIn && isEffectActive && isHighlighted) {
        return {
          fillColor: '#2ecc71',
          weight: 2,
          color: '#1B4F72',
          fillOpacity: 0.9,
          transition: 'fill-opacity 0.5s ease, fill-color 0.5s ease',
        };
      }

      // Logged-in users with photos
      if (isLoggedIn && hasPhotos) {
        return {
          fillColor: '#2ecc71',
          weight: 2,
          color: '#1B4F72',
          fillOpacity: 1,
          transition: 'fill-opacity 0.5s ease, fill-color 0.5s ease',
        };
      }

      // Default fill
      return {
        fillColor: '#D4E6F1',
        weight: 2,
        color: '#1B4F72',
        fillOpacity: 1,
        transition: 'fill-opacity 0.5s ease, fill-color 0.5s ease',
      };
    },
    [countriesWithPhotos, highlightedCountries, isLoggedIn, isEffectActive]
  );

  /**
   * Called for each country (GeoJSON feature):
   * - Adds mouseover (hover) effect with fill color change.
   * - Reverts to original style on mouseout.
   * - Navigates to country details page on click.
   */
  const onEachCountry = useCallback(
    (country, layer) => {
      layer.on({
        mouseover: (e) => {
          e.target.setStyle({
            fillColor: '#3498DB',
            weight: 2,
            color: '#1B4F72',
            fillOpacity: 0.7,
          });
        },
        mouseout: (e) => {
          e.target.setStyle(countryStyle(country));
        },
        click: () => {
          const countryId = country.properties.iso_a2.toLowerCase();
          navigate(`/countries/${countryId}`);
        },
      });

      // Adiciona tooltip com o nome do país
      layer.bindTooltip(country.properties.name || country.properties.name_long, {
        permanent: false,
        direction: 'top',
        className: 'country-tooltip',
      });
    },
    [navigate, countryStyle]
  );

  /**
   * Restrict panning outside the world bounds. 
   * We define bounding coordinates for the map container to avoid
   * scrolling to an empty, off-world area.
   */
  const bounds = [
    [-85, -180],
    [85, 180],
  ];

  /**
   * Force GeoJSON to re-render if our countriesWithPhotos changes,
   * ensuring the updated styling is applied.
   */
  const [geoJsonKey, setGeoJsonKey] = useState(0);
  useEffect(() => {
    setGeoJsonKey((prevKey) => prevKey + 1);
  }, [countriesWithPhotos]);

  /**
   * A bounding rectangle to provide a background color (ocean) behind all countries.
   */
  const oceanBounds = [
    [-90, -180],
    [90, 180],
  ];

  return (
    <Box mt="-20px">
      <MapContainer
        center={[20, 0]}
        zoom={2.6}
        minZoom={2.3}
        maxZoom={7.5}
        maxBounds={bounds}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
        style={{ height: '1000px', width: '100%' }}
      >
        {/* Rectangle for the ocean background fill */}
        <Rectangle
          bounds={oceanBounds}
          pathOptions={{
            fillColor: oceanColor,
            fillOpacity: 1,
            stroke: false,
          }}
        />

        {/* GeoJSON for Country Outlines */}
        <GeoJSON
          key={geoJsonKey}
          data={countriesData}
          style={countryStyle}
          onEachFeature={onEachCountry}
        />
      </MapContainer>
    </Box>
  );
};

export default Map;
