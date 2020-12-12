export { Note, NoteItem }

class Note {
  constructor() {
    this.items = []
    this.edit = null
  }
  
  // (this: Note, item: NoteItem) => Note
  add(item) {
    this.items.push(item)
    
    return this
  }
  
  // (this: Note, item: NoteItem) => Note
  remove(item) {
    this.items = this.items.filter(v => v.id !== item.id)

    return this
  }
  
  // items: NoteItem[] => Note
  gotItems(items) {
    this.items = items
    
    return this
  }
  
  // (this: Note, item: NoteItem) => Note
  toEdit(item) {
    this.edit = new Edit({
      at: item.id,
      newText: item.content
    })

    return this
  }
  
  // this: Note => Note
  doneEdit() {
    if (this.edit && this.edit.newText) {
      const item = this.items.find(v => v.id === this.edit.at)

      item.content = this.edit.newText
    }

    this.edit = null
    
    return this
  }
  
  // API
  
  // this: Note => void
  store() {
    localStorage.setItem('note.items', JSON.stringify(this.items))
  }

  // void => Value[]
  static restore() {
    const value = localStorage.getItem('note.items')

    try {
      const parsedValue = JSON.parse(value)
      
      if (parsedValue instanceof Array) {
        return parsedValue
      }
      else {
        return []
      }
    }
    catch (e) {
      console.log('restore', e)

      return []
    }
  }
}

class NoteItem {
  constructor({
    content,
    createdAt = Date.now(),
    id
  }) {
    this.content = content
    this.createdAt = createdAt
    this.id = id
  }
}

class Edit {
  constructor({
    at,
    newText
  }) {
    this.at = at
    this.newText = newText
  }
}