"use client";
import { useState } from "react";
import { Grid, Card, CardContent, Typography, Button, Modal, Box } from "@mui/material";
import { toolsConfig, ToolConfig } from "../utils/toolsConfig";

export default function MetaverseToolsDashboard() {
  const [openTool, setOpenTool] = useState<string | null>(null);
  const [addToolOpen, setAddToolOpen] = useState(false);

  const handleOpen = (toolId: string) => {
    if (toolId === "add-tool") setAddToolOpen(true);
    else setOpenTool(toolId);
  };
  const handleClose = () => setOpenTool(null);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>Metaverse Building Tools</Typography>
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
        gap: 3,
        mb: 4
      }}>
        {toolsConfig.map((tool: ToolConfig) => (
          <Card sx={{ cursor: "pointer", minHeight: 180 }} onClick={() => handleOpen(tool.id)} aria-label={`Open ${tool.name}`} key={tool.id}>
            <CardContent>
              <Typography variant="h6">{tool.name}</Typography>
              <Typography variant="body2" color="text.secondary">{tool.description}</Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
      {/* Tool Modal/Launcher */}
      {openTool && (
        <Modal open={!!openTool} onClose={handleClose} aria-labelledby="tool-modal-title">
          <Box sx={{ p: 4, bgcolor: "background.paper", m: "auto", mt: 8, maxWidth: 600, borderRadius: 2 }}>
            <Typography id="tool-modal-title" variant="h5" gutterBottom>
              {toolsConfig.find((t: ToolConfig) => t.id === openTool)?.name}
            </Typography>
            {toolsConfig.find((t: ToolConfig) => t.id === openTool)?.component
              ? toolsConfig.find((t: ToolConfig) => t.id === openTool)?.component
              : <Typography>Tool coming soon or external integration.</Typography>
            }
            <Button onClick={handleClose} sx={{ mt: 2 }}>Close</Button>
          </Box>
        </Modal>
      )}
      {/* Add Tool Modal */}
      <Modal open={addToolOpen} onClose={() => setAddToolOpen(false)}>
        <Box sx={{ p: 4, bgcolor: "background.paper", m: "auto", mt: 8, maxWidth: 500, borderRadius: 2 }}>
          <Typography variant="h6">Add External Tool</Typography>
          {/* Form for URL/API key, tool name, etc. */}
          <Typography variant="body2" sx={{ mt: 2 }}>Coming soon: Integrate Figma, Google Drive, IPFS, and more!</Typography>
          <Button onClick={() => setAddToolOpen(false)} sx={{ mt: 2 }}>Close</Button>
        </Box>
      </Modal>
    </Box>
  );
}