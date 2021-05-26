// selecting element that currently exist and will be used 
// on multiple occasions
const enterInput = document.querySelector('#task');
const completedInput = document.querySelector('#completed');
const enterButton = document.querySelector('#enterTask');
const completedButton = document.querySelector('#completedTask');
const ul = document.querySelector('ul');

// toggles the display of the ul if it is empty
function setUlDisplay() {
    if (ul.childElementCount === 0) {
        ul.style.border = 'none';
        ul.style.display = 'none'
    } else {
        ul.style.display = 'flex';
    };
};

setUlDisplay();

// loading items saved in localstorage and creating
// elements for them so that they load correctly on page load
function loadFromLocalStorage() {
    let i = 0;
    ul.style.display = 'flex';
    let allTodos = JSON.parse(localStorage.getItem("todos"));
    if (allTodos) {
        for (let item of allTodos) {
            if (item !== 'highscore') {
                let newLi = document.createElement('li');
                let newRadioInput = document.createElement('input');
                newRadioInput.setAttribute('type', 'radio');
                newRadioInput.id = 'radio' + i;
                newRadioInput.classList.add('radio');
                newLi.innerHTML = `<li id="number${i}">${item}</li>`
                if (newLi.innerText !== "null") {
                    ul.append(newLi, newRadioInput);
                };
            };
            i++
        };
    };
};

loadFromLocalStorage();

// if an item is deleted, we remove it from localstorage as well
function removeFromLocalStorage(item) {
    let todosToRemove = JSON.parse(localStorage.getItem("todos"));
    for (let todo of todosToRemove) {
        if (todo === item.innerText) {
            const idx = todosToRemove.indexOf(item.innerText);
            todosToRemove.splice(idx, 1);
            localStorage.setItem("todos", JSON.stringify(todosToRemove));
        };
    };
};

// there was an issue with items loaded from localstorage having an id,
// and then new items would have an id that was less than the last li id
// in the ul. This checks to see what that number is, and returns that number + 1
// if the list is empty, we return o. This is later used to set part of the id for
// the radio input and the li
function countLis() {
    let listIds = [];
    const listItems = document.querySelectorAll('li');
    for (let li of listItems) {
        if (li.id) {
            listIds.push(li.id);
        }
    };

    if (listIds.length >= 1) {
        return parseInt(listIds.slice(-1)[0].slice(-1)[0]) + 1;
    }
    return 0;
};

// handles creation and placement of new elements, and also 
// saves items to localstorage. Also clears input value and
// prevents the form from refreshing the page.
enterButton.addEventListener('click', (e) => {
    e.preventDefault();
    ul.style.display = 'flex';
    const oldTodos = JSON.parse(localStorage.getItem("todos")) || [];
    
    let newLi = document.createElement('li');
    let newRadioInput = document.createElement('input');
    newRadioInput.setAttribute('type', 'radio');
    newRadioInput.classList.add('radio');
    newLi.innerHTML = `<li id="number${countLis()}">${enterInput.value}</li>`
    newRadioInput.id = 'radio' + countLis();
    oldTodos.push(newLi.innerText)
    localStorage.setItem("todos", JSON.stringify(oldTodos));
    
    ul.append(newLi, newRadioInput);
    enterInput.value = '';
});

// I could not simply select all radio buttons on page load, 
// because there may not be any. This handles deletion of 
// elements and calls the function to delete information 
// from localstorage.
document.addEventListener('click', (ev) => {
    if (ev.target.className === 'radio') {
        let finder = ev.target.id.slice(-1)[0];
        const userSelected = document.querySelector(`#${ev.target.id}`);
        const associatedLi = document.querySelector(`#number${finder}`);
        let bothItems = [userSelected, associatedLi];
        bothItems.forEach((item) => {
            item.style.opacity = '0'
            item.style.transition = 'opacity 2000ms'
            setTimeout(() => {
                userSelected.remove();
                associatedLi.remove();
                setUlDisplay();
            },1500);
        });
        removeFromLocalStorage(associatedLi);
    };
});

// marking a line through an item if the "Mark as Completed"
// button is clicked, and clearing the input value, while 
// preventing the form from refreshing the page.
completedButton.addEventListener('click', (e) => {
    e.preventDefault();
    const allLis = document.querySelectorAll('li');
    for (let li of allLis) {
        if (li.innerText === completedInput.value) {
            li.style.textDecoration = 'line-through';
        };
    };
    completedInput.value = '';
});
