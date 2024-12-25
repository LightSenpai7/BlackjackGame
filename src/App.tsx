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
  const [balance, setBalance] = useState<number>(() => {
    const savedBalance = localStorage.getItem('balance');
    return savedBalance ? parseInt(savedBalance) : 100;
  });
  const [betAmount, setBetAmount] = useState<number>(10); 
  const [view, setView] = useState<'home' | 'game' | 'rules' | 'profile'>('home');

  useEffect(() => {
    console.group('🎲 Game State');
    console.log('Status:', gameStatus);
    console.log('Deck Size:', deck.length);
    console.log('Player Hand:', playerHand);
    console.log('Dealer Hand:', dealerHand);
    console.log('Player Score:', playerScore);
    console.log('Dealer Score:', dealerScore);
    console.groupEnd();
    localStorage.setItem('balance', balance.toString());
    localStorage.setItem('betAmount', betAmount.toString());

  }, [gameStatus, deck, playerHand, dealerHand, playerScore, dealerScore, balance, betAmount]);

  const resetBalance = () => {
    setBalance(100);
  };

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const amount = parseInt(e.target.value);
    setBetAmount(amount);
  };

  const startNewGame = useCallback((e?: React.MouseEvent | React.TouchEvent) => {
    if (e) {
      e.preventDefault();
      'stopPropagation' in e && e.stopPropagation();
    }

    if (balance <= 0) {
      alert("You don't have enough balance to start a new game.");
      return;
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
  }, [balance]);

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
  }, [deck, playerHand, gameStatus, betAmount]);

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
      setBalance(prevBalance => prevBalance + betAmount);
    } else if (dealerTotal > playerTotal) {
      setGameStatus('dealer_win');
      setBalance(prevBalance => prevBalance - betAmount);
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
      {view === 'home' && (
        <div className="home-screen">
          <h1>Welcome to Blackjack</h1>
          <p className="disclaimer">This game is for entertainment purposes only and does not involve real gambling.</p>
          <p>If your balance runs out, you can refresh it by using the reset balance button in your profile.</p>
         
          <div className="input-container">
            <label className="input-label">Bet Amount:</label>
            <input type="number" value={betAmount} onChange={handleBetChange} className="input-field" />
          </div>

          <button onClick={() => setView('game')} className="play-btn">Play</button>
          <button onClick={() => setView('profile')} className="profile-btn">Profile</button>
          <button onClick={() => setView('rules')} className="rules-btn">Rules</button>
          {balance <= 0 && <p className="warning">You need more balance to play.</p>}
        </div>
      )}
      {view === 'game' && (
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

            <button onClick={() => setView('home')} className="back-btn">Back</button>

          </div>
        </div>
      )}
      {view === 'profile' && (
        <div className="profile-screen">
          <h2>Profile User</h2>
          <p>Balance: {balance}</p>
          <p>The balance has no connection to reality.</p>
          <button onClick={() => setView('home')} className="back-btn">Back</button>
          <button onClick={resetBalance} className="reset-btn">Reset Balance</button> 
        </div>
      )}
      {view === 'rules' && (
        <div className="rules-screen">
          <h2>Game Rules</h2>
          <p>1. The goal is to get as close to 21 as possible without exceeding it.</p>
          <p>2. Aces can count as 1 or 11 points.</p>
          <p>3. Kings, Queens, and Jacks are worth 10 points each.</p>
          <p>4. Players can choose to "Hit" to draw a card or "Stand" to hold their total.</p>
          <p>5. If you exceed 21, you lose the game.</p>
          <button onClick={() => setView('home')} className="back-btn">Back</button>
        </div>
      )}
    </div>
  );
};

export default App;
