import type { ChipProps } from '@mui/material/Chip';
import type { Theme, SxProps } from '@mui/material/styles';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';

import { Iconify } from '../iconify';

// ----------------------------------------------------------------------

export const chipProps: ChipProps = { size: 'small', variant: 'soft' };

export type FiltersResultProps = React.ComponentProps<'div'> & {
  totalResults: number;
  onReset?: () => void;
  sx?: SxProps<Theme>;
};

export function FiltersResult({
  sx,
  onReset,
  children,
  totalResults,
  ...other
}: FiltersResultProps) {
  return (
    <ResultRoot sx={sx} {...other}>
      <ResultContent>
        {children}

        <Button
          color="error"
          onClick={onReset}
          startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
        >
          Цэвэрлэх
        </Button>
      </ResultContent>
    </ResultRoot>
  );
}

// ----------------------------------------------------------------------

const ResultRoot = styled('div')``;

const ResultContent = styled('div')(({ theme }) => ({
  flexGrow: 1,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(1),
}));
