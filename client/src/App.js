import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PrikolCard from "./components/PrikolCard";
import PrikolService from "./services/PrikolService";

function App() {  
  const [jokes, setJokes] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [newJokeText, setNewJokeText] = useState("");
  const [newJokeReactions, setNewJokeReactions] = useState("");

  useEffect(() => {
    fetchJokes();
  }, []);

  const fetchJokes = async () => {
    try {
      const response = await PrikolService.getAll();
      setJokes(response);
      setLoading(false);
    } catch (error) {
      console.error("Error loading prikoli:", error);
      setLoading(false);
    }
  };

  const handleReact = async (jokeId, reaction) => {
    await PrikolService.react(jokeId, reaction);
    setJokes((prevJokes) =>
      prevJokes.map((joke) =>
        joke._id === jokeId
          ? { ...joke, reactions: { ...joke.reactions, [reaction]: (joke.reactions[reaction] || 0) + 1 } }
          : joke
      )
    );
  };

  const nextJoke = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % jokes.length);
  };

  const addNewJoke = async () => {
    if (!newJokeText.trim() || !newJokeReactions.trim()) {
      alert("Enter text and reactions.");
      return;
    }
  
    const possibleReactions = newJokeReactions.split(",").map((r) => r.trim());
  
    try {
      await PrikolService.create(newJokeText, possibleReactions);
      setNewJokeText("");
      setNewJokeReactions("");
      fetchJokes(); 
    } catch (error) {
      console.error("Error adding new prikol:", error);
    }
  };

  const updateJoke = async (jokeId, newText, newReactions) => {
    if (!newText.trim()) {
      alert("Text of the prikol cannot be empty!");
      return;
    }
  
    const possibleReactions = Array.isArray(newReactions)
      ? newReactions
      : (newReactions || "").split(",").map((r) => r.trim()).filter((r) => r);
  
    try {
      await PrikolService.update(jokeId, newText, possibleReactions);
      fetchJokes();
    } catch (error) {
      console.error("Error updating prikol:", error);
    }
  };
  
  const deleteJoke = async (jokeId) => {
    try {
      await PrikolService.delete(jokeId);
      fetchJokes(); 
    } catch (error) {
      console.error("Error removing prikol:", error);
    }
  };
  
  

  return (
    <div className="d-flex flex-column align-items-center justify-content-center min-vh-100 bg-light p-4">
    <h1 className="text-primary fw-bold mb-4">Prikol App</h1>

    {loading ? (
      <p className="text-secondary">Loading prikols...</p>
    ) : jokes.length > 0 ? (
      <>
        <button onClick={nextJoke} className="btn btn-primary mb-4 px-4 py-2">
          Next Prikol
        </button>
        <PrikolCard joke={jokes[currentIndex]} onReact={handleReact} onDelete={deleteJoke} onUpdate={updateJoke} />
      </>
    ) : (
      <p className="text-danger">No prikols yet.</p>
    )}

    <div className="mt-4">
      <input
        type="text"
        placeholder="Text"
        value={newJokeText}
        onChange={(e) => setNewJokeText(e.target.value)}
        className="form-control mb-2"
      />
      <input
        type="text"
        placeholder="Possible reactions (using comma)"
        value={newJokeReactions}
        onChange={(e) => setNewJokeReactions(e.target.value)}
        className="form-control mb-2"
      />
      <button onClick={addNewJoke} className="btn btn-success">
        Add new prikol
      </button>
    </div>
  </div>
  );
}

export default App;