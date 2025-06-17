'use client';

import React, { useState } from 'react';
import { Box, TextField, IconButton, Tooltip, Paper, Typography, FormControl, InputLabel, Select, MenuItem, Chip, Collapse, Fade } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import SortIcon from '@mui/icons-material/Sort';
import SearchResults from './SearchResults';

export default function DocumentSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');
  const [fileType, setFileType] = useState('all');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          sortBy,
          fileType,
        }),
      });

      if (!response.ok) {
        throw new Error('Greška pri pretrazi');
      }

      const data = await response.json();
      setResults(data.results);
    } catch (error) {
      console.error('Greška:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() ? 
        <span key={i} style={{ backgroundColor: 'yellow', color: 'black' }}>{part}</span> : 
        part
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
      }}
    >
      <form onSubmit={handleSearch}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pretraži dokumente..."
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                endAdornment: (
                  <Tooltip title="Filtri">
                    <IconButton 
                      size="small"
                      onClick={() => setShowFilters(!showFilters)}
                      sx={{
                        color: showFilters ? 'primary.main' : 'text.secondary',
                      }}
                    >
                      <FilterListIcon />
                    </IconButton>
                  </Tooltip>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                },
              }}
            />
            <Tooltip title="Pretraži">
              <IconButton
                type="submit"
                color="primary"
                disabled={!query.trim() || isLoading}
                sx={{
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                  },
                }}
              >
                <SearchIcon />
              </IconButton>
            </Tooltip>
          </Box>

          <Collapse in={showFilters}>
            <Fade in={showFilters}>
              <Box sx={{ display: 'flex', gap: 2, p: 2, bgcolor: 'background.default', borderRadius: 2 }}>
                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Sortiraj po</InputLabel>
                  <Select
                    value={sortBy}
                    label="Sortiraj po"
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <MenuItem value="relevance">Relevantnosti</MenuItem>
                    <MenuItem value="date">Datumu</MenuItem>
                    <MenuItem value="name">Nazivu</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 120 }}>
                  <InputLabel>Tip fajla</InputLabel>
                  <Select
                    value={fileType}
                    label="Tip fajla"
                    onChange={(e) => setFileType(e.target.value)}
                  >
                    <MenuItem value="all">Svi tipovi</MenuItem>
                    <MenuItem value="pdf">PDF</MenuItem>
                    <MenuItem value="doc">Word</MenuItem>
                    <MenuItem value="txt">Tekst</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Fade>
          </Collapse>

          {results.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1, color: 'text.secondary' }}>
                Pronađeno {results.length} rezultata
              </Typography>
              <SearchResults results={results} query={query} highlightText={highlightText} />
            </Box>
          )}

          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Pretraga u toku...
              </Typography>
            </Box>
          )}
        </Box>
      </form>
    </Paper>
  );
} 