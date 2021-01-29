import db from '../db.json';
import Widget from '../src/components/Widget';
import QuizLogo from '../src/components/QuizLogo';
import QuizBackground from '../src/components/QuizBackground';
import QuizContainer from '../src/components/QuizContainer';
import AlternativesForm from '../src/components/AlternativesForm';
import Button from '../src/components/Button';

function LoadingWidget() {
    return(
        <Widget>
            <Widget.Header>
                Carregando...
            </Widget.Header>
    
            <Widget.Content>
                [Desafio do Loading]
            </Widget.Content>
      </Widget>
    );
  }

  function ResultWidget({results}) {
    return(
        <Widget>
            <Widget.Header>
                Tela de resultado
            </Widget.Header>
    
            <Widget.Content>
                <p>
                  Você acertou 
                  {' '}
                  {/* { results.reduce((somatoria, resultadoAtual) => {
                    const acertou = resultadoAtual === true;
                    if(acertou){
                      return somatoria + 1;
                    }

                    return somatoria;
                  }, 0)}  */}
                  {results.filter((x) => x).length}
                  {' '}
                  perguntas
                </p>
                <ul>
                  {results.map((r, index) => 
                    <li key={`result___${r}`}>
                      #{index + 1} {' '}: Resultado: 
                      {r === true ? ' Acertou' : ' Errou'}
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
          {/* <BackLinkArrow href="/" /> */}
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

            {isQuestionSubmited && isCorrect  && <p>Você Acertou!</p>}
            {isQuestionSubmited && !isCorrect && <p>Você Errou!</p>}

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
  export default function QuizPage() {
    const [screenState, setScreenState] = React.useState(screenStates.LOADING); //LOADING
    const totalQuestions = db.questions.length;
    const [currentQuestion, setCurrentQuestion] = React.useState(0);
    const questionIndex = currentQuestion;
    const question = db.questions[questionIndex];
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
      }, 1 * 1000);
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
      <QuizBackground backgroundImage={db.bg}>
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