import React from 'react';
import './GameBoard.css';

const CARD_CDN = 'https://deckofcardsapi.com/static/img';

const cardImages: { [key: string]: string } = {
  '2♣': `${CARD_CDN}/2C.png`,
  '3♣': `${CARD_CDN}/3C.png`,
  '4♣': `${CARD_CDN}/4C.png`,
  '5♣': `${CARD_CDN}/5C.png`,
  '6♣': `${CARD_CDN}/6C.png`,
  '7♣': `${CARD_CDN}/7C.png`,
  '8♣': `${CARD_CDN}/8C.png`,
  '9♣': `${CARD_CDN}/9C.png`,
  '10♣': `${CARD_CDN}/0C.png`,
  'J♣': `${CARD_CDN}/JC.png`,
  'Q♣': `${CARD_CDN}/QC.png`,
  'K♣': `${CARD_CDN}/KC.png`,
  'A♣': `${CARD_CDN}/AC.png`,
  
  '2♥': `${CARD_CDN}/2H.png`,
  '3♥': `${CARD_CDN}/3H.png`,
  '4♥': `${CARD_CDN}/4H.png`,
  '5♥': `${CARD_CDN}/5H.png`,
  '6♥': `${CARD_CDN}/6H.png`,
  '7♥': `${CARD_CDN}/7H.png`,
  '8♥': `${CARD_CDN}/8H.png`,
  '9♥': `${CARD_CDN}/9H.png`,
  '10♥': `${CARD_CDN}/0H.png`,
  'J♥': `${CARD_CDN}/JH.png`,
  'Q♥': `${CARD_CDN}/QH.png`,
  'K♥': `${CARD_CDN}/KH.png`,
  'A♥': `${CARD_CDN}/AH.png`,
  
  '2♠': `${CARD_CDN}/2S.png`,
  '3♠': `${CARD_CDN}/3S.png`,
  '4♠': `${CARD_CDN}/4S.png`,
  '5♠': `${CARD_CDN}/5S.png`,
  '6♠': `${CARD_CDN}/6S.png`,
  '7♠': `${CARD_CDN}/7S.png`,
  '8♠': `${CARD_CDN}/8S.png`,
  '9♠': `${CARD_CDN}/9S.png`,
  '10♠': `${CARD_CDN}/0S.png`,
  'J♠': `${CARD_CDN}/JS.png`,
  'Q♠': `${CARD_CDN}/QS.png`,
  'K♠': `${CARD_CDN}/KS.png`,
  'A♠': `${CARD_CDN}/AS.png`,
  
  '2♦': `${CARD_CDN}/2D.png`,
  '3♦': `${CARD_CDN}/3D.png`,
  '4♦': `${CARD_CDN}/4D.png`,
  '5♦': `${CARD_CDN}/5D.png`,
  '6♦': `${CARD_CDN}/6D.png`,
  '7♦': `${CARD_CDN}/7D.png`,
  '8♦': `${CARD_CDN}/8D.png`,
  '9♦': `${CARD_CDN}/9D.png`,
  '10♦': `${CARD_CDN}/0D.png`,
  'J♦': `${CARD_CDN}/JD.png`,
  'Q♦': `${CARD_CDN}/QD.png`,
  'K♦': `${CARD_CDN}/KD.png`,
  'A♦': `${CARD_CDN}/AD.png`,
};

const cardBack = `${CARD_CDN}/back.png`;

interface GameBoardProps {
  playerHand: string[];
  dealerHand: string[];
  playerScore: number;
  dealerScore: number;
  gameStatus: string;
}

const GameBoard: React.FC<GameBoardProps> = ({ 
  playerHand, 
  dealerHand, 
  playerScore, 
  dealerScore, 
  gameStatus 
}) => {
  const getStatusMessage = () => {
    switch(gameStatus) {
      case 'player_win': return '🎉 Congratulations! You Won!';
      case 'dealer_win': return '🃏 Dealer Wins. Better luck next time!';
      case 'draw': return '🤝 It\'s a Draw!';
      default: return '';
    }
  };

  const renderCard = (card: string, index: number, isDealer: boolean) => {
    const cardImage = cardImages[card] || cardBack;
    const isHidden = isDealer && gameStatus === 'in_progress' && index === 0;

    return (
      <div 
        key={index} 
        className="card"
      >
        <img 
          src={isHidden ? cardBack : cardImage} 
          alt={isHidden ? 'Card Back' : card} 
          className="card-image" 
        />
      </div>
    );
  };

  return (
    <div className="game-board">
      {gameStatus !== 'not_started' && (
        <div className="game-status-message">
          {getStatusMessage()}
        </div>
      )}
      
      <div className="dealer-section">
        <h2>Dealer's Hand</h2>
        <div className="hand">
          {dealerHand.map((card, index) => renderCard(card, index, true))}
        </div>
        <p>Score: {dealerScore}</p>
      </div>
      
      <div className="player-section">
        <h2>Your Hand</h2>
        <div className="hand">
          {playerHand.map((card, index) => renderCard(card, index, false))}
        </div>
        <p>Score: {playerScore}</p>
      </div>
    </div>
  );
};

export default GameBoard;