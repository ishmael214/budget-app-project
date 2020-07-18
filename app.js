// THIS CONTROLS THE BUDGET

var budgetController = (function () {
    var Expense = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val
    };

    var Income = function(id, desc, val) {
        this.id = id;
        this.desc = desc;
        this.val = val
    };

    var calculateTotal = function(type) {
        var sum = 0;
        data.items[type].forEach(function (current){
            sum = sum + current.val
        });

        data.totals[type] = sum
    };

    var data = {
        items: {
                exp: [],
                inc: []
            },
        totals: {
            exp: 0,
            inc: 0
        },

        budget: 0,
        percentage: -1
     }
    
     return {
         addItem: function (type, desc, val) {
            let newItem, id, dataType;

            dataType = data.items[type]
            
            //create new id
            if (dataType.length > 0) {
                id = dataType[dataType.length - 1].id + 1
            } 
            // might have to remove this else if bc of id selectors in html (maybe tho)
            else if (dataType.length === 0) {
                id = 1;
            }
             else {
                id = 0;
            }
            


            // create new item based on inc or exp
            if (type === 'exp') {
                newItem = new Expense (id, desc, val); 
            }
             else if (type === 'inc') {
                newItem = new Income (id, desc, val); 
            }
            // push into items data structure
            dataType.push(newItem);

            // return to global scope
            return newItem;

         },

         calculateBudget: function (){

            // calc total income & expenses
            calculateTotal('exp');
            calculateTotal('inc');
            // calculate budget: income - expenses
            data.budget = data.totals.inc - data.totals.exp;
            // calculate percentage of income spent 
            if (data.totals.inc > 0) {

                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
    
         },

         getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
         },

         testing: function () {
             console.log(data);
         }

     };


})();



// THIS CONTROLS THE UI

var UIController = (function (){

    let domStrings = {
        type: '.add__type',
        desc: '.add__description',
        val: '.add__value',
        addBtn: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expensesLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage'
    }


    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.type).value,
                desc: document.querySelector(domStrings.desc).value,
                val: parseFloat(document.querySelector(domStrings.val).value)
            }
            
        },

        addListItem: function(obj, type) {
            let html, newHtml, element;
            // create html string w palceholder

            // inc
            if (type === 'inc') {
                element = domStrings.incomeContainer
                html = `<div class="item clearfix" id="income-%id%"> 
                            <div class="item__description">%desc%</div> 
                            <div class="right clearfix">
                                <div class="item__value">+ %val%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }
            

            // exp
            if (type === 'exp') {
                element = domStrings.expenseContainer
                html = `<div class="item clearfix" id="expense-%id%">
                            <div class="item__description">%desc%</div>
                            <div class="right clearfix">
                                <div class="item__value">- %val%</div>
                                <div class="item__percentage">21%</div>
                                <div class="item__delete">
                                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                                </div>
                            </div>
                        </div>`;
            }
            

            // replace placehodler text with actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%desc%', obj.desc);
            newHtml = newHtml.replace('%val%', obj.val);
            // insert html into DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function () {
            let fields, fieldsArr;

            fields = document.querySelectorAll(domStrings.desc + ',' + domStrings.val)
            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function (current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            document.querySelector(domStrings.budgetLabel).textContent = obj.budget;
            document.querySelector(domStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(domStrings.expensesLabel).textContent = obj.totalExp;
            

            if (obj.percentage > 0) {
                document.querySelector(domStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(domStrings.percentageLabel).textContent = '---';
            }
        },

        getDomStrings: function (){
            return domStrings;
        }
    }


})();





// THIS CONTROLS THE CLICKS (GLOBAL APP CONTROLLER)

var appController = (function (budgetCtrl, UICtrl) {

    function setupEventListenerNother () {
        const domStrings = UICtrl.getDomStrings();

        document.querySelector(domStrings.addBtn).addEventListener('click', ctrlAddItem)

        document.addEventListener('keypress', function(e) {

             if (e.keyCode === 13 || e.switch === 13) {
                ctrlAddItem();
            } 
        });
    };

    var updateBudget = function () {
        // 4. Calculate the budget
        budgetCtrl.calculateBudget();
        // Return budget
        var budget = budgetCtrl.getBudget();

        // 5. Display the budget on the UI.
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        let input, newItem;
        // 1. get input field data (what they're typing into budget)
        input = UICtrl.getInput();
        
        if (input.desc !== "" && !isNaN(input.val) && input.val > 0) {
             // 2. add items to budget controller
        newItem = budgetCtrl.addItem(input.type, input.desc, input.val);

        // 3. add items to the User Interface (UI)

        UICtrl.addListItem(newItem, input.type);

        // clear fields

        UICtrl.clearFields();

        // calculate & update budget

        updateBudget();
        }
    }

    return {
        init: function () {
            setupEventListenerNother();
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            console.log('The app has started my boi');
        }
    }


})(budgetController, UIController);

appController.init();