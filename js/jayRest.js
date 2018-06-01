"use strict";
/**
 * @author Arockia Johnson Soundar Raj<soundar_raj_arockia01.pt@ichat.sp.edu.sg>
 * @returns {jayDb.d}
 */
var jayDb = function () {
    var d = {};
    d.init = function () {
        d.db = new Dexie("jay_rests");
        d.db.version(1).stores({
            jay_rests: '++id,first_name,last_name,age,&email,password',
            jay_cart: '++id,item_id,quantity'
        });
    };
    d.findOne = function (search) {
        return d.db.jay_rests.where(search).first();
    };
    d.save = function (attrs) {
        return d.db.jay_rests.add(attrs);
    };
    d.delete = function (pk) {
        return d.db.jay_rests.delete(pk);
    };
    d.init();
    return d;
};
var jayApp = angular.module('jayApp', []);
jayApp.controller('jayCtlr', function ($scope, $interval) {
    $scope.session = localStorage.getItem('jayRest') ? JSON.parse(localStorage.getItem('jayRest')) : {};
    $scope.register = {};
    $scope.jayDb = new jayDb();
    $scope.allowedPages = ["login", "welcome", "sign-up"];
    $scope.user = {email: '', password: ''};
    $scope.alertMsg = "";
    $scope.siteName = "Arockia Johnson";
    $scope.singleMenu = {};
    $scope.qtys = [];
    $scope.menuList = [{"name": "Alleppey Fish Curry", "price": 436}, {"name": "Aloo Dhanya Tikki", "price": 416}, {"name": "Butterfly Prawns", "price": 312}, {"name": "Catch of the day in Banana Leaves", "price": 412}, {"name": "Cock-a-leekie ", "price": 133}, {"name": "Corn Fritters", "price": 174}, {"name": "Dragon Soup", "price": 318}, {"name": "Fish ", "price": 348}, {"name": "Fish Cube Masala Fry", "price": 389}, {"name": "Fish Platter", "price": 156}, {"name": "French Fries", "price": 101}, {"name": "Gazpacho ", "price": 437}, {"name": "Grilled Fish Steak", "price": 296}, {"name": "Grilled Tiger Prawn", "price": 234}, {"name": "Kerala Fish Platter", "price": 261}, {"name": "Malabar Prawn Curry", "price": 348}, {"name": "Masala Fried Fish", "price": 182}, {"name": "Prawn and Mushroom Soup", "price": 220}, {"name": "Prawn Bisque ", "price": 142}, {"name": "Prawn Platter", "price": 16}, {"name": "Sea Food Ularthiyathu", "price": 17}, {"name": "Seafood Chowder", "price": 204}, {"name": "Seafood Platter", "price": 441}, {"name": "Seafood Platter with Lobster", "price": 375}, {"name": "Shrimp Cocktail", "price": 474}, {"name": "Spicy Prawn Skewers", "price": 228}, {"name": "Squid/ Prawn Tempura", "price": 493}, {"name": "Sweet Corn Chicken Soup", "price": 210}, {"name": "Tomato and Basil Soup ", "price": 350}, {"name": "Traditional Kerala specialities", "price": 343}, {"name": "Travancore Fish Roast", "price": 31}];
    $scope.validate = function () {
        var tmpSession = $scope.jayDb.findOne({email: $scope.user.email, password: sha1($scope.user.password)});
        tmpSession.then(function (dt) {
            if (dt) {
                $scope.session = dt;
                localStorage.setItem('jayRest', JSON.stringify(dt));
                $.mobile.navigate("#index");
            } else {
                $scope.alert('Invalid E-mail or Password!');
            }
        });
        return;
    };
    $scope.showMenu = function (menu, key) {
        $scope.singleMenu = menu;
        $scope.singleMenu.id = key;
    };
    /*
     * Function to show/hide the detail menu
     * @returns {Boolean}
     */
    $scope.isSingleMenu = function () {
        return Object.keys($scope.singleMenu).length > 0;
    };
    /**
     * Function to clear the single menu so that user can go ahead with multiple menu selection
     * @returns NULL
     */
    $scope.clearSingleMenu = function () {
        $scope.singleMenu = {};
    };
    /**
     * Function to save to indexeddb in the table jay_cart
     * @param INT id
     * @returns NULL
     */
    $scope.saveSingleMenu = function (id) {
        var qty = parseInt($('#qty_dt').val());
        $scope.qtys[id] = qty;
        $scope.jayDb.db.jay_cart.where({item_id: id}).first().then(function (res) {
            if (res) {
                res.quantity = qty;
                $scope.jayDb.db.jay_cart.update(res.id, res);
            } else {
                $scope.jayDb.db.jay_cart.add({item_id: id, quantity: qty});
            }
            $scope.alert('Menu item added to cart!');
        });
    };
    /**
     * Function to return all the cart values
     * @returns Promise
     */
    $scope.getAllCart = function () {
        $scope.jayDb.db.jay_cart.each(function (cart) {
            console.log($scope.qtys);
            $('#cartListView').append('<li>' + $scope.menuList[cart.item_id].name + '<span class="ui-li-count">' + cart.quantity + '</span></li>');
            $('#cartListView').listview().listview('refresh');
        });
        $scope.jayDb.db.jay_cart.count().then(function (isCnt) {
            if (isCnt === 0) {
                $('#cartListView').append('<li>No Items in your shopping cart!');
            }
            $('#cartListView').listview().listview('refresh');
        });

        $('#cartListView').listview().listview('refresh');
    };
    $scope.alert = function (msg) {
        $scope.alertMsg = msg;
        setTimeout(function () {
            $('#alertPopup').trigger('click');
        }, 150);
    };
    $scope.isValid = function () {
        return Object.keys($scope.session).length > 0;
    };
    $scope.init = function () {
        setInterval(function () {
            var actPage = $.mobile.activePage.attr("id");
            if (localStorage.getItem('jayRest') === null && !($scope.allowedPages.includes(actPage))) {
                $.mobile.navigate("#welcome");
            }
        }, 1000);
        setTimeout(function () {
            $('#author-list ul').listview().listview('refresh').alphascroll();
            $('#cartListView').listview().listview('refresh');
        }, 3000);
    };
    $scope.signUp = function () {
        $scope.register.password = sha1($scope.register.password);
        $scope.jayDb.save($scope.register);
        $scope.alert('Registration was successfull! Please proceed to login now..');
        $.mobile.navigate("#login");
    };
    $scope.logout = function () {
        if (alert('Are you sure want to log out?')) {
            $scope.session = {};
            localStorage.clear();
            $.mobile.navigate("#login");
        }
    };
    $scope.init();
});
document.addEventListener("DOMContentLoaded", function () {
    var elements = document.getElementsByTagName("INPUT");
    for (var i = 0; i < elements.length; i++) {
        elements[i].oninvalid = function (e) {
            e.target.setCustomValidity("");
            if (!e.target.validity.valid) {
                e.target.setCustomValidity(e.target.dataset.msg);
            }
        };
        elements[i].oninput = function (e) {
            e.target.setCustomValidity("");
        };
    }
});