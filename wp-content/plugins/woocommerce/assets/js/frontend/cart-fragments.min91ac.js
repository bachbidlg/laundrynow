jQuery(function(a) {
    function b() {
        e && sessionStorage.setItem("wc_cart_created", (new Date).getTime())
    }

    function c(a) {
        e && (localStorage.setItem(f, a), sessionStorage.setItem(f, a))
    }

    function d() {
        a.ajax(h)
    }
    if ("undefined" == typeof wc_cart_fragments_params) return !1;
    var e, f = wc_cart_fragments_params.ajax_url.toString() + "-wc_cart_hash";
    try {
        e = "sessionStorage" in window && null !== window.sessionStorage, window.sessionStorage.setItem("wc", "test"), window.sessionStorage.removeItem("wc"), window.localStorage.setItem("wc", "test"), window.localStorage.removeItem("wc")
    } catch (g) {
        e = !1
    }
    /*var h = {
        url: wc_cart_fragments_params.wc_ajax_url.toString().replace("%%endpoint%%", "get_refreshed_fragments"),
        type: "POST",
        success: function(d) {
            d && d.fragments && (a.each(d.fragments, function(b, c) {
                a(b).replaceWith(c)
            }), e && (sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(d.fragments)), c(d.cart_hash), d.cart_hash && b()), a(document.body).trigger("wc_fragments_refreshed"))
        }
    };*/
    if (e) {
        var i = null,
            j = 864e5;
        a(document.body).bind("wc_fragment_refresh updated_wc_div", function() {
            d()
        }), a(document.body).bind("added_to_cart", function(a, d, e) {
            var g = sessionStorage.getItem(f);
            null !== g && void 0 !== g && "" !== g || b(), sessionStorage.setItem(wc_cart_fragments_params.fragment_name, JSON.stringify(d)), c(e)
        }), a(document.body).bind("wc_fragments_refreshed", function() {
            clearTimeout(i), i = setTimeout(d, j)
        }), a(window).on("storage onstorage", function(a) {
            f === a.originalEvent.key && localStorage.getItem(f) !== sessionStorage.getItem(f) && d()
        });
        try {
            var k = a.parseJSON(sessionStorage.getItem(wc_cart_fragments_params.fragment_name)),
                l = sessionStorage.getItem(f),
                m = a.cookie("woocommerce_cart_hash"),
                n = sessionStorage.getItem("wc_cart_created");
            if (null !== l && void 0 !== l && "" !== l || (l = ""), null !== m && void 0 !== m && "" !== m || (m = ""), l && (null === n || void 0 === n || "" === n)) throw "No cart_created";
            if (n) {
                var o = 1 * n + j,
                    p = (new Date).getTime();
                if (o < p) throw "Fragment expired";
                i = setTimeout(d, o - p)
            }
            if (!k || !k["div.widget_shopping_cart_content"] || l !== m) throw "No fragment";
            a.each(k, function(b, c) {
                a(b).replaceWith(c)
            }), a(document.body).trigger("wc_fragments_loaded")
        } catch (g) {
            d()
        }
    } else d();
    a.cookie("woocommerce_items_in_cart") > 0 ? a(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").show() : a(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").hide(), a(document.body).bind("adding_to_cart", function() {
        a(".hide_cart_widget_if_empty").closest(".widget_shopping_cart").show()
    })
});