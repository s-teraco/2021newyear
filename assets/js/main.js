
var popCounter = 0;

var $windowWidth = $(window).width();
var $windowHeight = $(window).height();

PIXI.utils.skipHello();

var
  cursor = $(".cursor"),
  follower = $(".follower"),
  cWidth = 8, //カーソルの大きさ
  fWidth = 40, //フォロワーの大きさ
  delay = 10, //数字を大きくするとフォロワーがより遅れて来る
  mouseX = 0, //マウスのX座標
  mouseY = 0, //マウスのY座標
  posX = 0, //フォロワーのX座標
  posY = 0; //フォロワーのX座標

//マウス座標を取得
$(document).on("mousemove", function (e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
  corsorSet();
});

$(".circle").on({
  "mouseenter": function () {
    cursor.addClass("is-active");
    follower.addClass("is-active");
    $('.text-greeting').addClass('is-show');
  },
  "mouseleave": function () {
    cursor.removeClass("is-active");
    follower.removeClass("is-active");
    $('.text-greeting').removeClass('is-show');
  }
});

$(".modal__close,a").on({
  "mouseenter": function () {
    cursor.addClass("is-active");
    follower.addClass("is-active");
  },
  "mouseleave": function () {
    cursor.removeClass("is-active");
    follower.removeClass("is-active");
  }
});

function corsorSet() {
  gsap.set(cursor, {
    left: mouseX - cWidth / 2,
    top: mouseY - cWidth / 2
  })
  gsap.set(follower, {
    left: mouseX - fWidth / 2,
    top: mouseY - fWidth / 2,
    delay: 0.1
  })
}

$('.circle').click(function () {
  MicroModal.show('modal');
  // MicroModal.close('modal');
});


// circle animation
// -----------------------------------------------------

gsap.to(".circle", { opacity: 1, duration: 1, delay: 3 });
gsap.to(".text-greeting", { opacity: 1, y: 0, delay: 4 });

circleAnimation();

function circleAnimation() {
  var tl = gsap.timeline({ repeat: -1, repeatDelay: 3, delay: 1 });
  tl.add(function () {
    gsap.to("#cow", {
      duration: 2,
      morphSVG: {
        shape: "#heart",
        type: "rotational"
      }
    });
  })
    .to(".text-2021", { opacity: 1 }, "+=2")
    .to(".text-2021", { opacity: 0, delay: 2 })
    .add(function () {
      gsap.to("#cow", {
        duration: 2,
        morphSVG: {
          shape: "#cow",
          type: "rotational"
        }
      });
    }, "+=1");
}



// particle
// -----------------------------------------------------
var app = new PIXI.Application({
  width: $windowWidth,
  height: $windowHeight,
  transparent: true,
  resolution: 1
});
$('#canvas-container').append(app.view);

var particleCount = 100;
var particleColors = ['E8E5DB', 'f8d3d6', 'b5e1dc', 'cfc8b4']
// var particleColors = ['E8E5DB', 'cfb7dc', 'f8a2d6', 'b5e1dc', 'cfc8b4', '74a24e', 'fff47f']
var particleSettings;

for (var i = 0; i < particleCount; i++) {
  particleSettings = {
    particleSize: 20,
    x: Math.floor(Math.random() * app.renderer.width),
    y: Math.floor(Math.random() * app.renderer.height),
    scale: Math.floor(Math.random() * 4) / 4,
    alpha: Math.random(),
    particleSpeed: Math.floor(Math.min(200, Math.random() * 1000)),
    color: particleColors[Math.floor(Math.random() * particleColors.length)]
  }
  createParticle(particleSettings);
}

function createParticle() {

  // GRAPHIC
  var graphic = new PIXI.Graphics(); // create graphic
  graphic.beginFill('0x' + particleSettings.color);
  graphic.drawCircle(0, 0, particleSettings.particleSize); // (x, y, radius) // gets scaled as a sprite later
  graphic.endFill();

  // TEXTURE
  var texture = graphic.generateCanvasTexture(); // create texture using graphic (scaleMode, resolution)
  // texture.BaseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST; // scale mode for pixelation

  // SPRITE
  var particleSprite = new PIXI.Sprite(texture);  // create particle using texture
  particleSprite.interactive = true; 						  // enable mouse and touch events
  particleSprite.buttonMode = true; 						  // show hand cursor on mouseover
  particleSprite.anchor.set(0.5); 							  // center anchor point
  particleSprite.blendMode = PIXI.BLEND_MODES.SCREEN;

  // console.log('createParticle')
  // console.log('_particleSpeed', _particleSpeed);

  // SET POSITIONING
  gsap.set(particleSprite, { pixi: { x: particleSettings.x, y: particleSettings.y, scale: particleSettings.scale, alpha: particleSettings.alpha } }, 0);
  gsap.to(particleSprite, particleSettings.particleSpeed, {
    pixi: { x: Math.floor(Math.random() * app.renderer.width), y: Math.floor(Math.random() * app.renderer.height) }, ease: Power4.easeOut,
    onComplete: function () {
      // console.log('onComplete')
      popParticle();
    }
  }, 1);

  //
  function popParticle() {
    gsap.to(particleSprite, 0.3, { pixi: { scale: 3, alpha: 0 } }, 0);
  }

  // MOUSE EVENTS
  particleSprite.mouseover = function () {
    popParticle();
    popCounter++;
  }

  // ADD SPRITE TO STAGE
  app.stage.addChild(particleSprite);
}
