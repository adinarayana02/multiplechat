import React from "react";
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import DescriptionIcon from '@mui/icons-material/Description';
import QuizIcon from '@mui/icons-material/Quiz';
import TableChartIcon from '@mui/icons-material/TableChart';
import BookIcon from '@mui/icons-material/Book';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 280;

const segments = [
  { icon: <ChatIcon />, label: "General bot", path: "/" },
  { icon: <DescriptionIcon />, label: "PDF bot", path: "/pdf" },
  { icon: <QuizIcon />, label: "QA bot", path: "/qa" },
  { icon: <TableChartIcon />, label: "Excel bot", path: "/excel" },
  { icon: <BookIcon />, label: "Notebook Bot", path: "/notebook" },
];

export default function Sidebar({ onSegmentSelect, selectedSegment, mode, setMode }) {
  const navigate = useNavigate();
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          borderRight: '1px solid #eee',
          background: 'background.paper',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        },
      }}
    >
      <Box sx={{ p: 2, pb: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>🤖</Avatar>
            <Typography variant="h6" fontWeight={700}>Kamachat</Typography>
          </Box>
          <IconButton color="primary" size="small">
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'background.default', borderRadius: 2, px: 1, mb: 2 }}>
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase placeholder="Search chats" fullWidth sx={{ fontSize: 15 }} />
        </Box>
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1, mb: 0.5, fontWeight: 500 }}>BOTS</Typography>
        <List>
          {segments.map((seg, idx) => (
            <ListItem
              button
              key={seg.label}
              selected={selectedSegment === idx}
              onClick={() => { onSegmentSelect(idx); navigate(seg.path); }}
              sx={{ borderRadius: 2, mb: 0.5, transition: 'background 0.2s' }}
            >
              <ListItemIcon>{seg.icon}</ListItemIcon>
              <ListItemText primary={seg.label} />
            </ListItem>
          ))}
        </List>
        <Typography variant="caption" color="text.secondary" sx={{ pl: 1, mt: 2, mb: 0.5, fontWeight: 500 }}>RECENT CHATS</Typography>
        <List sx={{ flex: 1, overflowY: 'auto', minHeight: 60 }}>
          {/* Map recent chats here */}
        </List>
      </Box>
      <Box sx={{ p: 2, pt: 0 }}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ borderRadius: 2, fontWeight: 600, py: 1.2, mb: 2, boxShadow: 2 }}
          startIcon={<AddIcon />}
        >
          New chat
        </Button>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <IconButton onClick={() => setMode(mode === 'light' ? 'dark' : 'light')} color="inherit">
            {mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Box>
    </Drawer>
  );
} 