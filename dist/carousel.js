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
    var self = this

    self.$children.first().addClass("carousel-active")
    if(self.dots) {
      self.displayDots()
      self.bindEvents()
    }
    self.resetSliding()
  }

  Carousel.prototype.resetSliding = function(){
    var self = this

    clearTimeout(self.slideTimeout)
    self.slideTimeout = setTimeout(function(){
      self.slide()
      self.resetSliding()
    }, self.delayInSec * 1111 );
  }

  Carousel.prototype.displayDots = function(){
    var self = this

    var $dots = $("<span class='carousel-dots'/>")
    self.$container.append($dots)
    for(var i=0; i<self.$children.length; i++)
      $dots.append("<div class='carousel-dot'/>")
  }

  Carousel.prototype.bindEvents = function(){
    var self = this;

    self.$container.on("click", ".carousel-dot", function(e){
      self.slideToIndex($(e.currentTarget).index())
    })
  }

  Carousel.prototype.slide = function($nextActiveChild){
    var self = this

    var $activeChild = self.$container.find(".carousel-active")
    var $nextActiveChild = $nextActiveChild ? $nextActiveChild : $activeChild.nextOrFirst("div")
    var className = self.getDirectionClass()
    $activeChild.addClass("carousel-animation " + className)
    $nextActiveChild.addClass("carousel-next-active")

    if(self.dots)
      self.highlightDots($nextActiveChild.index())

    setTimeout(function(){
      $activeChild.removeClass("carousel-animation carousel-active " + className)
      $nextActiveChild.toggleClass("carousel-active carousel-next-active")
    }, 1000)
  }

  Carousel.prototype.highlightDots = function(index){
    var self = this

    self.$container.find(".carousel-dot").removeClass("carousel-dot-active")
    self.$container.find(".carousel-dot").eq(index).addClass("carousel-dot-active")
  }

  Carousel.prototype.slideToIndex = function(index){
    var self = this

    if(self.isAnimating() || this.beingActive(index))
      return

    var $nextActiveChild = self.$children.eq(index)
    self.slide($nextActiveChild)
    self.resetSliding()
  }

  Carousel.prototype.isAnimating = function() {
    var self = this

    return self.$container.find(".carousel-animation").length
  }

  Carousel.prototype.beingActive = function(index) {
    var self = this

    return self.$container.find(".carousel-active").index() == index
  }

  Carousel.prototype.getDirectionClass = function(){
    var self = this

    if(self.direction == "random"){
      return "moved-" + ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)]
    }else{
      return "moved-" + self.direction
    }
  }

  return Carousel;
})

