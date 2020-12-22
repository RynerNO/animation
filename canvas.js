let welcomeCanvas;
let timer;
function WelcomeCanvas() {
    function canv_mousemove(e) {
        mx = e.clientX - canv.offsetLeft - canv.offsetParent.offsetLeft, my = $(window).scrollTop() + e.clientY - canv.offsetTop - canv.offsetParent.offsetTop
    }

    function Fragment(homeX, homeY, colors) {
        this.x = this.homeX = Math.round(homeX), this.y = this.homeY = Math.round(homeY), this.colors = colors, this.fadeDelay = Math.floor(40 * Math.random()), this.xVelocity = 10 * Math.random() - 5, this.yVelocity = 10 * Math.random() - 5
    }

    function startTimer() {
        stopTimer(), timer = setTimeout(startTimer, fps);
        for (var i = 0; i < pixels.length; i++) pixels[i].move();
        drawFragments(imageData), n % 10 !== 0 || cw == Math.min(document.body.clientWidth, 1200) && ch == Math.min(document.body.clientHeight, 800) || bodyResize()
    }

    function stopTimer() {
        clearTimeout(timer)
    }

    function showLogo(callback) {
        startTimer(), $(".js-welcomeCanvas").show();//.delay(500).fadeIn(5e3)
    }

    function drawFragments(imageData) {
        imageData.data.set(imageDataCopy);
        for (var index, goodX, goodY, realX, realY, row, col, colors, i = 0; i < pixels.length; i++)
            for (goodX = Math.floor(pixels[i].x), goodY = Math.floor(pixels[i].y), colors = pixels[i].colors, realX = goodX - resHalfFloor, row = 0; realX <= goodX + resHalfCeil - 1 && realX >= 0 && realX < cw; realX++, row++)
                for (realY = goodY - resHalfFloor, col = 0; realY <= goodY + resHalfCeil - 1 && realY >= 0 && realY < ch; realY++, col++) {
                    index = 4 * (realY * imageData.width + realX);
                    var rgba = {
                        r: pixels[i].colors[4 * (row * resolution + col)],
                        g: pixels[i].colors[4 * (row * resolution + col) + 1],
                        b: pixels[i].colors[4 * (row * resolution + col) + 2]
                    };
                    rgba.a = pixels[i].colors[4 * (row * resolution + col) + 3], rgba.a > 0 && (imageData.data[index] = Math.max(imageData.data[index], rgba.r), imageData.data[index + 1] = Math.max(imageData.data[index + 1], rgba.g), imageData.data[index + 2] = Math.max(imageData.data[index + 2], rgba.b), imageData.data[index + 3] = Math.max(imageData.data[index + 3], rgba.a))
                }
        ctx.putImageData(imageData, 0, 0)
    }

    function init(delay, callback) {
        function initialize() {
            logo.image = new Image, logo.image.src = logo.url, logo.image.onload = function() {
                logo.offset = {
                    top: ch / 2 - logo.image.height / 2,
                    left: cw / 2 - logo.image.width / 2
                }, helperCtx.drawImage(logo.image, logo.offset.left, logo.offset.top);
                for (var index = 0, fragmentData = helperCtx.getImageData(0, 0, cw, ch), x = 0; x < fragmentData.width; x += resolution)
                    for (var y = 0; y < fragmentData.height; y += resolution) {
                        var isVisible = [fragmentData.data[4 * (y * fragmentData.width + x) + 3] > 128, fragmentData.data[4 * (y * fragmentData.width + (x + resolution)) + 3] > 128, fragmentData.data[4 * ((y + resolution) * fragmentData.width + x) + 3] > 128, fragmentData.data[4 * ((y + resolution) * fragmentData.width + (x + resolution)) + 3] > 128, fragmentData.data[4 * ((y + resolution / 2) * fragmentData.width + (x + resolution / 2)) + 3] > 128];
                        if (isVisible = isVisible[0] || isVisible[1] || isVisible[2] || isVisible[3] || isVisible[4]) {
                            if (index >= pixels.length) {
                                for (var colors = [], j = x, c = 0; j <= x + resolution; j++, c++)
                                    for (var k = y, r = 0; k < y + resolution; k++, r++) {
                                        var _i = 4 * ((y + r) * fragmentData.width + (x + c));
                                        colors.push(fragmentData.data[_i], fragmentData.data[_i + 1], fragmentData.data[_i + 2], fragmentData.data[_i + 3])
                                    }
                                pixels[index] = new Fragment(x, y, colors)
                            }
                            index++
                        }
                    }
                pixels.splice(index, pixels.length - index), callback && callback()
            }
        }
        welcomeCanvas && welcomeCanvas.loaded && window.innerWidth > 1217 && $(".js-welcomeCanvas").hide(), imageData = ctx.createImageData(cw, ch), imageDataCopy = ctx.createImageData(cw, ch).data, $(topLogo.image).fadeOut(), delay ? setTimeout(function() {
            initialize()
        }, delay) : initialize()
    }

    function destroy() {
        imageData = imageDataCopy = pixels = [], ctx.clearRect(0, 0, cw, ch), helperCtx.clearRect(0, 0, cw, ch)
    }

    function bodyResize() {
        cw = Math.min(document.body.clientWidth, 1200), ch = Math.min(document.body.clientHeight, 800), canv.width = helper.width = cw, canv.height = helper.height = ch, canvOffset = canvOffset || {
            top: $(canv).offset().top - topLogo.offset.top,
            left: $(canv).offset().left - topLogo.offset.left
        }, destroy(), init()
    }
    var canvOffset, timer, imageData, imageDataCopy, canv = $(".js-welcomeCanvas").get(0),
        ctx = canv.getContext("2d"),
        helper = document.createElement("canvas"),
        helperCtx = helper.getContext("2d"),
        topLogo = {},
        logo = {
            url: "logo-vertical-white.png"
        },
        mx = -1,
        my = -1,
        cw = 0,
        ch = 0,
        pixels = [],
        resolution = 10,
        n = 0,
        resHalfFloor = 0,
        resHalfCeil = 0,
        fps = 32;
    return Fragment.prototype.move = function() {
        var homeDX = this.homeX - this.x,
            homeDY = this.homeY - this.y,
            homeDistance = Math.sqrt(Math.pow(homeDX, 2) + Math.pow(homeDY, 2)),
            homeForce = .1 * homeDistance,
            homeAngle = Math.atan2(homeDY, homeDX),
            cursorForce = 0,
            cursorAngle = 0;
        if (mx >= 0) {
            var cursorDX = this.x - mx,
                cursorDY = this.y - my,
                cursorDistanceSquared = Math.pow(cursorDX, 2) + Math.pow(cursorDY, 2);
            Math.sqrt(cursorDistanceSquared) < 100 && (cursorForce = Math.min(1e4 / cursorDistanceSquared, 1e4), cursorAngle = Math.atan2(cursorDY, cursorDX))
        } else cursorForce = 0, cursorAngle = 0;
        this.xVelocity += homeForce * Math.cos(homeAngle) + cursorForce * Math.cos(cursorAngle),
        this.yVelocity += homeForce * Math.sin(homeAngle) + cursorForce * Math.sin(cursorAngle),
        this.xVelocity *= .8,
        this.yVelocity *= .8,
        this.x = homeDistance > 2 || cursorForce > .1 ? this.x + this.xVelocity : this.homeX,
        this.y = homeDistance > 2 || cursorForce > .1 ? this.y + this.yVelocity : this.homeY
    }, resHalfFloor = Math.floor(resolution / 2), resHalfCeil = Math.ceil(resolution / 2), topLogo = {
        image: $(".animationStub")[0],
        offset: $(".animationStub").offset()
    }, $(".js-welcomeCanvas").on("mousemove.animLogo", canv_mousemove).on("mouseout", function() {
        mx = my = -1
    }), $(window).resize(function() {
            if(window.innerWidth <= 1217) {
                destroy()
                stop()
                let img = $(".animationStub")[0]
                img.style.display = "block"
            } 
        
    }), {
        init: function() {
            var _this = this;
            bodyResize(), init(0, function() {
                showLogo(), _this.loaded = 1, _this.scrolling = 0
            })
        },
        start: function() {
            var _this = this;
            init(0, function() {
                showLogo(), _this.scrolling = 0
            }), startTimer()
        },
        stop: function() {
            stopTimer()
        },
        destroy: function() {
            destroy()
        },
        scroll: function(callback) {
            setTimeout(function() {}, 100)
        }
    }
}

window.addEventListener('load', () => {
    if(window.innerWidth > 1217) {
        welcomeCanvas = new WelcomeCanvas();
        welcomeCanvas.init(1e3);
    }
})