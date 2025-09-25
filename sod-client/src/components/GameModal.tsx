import { ReactNode, useEffect, useMemo, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  Button,
  IconButton,
  type DialogProps,
} from '@mui/material'
import { Close as CloseIcon } from '@mui/icons-material'
import { alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'

const mergeSx = (
  ...styles: Array<SxProps<Theme> | undefined>
): SxProps<Theme> => styles.filter(Boolean) as SxProps<Theme>

interface MinimizableOptions {
  hideLabel?: ReactNode
  showLabel?: ReactNode
  hideButtonSx?: SxProps<Theme>
  showButtonSx?: SxProps<Theme>
}

interface GameModalProps {
  open: boolean
  title: ReactNode
  children: ReactNode
  onClose?: () => void
  accentColor?: string
  maxWidth?: DialogProps['maxWidth']
  fullWidth?: boolean
  width?: string | number
  disableBackdropClose?: boolean
  disableEscapeKeyDown?: boolean
  showCloseButton?: boolean
  headerActions?: ReactNode
  paperSx?: SxProps<Theme>
  contentSx?: SxProps<Theme>
  minimizable?: MinimizableOptions
  dialogSx?: SxProps<Theme>
}

const DEFAULT_PAPER_SX: SxProps<Theme> = {
  backgroundColor: '#f5f5f5',
  backgroundImage: 'linear-gradient(145deg, #f0f0f0 0%, #e0e0e0 100%)',
  borderRadius: 3,
}

const DEFAULT_CONTENT_SX: SxProps<Theme> = {
  padding: 3,
}

export function GameModal({
  open,
  onClose,
  title,
  children,
  accentColor = '#1976d2',
  maxWidth = 'sm',
  fullWidth = true,
  width,
  disableBackdropClose = false,
  disableEscapeKeyDown = false,
  showCloseButton = false,
  headerActions,
  paperSx,
  contentSx,
  minimizable,
  dialogSx,
}: GameModalProps) {
  const [isMinimized, setIsMinimized] = useState(false)

  useEffect(() => {
    if (!open) {
      setIsMinimized(false)
    }
  }, [open])

  const handleDialogClose: DialogProps['onClose'] = (event, reason) => {
    if (disableBackdropClose && reason === 'backdropClick') return
    if (disableEscapeKeyDown && reason === 'escapeKeyDown') return
    onClose?.()
  }

  const headerBackground = useMemo(() => alpha(accentColor, 0.12), [accentColor])
  const headerBorderColor = useMemo(() => alpha(accentColor, 0.25), [accentColor])
  const showButtonBorder = useMemo(() => alpha(accentColor, 0.6), [accentColor])
  const showButtonColor = useMemo(() => alpha(accentColor, 0.9), [accentColor])

  const renderTitle = useMemo(() => {
    if (typeof title === 'string') {
      return (
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      )
    }
    return title
  }, [title])

  const minimizableConfig = useMemo(() => {
    const fallbackShowLabel = typeof title === 'string' ? `Show ${title}` : 'Show window'
    return {
      hideLabel: minimizable?.hideLabel ?? 'Hide',
      showLabel: minimizable?.showLabel ?? fallbackShowLabel,
      hideButtonSx: minimizable?.hideButtonSx,
      showButtonSx: minimizable?.showButtonSx,
    }
  }, [minimizable, title])

  const dialogContainerSx = mergeSx(
    {
      '& .MuiDialog-container': {
        alignItems: 'flex-end',
        justifyContent: 'center',
        margin: 0,
      },
      '& .MuiPaper-root': {
        borderRadius: '20px 20px 0 0',
        margin: 0,
        width: '100%',
        maxWidth: 'min(900px, 100%)',
      },
    },
    dialogSx
  )

  const paperStyles = mergeSx(
    DEFAULT_PAPER_SX,
    width ? { width } : undefined,
    {
      backgroundColor: '#ffffff',
      backgroundImage: 'none',
      paddingBottom: 1,
    },
    paperSx
  )

  const contentStyles = mergeSx(
    DEFAULT_CONTENT_SX,
    {
      padding: { xs: 2, sm: 3 },
    },
    contentSx
  )

  return (
    <>
      <Dialog
        open={open && !isMinimized}
        onClose={handleDialogClose}
        maxWidth={maxWidth}
  fullWidth={fullWidth}
        disableEscapeKeyDown={disableEscapeKeyDown}
        sx={dialogContainerSx}
        PaperProps={{
          sx: paperStyles,
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: headerBackground,
            borderBottom: `2px solid ${headerBorderColor}`,
            gap: 1,
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          {renderTitle}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {headerActions}
            <Button
              size="small"
              onClick={() => setIsMinimized(true)}
              sx={mergeSx(
                {
                  minWidth: 'auto',
                  padding: '4px 12px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  borderRadius: 999,
                  border: `1px solid ${alpha(accentColor, 0.4)}`,
                  backgroundColor: alpha(accentColor, 0.08),
                  '&:hover': {
                    backgroundColor: alpha(accentColor, 0.16),
                  },
                },
                minimizableConfig.hideButtonSx
              )}
            >
              {minimizableConfig.hideLabel}
            </Button>
            {showCloseButton && onClose && (
              <IconButton size="small" onClick={() => onClose?.()}>
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </DialogTitle>

        <DialogContent sx={contentStyles}>
          {children}
        </DialogContent>
      </Dialog>

      {open && isMinimized && (
        <Button
          variant="outlined"
          onClick={() => setIsMinimized(false)}
          sx={mergeSx(
            {
              position: 'fixed',
              bottom: 16,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1300,
              fontWeight: 700,
              textTransform: 'none',
              px: 3.5,
              py: 1.2,
              borderRadius: 3,
              borderWidth: 2,
              backdropFilter: 'blur(2px)',
              background: 'rgba(255,255,255,0.4)',
              borderColor: showButtonBorder,
              color: showButtonColor,
              '&:hover': {
                background: 'rgba(255,255,255,0.6)',
                borderColor: alpha(accentColor, 0.8),
                color: accentColor,
              },
            },
            minimizableConfig.showButtonSx
          )}
        >
          {minimizableConfig.showLabel}
        </Button>
      )}
    </>
  )
}
