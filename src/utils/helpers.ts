// save to localStorage
export function saveItem(key: string, value: any) {
    if (typeof value === 'string') {
        localStorage.setItem(key, value)
    } else {
        localStorage.setItem(key, JSON.stringify(value))
    }
}

// save to localStorage
export function getItem(key: string): string {
    return localStorage.getItem(key) || ''
}

//parse data from localstorage
export function parseData(key: string) {
    return getItem(key) ? JSON.parse(getItem(key)) : []
}

//get list
export function getDataList() {
    return parseData('datalist-d')
}


// get all items list
export function getAllItems() {   
    return getDataList()
}

// get active items list
export function getActiveItems() {    
    return getDataList().filter((item: any) => item.isCompleted === false)
}

//get completed list
export function getCompletedItems() {    
    return getDataList().filter((item: any) => item.isCompleted === true)
}

// number of active items
export function totalActiveItems(){
    return getActiveItems().length
} 