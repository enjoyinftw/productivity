import { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  IconButton,
  Stack,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const CurrentCard = ({ CardInfo, handleNoClick, handleYesClick }) => {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <Card
      sx={{
        border: '1px solid',
        borderColor: 'primary.main',
        widht: '300px',
        maxWidth: '300px',
      }}>
      <CardContent
        sx={{ borderBottom: '1px solid', borderColor: 'primary.main' }}>
        <Typography
          variant='h5'
          component='h3'
          textAlign='center'
          sx={{ paddingBottom: '16px' }}>
          {CardInfo.cardname}
        </Typography>
        <Typography variant='body1' component='p' textAlign='center'>
          {CardInfo.question}
        </Typography>
      </CardContent>
      {showAnswer ? (
        <CardContent
          sx={{
            '&:last-child': {
              paddingBottom: '16px',
            },
          }}>
          <Typography variant='body1' component='p' textAlign='center'>
            {CardInfo.answer}
          </Typography>
          <Stack
            justifyContent='space-around'
            direction='row'
            alignItems='center'>
            <IconButton onClick={() => handleYesClick()}>
              <CheckCircleOutlineIcon sx={{ color: 'primary.main' }} />
            </IconButton>
            <IconButton onClick={() => handleNoClick()}>
              <HighlightOffIcon sx={{ color: 'primary.main' }} />
            </IconButton>
          </Stack>
        </CardContent>
      ) : (
        <CardContent
          sx={{
            '&:last-child': {
              paddingBottom: '16px',
            },
          }}>
          <Stack
            justifyContent='center'
            alignItems='center'
            sx={{ width: '99%', height: '99%' }}>
            <Button onClick={() => setShowAnswer(!showAnswer)}>
              Show Answer
            </Button>
          </Stack>
        </CardContent>
      )}
    </Card>
  );
};

export default CurrentCard;
