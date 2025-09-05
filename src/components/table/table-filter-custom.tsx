import { useCallback } from 'react';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import { MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';
import { chipProps, FiltersBlock, FiltersResult } from 'src/components/filters-result';

import { STATUS_OPTIONS } from 'src/types/common';

export type CustomFilters = {
  key: string;
  placeholder: string;
  type?: 'text' | 'select';
  options?: { label: string; value: string }[];
};

type Props = Readonly<{
  onResetPage: () => void;
  filters: any;
  fields: CustomFilters[];
  totalResults: number;
}>;

export function CustomTableFilters({ onResetPage, filters, fields, totalResults }: Props) {
  const { state: currentFilters, setState: updateFilters, resetState: resetFilters } = filters;

  const handleFilter = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      onResetPage();
      updateFilters({ [name]: value });
    },
    [onResetPage, updateFilters]
  );

  const handleRemove = useCallback(
    (name: keyof typeof currentFilters) => {
      onResetPage();
      updateFilters({ [name]: name === 'status' ? 'all' : '' });
    },
    [onResetPage, updateFilters]
  );

  const handleReset = useCallback(() => {
    onResetPage();
    resetFilters();
  }, [onResetPage, resetFilters]);

  const showFiltersResult = Object.values(currentFilters).some(
    (value) => value !== '' && value !== 'all'
  );

  return (
    <>
      <Box
        sx={{
          p: 2.5,
          gap: 2,
          display: 'flex',
          pr: { xs: 2.5, md: 1 },
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'flex-end', md: 'center' },
        }}
      >
        {fields?.map(({ key, placeholder, type = 'text', options }) =>
          type === 'select' ? (
            <TextField
              select
              key={key}
              name={key}
              fullWidth
              value={currentFilters[key] ?? ''}
              onChange={handleFilter}
              label={placeholder}
            >
              {options?.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label ?? ''}
                </MenuItem>
              ))}
            </TextField>
          ) : (
            <TextField
              key={String(key)}
              name={String(key)}
              fullWidth
              value={currentFilters[key] ?? ''}
              onChange={handleFilter}
              placeholder={placeholder}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                },
              }}
            />
          )
        )}
      </Box>

      {showFiltersResult && (
        <FiltersResult totalResults={totalResults} onReset={handleReset} sx={{ px: 2.5, pb: 2.5 }}>
          {fields.map(({ key, placeholder, options }) => {
            const value = currentFilters[key];
            const isShow = value !== undefined && value !== null && value !== '' && value !== 'all';
            if (!isShow) return null;

            const label = options?.find((option) => option.value === value)?.label ?? value;

            return (
              <FiltersBlock key={key} label={`${placeholder}:`} isShow={isShow}>
                <Chip {...chipProps} label={String(label)} onDelete={() => handleRemove(key)} />
              </FiltersBlock>
            );
          })}

          {currentFilters.status !== 'all' && (
            <FiltersBlock label="Төлөв:" isShow>
              <Chip
                {...chipProps}
                label={
                  STATUS_OPTIONS.find((opt) => opt.value === currentFilters.status)?.label ??
                  currentFilters.status
                }
                onDelete={() => handleRemove('status')}
              />
            </FiltersBlock>
          )}
        </FiltersResult>
      )}
    </>
  );
}
