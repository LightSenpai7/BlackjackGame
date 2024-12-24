import React, { useState, useCallback, useEffect } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';
import { 
  initializeDeck, 
  calculateHandValue 
} from './utils/gameLogic';

const App: React.FC = () => {
  const [deck, setDeck] = useState<string[]>([]);
  const [playerHand, setPlayerHand] = useState<string[]>([]);
  const [dealerHand, setDealerHand] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'not_started' | 'in_progress' | 'player_win' | 'dealer_win' | 'draw'>('not_started');
  const [playerScore, setPlayerScore] = useState<number>(0);
  const [dealerScore, setDealerScore] = useState<number>(0);

  useEffect(() => {
    console.group('🎲 Game State');
    console.log('Status:', gameStatus);
    console.log('Deck Size:', deck.length);
    console.log('Player Hand:', playerHand);
    console.log('Dealer Hand:', dealerHand);
    console.log('Player Score:', playerScore);
    console.log('Dealer Score:', dealerScore);
    console.groupEnd();
  }, [gameStatus, deck, playerHand, dealerHand, playerScore, dealerScore]);

  const startNewGame = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      'stopPropagation' in e && e.stopPropagation();
    }
    
    setDeck([]);
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);

    requestAnimationFrame(() => {
      try {
        const newDeck = initializeDeck();

        const playerCards = [newDeck.pop()!, newDeck.pop()!];
        const dealerCards = [newDeck.pop()!, newDeck.pop()!];

        setDeck(newDeck);
        setPlayerHand(playerCards);
        setDealerHand(dealerCards);
        
        setGameStatus('in_progress');

        const playerInitialScore = calculateHandValue(playerCards);
        const dealerInitialScore = calculateHandValue(dealerCards);

        setPlayerScore(playerInitialScore);
        setDealerScore(dealerInitialScore);

      } catch (error) {
        alert('The game could not be started. Please try again.');
        setGameStatus('not_started');
      }
    });
  }, []);

  const hitCard = useCallback(() => {
    console.log('Hit Card clicked');
    if (gameStatus !== 'in_progress') return;
    
    const newDeck = [...deck];
    const newPlayerHand = [...playerHand];
    const drawnCard = newDeck.pop();
    
    if (drawnCard) {
      newPlayerHand.push(drawnCard);
      setPlayerHand(newPlayerHand);
      setDeck(newDeck);
      const newScore = calculateHandValue(newPlayerHand);
      setPlayerScore(newScore);
      
      if (newScore > 21) {
        setGameStatus('dealer_win');
      }
    }
  }, [deck, playerHand, gameStatus]);

  const stand = useCallback(() => {
    console.log('Stand clicked');
    if (gameStatus !== 'in_progress') return;

    let currentDealerHand = [...dealerHand];
    let currentDeck = [...deck];
    
    while (calculateHandValue(currentDealerHand) < 17) {
      const drawnCard = currentDeck.pop();
      if (drawnCard) {
        currentDealerHand.push(drawnCard);
      }
    }
    
    const playerTotal = calculateHandValue(playerHand);
    const dealerTotal = calculateHandValue(currentDealerHand);
    
    setDealerHand(currentDealerHand);
    setDeck(currentDeck);
    setDealerScore(dealerTotal);
    
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
      setGameStatus('player_win');
    } else if (dealerTotal > playerTotal) {
      setGameStatus('dealer_win');
    } else {
      setGameStatus('draw');
    }
  }, [deck, dealerHand, playerHand, gameStatus]);

  const handleClick = (action: () => void) => (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      if ('preventDefault' in e) e.preventDefault();
      if ('stopPropagation' in e) e.stopPropagation();
    }
    
    console.log('Button clicked');
    action();
  };

  return (
    <div className="app-container">
      <div className="blackjack-game">
        <div className="game-header">
          <h1>Blackjack</h1>
        </div>

        <GameBoard 
          playerHand={playerHand}
          dealerHand={dealerHand}
          playerScore={playerScore}
          dealerScore={dealerScore}
          gameStatus={gameStatus}
        />

        <div className="game-controls">
          {gameStatus === 'not_started' && (
            <button 
              onClick={startNewGame}
              className="start-btn"
            >
               Start New Game
            </button>
          )}
          {gameStatus === 'in_progress' && (
            <>
              <button 
                onClick={handleClick(hitCard)}
                className="hit-btn"
              >
                Hit
              </button>
              <button 
                onClick={handleClick(stand)}
                className="stand-btn"
              >
                Stand
              </button>
            </>
          )}
          {(gameStatus === 'player_win' || gameStatus === 'dealer_win' || gameStatus === 'draw') && (
            <button 
              onClick={handleClick(startNewGame)}
              className="restart-btn"
            >
              New Game
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
