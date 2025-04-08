import '../styles/Header.css';

function Header({ reset }) {

    return (
        <header className="header">
            <h1>Memory Game</h1>
            <div className="navbar">
                <button className="reset-button" onClick={reset}>Reset</button>
            </div>
        </header>
    );
}

export default Header;