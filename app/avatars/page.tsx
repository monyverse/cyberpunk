"use client";

import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Chip,
  Slider
} from '@mui/material';
import {
  Person as PersonIcon,
  PlayArrow as PlayIcon,
  Create as CreateIcon,
  Palette as PaletteIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';

interface AvatarData {
  id: string;
  name: string;
  appearance: {
    skinTone: string;
    hairStyle: string;
    eyeColor: string;
    height: number;
  };
  personality: {
    trait: string;
    intelligence: number;
    charisma: number;
    strength: number;
  };
  status: 'active' | 'inactive';
}

const AvatarCreator: React.FC = () => {
  const [avatars, setAvatars] = useState<AvatarData[]>([
    {
      id: '1',
      name: 'CyberNinja',
      appearance: {
        skinTone: 'Pale',
        hairStyle: 'Spiked',
        eyeColor: 'Neon Blue',
        height: 175
      },
      personality: {
        trait: 'Stealth',
        intelligence: 85,
        charisma: 70,
        strength: 90
      },
      status: 'active'
    },
    {
      id: '2',
      name: 'TechMage',
      appearance: {
        skinTone: 'Dark',
        hairStyle: 'Long',
        eyeColor: 'Purple',
        height: 168
      },
      personality: {
        trait: 'Intellectual',
        intelligence: 95,
        charisma: 80,
        strength: 60
      },
      status: 'inactive'
    }
  ]);

  const [newAvatar, setNewAvatar] = useState({
    name: '',
    skinTone: '',
    hairStyle: '',
    eyeColor: '',
    height: 170,
    trait: '',
    intelligence: 50,
    charisma: 50,
    strength: 50
  });

  const skinTones = ['Pale', 'Fair', 'Medium', 'Olive', 'Dark', 'Deep'];
  const hairStyles = ['Short', 'Long', 'Spiked', 'Mohawk', 'Bald', 'Dreadlocks'];
  const eyeColors = ['Brown', 'Blue', 'Green', 'Hazel', 'Neon Blue', 'Purple', 'Red'];
  const personalityTraits = ['Stealth', 'Intellectual', 'Aggressive', 'Diplomatic', 'Creative', 'Analytical'];

  const handleCreateAvatar = () => {
    const avatar: AvatarData = {
      id: Date.now().toString(),
      name: newAvatar.name,
      appearance: {
        skinTone: newAvatar.skinTone,
        hairStyle: newAvatar.hairStyle,
        eyeColor: newAvatar.eyeColor,
        height: newAvatar.height
      },
      personality: {
        trait: newAvatar.trait,
        intelligence: newAvatar.intelligence,
        charisma: newAvatar.charisma,
        strength: newAvatar.strength
      },
      status: 'inactive'
    };

    setAvatars([...avatars, avatar]);
    setNewAvatar({
      name: '',
      skinTone: '',
      hairStyle: '',
      eyeColor: '',
      height: 170,
      trait: '',
      intelligence: 50,
      charisma: 50,
      strength: 50
    });
  };

  const enterMetaverse = (avatarId: string) => {
    setAvatars(avatars.map(avatar => 
      avatar.id === avatarId 
        ? { ...avatar, status: 'active' as const }
        : { ...avatar, status: 'inactive' as const }
    ));
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Avatar Creator
      </Typography>

      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        gap: 4
      }}>
        {/* Avatar Creation Form */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <CreateIcon /> Create New Avatar
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Basic Info */}
                <TextField
                  label="Avatar Name"
                  value={newAvatar.name}
                  onChange={(e) => setNewAvatar({ ...newAvatar, name: e.target.value })}
                  fullWidth
                />

                {/* Appearance */}
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PaletteIcon /> Appearance
                </Typography>
                
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr',
                  gap: 2
                }}>
                  <FormControl fullWidth>
                    <InputLabel>Skin Tone</InputLabel>
                    <Select
                      value={newAvatar.skinTone}
                      label="Skin Tone"
                      onChange={(e) => setNewAvatar({ ...newAvatar, skinTone: e.target.value })}
                    >
                      {skinTones.map((tone) => (
                        <MenuItem key={tone} value={tone}>{tone}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Hair Style</InputLabel>
                    <Select
                      value={newAvatar.hairStyle}
                      label="Hair Style"
                      onChange={(e) => setNewAvatar({ ...newAvatar, hairStyle: e.target.value })}
                    >
                      {hairStyles.map((style) => (
                        <MenuItem key={style} value={style}>{style}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Eye Color</InputLabel>
                    <Select
                      value={newAvatar.eyeColor}
                      label="Eye Color"
                      onChange={(e) => setNewAvatar({ ...newAvatar, eyeColor: e.target.value })}
                    >
                      {eyeColors.map((color) => (
                        <MenuItem key={color} value={color}>{color}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  <Box>
                    <Typography variant="body2" gutterBottom>Height: {newAvatar.height}cm</Typography>
                    <Slider
                      value={newAvatar.height}
                      onChange={(e, value) => setNewAvatar({ ...newAvatar, height: value as number })}
                      min={150}
                      max={200}
                      valueLabelDisplay="auto"
                    />
                  </Box>
                </Box>

                {/* Personality */}
                <Typography variant="subtitle1" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PsychologyIcon /> Personality
                </Typography>

                <FormControl fullWidth>
                  <InputLabel>Personality Trait</InputLabel>
                  <Select
                    value={newAvatar.trait}
                    label="Personality Trait"
                    onChange={(e) => setNewAvatar({ ...newAvatar, trait: e.target.value })}
                  >
                    {personalityTraits.map((trait) => (
                      <MenuItem key={trait} value={trait}>{trait}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography variant="body2" gutterBottom>Intelligence: {newAvatar.intelligence}</Typography>
                  <Slider
                    value={newAvatar.intelligence}
                    onChange={(e, value) => setNewAvatar({ ...newAvatar, intelligence: value as number })}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>Charisma: {newAvatar.charisma}</Typography>
                  <Slider
                    value={newAvatar.charisma}
                    onChange={(e, value) => setNewAvatar({ ...newAvatar, charisma: value as number })}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Box>
                  <Typography variant="body2" gutterBottom>Strength: {newAvatar.strength}</Typography>
                  <Slider
                    value={newAvatar.strength}
                    onChange={(e, value) => setNewAvatar({ ...newAvatar, strength: value as number })}
                    min={0}
                    max={100}
                    valueLabelDisplay="auto"
                  />
                </Box>

                <Button
                  variant="contained"
                  size="large"
                  onClick={handleCreateAvatar}
                  disabled={!newAvatar.name || !newAvatar.skinTone || !newAvatar.hairStyle || !newAvatar.eyeColor || !newAvatar.trait}
                  sx={{ mt: 2 }}
                >
                  Create Avatar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Avatar List */}
        <Box>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Your Avatars
              </Typography>
              <List>
                {avatars.map((avatar) => (
                  <ListItem key={avatar.id} divider>
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: avatar.status === 'active' ? 'primary.main' : 'grey.500' }}>
                        <PersonIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={avatar.name}
                      secondary={
                        <Box>
                          <Typography variant="body2">
                            {avatar.appearance.skinTone} • {avatar.appearance.hairStyle} • {avatar.appearance.eyeColor}
                          </Typography>
                          <Typography variant="body2">
                            Trait: {avatar.personality.trait} • INT: {avatar.personality.intelligence} • CHA: {avatar.personality.charisma} • STR: {avatar.personality.strength}
                          </Typography>
                        </Box>
                      }
                    />
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      <Chip
                        label={avatar.status}
                        color={avatar.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<PlayIcon />}
                        onClick={() => enterMetaverse(avatar.id)}
                        disabled={avatar.status === 'active'}
                      >
                        Enter Metaverse
                      </Button>
                    </Box>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
  );
};

export default AvatarCreator; 