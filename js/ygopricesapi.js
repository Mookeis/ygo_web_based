function get_card_names(callback){
    let url = `https://cors-anywhere.herokuapp.com/http://yugiohprices.com/api/card_names`;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        crossDomain: true,
        cache: true,
        success: function (request, msg) {
            callback(request);
        },
        error: function (request, status, error) {
            console.log(error);
        }
    });
}

function get_card_desc(card_name, callback){
    let url = `https://cors-anywhere.herokuapp.com/http://yugiohprices.com/api/card_data/` + card_name;
    $.ajax({
        type: 'GET',
        url: url,
        dataType: "json",
        crossDomain: true,
        cache: true,
        success: function (request, msg) {
            callback(request);
        },
        error: function (request, status, error) {
            console.log(error);
        }
    });
}



