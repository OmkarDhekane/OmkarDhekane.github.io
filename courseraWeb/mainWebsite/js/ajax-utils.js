(function(global){

var ajaxUtils = {};


//Returns an HTTP request
function getRequestObject(){
    if(window.XMLHttpRequest){
        return (new XMLHttpRequest());
    }else{
        global.alert("Ajax is not supported!");
        return(null);
    }
}

//Makes an Ajax GET request to 'requestUrl'
ajaxUtils.sendGetRequest = 
    function (requesturl,responseHandler,isJsonResponse) {
        var request = getRequestObject();
        request.onreadystatechange =
        function(){
            handleResponse(request,responseHandler,isJsonResponse);
        };
        request.open("GET",requesturl,true);
        request.send(null);
    };

    //Only calls user provided 'responseHandler' function 
    //if response is ready and do not have any error
    function handleResponse(request,responseHandler,isJsonResponse) {
        if((request.readyState == 4 && (request.status == 200))){

            if(isJsonResponse == undefined){isJsonResponse =true;}
            if(isJsonResponse){responseHandler(JSON.parse(request.responseText))}
            else{responseHandler(request.responseText);}
            
        }
        
    }
global.$ajaxUtils = ajaxUtils;


})(window);