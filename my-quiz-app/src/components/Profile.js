import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

ChartJS.register(ArcElement, Tooltip, Legend);

const Profile = ({ user }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState(user.username || '');
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [questionsAttempted, setQuestionsAttempted] = useState(0);
  const [incorrectAnswers, setIncorrectAnswers] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserStatistics = async () => {
      try {
        const response = await axios.get(`https://cyberminds-xhm7.onrender.com/user-statistics/${user.id}`);
        if (response.data.statistics) {
          const { total_correct_answers, total_questions_attempted, total_incorrect_answers } = response.data.statistics;
          setCorrectAnswers(total_correct_answers);
          setQuestionsAttempted(total_questions_attempted);
          setIncorrectAnswers(total_incorrect_answers);
        } else {
          setError(response.data.message || 'Failed to fetch statistics');
        }
      } catch (error) {
        setError(error.response ? error.response.data.message : error.message);
      }
    };

    if (user && user.id) {
      setUsername(user.username);
      fetchUserStatistics();
    }
  }, [user]);

  const accuracy = questionsAttempted ? ((correctAnswers / questionsAttempted) * 100).toFixed(2) : 0;

  const data = {
    labels: ['Correct Answers', 'Incorrect Answers'],
    datasets: [
      {
        data: [correctAnswers, incorrectAnswers],
        backgroundColor: ['#4CAF50', '#FF6384'],
        hoverBackgroundColor: ['#4CAF50', '#FF6384'],
      },
    ],
  };

  const options = {
    cutout: '80%',
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
      },
    },
  };

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.text('Quiz Results', 20, 20);
    doc.autoTable({
      startY: 30,
      head: [['Total Questions', 'Correct Answers', 'Incorrect Answers']],
      body: [[questionsAttempted, correctAnswers, incorrectAnswers]],
    });
    doc.save('quiz_report.pdf');
  };

  return (
    <Container>
      <HeaderContainer>
        <Header>
          <BackButton onClick={handleBackClick}>←</BackButton>
          <Title>Profile</Title>
        </Header>
      </HeaderContainer>
      <Content>
        {error ? (
          <ErrorCard>
            <ErrorText>{error}</ErrorText>
          </ErrorCard>
        ) : (
          <>
            <Card>
              <Subtitle>Quiz Statistics</Subtitle>
              <ChartContainer>
                <Doughnut data={data} options={options} />
              </ChartContainer>
            </Card>
            <DetailsCard>
              <Info>
                <Label>Username:</Label>
                <Value>{username}</Value>
              </Info>
              <Info>
                <Label>Questions Attempted:</Label>
                <Value>{questionsAttempted}</Value>
              </Info>
              <Info>
                <Label>Correct Answers:</Label>
                <Value>{correctAnswers}</Value>
              </Info>
              <Info>
                <Label>Incorrect Answers:</Label>
                <Value>{incorrectAnswers}</Value>
              </Info>
              <Info>
                <Label>Accuracy:</Label>
                <Value>{accuracy}%</Value>
              </Info>
            </DetailsCard>
            <ButtonGroup>
              <Button onClick={handleDownloadPDF}>Download PDF</Button>
            </ButtonGroup>
          </>
        )}
      </Content>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #e0eafc, #cfdef3);
  min-height: 100vh;
`;

const HeaderContainer = styled.div`
  width: 100%;
  background: #ffffff;
  padding: 20px 0;
  display: flex;
  border-radius:25px;
  margin-bottom:20px;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const BackButton = styled.button`
  background: none;
  border: 2px solid #4CAF50;
  border-radius: 15px;
  padding: 10px;
  font-size: 24px;
  cursor: pointer;
  color: #4CAF50;
  transition: all 0.3s ease;

  &:hover {
    background: #4CAF50;
    color: #fff;
  }

  @media (max-width: 768px) {
    font-size: 18px;
    padding: 8px;
  }
`;

const Title = styled.h1`
  font-size: 36px;
  margin-left: 20px;
  color: #4CAF50;
  flex: 1;
  text-align: center;

  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 28px;
    margin-top: 10px;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
`;

const Card = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }
`;

const DetailsCard = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 5px;
  }
`;

const Subtitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;

  @media (max-width: 768px) {
    font-size: 20px;
    margin-bottom: 15px;
  }
`;

const Info = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  padding: 10px 0;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    padding: 8px 0;
  }
`;

const Label = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: #333;
  margin-right: 10px;

  @media (max-width: 768px) {
    font-size: 16px;
    margin-right: 5px;
  }
`;

const Value = styled.div`
  font-size: 18px;
  color: #666;

  @media (max-width: 768px) {
    font-size: 16px;
  }
`;

const ChartContainer = styled.div`
  max-width: 400px;
  margin: 0 auto 20px auto;

  @media (max-width: 768px) {
    max-width: 300px;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 5px;
    margin-top: 15px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #4CAF50;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.3s ease;
  &:hover {
    background-color: #45a049;
  }

  @media (max-width: 768px) {
    padding: 8px 15px;
    font-size: 16px;
  }
`;

const ErrorCard = styled.div`
  background: #ffdddd;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
  width: 100%;
  text-align: center;

  @media (max-width: 768px) {
    padding: 15px;
    margin-bottom: 15px;
  }
`;

const ErrorText = styled.p`
  font-size: 18px;
  color: #d8000c;
`;

export default Profile;
