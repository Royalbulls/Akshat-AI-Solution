import React, { useState, useEffect } from 'react';
import { KundliDetails } from '../types';
import { OmIcon, SearchIcon } from './Icons';
import { getCoordinatesForPlace, getTimezoneForPlace } from '../services/geminiService';

interface KundliModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: KundliDetails) => void;
  initialDetails: KundliDetails | null;
}

const KundliModal: React.FC<KundliModalProps> = ({ isOpen, onClose, onSave, initialDetails }) => {
  const [name, setName] = useState('');
  const [dob, setDob] = useState('');
  const [tob, setTob] = useState('');
  const [pob, setPob] = useState('');
  const [lat, setLat] = useState<number | ''>('');
  const [lon, setLon] = useState<number | ''>('');
  const [tzone, setTzone] = useState<number | ''>('');
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [geocodingError, setGeocodingError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setName(initialDetails?.name || '');
      setDob(initialDetails?.dob || '');
      setTob(initialDetails?.tob || '');
      setPob(initialDetails?.pob || '');
      setLat(initialDetails?.lat || '');
      setLon(initialDetails?.lon || '');
      setTzone(initialDetails?.tzone || '');
      setGeocodingError(null);
    }
  }, [isOpen, initialDetails]);

  if (!isOpen) return null;

  const handleFindCoordinates = async () => {
    if (!pob.trim()) return;
    setIsGeocoding(true);
    setGeocodingError(null);
    try {
        // Use Promise.all to fetch both simultaneously
        const [coords, timezone] = await Promise.all([
            getCoordinatesForPlace(pob.trim()),
            getTimezoneForPlace(pob.trim())
        ]);
        
        setLat(coords.lat);
        setLon(coords.lon);
        setTzone(timezone.tzone);

    } catch (error: any) {
        setGeocodingError(error.message);
    } finally {
        setIsGeocoding(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && dob && tob && pob.trim() && lat !== '' && lon !== '' && tzone !== '') {
      onSave({
        name: name.trim(),
        dob,
        tob,
        pob: pob.trim(),
        lat: Number(lat),
        lon: Number(lon),
        tzone: Number(tzone)
      });
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="kundli-modal-title"
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-center justify-between p-5 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <OmIcon className="w-6 h-6 text-amber-300"/>
            <h2 id="kundli-modal-title" className="text-xl font-bold text-white">
              Kundli Persona Details
            </h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl font-bold" aria-label="Close modal">&times;</button>
        </header>
        
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col overflow-hidden">
            <div className="p-6 space-y-4 overflow-y-auto">
              <p className="text-sm text-gray-400">Provide your birth details for an accurate, data-driven astrological reading. This data is saved locally.</p>
                <div>
                    <label htmlFor="kundli-name" className="block text-sm font-medium text-gray-300 mb-1">
                        Your Name (आपका नाम)
                    </label>
                    <input
                        id="kundli-name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Rohan Kumar"
                        className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                        required
                    />
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="kundli-dob" className="block text-sm font-medium text-gray-300 mb-1">
                            Date of Birth (जन्म तिथि)
                        </label>
                        <input
                            id="kundli-dob"
                            type="date"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="kundli-tob" className="block text-sm font-medium text-gray-300 mb-1">
                           Time of Birth (जन्म समय)
                        </label>
                        <input
                            id="kundli-tob"
                            type="time"
                            value={tob}
                            onChange={(e) => setTob(e.target.value)}
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="kundli-pob" className="block text-sm font-medium text-gray-300 mb-1">
                       Place of Birth (जन्म स्थान)
                    </label>
                    <div className="flex items-center gap-2">
                        <input
                            id="kundli-pob"
                            type="text"
                            value={pob}
                            onChange={(e) => {
                                setPob(e.target.value);
                                setGeocodingError(null);
                            }}
                            placeholder="e.g., Delhi, India"
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                        <button 
                            type="button" 
                            onClick={handleFindCoordinates} 
                            disabled={!pob.trim() || isGeocoding}
                            className="p-3 bg-amber-600 text-white rounded-md hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed flex-shrink-0"
                            title="Auto-detect coordinates for the entered place"
                        >
                            {isGeocoding ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            ) : (
                                <SearchIcon className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {geocodingError && <p className="text-xs text-red-400 mt-1">{geocodingError}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label htmlFor="kundli-lat" className="block text-sm font-medium text-gray-300 mb-1">
                            Latitude (अक्षांश)
                        </label>
                        <input
                            id="kundli-lat"
                            type="number"
                            step="any"
                            value={lat}
                            onChange={(e) => setLat(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            placeholder="e.g., 28.6139"
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="kundli-lon" className="block text-sm font-medium text-gray-300 mb-1">
                           Longitude (देशांतर)
                        </label>
                        <input
                            id="kundli-lon"
                            type="number"
                            step="any"
                            value={lon}
                            onChange={(e) => setLon(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            placeholder="e.g., 77.2090"
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                     <div>
                        <label htmlFor="kundli-tzone" className="block text-sm font-medium text-gray-300 mb-1">
                           Timezone
                        </label>
                        <input
                            id="kundli-tzone"
                            type="number"
                            step="any"
                            value={tzone}
                            onChange={(e) => setTzone(e.target.value === '' ? '' : parseFloat(e.target.value))}
                            placeholder="e.g., 5.5"
                            className="w-full bg-gray-700 text-white rounded-md border-gray-600 focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                            required
                        />
                    </div>
                </div>
                 <p className="text-xs text-gray-500 text-center">
                    Latitude, Longitude and Timezone will be auto-detected when you search for a place.
                </p>
            </div>
            <footer className="p-5 border-t border-gray-700 flex-shrink-0 flex justify-end items-center gap-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 rounded-md hover:bg-gray-600">
                    Cancel
                </button>
                <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-md hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed" disabled={!name.trim() || !dob || !tob || !pob.trim() || lat === '' || lon === '' || tzone === ''}>
                    Save & Activate
                </button>
            </footer>
        </form>
      </div>
    </div>
  );
};

export default KundliModal;