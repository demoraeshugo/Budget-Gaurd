// Budget Controller
var budgetController = (function() {
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var Income = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(current) {
      sum += current.value;
    });
    data.totals[type] = sum;
  };

  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };

  return {
    addItem: function(type, des, val) {
      var newItem, ID;

      //Create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //Create new inc/exp item
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //Push into data strucutre
      data.allItems[type].push(newItem);

      //Return new element
      console.log(newItem);
      return newItem;
    },

    calculateBudget: function() {
      //Calculate Total income and expenses
      calculateTotal("exp");
      calculateTotal("inc");

      //Calculate budget = totInc - totExp
      data.budget = data.totals.inc - data.totals.exp;

      //Calculate % of Inc used
      data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },

    testing: function() {
      console.log(data);
    }
  };
})();

// UI Controller
var UIController = (function() {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expenseContainer: ".expenses__list",
    container: ".container"
  };
  return {
    getInput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, //will be either inc or exp
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
      };
    },

    addListItem: function(obj, type) {
      var html, newHTML, element;

      //Create HTML string with placeholder text

      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div> <div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expenseContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Replace placeholder text with data from object

      newHTML = html.replace("%id%", obj.id);
      newHTML = newHTML.replace("%description%", obj.description);
      newHTML = newHTML.replace("%value%", obj.value);

      //Insert HTML into DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHTML);
    },

    clearFields: function() {
      var fields, fieldsArr;

      fields = document.querySelectorAll(
        DOMstrings.inputDescription + "," + DOMstrings.inputValue
      );

      fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });

      fieldsArr[0].focus();
    },

    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//Global App Controller
var controller = (function(budgetCtrl, UICtrl) {
  var setupEventListeners = function() {
    var DOM = UICtrl.getDOMstrings();
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);

    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });

    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);
  };

  var updateBudget = function() {
    var budget;

    //Calculate the budget
    budgetCtrl.calculateBudget();

    //Return the budget
    budget = budgetCtrl.getBudget();

    //Display the budget on the UI2
    console.log(budget);
  };

  var ctrlAddItem = function() {
    var input, newItem;

    //1. Get the filed input data
    input = UICtrl.getInput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //console.log(input);

      //2. Add the item to the budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      //3. Add the item to the UI
      UICtrl.addListItem(newItem, input.type);

      //4. Clear fields
      UICtrl.clearFields();

      //5. Calculate and Update Budget
      updateBudget();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;

    itemID = (event.target.parentNode.parentNode.parentNode.parentNode.id);

    if(itemID) {
      splitID = itemID.split("-");
      type = splitID[0];
      ID = splitID[1];
    }

    //1. Delete Item from Data Strucutre

    //2. Delete Item from UI

    //3. Update and show new Budget
  };

  return {
    init: function() {
      console.log("Application has started.");
      setupEventListeners();
    }
  };
})(budgetController, UIController);

controller.init();
