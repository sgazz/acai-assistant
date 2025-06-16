import React, { useState } from 'react';
import { Box, TextField, Button, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import SearchResults from './SearchResults';

interface SearchResult {
  content: string;
  metadata: {
    source: string;
    page?: number;
    type: string;
  };
}

const DocumentSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setIsSearching(true);
    setError(null);

    try {
      const response = await fetch(
        `http://localhost:8000/documents/search?query=${encodeURIComponent(query)}`
      );
      const data = await response.json();

      if (response.ok) {
        setResults(data.results);
      } else {
        setError(data.detail || 'Greška pri pretrazi dokumenata');
      }
    } catch (error) {
      setError('Greška pri povezivanju sa serverom');
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pretraži dokumente..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isSearching}
        />
        <Button
          variant="contained"
          onClick={handleSearch}
          disabled={isSearching || !query.trim()}
          startIcon={isSearching ? <CircularProgress size={20} /> : <SearchIcon />}
        >
          {isSearching ? 'Pretraga...' : 'Pretraži'}
        </Button>
      </Box>

      {error && (
        <Box sx={{ color: 'error.main', mb: 2 }}>
          {error}
        </Box>
      )}

      <SearchResults results={results} query={query} />
    </Box>
  );
};

export default DocumentSearch; 