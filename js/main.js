$(function () {
    let deck_arr = [];
    let extra_deck_arr = [];
    let main_count = 0;
    let extra_count = 0;
    if (localStorage.getItem("main_count") != null) {
        main_count = localStorage.getItem("main_count");
        localStorage.setItem("main_count", main_count);
    }
    if (localStorage.getItem("extra_count") != null) {
        extra_count = localStorage.getItem("extra_count");
        localStorage.setItem("extra_count", extra_count);
    }
    if (localStorage.getItem("deck_arr") != null) {
        //deck_arr = ;
        processData(localStorage.getItem("deck_arr").split(','));
        localStorage.setItem("deck_arr", deck_arr);
    }
    if (localStorage.getItem("extra_deck_arr") != null) {
        //extra_deck_arr = ;
        //alert(extra_deck_arr, localStorage.getItem("extra_deck_arr"));
        processData(localStorage.getItem("extra_deck_arr").split(','));
        localStorage.setItem("extra_deck_arr", extra_deck_arr);
    }

    function processData(arr){
        let results = arr;
        for (let i = 0; i < results.length; ++i) {
            let entry = document.createElement("a");
            entry.appendChild(
                document.createTextNode(results[i].replace(/&amp;/g, "&"))
            );
            entry.setAttribute(
                "class",
                "lists-list-item list-group-item list-group-item-action bg-dark text-light"
            );
            entry.setAttribute("title", "Card Description");
            entry.setAttribute("tabindex", "0");
            entry.setAttribute("data-toggle", "popover");
            entry.setAttribute("data-trigger", "focus");
            entry.setAttribute("data-html", "true");

            let entry_copy = document.createElement("a");
            entry_copy.appendChild(
                document.createTextNode(results[i].replace(/&amp;/g, "&"))
            );
            let card_class_name = results[i]
                .replace(/&amp;/g, "&")
                .toLowerCase()
                .replace(/\s/g, "");
            entry_copy.setAttribute(
                "class",
                `${card_class_name} list-group-item list-group-item-action bg-dark text-light`
            );
            entry_copy.setAttribute("title", "Card Description");
            entry_copy.setAttribute("tabindex", "0");
            entry_copy.setAttribute("data-toggle", "popover");
            entry_copy.setAttribute("data-trigger", "focus");
            entry_copy.setAttribute("data-html", "true");
            entry_copy.setAttribute("draggable", "true");
            entry_copy.setAttribute("ondragstart", "drag(event)");

            let isExtra = false;
            get_card_desc(results[i].replace(/&amp;/g, "&"), function (request) {
                let card_text = request.data.text;
                let card_type = request.data.card_type;
                let type = request.data.type;
                let card_attribute = request.data.family;
                let card_atk = request.data.atk;
                let card_def = request.data.def;
                let card_level = request.data.level;
                entry.setAttribute(
                    "data-content",
                    `Name: ${results[i].replace(
                        /&amp;/g,
                        "&"
                    )}<br>Description: ${card_text}<br>
                    Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                    Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`
                );
                entry_copy.setAttribute(
                    "data-content",
                    `Name: ${results[i].replace(
                        /&amp;/g,
                        "&"
                    )}<br>Description: ${card_text}<br>
                    Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                    Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`
                );

                let entry_list;
                let entry_copy_list = document.getElementById("deck-zone-list");
                if (
                    entry.getAttribute("data-content").indexOf("Card Type: spell") > -1
                ) {
                    entry_list = document.getElementById("spell-list");
                    document.getElementById("spell-count").innerHTML = `${
                        parseInt(document.getElementById("spell-count").innerHTML) + 1
                        }`;
                    deck_arr.push(entry.innerHTML);
                } else if (
                    entry.getAttribute("data-content").indexOf("Card Type: monster") >
                    -1
                ) {
                    if (
                        entry.getAttribute("data-content").indexOf("/ Xyz") > -1 ||
                        entry.getAttribute("data-content").indexOf("/ Synchro") > -1 ||
                        entry.getAttribute("data-content").indexOf("/ Fusion") > -1 ||
                        entry.getAttribute("data-content").indexOf("/ Link") > -1
                    ) {
                        entry_list = document.getElementById("extra-list");
                        entry_copy_list = document.getElementById("extra-deck-zone-list");
                        document.getElementById("extra-count").innerHTML = `${
                            parseInt(document.getElementById("extra-count").innerHTML) + 1
                            }`;
                        extra_deck_arr.push(entry.innerHTML);
                        isExtra = true;
                    } else {
                        entry_list = document.getElementById("monster-list");
                        document.getElementById("monster-count").innerHTML = `${
                            parseInt(document.getElementById("monster-count").innerHTML) + 1
                            }`;
                        deck_arr.push(entry.innerHTML);
                    }
                } else if (
                    entry.getAttribute("data-content").indexOf("Card Type: trap") > -1
                ) {
                    entry_list = document.getElementById("trap-list");
                    document.getElementById("trap-count").innerHTML = `${
                        parseInt(document.getElementById("trap-count").innerHTML) + 1
                        }`;
                    deck_arr.push(entry.innerHTML);
                }

                get_card_img(results[i].replace(/&amp;/g, "&"), entry, entry_copy);

                entry_list.appendChild(entry);

                if (isExtra) {
                    entry_copy.setAttribute("id", `extra-deck-item${extra_count++}`);
                } else {
                    entry_copy.setAttribute("id", `deck-item${main_count++}`);
                }
                entry_copy_list.appendChild(entry_copy);

                // description popover
                $('[data-toggle="popover"]').popover({
                    container: "body",
                    placement: "left",
                    offset: -600,
                });
            });
        }
    }

    function get_card_img(card_name, entry, entry_copy) {
        let url = `https://cors-anywhere.herokuapp.com/http://yugiohprices.com/api/card_image/` + card_name;
        let xmlHTTP = new XMLHttpRequest();
        xmlHTTP.open("GET", url, true);

        // Must include this line - specifies the response type we want
        xmlHTTP.responseType = "arraybuffer";

        xmlHTTP.onload = function (e) {
            var arr = new Uint8Array(this.response);

            // Convert the int array to a binary string
            // We have to use apply() as we are converting an *array*
            // and String.fromCharCode() takes one or more single values, not
            // an array.
            var raw = String.fromCharCode.apply(null, arr);

            // This works!!!
            var b64 = btoa(raw);
            var dataURL = "data:image/jpeg;base64," + b64;
            //let img = $("<img src=''/>").attr('src', dataURL);
            let img = document.createElement("img");
            img.setAttribute("src", dataURL);
            img.setAttribute(
                "style",
                "position: absolute; right: 30px; max-width: 30px; max-height: 30px;"
            );

            let img2 = document.createElement("img");
            img2.setAttribute("src", dataURL);
            img2.setAttribute(
                "style",
                "position: absolute; right: 30px; max-width: 30px; max-height: 30px;"
            );
            //$('body').append(img);
            entry.appendChild(img);
            entry_copy.appendChild(img2);
        };

        xmlHTTP.send();
    }

    // set array method for remove by value
    Array.prototype.remove = function () {
        let what,
            a = arguments,
            L = a.length,
            ax;
        while (L && this.length) {
            what = a[--L];
            while ((ax = this.indexOf(what)) !== -1) {
                this.splice(ax, 1);
            }
        }
        return this;
    };

    // find num occurences of value in array
    function get_occurrence(array, value) {
        return array.filter((v) => v === value).length;
    }

    //smooth scroll
    $(".scroll-down").on("click", function () {
        /*window.scrollTo({
                top: 1000,
                behavior: "smooth"
            });*/
        $("html,body").animate({ scrollTop: 1000 }, 1000);
    });

    // generate hand from arr
    $("#generate-hand").on("click", function () {
        $("#hand-list").empty();
        let hand = _.shuffle(deck_arr).slice(0, 5);
        let len = hand.length;
        for (let i = 0; i < len; ++i) {
            let card_list = document.getElementById("hand-list");
            let entry = document.createElement("a");
            let entry_copy = document.createElement("a");
            entry.appendChild(
                document.createTextNode(hand[i].replace(/&amp;/g, "&"))
            );
            entry.setAttribute(
                "class",
                "hand-list-item list-group-item list-group-item-action bg-dark text-light"
            );
            entry.setAttribute("title", "Card Description");
            get_card_img(hand[i].replace(/&amp;/g, "&"), entry, entry_copy);
            card_list.appendChild(entry);
        }
    });

    //generate hand from deck list
    $(".generate-hand").on("click", function () {
        if (deck_arr.length > 0) {
            let hand = _.shuffle(deck_arr).slice(0, 5);
            let len = hand.length;

            for (let i = 0; i < len; ++i) {
                let card_list = document.getElementById("hand-zone-list");
                let entry = document.getElementsByClassName(
                    hand[i].replace(/&amp;/g, "&").toLowerCase().replace(/\s/g, "")
                )[0];
                card_list.appendChild(entry);
            }
        }
    });

    $(document).on("click", ".online-deck", function (ev) {
        deck = $(this).children()[0].value.split(',');
        extra = $(this).children()[1].value.split(',')
        console.log(deck, extra);
        processData(deck);
        localStorage.setItem("deck_arr", deck);
        processData(extra);
        localStorage.setItem("extra_deck_arr", extra);
    });

    $(document).on("contextmenu", ".online-deck", function (ev) {
        ev.preventDefault();
        console.log($(this).attr("class").split(" ").pop());
        let deck_id = $(this).attr("class").split(" ").pop();
        $.ajax({
            url: "delete.php",
            method: "POST",
            data: {
                deck_id: deck_id,
            },
            success: function (data) {
                console.log(data);
                window.location.reload();
            },
            error: function (data) {
                console.log(data);
            },
        });
    });

    $('#chatRoomModal').on('show.bs.modal', function () {
        $('.modal-content').css('max-height',$( window ).height()*0.8);
        $('.modal-body').css('overflow', 'auto');
    });

    //save online handler
    $("#save-deck").on("click", function () {
        if(main_count == 0 || extra_count == 0){
            $("#save-error-container").attr("style", "");
            $('#saveOnlineModal').modal('toggle');
            return;
        }
        let deck_string = deck_arr.toString();
        let extra_deck_string = extra_deck_arr.toString();
        let user_id = $("#userlogin").attr("class").split(" ").pop();
        let name = $("#deck_name").val();
        if(name == null || name == ""){
            $("#deck_name").addClass("error");
            return;
        }
        $("#deck_name").removeClass("error");
        $.ajax({
            url: "insert.php",
            method: "POST",
            data: {
                deck: deck_string,
                extra_deck: extra_deck_string,
                user_id: user_id,
                name: name
            },
            success: function (data) {
                console.log(data);
                $('#saveOnlineModal').modal('toggle');
                window.location.reload();
            },
            error: function (data) {
                console.log(data);
            },
        });
    });

    // save button handler
    $("#save-button").on("click", function () {
        let data = deck_arr.join("**") + "**" + extra_deck_arr.join("**");
        let filename = "deck.txt";
        let type = "String";
        download(data, filename, type);
    });

    //load button handler
    $("#load-button").on("click", function () {
        if (!window.FileReader) {
            alert("Your browser is not supported");
            return false;
        }
        let fileInput = $("#files");
        let input = fileInput.get(0);

        // Create a reader object
        let reader = new FileReader();
        if (input.files.length) {
            let textFile = input.files[0];
            // Read the file
            reader.readAsText(textFile);
            // When it's loaded, process it
            $(reader).on("load", processFile);
        } else {
            alert("Please upload a file before continuing");
        }
    });

    // process uploaded file into lists
    function processFile(e) {
        let file = e.target.result,
            results;
        if (file && file.length) {
            results = file.split("**");
            for (let i = 0; i < results.length; ++i) {
                let entry = document.createElement("a");
                entry.appendChild(
                    document.createTextNode(results[i].replace(/&amp;/g, "&"))
                );
                entry.setAttribute(
                    "class",
                    "lists-list-item list-group-item list-group-item-action bg-dark text-light"
                );
                entry.setAttribute("title", "Card Description");
                entry.setAttribute("tabindex", "0");
                entry.setAttribute("data-toggle", "popover");
                entry.setAttribute("data-trigger", "focus");
                entry.setAttribute("data-html", "true");

                let entry_copy = document.createElement("a");
                entry_copy.appendChild(
                    document.createTextNode(results[i].replace(/&amp;/g, "&"))
                );
                let card_class_name = results[i]
                    .replace(/&amp;/g, "&")
                    .toLowerCase()
                    .replace(/\s/g, "");
                entry_copy.setAttribute(
                    "class",
                    `${card_class_name} list-group-item list-group-item-action bg-dark text-light`
                );
                entry_copy.setAttribute("title", "Card Description");
                entry_copy.setAttribute("tabindex", "0");
                entry_copy.setAttribute("data-toggle", "popover");
                entry_copy.setAttribute("data-trigger", "focus");
                entry_copy.setAttribute("data-html", "true");
                entry_copy.setAttribute("draggable", "true");
                entry_copy.setAttribute("ondragstart", "drag(event)");

                let isExtra = false;
                get_card_desc(results[i].replace(/&amp;/g, "&"), function (request) {
                    let card_text = request.data.text;
                    let card_type = request.data.card_type;
                    let type = request.data.type;
                    let card_attribute = request.data.family;
                    let card_atk = request.data.atk;
                    let card_def = request.data.def;
                    let card_level = request.data.level;
                    entry.setAttribute(
                        "data-content",
                        `Name: ${results[i].replace(
                            /&amp;/g,
                            "&"
                        )}<br>Description: ${card_text}<br>
                        Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                        Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`
                    );
                    entry_copy.setAttribute(
                        "data-content",
                        `Name: ${results[i].replace(
                            /&amp;/g,
                            "&"
                        )}<br>Description: ${card_text}<br>
                        Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                        Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`
                    );

                    let entry_list;
                    let entry_copy_list = document.getElementById("deck-zone-list");
                    if (
                        entry.getAttribute("data-content").indexOf("Card Type: spell") > -1
                    ) {
                        entry_list = document.getElementById("spell-list");
                        document.getElementById("spell-count").innerHTML = `${
                            parseInt(document.getElementById("spell-count").innerHTML) + 1
                            }`;
                        deck_arr.push(entry.innerHTML);
                    } else if (
                        entry.getAttribute("data-content").indexOf("Card Type: monster") >
                        -1
                    ) {
                        if (
                            entry.getAttribute("data-content").indexOf("/ Xyz") > -1 ||
                            entry.getAttribute("data-content").indexOf("/ Synchro") > -1 ||
                            entry.getAttribute("data-content").indexOf("/ Fusion") > -1 ||
                            entry.getAttribute("data-content").indexOf("/ Link") > -1
                        ) {
                            entry_list = document.getElementById("extra-list");
                            entry_copy_list = document.getElementById("extra-deck-zone-list");
                            document.getElementById("extra-count").innerHTML = `${
                                parseInt(document.getElementById("extra-count").innerHTML) + 1
                                }`;
                            extra_deck_arr.push(entry.innerHTML);
                            isExtra = true;
                        } else {
                            entry_list = document.getElementById("monster-list");
                            document.getElementById("monster-count").innerHTML = `${
                                parseInt(document.getElementById("monster-count").innerHTML) + 1
                                }`;
                            deck_arr.push(entry.innerHTML);
                        }
                    } else if (
                        entry.getAttribute("data-content").indexOf("Card Type: trap") > -1
                    ) {
                        entry_list = document.getElementById("trap-list");
                        document.getElementById("trap-count").innerHTML = `${
                            parseInt(document.getElementById("trap-count").innerHTML) + 1
                            }`;
                        deck_arr.push(entry.innerHTML);
                    }

                    get_card_img(results[i].replace(/&amp;/g, "&"), entry, entry_copy);

                    entry_list.appendChild(entry);

                    if (isExtra) {
                        entry_copy.setAttribute("id", `extra-deck-item${extra_count++}`);
                    } else {
                        entry_copy.setAttribute("id", `deck-item${main_count++}`);
                    }
                    entry_copy_list.appendChild(entry_copy);

                    // description popover
                    $('[data-toggle="popover"]').popover({
                        container: "body",
                        placement: "left",
                        offset: -600,
                    });
                });
            }
        }
        localStorage.setItem("deck_arr", deck_arr);
        localStorage.setItem("extra_deck_arr", extra_deck_arr);
        localStorage.setItem("main_count", main_count);
        localStorage.setItem("extra_count", extra_count);
    }

    // save data to file
    function download(data, filename, type) {
        let file = new Blob([data], { type: type });
        if (window.navigator.msSaveOrOpenBlob)
            window.navigator.msSaveOrOpenBlob(file, filename);
        else {
            let a = document.createElement("a"),
                url = URL.createObjectURL(file);
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(function () {
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
            let card_list = document.getElementById("card-list");
            let entry = document.createElement("a");
            let entry_copy = document.createElement("a");
            entry.appendChild(document.createTextNode(card_names[i]));
            entry.setAttribute(
                "class",
                "card-list-item list-group-item list-group-item-action bg-dark text-light"
            );
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
                card.attr(
                    "data-content",
                    `Name: ${card[0].textContent}<br>Description: ${card_text}<br>
                        Card Type: ${card_type}<br>Type: ${type}<br>Attribute: ${card_attribute}<br>
                        Attack: ${card_atk} Defense: ${card_def}<br> Level: ${card_level}`
                );
                card.attr("data-toggle", "popover");

                // description popover
                $('[data-toggle="popover"]').popover({
                    container: "body",
                    placement: "left",
                    offset: -600,
                });
            });
        });

        //set right click false
        $(".card-list").on("contextmenu", function (e) {
            return false;
        });

        $(".deck-lists").on("contextmenu", function (e) {
            return false;
        });

        //remove elements from deck
        $("body").on("dblclick", "a.lists-list-item", function () {
            let isExtra = false;
            if ($(this).attr("data-content").indexOf("Card Type: spell") > -1) {
                document.getElementById("spell-count").innerHTML = `${
                    parseInt(document.getElementById("spell-count").innerHTML) - 1
                    }`;
                deck_arr.remove($(this)[0].textContent.toString());
            } else if (
                $(this).attr("data-content").indexOf("Card Type: monster") > -1
            ) {
                if (
                    $(this).attr("data-content").indexOf("/ Xyz") > -1 ||
                    $(this).attr("data-content").indexOf("/ Synchro") > -1 ||
                    $(this).attr("data-content").indexOf("/ Fusion") > -1 ||
                    $(this).attr("data-content").indexOf("/ Link") > -1
                ) {
                    document.getElementById("extra-count").innerHTML = `${
                        parseInt(document.getElementById("extra-count").innerHTML) - 1
                        }`;
                    extra_deck_arr.remove($(this)[0].textContent.toString());
                    isExtra = true;
                } else {
                    document.getElementById("monster-count").innerHTML = `${
                        parseInt(document.getElementById("monster-count").innerHTML) - 1
                        }`;
                    deck_arr.remove($(this)[0].textContent.toString());
                }
            } else if ($(this).attr("data-content").indexOf("Card Type: trap") > -1) {
                document.getElementById("trap-count").innerHTML = `${
                    parseInt(document.getElementById("trap-count").innerHTML) - 1
                    }`;
                deck_arr.remove($(this)[0].textContent.toString());
            }
            let entry_remove = document.getElementsByClassName(
                $(this)[0].textContent.toString().toLowerCase().replace(/\s/g, "")
            );
            if (isExtra) {
                --extra_count;
            } else {
                --main_count;
            }

            $(this)[0].remove();
            entry_remove[0].remove();

            localStorage.setItem("deck_arr", deck_arr);
            localStorage.setItem("extra_deck_arr", extra_deck_arr);
            localStorage.setItem("main_count", main_count);
            localStorage.setItem("extra_count", extra_count);
            return false;
        });

        // add card right clicked to proper list, incr count
        $(".list-group.col .list-group-item").on("contextmenu", function (e) {
            if (
                get_occurrence(deck_arr, $(this)[0].innerHTML) >= 3 ||
                get_occurrence(extra_deck_arr, $(this)[0].innerHTML) >= 3
            ) {
                document.getElementById("error-container").setAttribute("style", "");
                return false;
            }
            let entry_list;
            let entry_copy_list = document.getElementById("deck-zone-list");
            let isExtra = false;
            if ($(this).attr("data-content").indexOf("Card Type: spell") > -1) {
                entry_list = document.getElementById("spell-list");
                document.getElementById("spell-count").innerHTML = `${
                    parseInt(document.getElementById("spell-count").innerHTML) + 1
                    }`;
                deck_arr.push($(this)[0].innerHTML);
            } else if (
                $(this).attr("data-content").indexOf("Card Type: monster") > -1
            ) {
                if (
                    $(this).attr("data-content").indexOf("/ Xyz") > -1 ||
                    $(this).attr("data-content").indexOf("/ Synchro") > -1 ||
                    $(this).attr("data-content").indexOf("/ Fusion") > -1 ||
                    $(this).attr("data-content").indexOf("/ Link") > -1
                ) {
                    entry_list = document.getElementById("extra-list");
                    entry_copy_list = document.getElementById("extra-deck-zone-list");
                    document.getElementById("extra-count").innerHTML = `${
                        parseInt(document.getElementById("extra-count").innerHTML) + 1
                        }`;
                    extra_deck_arr.push($(this)[0].innerHTML);
                    isExtra = true;
                } else {
                    entry_list = document.getElementById("monster-list");
                    document.getElementById("monster-count").innerHTML = `${
                        parseInt(document.getElementById("monster-count").innerHTML) + 1
                        }`;
                    deck_arr.push($(this)[0].innerHTML);
                }
            } else if ($(this).attr("data-content").indexOf("Card Type: trap") > -1) {
                entry_list = document.getElementById("trap-list");
                document.getElementById("trap-count").innerHTML = `${
                    parseInt(document.getElementById("trap-count").innerHTML) + 1
                    }`;
                deck_arr.push($(this)[0].innerHTML);
            }
            let entry = document.createElement("a");
            let entry_copy = document.createElement("a");
            entry.appendChild(document.createTextNode($(this)[0].textContent));
            let card_class_name = $(this)[0]
                .textContent.toLowerCase()
                .replace(/\s/g, "");
            entry.setAttribute(
                "class",
                `lists-list-item list-group-item list-group-item-action bg-dark text-light`
            );
            entry.setAttribute("id", "lists");
            entry.setAttribute("title", "Card Description");
            entry.setAttribute("tabindex", "0");
            entry.setAttribute("data-toggle", "popover");
            entry.setAttribute("data-trigger", "focus");
            entry.setAttribute("data-html", "true");
            entry.setAttribute("data-content", $(this).attr("data-content"));

            get_card_img($(this)[0].textContent, entry, entry_copy);

            entry_copy.appendChild(document.createTextNode($(this)[0].textContent));
            entry_copy.setAttribute(
                "class",
                `${card_class_name} list-group-item list-group-item-action bg-dark text-light`
            );
            if (isExtra) {
                entry_copy.setAttribute("id", `extra-deck-item${extra_count++}`);
            } else {
                entry_copy.setAttribute("id", `deck-item${main_count++}`);
            }
            entry_copy.setAttribute("title", "Card Description");
            entry_copy.setAttribute("tabindex", "0");
            entry_copy.setAttribute("data-toggle", "popover");
            entry_copy.setAttribute("data-trigger", "focus");
            entry_copy.setAttribute("data-html", "true");
            entry_copy.setAttribute("data-content", $(this).attr("data-content"));
            entry_copy.setAttribute("draggable", "true");
            entry_copy.setAttribute("ondragstart", "drag(event)");

            entry_list.appendChild(entry);
            entry_copy_list.appendChild(entry_copy);
            localStorage.setItem("deck_arr", deck_arr);
            localStorage.setItem("extra_deck_arr", extra_deck_arr);
            localStorage.setItem("main_count", main_count);
            localStorage.setItem("extra_count", extra_count);
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
            input = document.getElementById("card-search");
            filter = input.value.toUpperCase();
            card_list = document.getElementById("card-list");
            elements = card_list.getElementsByTagName("a");
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
