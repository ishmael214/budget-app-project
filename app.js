// THIS CONTROLS THE BUDGET

var budgetController = (function () {



})();



// THIS CONTROLS THE UI

var UIController = (function (){

    let domStrings = {
        type: '.add__type',
        desc: '.add__description',
        val: '.add__value',
        addBtn: '.add__btn'
    }


    return {
        getInput: function () {
            return {
                type: document.querySelector(domStrings.type).value,
                desc: document.querySelector(domStrings.desc).value,
                val: document.querySelector(domStrings.val).value
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
    }

    var ctrlAddItem = function () {
        let input = UICtrl.getInput();
        // get all the data
        console.log(input);
  
    }

    return {
        init: function () {
            setupEventListenerNother();
            console.log('The app has started my boi');
        }
    }


})(budgetController, UIController);

appController.init();