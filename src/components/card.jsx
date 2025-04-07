
import "../styles/card.css";
export function Card({ pokemon, onClick, index }) {
return (
    <div 
        className={`card`}
        key={pokemon.id} 
        id={index} 
        data-name={pokemon.name}
        onClick={onClick}
        >
        <div className="card-front"
            style={{ 
                backgroundImage: `url(${pokemon.sprites.front_default})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}>
            <p className="pokemon-name">{pokemon.name}</p>
        </div>
        <div className="card-back"></div>
    </div>
    
)

}