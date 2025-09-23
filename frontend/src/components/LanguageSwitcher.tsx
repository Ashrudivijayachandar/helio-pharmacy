import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();

  const handleChange = (event: any) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 100, ml: 2 }}>
      <InputLabel sx={{ color: '#1976d2', fontWeight: 500 }}>{t('language') || 'Language'}</InputLabel>
      <Select
        value={i18n.language}
        onChange={handleChange}
        label="Language"
        sx={{ 
          color: '#1976d2', 
          fontWeight: 500,
          '&:before': { borderColor: '#1976d2' },
          '&:after': { borderColor: '#1976d2' },
          '.MuiSvgIcon-root': { color: '#1976d2' } 
        }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="hi">हिन्दी</MenuItem>
        <MenuItem value="pa">ਪੰਜਾਬੀ</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
