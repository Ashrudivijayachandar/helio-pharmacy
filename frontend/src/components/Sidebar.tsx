/**
 * Sidebar navigation component
 */

import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider,
  Box,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  LocalPharmacy as PharmacyIcon,
  Receipt as ReceiptIcon,
  MedicalServices as RareMedicineIcon,
  Info as InfoIcon,
  Home as HomeIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const menuItems = [
  { text: 'Home', icon: <HomeIcon />, path: '/' },
  { text: 'Medicine Stock', icon: <PharmacyIcon />, path: '/medicine-stock' },
  { text: 'Prescriptions', icon: <ReceiptIcon />, path: '/prescriptions' },
  { text: 'Rare Medicines', icon: <RareMedicineIcon />, path: '/rare-medicines' },
  { text: 'About', icon: <InfoIcon />, path: '/about' },
];

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  const drawer = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => handleItemClick(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={open}
        onClose={onClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawer}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Sidebar;