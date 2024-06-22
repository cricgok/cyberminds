import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import axios from 'axios';
import InstructionModal from './Instructions';
import TestsIcon from "../assets/images/menu.png";

const Home = ({ isLoggedIn, handleLogout }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('https://xeuhjsvzzc.ap-south-1.awsapprunner.com/quizzes')
      .then(response => {
        const filteredQuizzes = response.data.filter(
          quiz => quiz.tableName !== 'users' && quiz.tableName !== 'results'
        );
        setQuizzes(filteredQuizzes);
      })
      .catch(error => {
        console.error('Error fetching quizzes:', error.response ? error.response.data : error.message);
      });
  }, []);

  const handleSolveQuiz = (tableName) => {
    if (isLoggedIn) {
      setSelectedQuiz(tableName);
      setShowModal(true);
    } else {
      navigate('/login');
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleProceed = () => {
    setShowModal(false);
    navigate(`/quiz/${selectedQuiz}`);
  };

  const formatTableName = (tableName) => {
    return tableName.replace(/_/g, ' ');
  };

  return (
    <Container>
      <Sidebar>
        <LogoContainer>
          <Logo>Øendo</Logo>
        </LogoContainer>
        <MenuItem>
          <LogoIcon src={TestsIcon} alt="Tests Icon" />
          <StyledLink to="/">Tests</StyledLink>
        </MenuItem>
        {isLoggedIn ? (
          <>
            <MenuItem>
              <PurpleIcon as={FaUser} size={18} />
              <StyledLink to="/profile">Profile</StyledLink>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <PurpleIcon as={FaSignOutAlt} size={18} />
              <LogoutLink>Logout</LogoutLink>
            </MenuItem>
          </>
        ) : (
          <>
            <MenuItem>
              <PurpleIcon as={FaSignInAlt} size={18} />
              <StyledLink to="/login">Login</StyledLink>
            </MenuItem>
            <MenuItem>
              <PurpleIcon as={FaUserPlus} size={18} />
              <StyledLink to="/register">Register</StyledLink>
            </MenuItem>
          </>
        )}
      </Sidebar>
      <MainContent>
        <TitleContainer>
          <Title>Quizzes for you!</Title>
        </TitleContainer>
        <QuizList>
          {quizzes.map((quiz, index) => (
            <QuizItem key={index}>
              <QuizInfo>
                <QuizTitle>{formatTableName(quiz.tableName)}</QuizTitle>
                <QuizDetails>
                  <span>Total Questions&nbsp;&nbsp; <strong>{quiz.count}</strong></span>
                  <span className="spacer">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
                  <span>Total Points&nbsp;&nbsp; <strong>{quiz.count * 5}</strong></span>
                </QuizDetails>
              </QuizInfo>
              <SolveButton onClick={() => handleSolveQuiz(quiz.tableName)}>Solve Challenge</SolveButton>
            </QuizItem>
          ))}
        </QuizList>
      </MainContent>
      <InstructionModal show={showModal} onClose={handleCloseModal} onProceed={handleProceed} />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f0f2f5;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Sidebar = styled.div`
  width: 250px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  border-radius: 25px;
  align-items: center;
  padding-top: 20px;
  margin: 10px;
  box-shadow: 2px 0px 5px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: auto;
    position: auto;
    height: auto;
    left: 0;
    transition: left 0.3s ease;
  }
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
`;

const Logo = styled.h1`
  font-size: 36px;
  color: #6c63ff;
  margin-top: 10px;
`;

const MenuItem = styled.div`
  font-size: 18px;
  color: #333;
  margin: 20px 0;
  display: flex;
  align-items: center;

  &:first-child {
    margin-top: 0;
  }
`;

const PurpleIcon = styled.div`
  color: #6c63ff; 
  margin-right: 8px;
`;

const LogoIcon = styled.img`
  width: 18px; 
  height: 18px; 
  margin-right: 8px;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: #6c63ff; 
  margin-left: 8px;
`;

const LogoutLink = styled.div`
  text-decoration: none;
  color: #6c63ff; 
  cursor: pointer;
  margin-left: 8px;
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  display: flex;
  border-radius: 25px;
  flex-direction: column;
  align-items: flex-start;
  background-color: #f0f2f5;

  @media (min-width: 768px) {
    padding: auto;
  }
`;

const TitleContainer = styled.div`
  padding: 20px;
  margin-bottom: 20px;
  background-color: #ffffff;
  width: 100%;
  border-radius: 25px;
`;

const Title = styled.h2`
  font-size: 25px;
  margin: 0px 10px 0px 0px;
`;

const QuizList = styled.div`
  width: 100%;
`;

const QuizItem = styled.div`
  background-color: #ffffff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #fffde7; 
    border: #fffde7;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const QuizInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const QuizTitle = styled.h3`
  font-size: 20px;
  margin: 0 0 5px 0;
`;

const QuizDetails = styled.div`
  font-size: 16px;
  color: gray;
  display: flex;
  align-items: center;

  span {
    display: inline-block;
  }

  strong {
    color: black;
    font-weight: bold;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const SolveButton = styled.button`
  padding: 10px 20px;
  background-color: #ffffff;
  border: 2px solid lightgray;
  border-radius: 13px;
  cursor: pointer;
  font-size: 18px;
  color: black;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #ffc107;
    border: yellow;
  }

  @media (max-width: 768px) {
    width: 100%;
    margin-top: 10px;
  }
`;

export default Home;
