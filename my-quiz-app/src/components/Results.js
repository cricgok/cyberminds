import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const Results = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalQuestions, selectedOptions, tableName } = location.state;

  const [quizQuestions, setQuizQuestions] = useState([]);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);

  const totalAttended = Object.keys(selectedOptions).length;

  const saveResults = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://cyberminds-xhm7.onrender.com/save-results', {
        userId: user.id,
        username: user.username,
        tableName,
        questionsAttempted: totalAttended,
        correctAnswers,
        incorrectAnswers,
        totalQuestions
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error('Error saving results:', error.response ? error.response.data : error.message);
    }
  }, [user.id, user.username, totalAttended, correctAnswers, incorrectAnswers, totalQuestions, tableName]);

  const fetchQuizData = useCallback(async () => {
    try {
      const response = await axios.get(`https://cyberminds-xhm7.onrender.com/quizzes/${tableName}`);
      setQuizQuestions(response.data);
    } catch (error) {
      console.error('Error fetching quiz data:', error.response ? error.response.data : error.message);
    }
  }, [tableName]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  useEffect(() => {
    if (quizQuestions.length > 0) {
      let correctCount = 0;
      let incorrectCount = 0;

      quizQuestions.forEach((question, index) => {
        const selectedOption = selectedOptions[index];
        const correctOption = `option${question.correct_option}`;
        if (selectedOption !== undefined) {
          if (selectedOption === question[correctOption]) {
            correctCount++;
          } else {
            incorrectCount++;
          }
        }
      });

      setCorrectAnswers(correctCount);
      setIncorrectAnswers(incorrectCount);
    }
  }, [quizQuestions, selectedOptions]);

  useEffect(() => {
    if (user && user.id) {
      saveResults();
    }
  }, [user, saveResults]);

  const centerTextPlugin = {
    id: 'centerText',
    beforeDraw: (chart, args, options) => {
      const { correctAnswers, totalAttended } = options;
      const ctx = chart.ctx;
      ctx.save();
      const centerX = chart.getDatasetMeta(0).data[0].x;
      const centerY = chart.getDatasetMeta(0).data[0].y;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 18px sans-serif';
      const text = chart.canvas.id === 'attemptedChart' ? `${totalAttended}` : `${correctAnswers}`;
      ctx.fillText(text, centerX, centerY);
      ctx.restore();
    }
  };

  ChartJS.register(centerTextPlugin);

  const attemptedData = {
    labels: ['Attempted', 'Unattempted'],
    datasets: [
      {
        data: [totalAttended, totalQuestions - totalAttended],
        backgroundColor: ['#FFA500', '#E0E0E0'],
        hoverBackgroundColor: ['#FFA500', '#E0E0E0'],
      },
    ],
  };

  const correctData = {
    labels: ['Correct', 'Incorrect'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['#4CAF50', '#FF6384'],
        hoverBackgroundColor: ['#4CAF50', '#FF6384'],
      },
    ],
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <Container>
      <HeaderContainer>
        <BackButton onClick={handleBackClick}>←</BackButton>
      </HeaderContainer>
      <Title>Thank you for taking the test</Title>
      <Spacer />
      <Subtitle>Your Report</Subtitle>
      <ChartsContainer>
        <ChartWrapper>
          <ChartTitle>Questions Attended</ChartTitle>
          <Doughnut 
            id="attemptedChart" 
            data={attemptedData} 
            options={{ 
              cutout: '80%', 
              plugins: { 
                legend: { display: false }, 
                centerText: { totalAttended } 
              } 
            }} 
          />
          <LegendContainer>
            <LegendItem>
              <LegendColor color="#FFA500" />
              <LegendText>Total Questions Attended</LegendText>
              <LegendCount>{totalAttended}</LegendCount>
            </LegendItem>
            <Separator />
            <LegendItem>
              <LegendColor color="#E0E0E0" />
              <LegendText>Total Questions Asked</LegendText>
              <LegendCount>{totalQuestions}</LegendCount>
            </LegendItem>
          </LegendContainer>
        </ChartWrapper>
        <ChartWrapper>
          <ChartTitle>Correct Answers</ChartTitle>
          <Doughnut 
            id="correctChart" 
            data={correctData} 
            options={{ 
              cutout: '80%', 
              plugins: { 
                legend: { display: false }, 
                centerText: { correctAnswers } 
              } 
            }} 
          />
          <LegendContainer>
            <LegendItem>
              <LegendColor color="#4CAF50" />
              <LegendText>Total Correct Answers</LegendText>
              <LegendCount>{correctAnswers}</LegendCount>
            </LegendItem>
            <Separator />
            <LegendItem>
              <LegendColor color="#FF6384" />
              <LegendText>Total Incorrect Answers</LegendText>
              <LegendCount>{incorrectAnswers}</LegendCount>
            </LegendItem>
          </LegendContainer>
        </ChartWrapper>
      </ChartsContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background-color: #f0f2f5;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #ccc;
  border-radius: 25px;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  &:hover {
    background: #4CAF50;
    color: #fff;
  }

  @media (max-width: 768px) {
    padding: 8px;
    font-size: 18px;
  }
`;

const Title = styled.h1`
  font-size: 32px;
  color: green;
  text-align: center;
  margin-bottom: 10px;

  @media (max-width: 768px) {
    font-size: 26px;
  }
`;

const Spacer = styled.div`
  height: 3em; /* Adjusted for better spacing */
`;

const Subtitle = styled.h2`
  font-size: 28px;
  color: green;
  text-align: center;
  margin-bottom: 20px;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 10px;
  }
`;

const ChartsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 900px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 40%;

  @media (max-width: 768px) {
    width: 100%;
    margin-bottom: 10px;
    padding: 15px;
  }
`;

const ChartTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 10px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 18px;
  }
`;

const LegendContainer = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 5px;
`;

const LegendText = styled.span`
  font-size: 18px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const LegendColor = styled.span`
  display: inline-block;
  width: 18px;
  height: 18px;
  background-color: ${({ color }) => color};
  margin-right: 8px;
`;

const LegendCount = styled.span`
  font-size: 20px;
  font-weight: bold;
`;

const Separator = styled.hr`
  width: 100%;
  border: 1px solid black;
  margin-top: 5px;
`;

export default Results;
