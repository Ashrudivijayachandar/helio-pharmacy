import React from 'react';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
  const { i18n, t } = useTranslation();
  const [lang, setLang] = React.useState(i18n.language);

  const handleChange = (event: any) => {
    const newLang = event.target.value;
    setLang(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <FormControl variant="standard" sx={{ minWidth: 100, ml: 2 }}>
      <InputLabel sx={{ color: 'white' }}>{t('language') || 'Language'}</InputLabel>
      <Select
        value={lang}
        onChange={handleChange}
        label="Language"
        sx={{ color: 'white', borderColor: 'white', '.MuiSvgIcon-root': { color: 'white' } }}
      >
        <MenuItem value="en">English</MenuItem>
        <MenuItem value="hi">हिन्दी</MenuItem>
        <MenuItem value="pa">ਪੰਜਾਬੀ</MenuItem>
      </Select>
    </FormControl>
  );
};

export default LanguageSwitcher;
