import { useEffect } from "react";
import { Card } from "./components/card";
import { Pokedex } from "pokeapi-js-wrapper";
import React, { useState } from "react";
import "./styles/gameboard-grid.css";

function Gameboard() {
    const pokedex = new Pokedex();
    const uniquePokemon = new Set();
    let pokemonList = new Array();
    const [pokemonArray, setPokemonArray] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [lastClicked, setLastClicked] = useState(null);

    while (uniquePokemon.size < 8) {
        const randomId = Math.floor(Math.random() * 1000);
        uniquePokemon.add(randomId);
    }
    
    pokemonList.push(...uniquePokemon, ...uniquePokemon);
    let shuffled = pokemonList.sort(() => Math.random() - 0.5); // Shuffle the array

    useEffect(() => {
        let isMounted = true; // Track if the component is still mounted
        const fetchPokemon = async () => {
            try {
                const pokemonData = await Promise.all(
                    [...shuffled].map(async (pokemon) => {
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
    }, []);

    
    function toggleFlippedClass(card) {
        if (card.classList.contains('flipped')) {
            return card.classList.remove('flipped');
        }
        card.classList.add('flipped');
    }

    const handleClick = (clickedCard) => {
        clickedCard = clickedCard.parentElement;
        if (flippedCards.includes(clickedCard.id)) {
            return;
        }

        if (!lastClicked) {
            setLastClicked(clickedCard);
            toggleFlippedClass(clickedCard);
            setFlippedCards((prev) => [...prev, clickedCard.id]);
            console.log(flippedCards)
        } else if (clickedCard.dataset.name === lastClicked.dataset.name && lastClicked.id !== clickedCard.id) {
            console.log(clickedCard.classList)
            setFlippedCards((prev) => [...prev, clickedCard.id]);
            toggleFlippedClass(clickedCard);
            setLastClicked(null);
        } else { // show clicked card then reset
            setFlippedCards((prev) => [...prev, clickedCard.id]);
            toggleFlippedClass(clickedCard);
            setTimeout(() => {
                toggleFlippedClass(lastClicked);
                toggleFlippedClass(clickedCard);
                setFlippedCards((prev) => prev.filter((id) => id !== clickedCard.id && id !== lastClicked.id));
                setLastClicked(null);
            }, 1000);
        }
    };
    

    return (
        <div className="gameboard">
            <h1>Memory Board</h1>
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