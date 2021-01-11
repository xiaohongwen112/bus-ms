/**
 * Django always check CSRF for post, which should either
 *      setRequestHeader("X-CSRFToken", getCookie('csrftoken'))
 * or append a "csrfmiddlewaretoken" in the post parmeters.
 #
 *
 * The best way is to extend a jQuery $.csrfost() for this.
 *
 * Up to now, just add some funcitons, and it should append the
 * "csrfmiddlewaretoken" in explicity.
 *
 * Refer to http://docs.djangoproject.com/en/1.3/ref/contrib/csrf/#ajax
 * for more details.
 **/

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = jQuery.trim(cookies[i]);
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) == (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
};

function getCsrfTokenName() {
    return 'csrfmiddlewaretoken';
};

function getCsrfCookie() {
    return getCookie('csrftoken');
};

function appendCsrfToken(obj) {
    if (obj) {
        obj.csrfmiddlewaretoken = getCsrfCookie()
    } else {
        obj = {"csrfmiddlewaretoken": getCsrfCookie()}
    }
    return obj
}


$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
            // Only send the token to relative URLs i.e. locally.
            xhr.setRequestHeader("X-CSRFToken", getCsrfCookie());
        }
    }
});