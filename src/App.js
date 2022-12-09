import React from "react"
import Sidebar from "./Sidebar"
import Editor from "./Editor"
import { data } from "./data"
import Split from "react-split"
import {nanoid} from "nanoid"
import './App.css';

export default function App() {
  const [notes, setNotes] = React.useState(
    ()=>JSON.parse(localStorage.getItem("notes"))|| []
    )
  const [currentNoteId, setCurrentNoteId] = React.useState(
      (notes[0] && notes[0].id) || ""
  )
  
  React.useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])
  
  function createNewNote() {
      const newNote = {
          id: nanoid(),
          body: "# Type your markdown note's title here"
      }
      setNotes(prevNotes => [newNote, ...prevNotes])
      setCurrentNoteId(newNote.id)
  }

  // Put the most recently-modified
  // note to be at the top
  function updateNote(text) {
    setNotes(oldNotes => {
      const newNotes = oldNotes.map(oldNote => {
        return oldNote.id === currentNoteId
          ? { ...oldNote, body: text }
          : oldNote
      })
      const newNote = newNotes.find(note => note.id === currentNoteId)
      const newNoteIndex = newNotes.indexOf(newNote)
      const newNotesWithoutNewNote = newNotes.filter(
        note => note.id !== currentNoteId
      )
      newNotesWithoutNewNote.splice(newNoteIndex, 0, newNote)
      return newNotesWithoutNewNote
    })
}
  // This does not rearrange the notes
  // function updateNote(text) {
  //     setNotes(oldNotes => oldNotes.map(oldNote => {
  //         return oldNote.id === currentNoteId
  //             ? { ...oldNote, body: text }
  //             : oldNote
  //     }))
  // }
  
   
  function deleteNote(event, noteId) {
    event.stopPropagation()
    setNotes(oldNotes => oldNotes.filter(note => note.id !== noteId))
  
}

  function findCurrentNote() {
      return notes.find(note => {
          return note.id === currentNoteId
      }) || notes[0]
  }
  
  return (
      <main>
      {
          notes.length > 0 
          ?
          <Split 
              sizes={[30, 70]} 
              direction="horizontal" 
              className="split"
          >
              <Sidebar
                  notes={notes}
                  currentNote={findCurrentNote()}
                  setCurrentNoteId={setCurrentNoteId}
                  newNote={createNewNote}
                  deleteNote={deleteNote}
              />
              {
                  currentNoteId && 
                  notes.length > 0 &&
                  <Editor 
                      currentNote={findCurrentNote()} 
                      updateNote={updateNote} 
                  />
              }
          </Split>
          :
          <div className="no-notes">
              <h1>You have no notes</h1>
              <button 
                  className="first-note" 
                  onClick={createNewNote}
              >
                  Create one now
              </button>
          </div>
          
      }
      </main>
  )
}
