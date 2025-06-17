import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Select, MenuItem, FormControl, InputLabel, TextField, IconButton, Tooltip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel, Dialog, DialogTitle, DialogContent, Button, DialogActions, Alert, Snackbar, CircularProgress, Divider } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ArticleIcon from '@mui/icons-material/Article';
import DescriptionIcon from '@mui/icons-material/Description';
import RefreshIcon from '@mui/icons-material/Refresh';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { TextField as MuiTextField } from '@mui/material';
import { Box as MuiBox } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CloseIcon from '@mui/icons-material/Close';
import DocumentUpload from './DocumentUpload';
import { Document, DocumentPage, fetchDocuments, fetchDocumentPages, deleteDocument } from '../lib/api';
import { List, ListItem, ListItemText, ListItemIcon, Chip } from '@mui/material';
import {
  Search as SearchIcon,
  Sort as SortIcon,
  FilterList as FilterIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import { InputAdornment } from '@mui/material';

function getFileIcon(type: string) {
  switch (type) {
    case '.pdf':
      return <PictureAsPdfIcon sx={{ color: 'error.main' }} />;
    case '.doc':
    case '.docx':
      return <ArticleIcon sx={{ color: 'primary.main' }} />;
    case '.txt':
      return <DescriptionIcon sx={{ color: 'text.secondary' }} />;
    default:
      return <DescriptionIcon sx={{ color: 'text.secondary' }} />;
  }
}

const statusOptions = [
  { value: '', label: 'Svi' },
  { value: 'processed', label: 'Obrađeni' },
  { value: 'pending', label: 'Na čekanju' },
  { value: 'error', label: 'Greška' },
];

const typeOptions = [
  { value: '', label: 'Svi' },
  { value: '.pdf', label: 'PDF' },
  { value: '.doc', label: 'DOC' },
  { value: '.docx', label: 'DOCX' },
  { value: '.txt', label: 'TXT' },
];

function highlightText(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, 'gi'));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? <mark key={i} style={{ background: 'yellow' }}>{part}</mark> : part
  );
}

const copyWithReference = (text: string, page: DocumentPage, doc: Document) => {
  const reference = `\n\nIzvor: ${doc.filename}, Stranica ${page.page_number}`;
  navigator.clipboard.writeText(text + reference);
};

