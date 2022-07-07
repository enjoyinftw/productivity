import { useState } from 'react';
import { Grid, Typography } from '@mui/material';
import CurrentCard from './CurrentCard';

const exampleCard = {
  cardtopic: 'Math',
  content: [
    {
      cardname: 'Pythagoras',
      question: 'Was ist der Satz vom Pythagoras?',
      answer: 'a^2 + b^2 = c^2',
    },
    {
      cardname: 'Assoziativgesetz',
      question: 'Was ist das Assoziativgesetz?',
      answer:
        'Beim Addieren und Multiplizieren kann man beliebig Klammern setzen und entfernen. Dies ändert nichts am Ergebnis.',
    },
  ],
};

const LearningBoard = () => {
  const [learnSubject, setLearnSubject] = useState(exampleCard);
  const [learningCardList, setLearningCardList] = useState(
    learnSubject.content
  );

  const handleYesClick = () => {
    const newLearningCardList = [...learningCardList];
    const removeCorrectCard = newLearningCardList.splice(0, 1);
    console.log(removeCorrectCard);
    setLearningCardList(newLearningCardList);
  };

  const handleNoClick = async () => {
    let newLearningCardList = [...learningCardList];
    const removeWrongCard = await newLearningCardList.splice(0, 1);
    newLearningCardList = [...newLearningCardList, ...removeWrongCard];

    setLearningCardList(newLearningCardList);
  };

  return (
    <Grid container>
      <Typography variant='h4' component='h1'>
        YEP
      </Typography>
      {learningCardList.length > 0 ? (
        <CurrentCard
          CardInfo={learningCardList[0]}
          handleNoClick={handleNoClick}
          handleYesClick={handleYesClick}
        />
      ) : (
        <Typography>Done with all cards!</Typography>
      )}
    </Grid>
  );
};

export default LearningBoard;
