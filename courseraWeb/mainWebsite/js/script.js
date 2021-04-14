$(function(){ //same as document.addEventListener("DOMContentLoaded" ..)

    $("#navbarToggle").blur(function(event){
        var screenWidth = window.innerWidth;
        if(screenWidth < 768){
            $("#collapsable-nav").collapse('hide');
        }
    });
});

(function(global){

    var od = {};
    
    var homeHtml = "./snippets/home-snippet.html"; // Home page html
    var allCategoriesUrl = "https://davids-restaurant.herokuapp.com/categories.json"; //actual data for categories
    var categoriesTitleHtml = "./snippets/categories-title-snippet.html"; //Html for categories title (need to render first)
    var categoryHtml = "./snippets/category-snippet.html"; //Html for category

    var menuItemsUrl = "https://davids-restaurant.herokuapp.com/menu_items.json?category=";//actual data for categories
    var menuItemsTitleHtml = "./snippets/menu-items-title.html";
    var menuItemHtml = "./snippets/menu-item.html";

    var aboutHtml = "./snippets/about-snippet.html";
    var awardsHtml = "./snippets/awards-snippet.html";
    

    var insertHtml = function (selector,html){
        var targetElem = document.querySelector(selector);
        targetElem.innerHTML = html;
    };

    var showLoadingIcon = function(selector){
        var html = "<div class='text-center'>";
        html += "<img src='./img/ajax-loader.gif'></div>";
        insertHtml(selector,html);
    };
    
    var insertProperty = function(string,propName,propValue){
        var propToReplace = "{{" + propName + "}}";
        string = string.replace(new RegExp(propToReplace,"g"),propValue);
        return string;
    }

    var switchMenuToActive = function(){
        var classes = document.querySelector("#navHomeButton").className;
        classes = classes.replace(new RegExp("active","g"),"");
        document.querySelector("#navHomeButton").className = classes;
    
        var classes = document.querySelector("#navMenuButton").className;
        if(classes.indexOf("active") == -1){
            classes += " active";
            document.querySelector("#navMenuButton").className = classes;
        }
    };

    document.addEventListener("DOMContentLoaded",function(event){

        showLoadingIcon("#main-content");
        $ajaxUtils.sendGetRequest(
            homeHtml,
            function(responseText){
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false);
    });

    od.loadAboutPage = function(){loadPage(aboutHtml);}
    od.loadAwardsPage = function(){loadPage(awardsHtml);}
    
    function loadPage(htmlRoute){
        showLoadingIcon("#main-content");
        $ajaxUtils.sendGetRequest(
            htmlRoute,
            function(responseText){
                space = "<br>";
                var i=0;
                while (i<10) {space += "<br>";i++;}
                responseText += space;
                document.querySelector("#main-content").innerHTML = responseText;
            },
            false);

    }
    
    /*****************************************************************************************************************/
    od.loadMenuCategories = function(){
        showLoadingIcon("#main-content");
        $ajaxUtils.sendGetRequest(
            allCategoriesUrl,
            buildAndShowCategoriesHTML);
    };

    function buildAndShowCategoriesHTML(categories){

        $ajaxUtils.sendGetRequest(
            categoriesTitleHtml, //resquesting for local html-structure built
            function(categoriesTitleHtml){
                $ajaxUtils.sendGetRequest(
                    categoryHtml, //resquesting for local html-structure built
                    function(categoryHtml){
                        switchMenuToActive();
                        var categoriesViewHtml = buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml);
                        insertHtml("#main-content",categoriesViewHtml);
                    },false);
            },false);

    }//end of buildAndShowCategoriesFunction()

    function buildCategoriesViewHtml(categories,categoriesTitleHtml,categoryHtml){
       
        finalHtml = categoriesTitleHtml;
        finalHtml += "<section class='row'>";
        for(var i=0;i<categories.length;i++){
            var html = categoryHtml;
            var name = "" + categories[i].name;
            var short_name = categories[i].short_name;
            html = insertProperty(html,"name",name);
            html = insertProperty(html,"short_name",short_name);
            finalHtml += html;
        }
        finalHtml += "</section>";
        return finalHtml;
    }
    /*****************************************************************************************************************/
    od.loadMenuItems = function (categoryShort){
        showLoadingIcon("#main-content");
        $ajaxUtils.sendGetRequest(
            menuItemsUrl + categoryShort,
            buildAndShowMenuItemsHTML);
    }

    function buildAndShowMenuItemsHTML(categoryMenuItems){

        $ajaxUtils.sendGetRequest(
            menuItemsTitleHtml, //resquesting for local html-structure built
            function(menuItemsTitleHtml){
                $ajaxUtils.sendGetRequest(
                    menuItemHtml, //resquesting for local html-structure built
                    function(menuItemHtml){
                        switchMenuToActive();
                        var menuItemsViewHtml = buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml);
                        insertHtml("#main-content",menuItemsViewHtml);
                    },false);
            },false);

    }//end of buildAndShowMenuItemsFunction()

    function buildMenuItemsViewHtml(categoryMenuItems,menuItemsTitleHtml,menuItemHtml){
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"name",categoryMenuItems.category.name);
        menuItemsTitleHtml = insertProperty(menuItemsTitleHtml,"special_instructions",categoryMenuItems.category.special_instructions);
        var finalHtml = menuItemsTitleHtml; //menu-items-title html title ready
        finalHtml += "<section class='row'>";

        var menuItems = categoryMenuItems.menu_items;
        var catShortName = categoryMenuItems.category.short_name;

        for(var i=0;i<menuItems.length;i++){
            var html = menuItemHtml;    //menu-item html template
            html = insertProperty(html,"short_name",menuItems[i].short_name);
            html = insertProperty(html,"catShortName",catShortName);
            html = insertItemPrice(html,"price_small",menuItems[i].price_small);
            html = insertItemPortionName(html,"small_portion_name",menuItems[i].small_portion_name);
            html = insertItemPrice(html,"price_large",menuItems[i].price_large);
            html = insertItemPortionName(html,"large_portion_name",menuItems[i].large_portion_name);
            html = insertProperty(html,"name",menuItems[i].name);
            html = insertProperty(html,"description",menuItems[i].description);
            if(i%2!=0){html += "<div class=' clearfix visible-lg-block visible-md-block'></div>"};
            finalHtml += html;
        }
        finalHtml +="</section>";
        return finalHtml;
    }

    function insertItemPrice(html,pricePropName,priceValue){
        if(!priceValue){
            return insertProperty(html,pricePropName,"");
        }
        priceValue = " Rs." + ((priceValue.toFixed(2))*10);
        html = insertProperty(html,pricePropName,priceValue);
        return html;
    }

    function insertItemPortionName(html,portionPropName,portionValue){
        if(!portionValue){
            return insertProperty(html,portionPropName,"");
        }
        portionValue = "(" + portionValue + ")";
        html = insertProperty(html,portionPropName,portionValue);
        return html;
    }


    global.$od = od;
})(window);
