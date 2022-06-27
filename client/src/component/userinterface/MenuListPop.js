import { useState, useEffect, useRef } from 'react';
import {
  IconButton,
  Button,
  Popper,
  Grow,
  Paper,
  MenuList,
  MenuItem,
  ClickAwayListener,
  Stack,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

/*
const exampleData = [
  {
    id: 'add',
    color: 'secondary',
    // eslint-disable-next-line no-undef
    onClick: handleButtonClick,
    // eslint-disable-next-line react/jsx-no-undef
    icon: <AddCircleIcon />,
    ariaLabel: 'add button',
  },
  {
    id: 'edit',
    color: 'secondary',
    // eslint-disable-next-line no-undef
    onClick: handleButtonClick,
    // eslint-disable-next-line react/jsx-no-undef
    icon: <EditIcon />,
    ariaLabel: 'edit button',
  },
  {
    id: 'delete',
    color: 'secondary',
    // eslint-disable-next-line no-undef
    onClick: handleButtonClick,
    // eslint-disable-next-line react/jsx-no-undef
    icon: <DeleteIcon />,
    ariaLabel: 'delete button',
  },
];
*/
const MenuListPop = ({ menuItems, id }) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const prevOpen = useRef(null);

  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleListKeyDown = (event) => {
    if (event.key === 'Tab') {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === 'Escape') {
      setOpen(false);
    }
  };
  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  return (
    <>
      <Button
        color='primary'
        ref={anchorRef}
        id='composition-button'
        aria-label='Options'
        aria-controls={open ? 'composition-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup='true'
        onClick={handleToggle}>
        <MoreVertIcon />
      </Button>
      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        placement='right'
        transition
        disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom-start' ? 'left top' : 'left bottom',
            }}>
            <Paper variant='outlined'>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList
                  sx={{
                    border: '1px solid',
                    borderColor: 'primary.main',
                    zIndex: '2',
                    borderRadous: '4px',
                  }}
                  autoFocusItem={open}
                  id='compositon-menu'
                  aria-labelledby='composition-button'
                  onKeyDown={handleListKeyDown}>
                  <Stack direction='row'>
                    {menuItems.map((menuItem, index) => (
                      <MenuItem
                        sx={{ padding: '0' }}
                        key={index}
                        aria-label={menuItem.ariaLabel}>
                        <IconButton
                          name={id}
                          onClick={(event) => {
                            handleClose(event);
                            menuItem.onClick(event);
                          }}
                          size='small'
                          color={menuItem.color}>
                          {menuItem.icon}
                        </IconButton>
                      </MenuItem>
                    ))}
                  </Stack>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  );
};

export default MenuListPop;
