$(document).ready(function() {

    var editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        lineWrapping: true,
        theme: "default",
        extraKeys: {
           "F11": function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
           },
           "Esc": function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
           }
         }
    });

    var result = CodeMirror.fromTextArea(document.getElementById("result"), {
        lineWrapping: true,
        theme: "default",
        extraKeys: {
           "F11": function(cm) {
            cm.setOption("fullScreen", !cm.getOption("fullScreen"));
           },
           "Esc": function(cm) {
            if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
           }
         }
    });

    /* Code Mirror Controls */
    $fullscreen_code = $("#fullscreen-code");
    $toggle_code = $("#toggle-code");

    $fullscreen_code.click(function(e) {
        editor.setOption("fullScreen", !editor.getOption("fullScreen"));
        editor.focus();
    });

    $toggle_code.click(function() {
        if(editor.getOption("theme") == "monokai") {
            editor.setOption("theme", "default");
        } else{
            editor.setOption("theme", "monokai");
        }
    });

    $fullscreen_result = $("#fullscreen-result");
    $toggle_result = $("#toggle-result");

    $fullscreen_result.click(function(e) {
        result.setOption("fullScreen", !result.getOption("fullScreen"));
        result.focus();
    });

    $toggle_result.click(function() {
        if(result.getOption("theme") == "monokai") {
            result.setOption("theme", "default");
        } else{
            result.setOption("theme", "monokai");
        }
    });

    /* 
     * Selectors function 
     * Write the queries using .on()
    */
    $(document).on("change", "#categories", function() {
        $("#books-wrapper").html("");
        $("#chapters-wrapper").html("");
        $("#examples-wrapper").html("");
        Dajaxice.website.books(Dajax.process, {category_id: $(this).val()});
    });

    $(document).on("change", "#books", function() {
        $("#chapters-wrapper").html("");
        $("#examples-wrapper").html("");
        Dajaxice.website.chapters(Dajax.process, {book_id: $(this).val()});
    });

    $(document).on("change", "#chapters", function() {
        $("#examples-wrapper").html("");
        Dajaxice.website.examples(Dajax.process, {chapter_id: $(this).val()});
    });

    $(document).on("change", "#examples", function() {
        Dajaxice.website.code(function(data) {
            editor.setValue(data.code);
        }, {example_id: $(this).val()});
    });

    /* Execute the code */
    $lightbox_wrapper  = $("#lightbox-me-wrapper");
    $lightbox = $("#lightbox-me");
    $(document).on("click", "#execute", function() {
        $("body").css("cursor", "wait");
        Dajaxice.website.execute(function(data) {
            $("body").css("cursor", "auto");
            result.setValue(data.output);
            if(data.plot_path) {
                $plot = $("<img>");
                $plot.attr({
                    src: data.plot_path,
                    width: 400
                });
                $lightbox.html($plot);
                $lightbox_wrapper.lightbox_me({centered: true});
            }
        }, {
            token: $("[name='csrfmiddlewaretoken']").val(),
            code: editor.getValue(),
            book_id: $("#books").val() || 0,
            chapter_id: $("#chapters").val() || 0,
            example_id: $("#examples").val() || 0
        });
    });
});
