$(function () {
    let deck_arr = [];
    let extra_deck_arr = [];
    // find num occurences of value in array
    function get_occurrence(array, value) {
        return array.filter((v) => (v === value)).length;
    }

    // generate hand from arr
    $('#generate-hand').on('click', function(){
        $('#hand-list').empty();
        let hand = _.shuffle(deck_arr).slice(0,5);
        let len = hand.length;
        for (let i = 0; i < len; ++i) {
            let card_list = document.getElementById('hand-list');
            let entry = document.createElement('a');
            entry.appendChild(document.createTextNode(hand[i]));
            entry.setAttribute("class", "list-group-item list-group-item-action");
            entry.setAttribute("title", "Card Description");
            entry.setAttribute("tabindex", "0");
            entry.setAttribute("data-toggle", "popover");
            entry.setAttribute("data-trigger", "focus");
            entry.setAttribute("data-html", "true");
            card_list.appendChild(entry);
        }
    });

    // save button handler
    $('#save-button').on('click', function(){
        let data = deck_arr.toString() + extra_deck_arr.toString();
        let filename = "deck.txt";
        let type = "String";
        download(data, filename, type);
    });

    $('#load-button').on('click', function() {
        if (!window.FileReader) {
            alert('Your browser is not supported');
            return false;
        }
        let fileInput = $('#files');
        let input = fileInput.get(0);

        // Create a reader object
        let reader = new FileReader();
        if (input.files.length) {
            let textFile = input.files[0];
            // Read the file
            reader.readAsText(textFile);
            // When it's loaded, process it
            $(reader).on('load', processFile);
        } else {
            alert('Please upload a file before continuing')
        }
    });

    function processFile(e) {
        let file = e.target.result,
            results;
        if (file && file.length) {
            results = file.split(",");
            for(let i = 0; i < results.length; ++i){
                let entry = document.createElement('a');
                entry.appendChild(document.createTextNode(results[i]));
                entry.setAttribute("class", "list-group-item list-group-item-action");
                entry.setAttribute("title", "Card Description");
                entry.setAttribute("tabindex", "0");
                entry.setAttribute("data-toggle", "popover");
                entry.setAttribute("data-trigger", "focus");
                entry.setAttribute("data-html", "true");
                get_card_desc(results[i], function (request) {
                    let card_text = request.data.text;
                    let card_type = request.data.card_type;
                    let type = request.data.type;
                    let card_attribute = request.data.family;
                    let card_atk = request.data.atk;
                    let card_def = request.data.def;
                    let card_level = request.data.level;
                    entry.setAttribute("data-content", `Name: ${results[i]}<br>Description: ${card_text}<br>
                        Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                        Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`);

                    let entry_list;
                    if(entry.getAttribute('data-content').indexOf("Card Type: spell") > -1){
                        entry_list = document.getElementById('spell-list');
                        document.getElementById('spell-count').innerHTML =
                            `${parseInt(document.getElementById('spell-count').innerHTML) + 1}`;
                        deck_arr.push(entry.innerHTML);
                    }else if(entry.getAttribute('data-content').indexOf("Card Type: monster") > -1){
                        if(entry.getAttribute('data-content').indexOf("/ Xyz") > -1 ||
                            entry.getAttribute('data-content').indexOf("/ Synchro") > -1 ||
                            entry.getAttribute('data-content').indexOf("/ Fusion") > -1){
                            entry_list = document.getElementById('extra-list');
                            document.getElementById('extra-count').innerHTML =
                                `${parseInt(document.getElementById('extra-count').innerHTML) + 1}`;
                            extra_deck_arr.push(entry.innerHTML);
                        }else{
                            entry_list = document.getElementById('monster-list');
                            document.getElementById('monster-count').innerHTML =
                                `${parseInt(document.getElementById('monster-count').innerHTML) + 1}`;
                            deck_arr.push(entry.innerHTML);
                        }
                    } else if(entry.getAttribute('data-content').indexOf("Card Type: trap") > -1){
                        entry_list = document.getElementById('trap-list');
                        document.getElementById('trap-count').innerHTML =
                            `${parseInt(document.getElementById('trap-count').innerHTML) + 1}`;
                        deck_arr.push(entry.innerHTML);
                    }
                    entry_list.appendChild(entry);

                    // description popover
                    $('[data-toggle="popover"]').popover({
                        container: 'body',
                        placement: 'left',
                        offset: -600
                    });
                });
            }
        }
    }

    // save data to file
    function download(data, filename, type) {
        let file = new Blob([data], {type: type});
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            let a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function() {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        }
    }

    get_card_names(function (request) {
        // fill card list
        let card_names = request;
        let len = card_names.length;
        for (let i = 0; i < len; ++i) {
            let card_list = document.getElementById('card-list');
            let entry = document.createElement('a');
            entry.appendChild(document.createTextNode(card_names[i]));
            entry.setAttribute("class", "list-group-item list-group-item-action");
            entry.setAttribute("title", "Card Description");
            entry.setAttribute("tabindex", "0");
            //entry.setAttribute("data-toggle", "popover");
            entry.setAttribute("data-trigger", "focus");
            entry.setAttribute("data-html", "true");
            entry.setAttribute("style", "display: none");
            card_list.appendChild(entry);
        }

        //set popover and card desc
        $(".list-group .list-group-item").on("mouseover", function () {
            let card = $(this);
            get_card_desc($(this)[0].textContent, function (request) {
                let card_text = request.data.text;
                let card_type = request.data.card_type;
                let type = request.data.type;
                let card_attribute = request.data.family;
                let card_atk = request.data.atk;
                let card_def = request.data.def;
                let card_level = request.data.level;
                card.attr("data-content", `Name: ${card[0].textContent}<br>Description: ${card_text}<br>
                        Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                        Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`);
                card.attr("data-toggle", "popover");

                // description popover
                $('[data-toggle="popover"]').popover({
                    container: 'body',
                    placement: 'left',
                    offset: -600
                });
            });
        });

        //set right click false
        $(".card-list").on("contextmenu", function(e){
            return false;
        });

        $(".deck-lists").on("contextmenu", function(e){
            return false;
        });

        // add card right clicked to proper list, incr count
        $(".list-group.col .list-group-item").on("contextmenu", function(e){
            if(get_occurrence(deck_arr, $(this)[0].innerHTML) >= 3 ||
                get_occurrence(extra_deck_arr, $(this)[0].innerHTML) >= 3){
                document.getElementById('error-container').setAttribute("style", "");
                return false;
            }
            let entry_list;
            if($(this).attr('data-content').indexOf("Card Type: spell") > -1){
                entry_list = document.getElementById('spell-list');
                document.getElementById('spell-count').innerHTML =
                    `${parseInt(document.getElementById('spell-count').innerHTML) + 1}`;
                deck_arr.push($(this)[0].innerHTML);
            }else if($(this).attr('data-content').indexOf("Card Type: monster") > -1){
                if($(this).attr('data-content').indexOf("/ Xyz") > -1 ||
                    $(this).attr('data-content').indexOf("/ Synchro") > -1 ||
                    $(this).attr('data-content').indexOf("/ Fusion") > -1){
                    entry_list = document.getElementById('extra-list');
                    document.getElementById('extra-count').innerHTML =
                        `${parseInt(document.getElementById('extra-count').innerHTML) + 1}`;
                    extra_deck_arr.push($(this)[0].innerHTML);
                }else{
                    entry_list = document.getElementById('monster-list');
                    document.getElementById('monster-count').innerHTML =
                        `${parseInt(document.getElementById('monster-count').innerHTML) + 1}`;
                    deck_arr.push($(this)[0].innerHTML);
                }
            } else if($(this).attr('data-content').indexOf("Card Type: trap") > -1){
                entry_list = document.getElementById('trap-list');
                document.getElementById('trap-count').innerHTML =
                    `${parseInt(document.getElementById('trap-count').innerHTML) + 1}`;
                deck_arr.push($(this)[0].innerHTML);
            }
            let entry = document.createElement('a');
            entry.appendChild(document.createTextNode($(this)[0].textContent));
            entry.setAttribute("class", "list-group-item list-group-item-action");
            entry.setAttribute("id", "lists");
            entry.setAttribute("title", "Card Description");
            entry.setAttribute("tabindex", "0");
            entry.setAttribute("data-toggle", "popover");
            entry.setAttribute("data-trigger", "focus");
            entry.setAttribute("data-html", "true");
            entry.setAttribute("data-content", $(this).attr('data-content'));
            entry_list.appendChild(entry);
            return false;
        });

        // active button class changer
        $(".list-group .list-group-item").on("click", function () {
            $(".list-group-item").removeClass("active");
            $(this).addClass("active");
        });


        //search filtering
        $("#card-search").on("keyup", function () {
            let input, filter, card_list, elements;
            input = document.getElementById('card-search');
            filter = input.value.toUpperCase();
            card_list = document.getElementById('card-list');
            elements = card_list.getElementsByTagName('a');
            for (let i = 0; i < elements.length; i++) {
                let card = elements[i];
                if (card.innerHTML.toUpperCase().indexOf(filter) > -1) {
                    elements[i].style.display = "";
                } else {
                    elements[i].style.display = "none";
                }
                if (filter === "") {
                    elements[i].style.display = "none";
                }
            }
        });
    });
});