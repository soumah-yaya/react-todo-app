import { useState, useEffect, useRef } from 'react';
import './App.css';
import sun from './assets/images/icon-sun.svg'
import moon from './assets/images/icon-moon.svg'
import cross from './assets/images/icon-cross.svg'
import { MESSAGE } from './utils/contants'
import {
  getItem,
  parseData,
  saveItem,
  getAllItems,
  getActiveItems,
  getCompletedItems,
  getDataList,
  totalActiveItems
} from './utils/helpers'

function App() {

  const { NO_TASK, NO_ACTIVE, NO_COMPLETED } = MESSAGE

  const [theme, setTheme] = useState(getItem('theme-d') || 'dark')
  const [task, setTask] = useState('')
  const [todos, setTodos] = useState(parseData('datalist-d'))
  const [active, setActive] = useState(getItem('active-d') || 'all')
  const [message, setMessage] = useState(NO_TASK)

  const inputRef = useRef(null) as any

  useEffect(() => {
    inputRef.current.focus()
  })

  useEffect(() => {
    let list = getItem('datalist-d') ? JSON.parse(getItem('datalist-d')) : []

    showMessage(list, NO_TASK)
    setTodos(list)

  }, [NO_TASK])


  //handle input change
  function handleInputHange(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value
    setTask(value)
    saveItem('task-d', value)
  }

  //handle form submit
  function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {

    e.preventDefault()

    if (task.trim().length) {
      let text = task[0].toUpperCase() + task.slice(1)

      saveItem('task-d', task)

      let list = parseData('datalist-d')

      list = [{ id: Date.now(), text: text, isCompleted: false }, ...list]

      saveItem('datalist-d', list)
      setTodos(list)
      setTask('')
      setActive('all')
    }

  }

  //handle theme toogle
  const themeToggleHandler = () => {
    let currentTheme = theme === "dark" ? "light" : "dark"
    setTheme(currentTheme)
    saveItem('theme-d', currentTheme)
  }

  // item check handler
  const ItemCheckHandler = (id: number) => {
    let newTodos, list

    //update the item
    newTodos = getAllItems().map((todo: any) => {
      if (todo.id === id) {
        return { ...todo, isCompleted: !todo.isCompleted }
      } else {
        return todo
      }
    })

    //filter when active button is active
    if (active === 'active') {
      list = newTodos.filter((item: any) => item.isCompleted === false)
      showMessage(list, NO_ACTIVE)
    }

    //filter when completed button is active
    else if (active === 'completed') {
      list = newTodos.filter((item: any) => item.isCompleted === true)
      showMessage(list, NO_COMPLETED)
    }
    else {
      list = newTodos

    }

    saveItem('datalist-d', newTodos)
    setTodos(list)

  }


  // show all items handler
  function handleShowAll() {
    let list = getAllItems()
    showMessage(list, NO_TASK)

    setTodos(list)
    setActive('all')
    saveItem('active-d', 'all')

  }

  // show active items handler
  function handleActive() {

    let list = getActiveItems()
    showMessage(list, NO_ACTIVE)

    setTodos(list)
    setActive('active')
    saveItem('active-d', 'active')
  }

  // show completed items handler
  function handleCompleted() {
    let list = getCompletedItems()
    showMessage(list, NO_COMPLETED)

    setTodos(list)
    setActive('completed')
    saveItem('active-d', 'completed')
  }

  // clear completed items handler
  function handleClearCompleted() {
    if (active === 'active') {
      return
    }
    let list = getActiveItems()
    showMessage(list, NO_TASK)
    setTodos(list)
    saveItem('datalist-d', list)
    setActive('all')
    saveItem('active-d', 'all')
  }

  // handle delete item
  function handleRemoveItem(id: number) {
    let newTodos, list
    newTodos = getDataList().filter((item: any) => item.id !== id)

    //filter when active button is active
    if (active === 'active') {
      list = newTodos.filter((item: any) => item.isCompleted === false)
      showMessage(list, NO_ACTIVE)
    }

    //filter when completed button is active
    else if (active === 'completed') {
      list = newTodos.filter((item: any) => item.isCompleted === true)
      showMessage(list, NO_COMPLETED)
    }
    else {
      list = newTodos
      showMessage(list, NO_TASK)
    }
    setTodos(list)
    saveItem('datalist-d', newTodos)

  }

  //show message helper
  function showMessage(list: any, text: string) {
    if (list.length === 0) setMessage(text)
  }

  //total active items
  let leftItemsNumber = totalActiveItems()

  //holds the dragged item's index
  let draggedIndex: number;


  function onDrag(e: any, index: number) {
    draggedIndex = index

  }

  function onDragStart(e: any) {
    // make it half tranparent
    e.target.classList.add("dragging")
  }

  function onDragEnd(e: any) {
    // make it half tranparent
    e.target.classList.remove("dragging")
  }

  function onDragEnter(e: any) {
    e.target.classList.add('dragover')

  }

  function onDragLeave(e: any) {
    e.target.classList.remove('dragover')
  }

  function onDragOver(e: any) {
    e.preventDefault()
  }

  function onDrop(e: any, index: number) {
    e.preventDefault()
    if (draggedIndex === index) {
      return
    }

    //get todo list
    let list = [...getAllItems()]

    let draggedItem = list[draggedIndex]

    //filter out the dragged item
    let newList = list.filter((item: any, index: number) => index !== draggedIndex)

    //insert the dragged item at the dropped position
    newList.splice(index, 0, draggedItem)

    setTodos(newList)
    saveItem('datalist-d', newList)

  }


  return (
    <div className="App" data-theme={theme}>
      <header className="header-container">
        <div className="header">
          <div className="header-top">
            <h1>TODO</h1>
            <div className="theme-switch-wrapper">
              <button onClick={themeToggleHandler} type='button' aria-label='toggle theme'>
                {
                  theme === "dark"
                    ? <img src={sun} alt="dark mode" />
                    : <img src={moon} alt="dark mode" />
                }
              </button>
            </div>
          </div>
          <div className="search-wrapper">
            <form onSubmit={handleFormSubmit} className='search-wrapper-form'>
              <div className="search-button">
                <input
                  type="submit" value="" />
              </div>
              <div className="search-input">
                <input onChange={handleInputHange} value={task} type="search" name="search" ref={inputRef} placeholder='Create a new todo' />
              </div>
            </form>
          </div>

        </div>
      </header>
      <main className="main-wrapper">
        <ul className='list'>

          {
            !todos.length
              ? <li className='no-task'>{message}</li>
              : todos.map((todo: any, index: number) => {
                return (
                  <ListItem
                    onDrag={onDrag}
                    onDragStart={onDragStart}
                    onDragEnd={onDragEnd}
                    onDragLeave={onDragLeave}
                    onDragEnter={onDragEnter}
                    onDragOver={onDragOver}
                    onDrop={onDrop}
                    handleRemoveItem={handleRemoveItem}
                    id={todo.id} onchange={() => ItemCheckHandler(todo.id)} key={todo.id} checked={todo.isCompleted} text={todo.text}
                    index={index}
                  />
                )
              })

          }



        </ul>
        <div className="control-btns">
          <div className="control-btns-left"><span>{leftItemsNumber > 1 ? leftItemsNumber + " Items left" : leftItemsNumber + " Item left"}</span></div>
          <div className="control-btns-center">
            <input onClick={handleShowAll} className={active === 'all' ? 'active' : ''} type="button" value="All" />
            <input onClick={handleActive} className={active === 'active' ? 'active' : ''} type="button" value="Active" />
            <input onClick={handleCompleted} className={active === 'completed' ? 'active' : ''} type="button" value="Completed" />
          </div>
          <div className="control-btns-right">
            <input onClick={handleClearCompleted} type="button" value="Clear Completed" />
          </div>
        </div>
      </main>
      <footer className='footer'>
        <p>Drag and drop to reorder list</p>
      </footer>

    </div>
  );
}

