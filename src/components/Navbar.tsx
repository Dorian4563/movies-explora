import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <button className="navbar-logo" onClick={() => navigate("/")}>
           more details
        </button>

        <ul className="navbar-menu">
          <li>
            <button onClick={() => navigate("/")} className="nav-link">
              Home
            </button>
          </li>
          <li>
            <button onClick={() => navigate("/watchlist")} className="nav-link">
               My List
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
