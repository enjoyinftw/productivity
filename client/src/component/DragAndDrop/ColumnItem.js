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

const ColumnItem = ({
  colItem,
  colIndex,
  rowIndex,
  handleBoardChange,
  snapshot,
  ...rest
}) => {
  const columnItemTitleRef = useRef();
  const columnItemDescriptionRef = useRef();
  const [columnItemTitlePreview, setColumnItemTitlePreview] = useState(
    colItem.itemname
  );

  const [columnItemDescriptionPreview, setColumnItemDescriptionPreview] =
    useState(colItem.itemdescription);

  const [error, setError] = useState(false);
  const [helperText, setHelperText] = useState(' ');
  const [descriptionHelperText, setDescriptionHelperText] = useState(' ');
  const [disableButton, setDisableButton] = useState(false);

  const [isFocused, setIsFocused] = useState(false);
  const [open, setOpen] = useState(false);

  const handleTitleChange = (e) => {
    if (e.target.value.length === 0) {
      setDisableButton(true);
      setError(true);
      setColumnItemTitlePreview(e.target.value);
      setHelperText('Title cant be empty.');
    } else if (e.target.value.length === 20) {
      if (error === true) setError(false);
      setDisableButton(false);
      setHelperText('Maximum title length is 20 characters.');
    } else {
      if (error === true) setError(false);
      setDisableButton(false);
      setHelperText(' ');
      setColumnItemTitlePreview(e.target.value);
    }
  };

  const handleDescriptionChange = (e) => {
    if (e.target.value.length === 160) {
      setDescriptionHelperText('Maximum description length is 160 Characters.');
      setColumnItemDescriptionPreview(e.target.value);
    } else {
      setDescriptionHelperText(' ');
      setColumnItemDescriptionPreview(e.target.value);
    }
  };
  const handleSave = (event) => {
    if (columnItemTitleRef.current.value.length === 0) {
      setError(true);
      setHelperText('Title cant be empty.');
    } else {
      handleBoardChange({
        type: event.target.name,
        colIndex: colIndex,
        rowIndex: rowIndex,
        value: {
          title: columnItemTitleRef.current.value,
          description: columnItemDescriptionRef.current.value,
        },
      });
      setIsFocused(false);
    }
  };

  const handleClickAway = () => {
    setOpen(false);
    handleResetSettingsState();
  };

  const handleResetSettingsState = () => {
    setColumnItemTitlePreview(colItem.itemname);
    setColumnItemDescriptionPreview(colItem.itemdescription);
    setIsFocused(false);
    setDisableButton(false);
    setError(false);
    setHelperText(' ');
    setDescriptionHelperText(' ');
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
                  variant='subtitle1'
                  paragraph
                  sx={{ overflowWrap: 'anywhere', marginBottom: 0 }}
                  textAlign='center'>
                  {colItem.itemname}
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
                <Stack alignItems='center'>
                  <Typography
                    sx={{ overflowWrap: 'anywhere' }}
                    variant='subtitle2'
                    paragraph
                    textAlign='center'>
                    {colItem.itemdescription}
                  </Typography>
                  <ButtonGroup>
                    <Button
                      name='newColumnItem'
                      size='small'
                      sx={{ borderColor: 'primary.main' }}
                      onClick={(event) =>
                        handleBoardChange({
                          type: event.target.name,
                          colIndex: colIndex,
                        })
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
                      onClick={(event) =>
                        handleBoardChange({
                          type: event.target.name,
                          colIndex: colIndex,
                          rowIndex: rowIndex,
                        })
                      }
                      name='deleteColumnItem'
                      sx={{ borderColor: 'primary.main' }}
                      size='small'>
                      Delete
                    </Button>
                  </ButtonGroup>
                </Stack>
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
                  inputRef={columnItemTitleRef}
                  sx={{
                    padding: '8px 0 0 28px',
                    borderColor: 'primary.main',
                  }}
                  variant='outlined'
                  value={columnItemTitlePreview}
                  onChange={(e) => {
                    handleTitleChange(e);
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
              <TextField
                helperText={descriptionHelperText}
                multiline
                minRows={4}
                maxRows={9}
                inputProps={{ maxLength: 160 }}
                InputProps={{ style: { fontSize: 12, minWidth: '188px' } }}
                inputRef={columnItemDescriptionRef}
                sx={{
                  padding: '8px 33px 0 28px',
                  borderColor: 'primary.main',
                }}
                variant='outlined'
                value={columnItemDescriptionPreview}
                onChange={(e) => {
                  handleDescriptionChange(e);
                }}
              />
            </CardContent>
            <Collapse in={open} timeout='auto' unmountOnExit>
              <CardActions sx={{ justifyContent: 'center' }}>
                <ButtonGroup>
                  <Button
                    name='saveColumnItem'
                    disabled={disableButton}
                    sx={{ borderColor: 'primary.main' }}
                    size='small'
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
                    name='deleteColumnItem'
                    sx={{ borderColor: 'primary.main' }}
                    size='small'
                    onClick={(event) =>
                      handleBoardChange({
                        type: event.target.name,
                        colIndex: colIndex,
                        rowIndex: rowIndex,
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

export default ColumnItem;