// checkbox component
type CheckboxType = {

  checked: boolean;
  onChange: () => void

}

const Checkbox = ({ checked, onChange }: CheckboxType) => {

  return (
    <label className="checkbox">
      <input type="checkbox" onChange={onChange} checked={checked} />
      {/* <img src={check} alt=""/> */}
    </label>
  )
}

// list item component
type ListItemTypes = {
  onchange: () => void
  text: string;
  checked: boolean;
  id: number;
  index: number;
  handleRemoveItem: (id: number) => void,
  onDragStart: (e: any) => void
  onDragEnd: (e: any) => void
  onDrag: (e: any, index: number) => void
  onDragLeave: (e: any) => void
  onDragEnter: (e: any) => void
  onDragOver: (e: any) => void
  onDrop: (e: any, index: number) => void
}

const ListItem = ({ checked,
  text,
  onchange,
  handleRemoveItem,
  id,
  index,
  onDrag,
  onDragStart,
  onDragEnd,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop,
}: ListItemTypes) => {

  let textClassname = checked ? "text text-through" : "text"

  return (
    <li
      onDrag={(e) => onDrag(e, index)}
      draggable={true}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDrop={(e) => onDrop(e, index)}
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
    >
      <Checkbox onChange={onchange} checked={checked} />
      <p onClick={onchange} className={textClassname}>{text}</p>
      <button type="button" onClick={() => handleRemoveItem(id)} >
        <img src={cross} alt="remove item" />
      </button>
    </li>
  )
}
export default App;
