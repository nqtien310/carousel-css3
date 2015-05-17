define(["jquery"], function(){
  "use strict";

  $.fn.nextOrFirst = function(selector){
    var next = this.next(selector);
    return (next.length) ? next : this.prevAll(selector).last();
  }

  var Carousel = function(opts){
    this.container  = opts.container
    this.delayInSec = opts.delayInSec
    this.direction  = opts.direction
    this.dots       = opts.dots
    this.$container = $(this.container)
    this.$children  = this.$container.find(" > div")
  }

  Carousel.prototype.start = function(){
    this.$children.first().addClass("carousel-active")
    if(this.dots) {
      this.displayDots()
      this.bindEvents()
    }

    this.resetTimeout()
  }

  Carousel.prototype.resetTimeout = function(){
    var self = this
    clearTimeout(this.slideTimeout)
    this.slideTimeout = setTimeout(function(){
      self.slide()
      self.resetTimeout()
    }, this.delayInSec * 1010 );
  }

  Carousel.prototype.displayDots = function(){
    var $dots = $("<span class='carousel-dots'/>")
    this.$container.append($dots)
    for(var i=0; i<this.$children.length; i++){
      $dots.append("<div class='carousel-dot'/>")
    }
  }

  Carousel.prototype.bindEvents = function(){
    var self = this;
    this.$container.on("click", ".carousel-dot", function(e){
      var index = $(e.currentTarget).index()
      self.slideToIndex(index)
    })
  }

  Carousel.prototype.slide = function($nextActiveChild){
    var $activeChild = this.$container.find(".carousel-active")
    var $nextActiveChild = $nextActiveChild ? $nextActiveChild : $activeChild.nextOrFirst("div")
    var className = this.getDirectionClass()
    $activeChild.addClass("carousel-animation " + className)
    $nextActiveChild.addClass("carousel-next-active")

    if(this.dots)
      this.highlightDots($nextActiveChild.index())

    setTimeout(function(){
      $activeChild.removeClass("carousel-animation carousel-active " + className)
      $nextActiveChild.toggleClass("carousel-active carousel-next-active")
    }, 1000)
  }

  Carousel.prototype.highlightDots = function(index){
    this.$container.find(".carousel-dot").removeClass("carousel-dot-active")
    this.$container.find(".carousel-dot").eq(index).addClass("carousel-dot-active")
  }

  Carousel.prototype.slideToIndex = function(index){
    if(this.$container.find(".carousel-active").index() == index ||
      this.$container.find(".carousel-animation").length)
      return

    var $nextActiveChild = this.$children.eq(index)
    this.slide($nextActiveChild)
    this.resetTimeout()
  }

  Carousel.prototype.getDirectionClass = function(){
    if(this.direction == "random"){
      return "moved-" + ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)]
    }else{
      return "moved-" + this.direction
    }
  }

  return Carousel;
})

