let addBtn = document.querySelector("#add");
let incList = document.querySelector(".inc-list");
let expList = document.querySelector(".exp-list");
let budget = document.querySelector("#balance");
let income = document.querySelector("#income");
let expense = document.querySelector("#expense");
let incExp = document.querySelector(".income-expense");
let formEl = document.querySelector(".form form");

let data;

// Check if there is saved item in local storage
data = JSON.parse(localStorage.getItem('list')) || {
    incomes: [],
    expenses: [],
    totalInc: 0,
    totalExp: 0,
    budget: 0
};
apdateUi();

// Function to add items to data
let addToData = function(item){
    if(item.description === "" || item.value === 0){return;}
    if(item.type === 'inc'){
        data.incomes.push(item);
        data.totalInc = data.incomes.reduce((acc, item)=>acc + item.value, 0);
    }else if(item.type === 'exp'){
        data.expenses.push(item);
        data.totalExp = data.expenses.reduce((acc, item)=>acc + item.value, 0);
    }
    data.budget = data.totalInc - data.totalExp;
}

// Function to update the user interface
function apdateUi(){
    data.totalInc = data.incomes.reduce((acc, item)=>acc + item.value, 0);
    data.totalExp = data.expenses.reduce((acc, item)=>acc + item.value, 0);
    data.budget = data.totalInc - data.totalExp;

    budget.textContent = `+ $${data.budget}`;
    income.textContent = `+ $${data.totalInc}`;
    expense.textContent = `- $${data.totalExp}`;

    incList.innerHTML = "";
    expList.innerHTML = "";
    data.incomes.forEach((element, index) => {
        let html = `
            <div id="${index}" class="inc-item flex j-c-sb">
                <div class="item-infos flex j-c-sb">
                    <p>${element.description}</p>
                    <p>${element.value}</p>
                </div>
                <div class="item-options flex j-c-sa">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-times-circle"></i>
                </div>
            </div>
        `;
        incList.insertAdjacentHTML("afterbegin", html);
    });
    data.expenses.forEach((element, index) => {
        let html = `
            <div id="${index}" class="exp-item flex j-c-sb">
                <div class="item-infos flex j-c-sb">
                    <p>${element.description}</p>
                    <p>${element.value}</p>
                </div>
                <div class="item-options flex j-c-sa">
                    <i class="fa fa-edit"></i>
                    <i class="fa fa-times-circle"></i>
                </div>
            </div>
        `;
        expList.insertAdjacentHTML("afterbegin", html);
    });

    // Store items into local storage
    localStorage.setItem('list', JSON.stringify(data));
}

// Callback that's will be triggerd when we click submit button 
let additionCtrl = function(e){
    // Preventing the default behavior of the form element
    e.preventDefault();

    // 1 Get input values
    let newItem = {
        type: document.querySelector(".input-type select").value,
        description: document.querySelector("#description").value,
        value: +document.querySelector("#value").value,
    }

    // 2 Add newItem to the data
    addToData(newItem);

    // 3 Add new item to the ui
    apdateUi();

    // Reset the form
    formEl.reset();   
};

let deletionCtrl = function(e){
    // Get element that was clicked
    let delBtn = e.target;

    if(delBtn.classList.contains("fa-times-circle")){
        let parent = delBtn.parentNode;
        let grandParent = parent.parentNode;

        // 1 get the id of the item you want to delete
        let idValue = +grandParent.id;

        // 2 delete item from the data
        if(grandParent.classList.contains('inc-item')){
            data.incomes.splice(idValue, 1);
        }else if(grandParent.classList.contains('exp-item')){
            data.expenses.splice(idValue, 1);
        }
    }
    // 3 update ui with new values
    apdateUi();
}

let editionCtrl = function(e){
    let edtBtn = e.target;

    if(edtBtn.classList.contains("fa-edit")){
        let parent = edtBtn.parentNode;
        let grandParent = parent.parentNode;

        // 1 get the id of the item you want to edite
        let idValue = +grandParent.id;


        // 2 delete item from the data;
        if(grandParent.classList.contains('inc-item')){
            let incDes = data.incomes[idValue].description;
            let incVal = data.incomes[idValue].value;
            document.querySelector("#description").value = incDes;
            document.querySelector("#value").value = incVal;
            data.incomes.splice(idValue, 1);
        }else if(grandParent.classList.contains('exp-item')){
            let expDes = data.expenses[idValue].description;
            let expVal = data.expenses[idValue].value;
            document.querySelector("#description").value = expDes;
            document.querySelector("#value").value = expVal;
            data.expenses.splice(idValue, 1);
        }
    }

    apdateUi();
}

addBtn.addEventListener("click", additionCtrl);
incExp.addEventListener("click", deletionCtrl);
incExp.addEventListener("click", editionCtrl);