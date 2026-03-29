import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Droplets, Wind, Sun, Cloud, CloudRain, CloudSnow, CloudLightning, Eye, Navigation } from 'lucide-react';

interface WeatherSnapshot {
  time: string;
  temp: number;
  condition: string;
  code: number;
}

interface DailyForecast {
  day: string;
  tempMax: number;
  tempMin: number;
  condition: string;
  precipProb: number;
  code: number;
}

interface WeatherData {
  city: string;
  country: string;
  temp: number;
  condition: string;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  uvIndex: number;
  visibility: number;
  hourly: WeatherSnapshot[];
  daily: DailyForecast[];
  lat: number;
  lon: number;
}

const globeCities = [
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'GB' },
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'US' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'JP' }
];

export const WeatherTool: React.FC = () => {
  const [search, setSearch] = useState('');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const fetchWeather = async (lat: number, lon: number, cityName: string, countryCode?: string) => {
    try {
      setLoading(true);
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`);
      const data = await res.json();
      
      const now = new Date();
      const currentHour = now.getHours();
      
      const hourly: WeatherSnapshot[] = data.hourly.time.slice(currentHour, currentHour + 24).map((t: string, i: number) => ({
        time: new Date(t).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' }),
        temp: Math.round(data.hourly.temperature_2m[currentHour + i]),
        condition: getWeatherCondition(data.hourly.weathercode[currentHour + i]),
        code: data.hourly.weathercode[currentHour + i]
      }));

      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const daily: DailyForecast[] = data.daily.time.map((t: string, i: number) => ({
        day: i === 0 ? 'Today' : days[new Date(t).getDay()],
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        condition: getWeatherCondition(data.daily.weathercode[i]),
        precipProb: data.daily.precipitation_probability_max[i],
        code: data.daily.weathercode[i]
      }));

      setWeather({
        city: cityName,
        country: countryCode || '',
        temp: Math.round(data.current_weather.temperature_2m),
        condition: getWeatherCondition(data.current_weather.weathercode),
        feelsLike: Math.round(data.current_weather.temperature_2m - 2),
        humidity: 68,
        windSpeed: data.current_weather.windspeed,
        uvIndex: 5,
        visibility: 10,
        hourly,
        daily,
        lat,
        lon
      });
      setError(null);
      localStorage.setItem('procalc_weather_city', JSON.stringify({ name: cityName, lat, lon, country: countryCode }));
    } catch (e) {
      setError('Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(search)}&count=1&language=en&format=json`);
      const data = await res.json();
      if (data.results && data.results.length > 0) {
        const city = data.results[0];
        fetchWeather(city.latitude, city.longitude, city.name, city.country_code);
        setSearch('');
      } else {
        setError('City not found');
      }
    } catch (e) {
      setError('Geocoding service failed');
    } finally {
      if (!weather) setLoading(false);
    }
  };

  const getWeatherCondition = (code: number) => {
    if (code === 0) return 'Clear';
    if (code <= 3) return 'Partly Cloudy';
    if (code <= 48) return 'Foggy';
    if (code <= 67) return 'Rainy';
    if (code <= 77) return 'Snowy';
    return 'Stormy';
  };

  const getWeatherIcon = (code: number, size: number = 24) => {
    if (code === 0) return <Sun size={size} color="#fbbf24" />;
    if (code <= 3) return <Cloud size={size} color="#38bdf8" />;
    if (code <= 48) return <Cloud size={size} color="#94a3b8" />;
    if (code <= 67) return <CloudRain size={size} color="#38bdf8" />;
    if (code <= 77) return <CloudSnow size={size} color="#ffffff" />;
    return <CloudLightning size={size} color="#fbbf24" />;
  };

  useEffect(() => {
    const saved = localStorage.getItem('procalc_weather_city');
    if (saved) {
      const city = JSON.parse(saved);
      fetchWeather(city.lat, city.lon, city.name, city.country);
    } else {
      fetchWeather(51.5074, -0.1278, 'London', 'GB');
    }
  }, []);

  return (
    <div style={{
      width: '100%',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem',
      display: 'grid',
      gridTemplateColumns: '1fr 315px',
      gap: '1.5rem',
      minHeight: '80vh'
    }}>
      {/* --- Main Content (Left) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '800', 
            color: '#fbbf24', 
            fontFamily: 'Outfit',
            letterSpacing: '-1px'
          }}>
            Weather Forecast
          </h1>
          
          <form onSubmit={handleSearch} style={{ position: 'relative', width: '300px' }}>
            <input 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search city..."
              className="glass"
              style={{
                width: '100%',
                padding: '12px 16px 12px 40px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                color: 'white',
                outline: 'none',
                fontSize: '0.9rem',
              }}
            />
            <Search size={16} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.3 }} />
          </form>
        </div>

        {error && <div style={{ color: '#ff3b30', fontSize: '0.9rem' }}>{error}</div>}

        <AnimatePresence mode="wait">
          {weather && !loading && (
            <motion.div
              key={weather.city}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
            >
              {/* Primary Weather Card */}
              <div className="glass" style={{ padding: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>
                    <MapPin size={16} />
                    <span>{weather.city}, {weather.country}</span>
                  </div>
                  <h2 style={{ fontSize: '8rem', fontWeight: '800', fontFamily: 'Outfit', margin: '0.5rem 0', lineHeight: '1' }}>
                    {weather.temp}°
                  </h2>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: 'white' }}>{weather.condition}</div>
                  <div style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.4)', fontWeight: '500' }}>
                    Feels like {weather.feelsLike}° • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <div style={{ transform: 'scale(4.5)', paddingRight: '2rem' }}>
                  {getWeatherIcon(weather.daily[0].code, 48)}
                </div>
              </div>

              {/* Metrics Row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                <MetricBox icon={Wind} label="Wind Speed" val={`${weather.windSpeed} km/h`} color="#38bdf8" />
                <MetricBox icon={Eye} label="Visibility" val={`${weather.visibility} km`} color="#fbbf24" />
                <MetricBox icon={Sun} label="UV Index" val={weather.uvIndex.toString()} color="#fbbf24" />
              </div>

              {/* 24-Hour Timeline */}
              <div className="glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.01)' }}>
                <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '2rem' }}>
                   Next 24 Hours
                </h3>
                <div 
                  ref={scrollRef}
                  style={{ 
                    display: 'flex', 
                    gap: '2rem', 
                    overflowX: 'auto', 
                    paddingBottom: '1rem',
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none'
                  }}
                >
                  {weather.hourly.map((hour, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', minWidth: '64px' }}>
                      <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', fontWeight: '600' }}>{hour.time}</span>
                      {getWeatherIcon(hour.code, 28)}
                      <span style={{ fontWeight: '800', fontSize: '1.2rem' }}>{hour.temp}°</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--accent-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
          </div>
        )}
      </div>

      {/* --- Sidebar (Right) --- */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* 7-Day Forecast */}
        <div className="glass" style={{ padding: '2rem', background: 'rgba(255,255,255,0.02)' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '1.5rem' }}>
            7-Day Forecast
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {weather?.daily.map((day, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                padding: '1rem 0',
                borderBottom: i === 6 ? 'none' : '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ width: '64px', fontWeight: '700', fontSize: '0.9rem' }}>{day.day}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '80px' }}>
                  <Droplets size={14} color="#38bdf8" />
                  <span style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: '700' }}>{day.precipProb}%</span>
                </div>
                {getWeatherIcon(day.code, 24)}
                <div style={{ width: '40px', textAlign: 'right', fontWeight: '800', fontSize: '1rem' }}>
                  {day.tempMax}°
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Globe Highlights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '0.85rem', fontWeight: '800', color: '#fbbf24', textTransform: 'uppercase', letterSpacing: '2px', marginLeft: '1rem' }}>
            Globe Centers
          </h3>
          {globeCities.map((city) => (
            <motion.button
              key={city.name}
              whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.05)' }}
              whileTap={{ scale: 0.98 }}
              onClick={() => fetchWeather(city.lat, city.lon, city.name, city.country)}
              style={{
                width: '100%',
                padding: '1.5rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '1rem',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', textAlign: 'left' }}>
                <span style={{ fontWeight: '800', color: 'white', fontSize: '1rem' }}>{city.name}</span>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>{city.country} Area</span>
              </div>
              <Navigation size={16} color="#38bdf8" />
            </motion.button>
          ))}
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { display: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const MetricBox = ({ icon: Icon, label, val, color }: any) => (
  <div className="glass" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.01)' }}>
    <div style={{ 
      width: '44px', 
      height: '44px', 
      borderRadius: '12px', 
      background: `${color}15`, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      color: color 
    }}>
       <Icon size={22} strokeWidth={2.5} />
    </div>
    <div style={{ textAlign: 'center' }}>
       <div style={{ fontSize: '0.7rem', fontWeight: '800', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{label}</div>
       <div style={{ fontSize: '1.2rem', fontWeight: '800' }}>{val}</div>
    </div>
  </div>
);
