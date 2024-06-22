import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import HelpButton from './Helpbutton';
import HelpModal from './Help';
import sliderImage from '../assets/images/slider.png';

const Quiz = ({ user, setUser }) => {
  const { tableName } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState(location.state?.selectedOptions || {});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [leftWidth, setLeftWidth] = useState(50);
  const containerRef = useRef(null);
  const isDragging = useRef(false);

  useEffect(() => {
    axios.get(`https://cyberminds-xhm7.onrender.com/quizzes/${tableName}`)
      .then(response => {
        setQuestions(response.data);
      })
      .catch(error => {
        console.error('Error fetching questions:', error.response ? error.response.data : error.message);
      });
  }, [tableName]);

  useEffect(() => {
    const handleDocumentMouseMove = (event) => handleMouseMove(event);
    const handleDocumentMouseUp = () => handleMouseUp();

    document.addEventListener('mousemove', handleDocumentMouseMove);
    document.addEventListener('mouseup', handleDocumentMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleDocumentMouseMove);
      document.removeEventListener('mouseup', handleDocumentMouseUp);
    };
  }, []);

  const handleOptionChange = (option) => {
    setSelectedOptions(prevState => ({
      ...prevState,
      [currentQuestionIndex]: option
    }));
  };

  const handleNextQuestion = () => {
    if (selectedOptions[currentQuestionIndex] !== undefined) {
      setCurrentQuestionIndex(prevIndex => prevIndex + 1);
    }
  };

  const calculateResults = () => {
    let correctAnswers = 0;
    let incorrectAnswers = 0;

    questions.forEach((question, index) => {
      const selectedOption = selectedOptions[index];
      if (selectedOption !== undefined) {
        if (selectedOption === question.correct_option) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });

    return { correctAnswers, incorrectAnswers, attemptedQuestions: Object.keys(selectedOptions).length };
  };

  const handleEndTest = () => {
    const { correctAnswers, incorrectAnswers, attemptedQuestions } = calculateResults();
    const allQuestionsAnswered = questions.length === Object.keys(selectedOptions).length;
    const message = allQuestionsAnswered
      ? 'All questions are answered. Do you want to submit your answers?'
      : 'Not all questions are answered. Do you want to submit your answers before submitting?';

    if (window.confirm(message)) {
      navigate('/results', {
        state: {
          questions,
          selectedOptions,
          tableName,
          totalQuestions: questions.length,
          correctAnswers,
          incorrectAnswers,
          attemptedQuestions,
          skippedQuestions: questions.length - Object.keys(selectedOptions).length
        }
      });
    }
  };

  const handleBackClick = () => {
    const { correctAnswers, incorrectAnswers, attemptedQuestions } = calculateResults();
    if (window.confirm('Warning: The test will be auto-submitted. Do you want to proceed?')) {
      navigate('/results', {
        state: {
          questions,
          selectedOptions,
          tableName,
          totalQuestions: questions.length,
          correctAnswers,
          incorrectAnswers,
          attemptedQuestions,
          skippedQuestions: questions.length - Object.keys(selectedOptions).length
        }
      });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleHelpClose = () => {
    setShowHelp(false);
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    isDragging.current = true;
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleMouseMove = (event) => {
    if (!isDragging.current) return;
    const container = containerRef.current;
    const containerRect = container.getBoundingClientRect();
    const newLeftWidth = ((event.clientX - containerRect.left) / containerRect.width) * 100;
    if (newLeftWidth >= 0 && newLeftWidth <= 100) {
      setLeftWidth(newLeftWidth);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <Loading>Loading...</Loading>;
  }

  return (
    <Container ref={containerRef}>
      <Header>
        <HeaderLeft>
          <BackButton $isMenuOpen={isMenuOpen} onClick={handleBackClick}>←</BackButton>
          <MenuIcon $isMenuOpen={isMenuOpen} onClick={toggleMenu}>☰</MenuIcon>
        </HeaderLeft>
        <ButtonGroup>
          <EndRoundButton onClick={handleEndTest}>End Test</EndRoundButton>
          <HelpButton onClick={() => setShowHelp(true)} />
        </ButtonGroup>
      </Header>
      <Content>
        <MainContent>
          <LeftPanel width={leftWidth} $isMenuOpen={isMenuOpen}>
            {isMenuOpen && (
              <Sidebar $isMenuOpen={isMenuOpen}>
                <SidebarContent>
                  <MenuList>
                    {questions.map((question, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          setCurrentQuestionIndex(index);
                          setIsMenuOpen(false);
                        }}
                      >
                        <Circle answered={selectedOptions[index] !== undefined}>{index + 1}</Circle>
                        <MenuItemContent>
                          <QuestionLabel>
                            Mcq {index + 1}
                          </QuestionLabel>
                          <QuestionPoints>5 Points </QuestionPoints>
                        </MenuItemContent>
                        <QuestionStatus answered={selectedOptions[index] !== undefined} />
                      </MenuItem>
                    ))}
                  </MenuList>
                </SidebarContent>
              </Sidebar>
            )}
            <QuestionNumber>Question {currentQuestionIndex + 1}</QuestionNumber>
            <QuestionText>{currentQuestion.questions}</QuestionText>
          </LeftPanel>
          <SliderContainer
            onMouseDown={handleMouseDown}
            onDoubleClick={handleMouseMove}
          >
            <img src={sliderImage} alt="slider" />
          </SliderContainer>
          <RightPanel width={leftWidth}>
            <QuestionHeader>Select One Of The Following Options:</QuestionHeader>
            <Options>
              {['option1', 'option2', 'option3'].map((opt, idx) => (
                <Option
                  key={idx}
                  onClick={() => handleOptionChange(currentQuestion[opt])}
                  selected={selectedOptions[currentQuestionIndex] === currentQuestion[opt]}
                >
                  <OptionCircle selected={selectedOptions[currentQuestionIndex] === currentQuestion[opt]} />
                  <Label>{currentQuestion[opt]}</Label>
                </Option>
              ))}
            </Options>
          </RightPanel>
        </MainContent>
      </Content>
      <Footer>
        <PreviousButton onClick={() => setCurrentQuestionIndex(Math.max(currentQuestionIndex - 1, 0))}>← Previous</PreviousButton>
        {currentQuestionIndex < questions.length - 1 ? (
          <SaveNextButton onClick={handleNextQuestion}>Save & Next →</SaveNextButton>
        ) : (
          <SaveNextButton onClick={handleEndTest}>Review & Submit</SaveNextButton>
        )}
      </Footer>
      {showHelp && <HelpModal show={showHelp} onClose={handleHelpClose} />}
    </Container>
  );
};

const Loading = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  font-family: 'Satoshi Variable';
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background-color: #f0f2f5;
  font-family: 'Satoshi Variable';
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
  border-radius: 21px;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const BackButton = styled.button`
  background-color: ${({ $isMenuOpen }) => ($isMenuOpen ? 'transparent' : '#ccc')};
  border: none;
  border-radius: 18px;
  margin-left: 10px;
  font-size: 20px;
  cursor: pointer;
  padding: 10px;
  transition: all 0.3s ease;
  font-family: 'Satoshi Variable';
  &:hover {
    background-color: ${({ $isMenuOpen }) => ($isMenuOpen ? 'transparent' : '#6c63ff')};
    color: ${({ $isMenuOpen }) => ($isMenuOpen ? 'inherit' : 'white')};
  }
  @media (max-width: 768px) {
    margin-left: 0;
  }
`;

const MenuIcon = styled.div`
  font-size: 24px;
  cursor: pointer;
  margin-left: 20px;
  background-color: ${({ $isMenuOpen }) => ($isMenuOpen ? '#ccc' : 'transparent')};
  padding: ${({ $isMenuOpen }) => ($isMenuOpen ? '10px' : '0')};
  border-radius: 10px;
  transition: all 0.3s ease;
  font-family: 'Satoshi Variable';
  &:hover {
    background-color: ${({ $isMenuOpen }) => ($isMenuOpen ? '#6c63ff' : 'transparent')};
    color: ${({ $isMenuOpen }) => ($isMenuOpen ? 'white' : 'inherit')};
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  @media (max-width: 768px) {
    margin-top: 10px;
  }
`;

const EndRoundButton = styled.button`
  padding: 15px 30px;
  background-color: lightgray;
  border-radius: 18px;
  cursor: pointer;
  color: black;
  border: lightgray solid;
  font-size: 18px;
  transition: all 0.3s ease;
  font-family: 'Satoshi Variable';
  &:hover {
    background-color: #6c63ff;
    color: white;
    border: #6c65ff;
  }
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  position: relative;
  gap: 8px;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    flex-direction: column;
    padding: 10px;
  }
`;

const Sidebar = styled.div`
  position: absolute;
  width: 30%;
  height: 100%;
  left: 10px;
  top: 2px;
  bottom: 10px;
  background: #FFFFFF;
  box-shadow: 80px 0px 32px rgba(194, 194, 194, 0.01), 45px 0px 27px rgba(194, 194, 194, 0.05), 20px 0px 20px rgba(194, 194, 194, 0.09), 5px 0px 11px rgba(194, 194, 194, 0.1);
  border-radius: 25px;
  display: ${({ $isMenuOpen }) => ($isMenuOpen ? 'block' : 'none')};
  overflow: hidden;
  transition: opacity 0.3s ease, visibility 0.3s ease;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    width: 100%;
    position: fixed;
    height: auto;
    bottom: 0;
    top: 10px;
    border-radius: 25px;
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 10px;
  overflow: hidden;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    height: auto;
  }
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: scroll;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    overflow-y: visible;
  }

  /* Hide scrollbar */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
`;

const MenuItem = styled.li`
  padding: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  font-family: 'Satoshi Variable';
  &:hover {
    background-color: #f0f2f5;
  }
`;

const Circle = styled.div`
  width: 35px;  
  height: 35px; 
  border-radius: 50%;
  font-weight:lighter;
  background-color: white;
  color: black;
  border: 1px solid black;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
  font-size: 18px;
  font-family: 'Satoshi Variable';
`;

const MenuItemContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-family: 'Satoshi Variable';
`;

const QuestionStatus = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${({ answered }) => (answered ? 'green' : 'white')};
  border: 1px solid ${({ answered }) => (answered ? 'green' : 'black')};
`;

const QuestionLabel = styled.div`
  font-size: 18px;
  font-family: 'Satoshi Variable';
`;

const QuestionPoints = styled.div`
  font-size: 12px;
  color: gray;
  margin-right: 10px;
  font-family: 'Satoshi Variable';
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
  gap: 10px;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    flex-direction: column;
    margin-left: 0;
  }
`;

const LeftPanel = styled.div.attrs(props => ({
  style: {
    width: `${props.width}%`,
  },
}))`
  padding: 20px;
  background-color: ${({ $isMenuOpen }) => ($isMenuOpen ? '#f0f0f0' : '#fff')};
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16.5px;
  margin: 20px 0 20px 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; 
  justify-content: flex-start; 
  position: relative;
  transition: background-color 0.3s ease;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    margin-right: 0%;
    width: 100%;
  }
`;

const SliderContainer = styled.div`
  position: relative;
  width: 30px;
  height: 100%;
  cursor: ew-resize;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    width: 100%;
    height: auto;
  }
`;

const RightPanel = styled.div.attrs(props => ({
  style: {
    width: `${100 - props.width}%`,
  },
}))`
  padding: 20px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-size: 16.5px;
  display: flex;
  margin: 20px ;
  margin-left: 0%;
  flex-direction: column;
  align-items: flex-start; 
  justify-content: flex-start;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const QuestionNumber = styled.h3`
  font-size: 24px;
  font-weight:lighter;
  margin-bottom: 10px;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    font-size:auto;
  }
`;

const QuestionText = styled.p`
  font-size: 24px;
  text-align: left;
  margin-top:35px;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    font-size: 22px;
  }
