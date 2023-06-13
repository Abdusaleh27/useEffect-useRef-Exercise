import React, { useEffect, useRef, useState } from "react";
import Card from "./Card";
import axios from "axios";
import { v4 as uuid } from "uuid";
import "./DeckBuilder.css";
const DeckBuilder = () => {
  //<--------make a deck of cards-------------->
    
  const [deck, setDeck] = useState(null);
  const [remaining, setRemaining] = useState(52);
  useEffect(() => {
    async function makeDeck() {
      const freshDeck = await axios.get(
        "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"
      );
      setDeck(() => freshDeck.data);
    }
    makeDeck();
  }, []);

  const randomAngle = () =>Math.floor(Math.random()*180);
  // <---------draw a card from deck and add it to pile-------->
  
  const [cards, setCards] = useState([]);
  async function makeCard() {
    const newCard = await axios.get(
      `https://deckofcardsapi.com/api/deck/${deck.deck_id}/draw/?count=1`
    );
    setCards((pile) => [...pile, {image: newCard.data.cards[0].image,rotate:randomAngle()}]);
    setRemaining(() => newCard.data.remaining);
  }
  async function handleDraw(e) {
    if (deck && remaining > 0) {
      e.target.disabled = true;
      await makeCard();
      e.target.disabled = false;
    } else {
      alert("No more cards, please reshuffle");
    }
  }

  // <---------shuffling the deck and reset pile----------->
  async function shuffleDeck() {
    await axios.get(
      `https://deckofcardsapi.com/api/deck/${deck.deck_id}/shuffle/`
    );
    setCards(() => []);
    setRemaining(52);
  }
  async function handleSuffle(e) {
    if (deck) {
      e.target.disabled = true;
      await shuffleDeck();
      e.target.disabled = false;
    }
  }
  
  return (
    <div>
      <div>
        <button onClick={handleDraw}>Draw Card!</button>
        <button onClick={handleSuffle}>Suffle Deck!</button>
      </div>
      <div>
        <p>Remaining cards: {deck ? <b>{remaining}</b> : ""}</p>
      </div>
      <div className="parent-container">
        {cards.map((card) => (
          <div className="card" style={{ transform: `rotate(${card.rotate}deg)` }}  key={uuid()}>
            <Card source={card.image} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DeckBuilder;
