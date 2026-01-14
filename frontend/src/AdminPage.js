import React, { useContext, useEffect, useState } from "react";
import logo from "./media/Logo.png";
import "./styles/AdminPage.css";
import axios from "axios";
import { LoginContext } from "./context/LoginContext";
import Page401 from "./errorPages/Page401";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [games, setGames] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categoriesFilter, setCategoriesFilter] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [editingGameId, setEditingGameId] = useState(null);
  const [editedScore, setEditedScore] = useState("");
  const [usernameFilter, setUsernameFilter] = useState("");

  const { player, setPlayer } = useContext(LoginContext);

  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalGames: 0,
    bestByCategory: [],
  });

  const api = axios.create({
    baseURL: "http://localhost:2812/api/",
  });

  const fetchAllCategories = async () => {
    const res = await api.get("categories");
    setCategoriesFilter(res.data);
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get("games/admin/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStats(res.data);
    } catch (error) {
      console.error("Greška pri učitavanju statistike:", error);
    }
  };

  const fetchGames = async (pageNum) => {
    try {
      const token = localStorage.getItem("token");

      const res = await api.get(
        `games/admin/paginatedGames?page=${pageNum}&category=${selectedCategory}&username=${usernameFilter}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setGames(res.data.games);
      setTotalPages(res.data.totalPages);
      setPage(res.data.currentPage);
    } catch (e) {
      console.error("Greška pri ucitavanju partija", e);
    }
  };

  useEffect(() => {
    fetchAllCategories();
  }, []);

  useEffect(() => {
    fetchStats();
    fetchGames(page);
  }, [page, selectedCategory]);

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePrev = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleDelete = async (gameId) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`games/${gameId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPage(1);
      await fetchGames(1);
      await fetchStats();
    } catch (error) {
      alert("Neuspešno brisanje igre");
    }
  };

  const handleSaveChanges = async (gameId) => {
    try {
      const token = localStorage.getItem("token");

      await api.patch(
        `games/${gameId}`,
        { score: editedScore },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setEditingGameId(null);
      fetchGames(page);
      fetchStats();
    } catch (e) {
      alert("Neuspešna izmena rezultata");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPlayer(null);
    navigate("/");
  };

  if (!player?.admin) {
    return <Page401 />;
  }

  return (
    <div className="admin-wrapper">
      <div className="admin-left-wrapper">
        <img src={logo} alt="logo" />
        <div className="admin-all-stats">
          <p>Ukupan broj korisnika: {stats.totalPlayers}</p>
          <p>Ukupan broj odigranih igara: {stats.totalGames}</p>
          <p>Najbolji igrač po kategoriji:</p>
          {stats.bestByCategory.map((element, index) => (
            <p key={index}>
              {element.category}: {element.username} ({element.score})
            </p>
          ))}
        </div>
      </div>
      <div className="admin-right-wrapper">
        <table className="admin-games-table">
          <thead>
            <tr>
              <th>Igrač</th>
              <th>Kategorija</th>
              <th>Rezultat</th>
              <th>Uredi</th>
            </tr>
          </thead>
          <tbody>
            {games.map((data, index) => (
              <tr key={index}>
                <td>{data.player.username}</td>
                <td>{data.category.title}</td>
                <td>
                  {editingGameId === data._id ? (
                    <input
                      type="number"
                      className="admin-score-input"
                      value={editedScore}
                      onChange={(e) => setEditedScore(e.target.value)}
                    />
                  ) : (
                    data.score
                  )}
                </td>
                <td>
                  {editingGameId === data._id ? (
                    <>
                      <button onClick={() => handleSaveChanges(data._id)}>
                        Sačuvaj
                      </button>
                      <button onClick={() => setEditingGameId(null)}>
                        Otkaži
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setEditingGameId(data._id);
                          setEditedScore(data.score);
                        }}
                      >
                        Uredi
                      </button>
                      <button onClick={() => handleDelete(data._id)}>
                        Obriši
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <span className="stats-pages">
          {page} / {totalPages}
        </span>
        <div className="stats-table-control">
          <div className="stats-table-control-input">
            <input
              type="text"
              placeholder="Pretraži po korisniku..."
              value={usernameFilter}
              onChange={(e) => {
                setUsernameFilter(e.target.value);
                setPage(1); // Vrati se na prvu stranicu
              }}
              onBlur={() => fetchGames(1)} // Pretraga se aktivira kad izgubi fokus
              onKeyDown={(e) => {
                if (e.key === "Enter") fetchGames(1); // ili Enter
              }}
            />
          </div>
          <div className="stats-table-control-options">
            <select
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Sve kategorije</option>
              {categoriesFilter.map((category, index) => (
                <option value={category._id} key={index}>
                  {category.title}
                </option>
              ))}
            </select>
            <button onClick={handlePrev}>{"<"}</button>
            <button onClick={handleNext}>{">"}</button>
          </div>
        </div>
      </div>
      <button className="admin-logout-button" onClick={handleAdminLogout}>
        Odjavi se
      </button>
    </div>
  );
};

export default AdminPage;
