const addBtn = document.getElementById('abbTask');
const taskValue = document.getElementById('task__value');
const taskList = document.querySelector('.task__list');
const finishedTask = document.querySelector('.task__finished');




function createdNewLiHtml(task,done){
    let listItem = document.createElement('li');
    let checkBox = document.createElement('button');

   if(done){
    checkBox.className = 'btn__task checkbox'; 
    checkBox.innerHTML =  '<img src="img/check.png" alt=""></img>';
    checkBox.style.backgroundColor = 'lightgreen';

   }else{
    checkBox.className = 'btn__task checkbox'; 
    checkBox.innerHTML =  '<img src="img/check.png" alt=""></img>';
   }
    

    let labelTextTask = document.createElement('label');
    labelTextTask.innerText = task;
    labelTextTask.classList.add('task__todo');

    let inputEdit = document.createElement('input');
    inputEdit.type = 'text';
    
    let editBtn = document.createElement('button');
    editBtn.classList.add('btn__task');
    editBtn.classList.add('edit');
    editBtn.innerHTML =' <img src="img/edit.png" alt="">'; 

    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('btn__task');
    deleteBtn.classList.add('delete');
    deleteBtn.innerHTML = ' <img src="img/delete.png" alt="">';

    
    

    taskList.appendChild(listItem);
    listItem.appendChild(checkBox);
    listItem.appendChild(labelTextTask);
    listItem.appendChild(inputEdit);
    listItem.appendChild(editBtn);
    listItem.appendChild(deleteBtn);
   

   

    return listItem;
}


// Добавляес задачу в активные таски

function addTask () {
    if(taskValue.value) {
        let listItem = createdNewLiHtml(taskValue.value, false);
        
        bindTasks(listItem,finishTask);
        taskValue.value = '';
    }
    save();
}

addBtn.onclick = addTask;


// метод удаления таски

function deleteTask () {
    // console.log(this);
    let listItem = this.parentNode;
    let ul = listItem.parentNode;
   
    ul.removeChild(listItem);
    save ();
   
}

function editTask () {
    // console.log(this)

    let editBtn = this;
    let  listItem = this.parentNode;

    let label = listItem.querySelector('label');

    let input = listItem.querySelector('input[type=text]');
 

    var containsClass = listItem.classList.contains('editMode');
    console.log(containsClass)

    if (containsClass) {
        label.innerText = input.value;
        editBtn.classList.add('btn__task');
        editBtn.classList.add('edit');
        editBtn.innerHTML =' <img src="img/edit.png" alt="">'; 
        save();
        
    } else {
        input.value = label.innerText;
        editBtn.classList.add('btn__task');
        editBtn.classList.add('edit');
        editBtn.innerHTML =' <img src="img/save.png" alt="">'; 

    }
    listItem.classList.toggle('editMode');
 }
 
 function finishTask () {
    let checkBtn = this;
    let  listItem = this.parentNode;
    let ul = listItem.parentNode;
   
    checkBtn.style.backgroundColor = 'lightgreen';
    
    finishedTask.appendChild(listItem);
    bindTasks(listItem, unfinishedTask);

    save();
    
 }

 function unfinishedTask () {
    let  checkBtn = this;
    let  listItem = this.parentNode;
    checkBtn.style.backgroundColor = 'transparent';
    taskList.appendChild(listItem);
    bindTasks(listItem, finishTask);
    save();
    
 }
 


//  функция обработчик тасков

function bindTasks(listItem, checkboxEvent){
    let checkbox = listItem.querySelector('button.checkbox');
    let editBtn = listItem.querySelector('button.edit');
    let deleteBtn = listItem.querySelector('button.delete');
    
    checkbox.onclick = checkboxEvent;
    editBtn.onclick = editTask;
    deleteBtn.onclick = deleteTask;
}


// функция сохраняние в локалсторедж

function save () {
    var unfinishedTasksArr = [];

    for (var i = 0; i < taskList.children.length; i++) {
        unfinishedTasksArr.push(taskList.children[i].getElementsByTagName('label')[0].innerText);
    }
   


    var finishedTasksArr = [];

    for (var i = 0; i < finishedTask.children.length; i++) {
        finishedTasksArr.push(finishedTask.children[i].getElementsByTagName('label')[0].innerText);
    }


    localStorage.removeItem('todo');
    localStorage.setItem('todo', JSON.stringify({
        taskList: unfinishedTasksArr,
        finishedTask: finishedTasksArr
    }));
}

function load(){
    return JSON.parse(localStorage.getItem('todo'));
}



var data=load();

for(var i=0; i<data.taskList.length;i++){
    var listItem=createdNewLiHtml(data.taskList[i], false);
    taskList.appendChild(listItem);
    bindTasks(listItem, finishTask);
}

for(var i=0; i<data.finishedTask.length; i++){
    var listItem=createdNewLiHtml(data.finishedTask[i], true);
    finishedTask.appendChild(listItem);
    bindTasks(listItem, unfinishedTask);
}




// function auto_grow(element) {
//     element.style.height = "30px";
//     element.style.height = (element.scrollHeight)+"px";
//     };