export default function DocumentList() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filtered, setFiltered] = useState<Document[]>([]);
  const [type, setType] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [sortBy, setSortBy] = useState<'created_at' | 'filename'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDoc, setOpenDoc] = useState<Document | null>(null);
  const [pages, setPages] = useState<DocumentPage[]>([]);
  const [pageSearch, setPageSearch] = useState('');
  const [loadingPages, setLoadingPages] = useState(false);
  const [showFullDocument, setShowFullDocument] = useState(false);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
  }>({
    open: false,
    message: '',
    severity: 'info'
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(null);

  const fetchDocumentsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchDocuments();
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        setDocuments(response.data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Greška pri dohvatanju dokumenata');
      setDocuments([]);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Greška pri dohvatanju dokumenata',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentsData();
  }, []);

  useEffect(() => {
    let result = [...documents];
    if (type) result = result.filter(doc => doc.file_type === type);
    if (status) result = result.filter(doc => doc.status === status);
    if (date) result = result.filter(doc => doc.created_at && doc.created_at.startsWith(date));
    if (search) result = result.filter(doc => doc.filename.toLowerCase().includes(search.toLowerCase()));
    result = result.sort((a, b) => {
      if (sortBy === 'created_at') {
        return sortOrder === 'asc'
          ? new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          : new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else {
        return sortOrder === 'asc'
          ? a.filename.localeCompare(b.filename)
          : b.filename.localeCompare(a.filename);
      }
    });
    setFiltered(result);
  }, [documents, type, status, date, sortBy, sortOrder, search]);

  const handleOpenDoc = async (doc: Document) => {
    setOpenDoc(doc);
    
    if (doc.file_type === '.jpg' || doc.file_type === '.jpeg' || doc.file_type === '.png' || doc.file_type === '.gif') {
      setShowImagePreview(true);
      return;
    }

    setLoadingPages(true);
    try {
      const response = await fetchDocumentPages(doc.id);
      if (response.error) {
        throw new Error(response.error);
      }
      if (response.data) {
        setPages(response.data);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Greška pri dohvatanju stranica');
      setPages([]);
      setSnackbar({
        open: true,
        message: error instanceof Error ? error.message : 'Greška pri dohvatanju stranica',
        severity: 'error'
      });
    } finally {
      setLoadingPages(false);
    }
  };

  const handleCloseDialog = () => {
    setOpenDoc(null);
    setPages([]);
    setPageSearch('');
  };

  const handleUploadSuccess = () => {
    fetchDocumentsData();
    setSnackbar({
      open: true,
      message: 'Dokument uspešno otpremljen',
      severity: 'success'
    });
  };

  const handleSortToggle = () => {
    setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
  };

  const handleFilterChange = (type: string | null) => {
    setType(type || '');
  };

  const handleDeleteClick = (doc: Document, event: React.MouseEvent) => {
    event.stopPropagation();
    setDocumentToDelete(doc);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!documentToDelete) return;

    try {
      const response = await deleteDocument(documentToDelete.id);
      if (response.error) {
        throw new Error(response.error);
      }

      setSnackbar({
        open: true,
        message: 'Dokument uspešno obrisan',
        severity: 'success'
      });

      fetchDocumentsData();
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Greška pri brisanju dokumenta',
        severity: 'error'
      });
    } finally {
      setDeleteDialogOpen(false);
      setDocumentToDelete(null);
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Dokumenti
        </Typography>
        <DocumentUpload onUploadSuccess={handleUploadSuccess} />
      </Paper>

      <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Pretraži dokumente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title="Promeni redosled sortiranja">
            <IconButton onClick={handleSortToggle}>
              <SortIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Filtriraj po tipu">
            <IconButton onClick={() => handleFilterChange(null)}>
              <FilterIcon />
            </IconButton>
          </Tooltip>
        </Box>

        {type && (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Filtrirano po:
            </Typography>
            <Chip
              label={type}
              onDelete={() => handleFilterChange(null)}
              size="small"
            />
          </Box>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List sx={{ flex: 1, overflow: 'auto' }}>
            {filtered.map((doc) => (
              <React.Fragment key={doc.id}>
                <ListItem
                  component="div"
                  onClick={() => handleOpenDoc(doc)}
                  sx={{
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    cursor: 'pointer'
                  }}
                >
                  <ListItemIcon>
                    {getFileIcon(doc.file_type)}
                  </ListItemIcon>
                  <ListItemText
                    primary={doc.filename}
                    secondary={
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(doc.created_at).toLocaleDateString()}
                        </Typography>
                        <Chip
                          label={`${doc.total_pages} stranica`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          label={doc.file_type}
                          size="small"
                          variant="outlined"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleFilterChange(doc.file_type);
                          }}
                        />
                      </Box>
                    }
                  />
                  <Tooltip title="Obriši dokument">
                    <IconButton
                      size="small"
                      onClick={(e) => handleDeleteClick(doc, e)}
                      sx={{ ml: 1 }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>

      <Dialog
        open={!!openDoc}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        {openDoc && (
          <>
            <DialogTitle>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6">{openDoc.filename}</Typography>
                <IconButton onClick={handleCloseDialog}>
                  <CloseIcon />
                </IconButton>
              </Box>
            </DialogTitle>
            <DialogContent>
              {showImagePreview && openDoc.image_url ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <img
                    src={openDoc.image_url}
                    alt={openDoc.filename}
                    style={{ maxWidth: '100%', maxHeight: '70vh' }}
                  />
                </Box>
              ) : (
                <>
                  <Box sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      placeholder="Pretraži stranice..."
                      value={pageSearch}
                      onChange={(e) => setPageSearch(e.target.value)}
                    />
                  </Box>
                  {loadingPages ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                      <Typography>Učitavanje stranica...</Typography>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {pages
                        .filter(page =>
                          page.content.toLowerCase().includes(pageSearch.toLowerCase())
                        )
                        .map((page) => (
                          <Paper
                            key={page.id}
                            elevation={0}
                            sx={{
                              p: 2,
                              border: '1px solid',
                              borderColor: 'divider',
                              borderRadius: 2,
                            }}
                          >
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                              <Typography variant="subtitle2">
                                Stranica {page.page_number}
                              </Typography>
                              <Box>
                                <Tooltip title="Kopiraj sa referencom">
                                  <IconButton
                                    size="small"
                                    onClick={() => copyWithReference(page.content, page, openDoc)}
                                  >
                                    <ContentCopyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: 'pre-wrap',
                                fontFamily: 'monospace',
                                fontSize: '0.875rem',
                              }}
                            >
                              {highlightText(page.content, pageSearch)}
                            </Typography>
                          </Paper>
                        ))}
                    </Box>
                  )}
                </>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Zatvori</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Potvrda brisanja</DialogTitle>
        <DialogContent>
          <Typography>
            Da li ste sigurni da želite da obrišete dokument "{documentToDelete?.filename}"?
            Ova akcija je nepovratna.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Otkaži</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Obriši
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 