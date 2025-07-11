"use client";
import { useState } from "react";
import Box from "@mui/material/Box";
import { Grid, Card, CardContent, Typography, Button, Modal } from "@mui/material";
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
      <Grid container spacing={3}>
        {toolsConfig.map((tool: ToolConfig) => (
          <Grid item xs={12} sm={6} md={4} key={tool.id}>
            <Card sx={{ cursor: "pointer", minHeight: 180 }} onClick={() => handleOpen(tool.id)} aria-label={`Open ${tool.name}`}>
              <CardContent>
                <Typography variant="h6">{tool.name}</Typography>
                <Typography variant="body2" color="text.secondary">{tool.description}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
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