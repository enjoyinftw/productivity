import { useState, useRef } from 'react';
import {
  ClickAwayListener,
  ButtonGroup,
  Card,
  CardContent,
  CardActions,
  Collapse,
  Typography,
  Button,
  TextField,
  IconButton,
  Stack,
  styled,
} from '@mui/material';
import KeyboardDoubleArrowDownIcon from '@mui/icons-material/KeyboardDoubleArrowDown';
import KeyboardDoubleArrowUpIcon from '@mui/icons-material/KeyboardDoubleArrowUp';

const StyledCard = styled(Card)(({ theme }) => ({
  width: '250px',
  minWidth: '250px',
  padding: ' 0',
  color: theme.palette.primary.main,
}));

const ColumnHead = ({
  column,
  colIndex,
  handleBoardChange,
  snapshot,
  ...rest
}) => {
  const columnTitleRef = useRef();
  const [columnTitlePreview, setColumnTitlePreview] = useState(
    column.columnname
  );

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(' ');
  const [disableButton, setDisableButton] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const handleChange = (e) => {
    if (e.target.value.length === 0) {
      setDisableButton(true);
      setError(true);
      setColumnTitlePreview(e.target.value);
      setHelperText('Title cant be empty.');
    } else if (e.target.value.length === 20) {
      if (error === true) setError(false);
      setDisableButton(false);
      setHelperText('Maximum title length is 20.');
    } else {
      if (error === true) setError(false);
      setDisableButton(false);
      setHelperText(' ');
      setColumnTitlePreview(e.target.value);
    }
  };
  const handleSave = (event) => {
    if (columnTitleRef.current.value.length === 0) {
      setError(true);
      setHelperText('Title cant be empty.');
    } else {
      handleBoardChange({
        type: event.target.name,
        colIndex: colIndex,
        value: columnTitleRef.current.value,
      });
      setIsFocused(false);
    }
  };

  const handleResetSettingsState = () => {
    setDisableButton(false);
    setError(false);
    setHelperText(' ');
    setColumnTitlePreview(column.columnname);
    setIsFocused(false);
  };

  const handleClickAway = () => {
    setOpen(false);
    handleResetSettingsState();
  };

  return (
    <>
      {!isFocused ? (
        <ClickAwayListener onClickAway={handleClickAway}>
          <StyledCard
            {...rest}
            sx={{
              border: snapshot.isDragging ? '3px solid ' : '1px solid',
              borderColor: snapshot.isDragging
                ? 'secondary.main'
                : 'primary.main',
            }}>
            <CardContent
              sx={{
                padding: '8px 16px 8px 16px',
                '&:last-child': {
                  paddingBottom: '8px',
                },
              }}>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'>
                <div></div>
                <Typography
                  sx={{ overflowWrap: 'anywhere', marginBottom: 0 }}
                  variant='h6'
                  paragraph
                  textAlign='center'>
                  {column.columnname}
                </Typography>
                <IconButton
                  aria-label='expand row'
                  size='small'
                  onClick={() => setOpen(!open)}>
                  {open ? (
                    <KeyboardDoubleArrowUpIcon />
                  ) : (
                    <KeyboardDoubleArrowDownIcon />
                  )}
                </IconButton>
              </Stack>
            </CardContent>

            <Collapse in={open} timeout='auto' unmountOnExit>
              <CardActions sx={{ justifyContent: 'center' }}>
                <ButtonGroup>
                  <Button
                    name='newColumnHead'
                    size='small'
                    sx={{ borderColor: 'primary.main' }}
                    onClick={(event) =>
                      handleBoardChange({ type: event.target.name })
                    }>
                    New
                  </Button>
                  <Button
                    size='small'
                    sx={{ borderColor: 'primary.main' }}
                    onClick={() => setIsFocused(true)}>
                    Edit
                  </Button>
                  <Button
                    name='deleteColumnHead'
                    sx={{ borderColor: 'primary.main' }}
                    size='small'
                    onClick={(event) =>
                      handleBoardChange({
                        type: event.target.name,
                        colIndex: colIndex,
                      })
                    }>
                    Delete
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Collapse>
          </StyledCard>
        </ClickAwayListener>
      ) : (
        <ClickAwayListener onClickAway={handleClickAway}>
          <StyledCard
            sx={{
              width: '250px',
              minWidth: '250px',
              border: '1px solid',
              borderColor: 'primary.main',
            }}>
            <CardContent
              sx={{
                padding: '0',
                '&:last-child': {
                  paddingBottom: '0',
                },
              }}>
              <Stack
                direction='row'
                alignItems='center'
                justifyContent='space-between'>
                <div></div>
                <TextField
                  error={error}
                  helperText={helperText}
                  inputProps={{ maxLength: 20 }}
                  autoFocus
                  fullWidth
                  inputRef={columnTitleRef}
                  sx={{
                    padding: '8px 0 0 28px',
                    borderColor: 'primary.main',
                  }}
                  variant='outlined'
                  value={columnTitlePreview}
                  onChange={(e) => {
                    handleChange(e);
                  }}
                />
                <IconButton
                  aria-label='expand row'
                  size='small'
                  onClick={() => {
                    setOpen(!open);
                    handleResetSettingsState();
                  }}>
                  {open ? (
                    <KeyboardDoubleArrowUpIcon />
                  ) : (
                    <KeyboardDoubleArrowDownIcon />
                  )}
                </IconButton>
              </Stack>
            </CardContent>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <CardActions sx={{ justifyContent: 'center' }}>
                <ButtonGroup>
                  <Button
                    disabled={disableButton}
                    sx={{ borderColor: 'primary.main' }}
                    size='small'
                    name='saveColumnHead'
                    onClick={(e) => handleSave(e)}>
                    Save
                  </Button>
                  <Button
                    sx={{ borderColor: 'primary.main' }}
                    size='small'
                    onClick={() => {
                      handleResetSettingsState();
                    }}>
                    Discard
                  </Button>
                  <Button
                    sx={{ borderColor: 'primary.main' }}
                    size='small'
                    name='deleteColumnHead'
                    onClick={(event) =>
                      handleBoardChange({
                        type: event.target.name,
                        colIndex: colIndex,
                      })
                    }>
                    Delete
                  </Button>
                </ButtonGroup>
              </CardActions>
            </Collapse>
          </StyledCard>
        </ClickAwayListener>
      )}
    </>
  );
};

export default ColumnHead;
