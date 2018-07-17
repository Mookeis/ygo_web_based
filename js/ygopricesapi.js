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

function get_card_img(card_name, entry, entry_copy){
    let url = `https://cors-anywhere.herokuapp.com/http://yugiohprices.com/api/card_image/` +
        card_name;
    let xmlHTTP = new XMLHttpRequest();
    xmlHTTP.open('GET',url,true);
    xmlHTTP.responseType = 'arraybuffer';

    xmlHTTP.onload = function(e) {

        let arr = new Uint8Array(this.response);

        let raw = String.fromCharCode.apply(null,arr);
        let b64=btoa(raw);
        let dataURL="data:image/jpeg;base64,"+b64;
        let img = document.createElement("img");
        img.setAttribute("src", dataURL);
        img.setAttribute("style", "position: absolute; right: 30px; max-width: 30px; max-height: 30px;");

        let img2 = document.createElement("img");
        img2.setAttribute("src", dataURL);
        img2.setAttribute("style", "position: absolute; right: 30px; max-width: 30px; max-height: 30px;");
        entry.appendChild(img);
        entry_copy.appendChild(img2);
    };

    xmlHTTP.send();
}