`;

const QuestionHeader = styled.h2`
  font-size: 28px;
  margin-bottom: 55px;
  font-weight: lighter;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Options = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  padding :5px;
  font-family: 'Satoshi Variable';
`;

const Option = styled.div`
  display: flex;
  align-items: center;
  width: 55%;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 30px;
  cursor: pointer;
  background-color: ${({ selected }) => (selected ? '#e6e6ff' : '#fff')};
  transition: all 0.3s ease;
  font-family: 'Satoshi Variable';
  &:hover {
    border-color: #6c63ff;
    background-color: #f0f2f5;
  }
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const OptionCircle = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #ccc;
  margin-right: 15px;
  background-color: ${({ selected }) => (selected ? 'green' : 'white')};
  transition: background-color 0.3s ease;
  font-family: 'Satoshi Variable';
`;

const Label = styled.label`
  font-size: 24px;
  font-family: 'Satoshi Variable';
  font-weight: normal;
  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 18px;
  background-color: #fff;
  box-shadow: 0 -2px 4px rgba(0, 0, 0, 0.1);
  position: sticky;
  bottom: 2;
  border-radius: 24px;
  gap: 20px;
  margin: 10px 10px 10px 10px;
  font-family: 'Satoshi Variable';
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
  }
`;

const FooterButton = styled.button`
  padding: 15px 30px;
  background-color: #ccc;
  border: lightgray 1px solid;
  border-radius: 20px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  font-family: 'Satoshi Variable';
  &:nth-of-type(1) {
    background-color: white;
    color: black;
    font-size: 16px;
  }

  &:nth-of-type(2) {
    background-color: lightgray;
    color: black;
    font-size: 16px;

    &:hover {
      background-color: #6c63ff;
      color: white;
      border: #6c65ff;
    }
  }

  &:hover {
    background-color: #6c63ff;
    color: white;
    border: #6c65ff;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const PreviousButton = styled(FooterButton)`
  margin-right: 650px; 
  background-color: white;
  border-radius: 20px;
  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

const SaveNextButton = styled(FooterButton)`
  border:lightgray;
`;

export default Quiz;
