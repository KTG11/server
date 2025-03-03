

import './App.css';
import { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: []
    };
  }

  API_URL = "http://localhost:5000/";

  componentDidMount() {
    this.refreshNotes();
    this.interval = setInterval(() => this.refreshNotes(), 1000); // Auto-refresh every second
  }

  componentWillUnmount() {
    clearInterval(this.interval); // Clear interval when component unmounts
  }

  async refreshNotes() {
    fetch(this.API_URL + "api/todoapp/getnotes")
      .then(response => response.json())
      .then(data => {
        this.setState({ notes: data });
      })
      .catch(error => console.error("Error fetching notes:", error));
  }

  async addClick() {
    var newNotes = document.getElementById("newNotes").value;
    const data = new FormData();
    data.append("newNotes", newNotes); // Fixed FormData key

    fetch(this.API_URL + "api/todoapp/AddNotes", { // Fixed casing
      method: "POST",
      body: data
    })
      .then(res => res.json())
      .then((result) => {
        alert(result.message);
        this.refreshNotes();
      })
      .catch(error => console.error("Error adding note:", error));
  }

  async deleteClick(noteId) {
    fetch(this.API_URL + `api/todoapp/DeleteNotes?id=${noteId}`, { // Fixed API call
      method: "DELETE"
    })
      .then(res => res.json())
      .then((result) => {
        alert(result.message);
        this.refreshNotes();
      })
      .catch(error => console.error("Error deleting note:", error));
  }

  render() {
    const { notes } = this.state;
    return (
      <div className="App">
        <h2>Live view</h2>
        <input id='newNotes' />&nbsp; {/* Fixed input ID */}
        <button onClick={() => this.addClick()}>Add Notes</button>

        {notes.map((note, index) =>
          <p key={index}>
            <b>{note.id}</b> - <b>{note.description}</b>&nbsp;
            <button onClick={() => this.deleteClick(note.id)}>Delete Notes</button> {/* Fixed deleteClick */}
          </p>
        )}
      </div>
    );
  }
}

export default App;
