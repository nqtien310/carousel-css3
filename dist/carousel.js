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
    this.$container = $(this.container)
    this.$children  = this.$container.find(" > div")

    this.start = function(){
      var self = this;
      this.$children.first().addClass("carousel-active")

      setInterval(function(){
        self.slide()
      }, this.delayInSec * 1010)
    }

    this.slide = function(){
      var $activeChild = this.$container.find(".carousel-active")
      var $nextActiveChild = $activeChild.nextOrFirst("div")
      var className = this.getDirectionClass()
      $activeChild.addClass("animation " + className)
      $nextActiveChild.addClass("next-carousel-active")
      setTimeout(function(){
        $activeChild.removeClass("animation carousel-active " + className)
        $nextActiveChild.toggleClass("carousel-active next-carousel-active")
      }, this.delayInSec * 1000)
    }

    this.getDirectionClass = function(){
      if(this.direction == "random"){
        return "moved-" + ["left", "right", "top", "bottom"][Math.floor(Math.random() * 4)]
      }else{
        return "moved-" + this.direction
      }
    }
  }

  return Carousel;
})

