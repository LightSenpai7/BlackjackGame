const SUITS = ['♠', '♣', '♥', '♦'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

export const initializeDeck = (): string[] => {
  console.log('Initializing deck'); 
  const deck: string[] = [];
  
  SUITS.forEach(suit => {
    VALUES.forEach(value => {
      deck.push(`${value}${suit}`);
      deck.push(`${value}${suit}`);  
      deck.push(`${value}${suit}`);
      deck.push(`${value}${suit}`);
    });
  });
  
  console.log('Deck created', deck.length); 
  return shuffleDeck(deck);
};

export const shuffleDeck = (deck: string[]): string[] => {
  console.log('Shuffling deck', deck.length); 
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
};

export const dealInitialCards = (deck: string[]) => {
  console.log('Dealing initial cards', deck.length);
  const playerCards = [deck.pop()!, deck.pop()!];
  const dealerCards = [deck.pop()!, deck.pop()!];
  
  console.log('Player cards', playerCards);
  console.log('Dealer cards', dealerCards);
  
  return { playerCards, dealerCards, deck };
};

export const calculateHandValue = (hand: string[]): number => {
  console.log('Calculating hand value', hand);
  let value = 0;
  let aceCount = 0;

  hand.forEach(card => {
    const cardValue = card.slice(0, -1);
    if (['J', 'Q', 'K'].includes(cardValue)) {
      value += 10;
    } else if (cardValue === 'A') {
      aceCount++;
    } else {
      value += parseInt(cardValue);
    }
  });

  for (let i = 0; i < aceCount; i++) {
    if (value + 11 <= 21) {
      value += 11;
    } else {
      value += 1;
    }
  }

  console.log('Hand value', value); 
  return value;
};

export const determineGameOutcome = (playerHand: string[], dealerHand: string[]) => {
  const playerTotal = calculateHandValue(playerHand);
  const dealerTotal = calculateHandValue(dealerHand);

  if (playerTotal > 21) return 'dealer';
  if (dealerTotal > 21) return 'player';
  if (playerTotal > dealerTotal) return 'player';
  if (dealerTotal > playerTotal) return 'dealer';
  return 'tie';
};