export { init, view }

import { Note, NoteItem } from './note.js'

// Model
function init() {
  let note = new Note()
  
  note.items = Note.restore()
  
  return {
    model: {
      note,
      newText: '' 
    },
    cmd: handleQueryParams
  }
}

// Update
function updateText({ model, args: { value }}) {
  model.newText = value
  
  return { model }
}

function add({ model }) {
  if (model.newText) {
    model.note.add(new NoteItem({
      id: uuidv4(),
      content: model.newText
    }))
    
    model.newText = ''
    
    model.note.store()
  }
  
  return { model }
}

function remove({ model, args: { item }}) {
  model.note.remove(item)
  
  model.note.store()
  
  return { model }
}

function gotSharedText({ model, args: { content }}) {
  model.note.add(new NoteItem({
    id: uuidv4(),
    content
  }))
  
  model.note.store()
  // window.close()
  
  return { model }
}

// API
function handleQueryParams({ msg }) {
  const content = new URLSearchParams(window.location.search).get("text")
  
  if (content) {
    msg(gotSharedText, { content })
  }
}

// View
function view({ model, msg }) {
  return div(
    {},
    [ form(
        { onSubmit: e => {
            e.preventDefault()
            msg(add)
          }
        , onInput: e => msg(updateText, { value: e.target.value })
        , className: 'flex mt-2'
        },
        [ input(
            { value: model.newText
            , className: 'shadow rounded py-4'
            , placeHolder: 'Write to localStorage'
            }, 
            )
        , button(
          { className: 'shadow rounded p-2 px-4'
          }, [ text('+') ])
        ])
    , div(
        { className: 'mt-4 mx-2'},
        model.note.items.map(item => viewItem({ item, msg })))
    ])
     
}


function viewItem({ item, msg }) {
  return div(
    { className: 'flex border-b mt-1 pb-1' },
    [ text(item.content)
    , a(
        { href: `https://www.google.com/search?${queryParam('q', item.content)}`
        , target: `${item.id}`
        , className: 'px-1 ml-2 rounded-full border'
        },
        [ text('Search') ])
    , button(
        { className: 'px-1 ml-2 rounded-full bg-gray-300'
        , onClick: () => msg(remove, { item })
        },
        [ text('Done') ])
    ])
}


function queryParam(name, value) {
  let p = new URLSearchParams()
  p.append(name, value)
  
  return p.toString()
}


// Virtual DOM
function div(attributes, children) {
  return React.createElement('div', attributes, children)
}

function a(attributes, children) {
  return React.createElement('a', attributes, children)
}

function text(str) {
  return React.createElement('span', null, str)
}

function button(attributes, children) {
  return React.createElement('button', attributes, children)
}


function form(attributes, children) {
  return React.createElement('form', attributes, children)
}


function input(attributes, children) {
  return React.createElement('input', attributes, children)
}