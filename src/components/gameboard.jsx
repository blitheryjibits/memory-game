import { useEffect } from "react";
import { Card } from "./card";
import { Pokedex } from "pokeapi-js-wrapper";
import React, { useState } from "react";
import "../styles/gameboard-grid.css";
import Header from "./Header";

function Gameboard() {
    const pokedex = new Pokedex();
    const uniquePokemon = new Set(); // holds unique pokemon ids
    let pokemonList = new Array(); // holds duplicate set of pokemon ids
    const [pokemonArray, setPokemonArray] = useState([]); // holds pokemon objects
    const [flippedCards, setFlippedCards] = useState([]); // card ids of flipped cards
    const [lastClicked, setLastClicked] = useState(null); // single card object
    const [resetTrigger, setResetTrigger] = useState(false); // used for useEffect trigger
    const [lockBoard, setLockBoard] = useState(false); // locks the board between flips

    // Generate 8 unique random Pokémon
    while (uniquePokemon.size < 8) {
        const randomId = Math.floor(Math.random() * 1000);
        uniquePokemon.add(randomId);
    }
    // Create and shuffle pokemon deck
    pokemonList.push(...uniquePokemon, ...uniquePokemon);
    pokemonList.sort(() => Math.random() - 0.5);


    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted
        const fetchPokemon = async () => {
            try {
                const pokemonData = await Promise.all(
                    [...pokemonList].map(async (pokemon) => {
                        return await pokedex.getPokemon(pokemon);
                    })
                );
                
                if (isMounted) {
                    setPokemonArray((prevData) => [...prevData, ...pokemonData]);
                }
            } catch (error) {
                console.error("Error fetching Pokémon data:", error); 
            }
        };
        fetchPokemon();

        // Cleanup function
        return () => {
            isMounted = false; // Prevent state updates if the component unmounts
        };
    }, [resetTrigger]); 

    
    function toggleFlippedClass(card) {
        if (card.classList.contains('flipped')) {
            return card.classList.remove('flipped');
        }
        card.classList.add('flipped');
    }

    const handleClick = (clickedCard) => {
        clickedCard = clickedCard.parentElement;
        if (flippedCards.includes(clickedCard.id) || lockBoard) {
            return;
        }

        if (!lastClicked) {
            setLastClicked(clickedCard);
            toggleFlippedClass(clickedCard);
            setFlippedCards((prev) => [...prev, clickedCard.id]);
        } else if (clickedCard.dataset.name === lastClicked.dataset.name && lastClicked.id !== clickedCard.id) {
            setFlippedCards((prev) => [...prev, clickedCard.id]);
            toggleFlippedClass(clickedCard);
            setLastClicked(null);
            setLockBoard(true);
            setTimeout(() => { setLockBoard(false) }, 1000);
        } else { // show clicked card then reset
            setFlippedCards((prev) => [...prev, clickedCard.id]);
            toggleFlippedClass(clickedCard);
            setLockBoard(true);
            setTimeout(() => {
                toggleFlippedClass(lastClicked);
                toggleFlippedClass(clickedCard);
                setFlippedCards((prev) => prev.filter((id) => id !== clickedCard.id && id !== lastClicked.id));
                setLastClicked(null);
                setLockBoard(false);
            }, 1000);
        }
    };
    
    function resetGame() {
        setFlippedCards([]);
        setLastClicked(null);
        setPokemonArray([]);
        setResetTrigger((prev) => !prev); 
    }

    return (
        <div className="gameboard">
            <Header reset={resetGame}/>
            <div className="gameboard-grid">
                {pokemonArray.map((pokemon, index) => (
                    <Card 
                        key={index} 
                        pokemon={pokemon}  
                        onClick={(e) => handleClick(e.target)}
                        index={index} />
                ))}

            </div>
        </div>
    );
}

export default Gameboard;