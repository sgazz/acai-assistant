import React from 'react';
import { Box, Typography, Paper, List, ListItem, ListItemText, Divider } from '@mui/material';

interface SearchResult {
  content: string;
  metadata: {
    source: string;
    page?: number;
    type: string;
  };
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query }) => {
  if (!results.length) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Nema rezultata za pretragu: {query}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper elevation={2} sx={{ mt: 2, maxHeight: '400px', overflow: 'auto' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Rezultati pretrage za: {query}
        </Typography>
        <List>
          {results.map((result, index) => (
            <React.Fragment key={index}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" color="primary">
                      {result.metadata.source}
                      {result.metadata.page && ` (Strana ${result.metadata.page})`}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      component="span"
                      variant="body2"
                      color="text.primary"
                      sx={{ display: 'block', mt: 1 }}
                    >
                      {result.content}
                    </Typography>
                  }
                />
              </ListItem>
              {index < results.length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Paper>
  );
};

export default SearchResults; 