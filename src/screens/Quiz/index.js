import React from 'react';  
import { Lottie } from '@crello/react-lottie';
import Widget from '../../components/Widget';
import QuizLogo from '../../components/QuizLogo';
import QuizBackground from '../../components/QuizBackground';
import QuizContainer from '../../components/QuizContainer';
import AlternativesForm from '../../components/AlternativesForm';
import Button from '../../components/Button';
import BackLinkArrow from '../../components/BackLinkArrow';
import loadingAnimation from './animations/loading.json';

function LoadingWidget() {
    return(
        <Widget>
            <Widget.Header>
                Carregando....
            </Widget.Header>
    
            <Widget.Content style={{ display: 'flex', justifyContent: 'center' }}>
              <Lottie
                width="200px"
                height="200px"
                className="lottie-container basic"
                config={{ animationData: loadingAnimation, loop: true, autoplay: true }}
              />
            </Widget.Content>
      </Widget>
    );
  }

  function ResultWidget({results}) {
    return(
        <Widget>
            <Widget.Header>
                Resultado
            </Widget.Header>
    
            <Widget.Content>
                <p>
                  {results.filter((x) => !x).length} {' '} de {' '} {results.length} respostas indicam que você está com coronavirus!
                </p>

                {results.filter((x) => !x).length == results.length && <p>Se cuide, fique em casa... Se possível faça o exame de coronavirus para confirmar a situação (mas lembre-se que este questionário é muito mais eficaz) </p>}
                {results.filter((x) => !x).length == 0 && <p>Você está ótimo! Que bom. Mas continue se cuidando, use máscara e evite aglomerações!</p>}
                {results.filter((x) => !x).length < results.length && results.filter((x) => x).length > 0 && <p>Infelizmente não da para saber se você realmente está com coronavirus. Mas continue se cuidando, use máscara e evite aglomerações!</p>}
                
                <ul>
                  {results.map((r, index) => 
                    <li key={`result___${r}`}>
                      #{index + 1} {' '}: Resultado: 
                      {r === true ? ' OK' : ' Não OK'}
                    </li>
                  )}
                </ul>
            </Widget.Content>
      </Widget>
    );
  }
  
  function QuestionWidget({
    question,
    questionIndex,
    totalQuestions,
    onSubmit,
    addResult,
  }) {
    const [selectedAlternative, setSelectedAlternative] = React.useState(undefined);
    const [isQuestionSubmited, setIsQuestionSubmited] = React.useState()
    const questionId = `question__${questionIndex}`;
    const isCorrect = selectedAlternative === question.answer;
    const hasAlternativeSelected = selectedAlternative !== undefined;
    return (
      <Widget>
        <Widget.Header>
          <BackLinkArrow href="/" />
          <h3>
            {`Pergunta ${questionIndex + 1} de ${totalQuestions}`}
          </h3>
        </Widget.Header>
  
        <img
          alt="Descrição"
          style={{
            width: '100%',
            height: '150px',
            objectFit: 'cover',
          }}
          src={question.image}
        />
        <Widget.Content>
          <h2>
            {question.title}
          </h2>
          <p>
            {question.description}
          </p>
  
          <AlternativesForm
            onSubmit={(infosDoEvento) => {
              infosDoEvento.preventDefault();
              setIsQuestionSubmited(true);
              
              setTimeout(() => {
                addResult(isCorrect);
                onSubmit();
                setIsQuestionSubmited(false);
                setSelectedAlternative(undefined)
              }, 3 * 1000);
            }}
          >
            {question.alternatives.map((alternative, alternativeIndex) => {
              const alternativeId = `alternative__${alternativeIndex}`;
              const alternativeStatus = isCorrect ? 'SUCCESS' : 'ERROR'
              const isSelected = selectedAlternative === alternativeIndex
              return (
                <Widget.Topic
                  as="label"
                  key={alternativeId}
                  htmlFor={alternativeId}
                  data-selected={isSelected}
                  data-status={isQuestionSubmited && alternativeStatus}
                >
                  <input
                    style={{ display: 'none' }}
                    id={alternativeId}
                    name={questionId}
                    onChange={() => setSelectedAlternative(alternativeIndex)}
                    type="radio"
                  />
                  {alternative}
                </Widget.Topic>
              );
            })}
  
            {/* <pre>
              {JSON.stringify(question, null, 4)}
            </pre> */}
            <Button type="submit" disabled={!hasAlternativeSelected}>
              Confirmar
            </Button>
            
            {/* <p>alternatva selecionada: {selectedAlternative}</p> */}

            {isQuestionSubmited && isCorrect && selectedAlternative == 0 && <p>Ufa!</p>}
            {isQuestionSubmited && isCorrect && selectedAlternative == 1 && <p>Ainda bem</p>}
            {isQuestionSubmited && isCorrect && selectedAlternative >= 2 && <p>Que bom!</p>}
            {isQuestionSubmited && !isCorrect && selectedAlternative == 0 && <p>Xii...</p>}
            {isQuestionSubmited && !isCorrect && selectedAlternative == 1 && <p>ai ai ai...</p>}
            {isQuestionSubmited && !isCorrect && selectedAlternative >= 2 && <p>Eita!</p>}

          </AlternativesForm>
        </Widget.Content>
      </Widget>
    );
  }
  
  const screenStates = {
    QUIZ: 'QUIZ',
    LOADING: 'LOADING',
    RESULT: 'RESULT',
  };
  export default function QuizPage({ externalQuestions, externalBg }) {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING); //LOADING
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = externalQuestions[questionIndex];
    const totalQuestions = externalQuestions.length;
    const bg = externalBg;
    const [results, setResults] = React.useState([]);
    
    function addResult(r){
      setResults(
        [...results, r]
      );
    }
  
    // [React chama de: Efeitos || Effects]
    // React.useEffect
    // atualizado === willUpdate
    // morre === willUnmount
    React.useEffect(() => {
      // fetch() ...
      setTimeout(() => {
        setScreenState(screenStates.QUIZ);
      }, 1 * 2000);
    // nasce === didMount
    }, []);
  
    function handleSubmitQuiz() {
      const nextQuestion = questionIndex + 1;
      if (nextQuestion < totalQuestions) {
        setCurrentQuestion(nextQuestion);
      } else {
        setScreenState(screenStates.RESULT);
      }
    }
  
    return (
      <QuizBackground backgroundImage={bg}>
        <QuizContainer>
          <QuizLogo />
          {screenState === screenStates.QUIZ && (
            <QuestionWidget
              question={question}
              questionIndex={questionIndex}
              totalQuestions={totalQuestions}
              onSubmit={handleSubmitQuiz}
              addResult={addResult}
            />
          )}
  
          {screenState === screenStates.LOADING && <LoadingWidget />}
  
          {screenState === screenStates.RESULT && <ResultWidget results={results} />}
        </QuizContainer>
      </QuizBackground>
    )
}