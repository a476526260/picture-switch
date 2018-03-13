/**
 * Created by dennyzhou on 2016/6/30.
 */
;!function ($) {
    $.fn.default = {
        autoPlay: true,
        pause: true,
        start: 0,
        style: "carousel",    //coverflow
        keyboard: true,
        mouseWheel: true,
        buttons: true,
        speed: 3000
    };

    $.fn.flipster = function (options) {
        return this.each(function () {
            var opts = $.extend({}, $.fn.default, options);
            var ths = $(this);
            var _current;
            var _actionThrottle = 0;
            var timer;
            var item = ths.find(".flip-item");

            function Flipster() {}
            Flipster.prototype.init = function () {
                var _ths = this;
                _current = opts.start;
                if (opts.style == "carousel") {
                    ths.addClass("flipster-carousel");
                } else {
                    ths.addClass("flipster-coverflow");
                }
                _ths.move();
                item.on("click", function (e) {
                    if (!$(this).hasClass("flip-current")) {
                        e.preventDefault();
                        _ths.change($(this).index());
                    }
                });
                if (opts.keyboard) {
                    $(window).on('keydown', function (e) {
                        _actionThrottle++;
                        if (_actionThrottle % 20 !== 0 && _actionThrottle !== 1) {
                            return false;   //if holding the key down, ignore most events
                        }
                        var code = e.which;
                        if (code == 39 || code == 40) {
                            e.preventDefault();
                            _ths.change("next");
                        } else if (code == 37 || code == 38) {
                            e.preventDefault();
                            _ths.change("prev");
                        }
                    });
                    $(window).on("keyup", function () {
                        _actionThrottle = 0;
                    });
                }
                if (opts.mouseWheel) {
                    ths.on("mousewheel DOMMouseScroll", function (e) {
                        var delta = (e.originalEvent.wheelDelta && (e.originalEvent.wheelDelta > 0 ? 1 : -1)) ||  // chrome & ie
                            (e.originalEvent.detail && (e.originalEvent.detail > 0 ? -1 : 1));
                        var _throttleTimeout;
                        _throttleTimeout = window.setTimeout(function () {
                            _actionThrottle = 0;
                        }, 500); //throttling should expire if scrolling pauses for a moment.
                        _actionThrottle++;
                        if (_actionThrottle % 20 !== 0 && _actionThrottle !== 1) {
                            return;

                        } //throttling like with held-down keys
                        window.clearTimeout(_throttleTimeout);
                        if (delta > 0) {
                            e.preventDefault();
                            _ths.change("next");
                        } else {
                            e.preventDefault();
                            _ths.change("prev");
                        }
                    })
                }
                if (opts.buttons) {
                    //创建前后按钮
                    var button = $("<div class='buttons'></div>").appendTo(ths).css({
                        "width": ths.find(".flip-items").width(),
                        "marginLeft": -ths.find(".flip-items").width() / 2
                    });
                    $("<div class='btn btn-prev'>Prev</div><div class='btn btn-next'>Next</div>").appendTo(button);
                    ths.on("click", ".btn-prev", function () {
                        _ths.change("prev");
                    });
                    ths.on("click", ".btn-next", function () {
                        _ths.change("next");
                    });
                }
                if (opts.autoPlay) {
                    timer = setInterval(function () {
                        _ths.change("next");
                    }, opts.speed);
                    if (opts.pause) {
                        ths.hover(function () {
                            clearInterval(timer)
                        }, function () {
                            timer = setInterval(function () {
                                _ths.change("next");
                            }, opts.speed);
                        })
                    }
                }
            };

            Flipster.prototype.move = function () {
                // if(opts.style=="carousel"){
                var currentItem = item.addClass("flip-hidden").eq(_current);
                item.removeClass("flip-current flip-next flip-feature flip-prev flip-past");
                var nextItem = item.eq(_current + 1),
                    featureItem = item.eq(_current + 2),
                    prevItem = item.eq(_current - 1),
                    pastItem = item.eq(_current - 2);

                if (_current == 0) {
                    prevItem = item.last();
                    pastItem = prevItem.prev();
                } else if (_current == 1) {
                    pastItem = item.last();
                } else if (_current == item.length - 1) {
                    nextItem = item.first();
                    featureItem = item.eq(1);
                } else if (_current == item.length - 2) {
                    featureItem = item.eq(0);
                }
                nextItem.removeClass("flip-hidden").addClass("flip-next");
                featureItem.removeClass("flip-hidden").addClass("flip-feature");
                prevItem.removeClass("flip-hidden").addClass("flip-prev");
                pastItem.removeClass("flip-hidden").addClass("flip-past");
                currentItem.removeClass("flip-prev flip-next flip-past flip-feature flip-hidden").addClass("flip-current");
                // }else{

                //}
            };
            Flipster.prototype.change = function (num) {
                var _ths = this;
                if (typeof num == "string") {
                    if (num == "next") {
                        if (_current < item.length - 1) {
                            _current++;
                        } else {
                            _current = 0;
                        }
                    } else if (num == "prev") {
                        if (_current < 0) {
                            _current = item.length - 1;
                        } else {
                            _current--;
                        }
                    }
                } else {
                    _current = num;
                }
                _ths.move();
            };
            var flipster = new Flipster();
            flipster.init();

        });
    }
}(jQuery);

$(function () {
    $(".flipster").flipster({
        autoPlay: false,
        pause: true,
        start: 0,
        style: "carousel",
        keyboard: true,
        mouseWheel: false,
        buttons: true,
        speed: 3000
    })
});








































































