// components/FileList.tsx
import React from 'react';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const FileList = () => {
  return (
    <Paper elevation={3} sx={{ borderRadius: 2, p: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
        Recent Uploads
      </Typography>
      <List>
        {Array.from({ length: 5 }).map((_, index) => (
          <ListItem key={index} sx={{ display: 'flex', alignItems: 'center' }}>
            <ListItemIcon>
              <InsertDriveFileIcon color="action" />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {['project_report.pdf', 'image_assets.zip', 'presentation.pptx', 'contract.docx', 'financial_data.xlsx'][index]}
                </Typography>
              }
              secondary={
                <Typography variant="body2" color="text.secondary">
                  {['2.5 MB', '8.2 MB', '4.7 MB', '1.2 MB', '3.8 MB'][index]} • Uploaded {['10 minutes', '30 minutes', '2 hours', '5 hours', '1 day'][index]} ago
                </Typography>
              }
            />
            {index < 3 ? (
              <Chip label="Pending" color="warning" size="small" sx={{ ml: 2 }} />
            ) : (
              <Chip
                icon={<CheckCircleIcon sx={{ color: 'success.main' }} />}
                label="Verified"
                color="success"
                size="small"
                sx={{ ml: 2 }}
              />
            )}
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <Typography
          variant="body2"
          color="primary"
          component="a"
          href="#"
          sx={{ cursor: 'pointer', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
        >
          View all files →
        </Typography>
      </Box>
    </Paper>
  );
};

export default FileList;
