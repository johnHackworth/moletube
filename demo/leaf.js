function isoTile(backgroundColor, borderColor, w, h, total_width, total_height) {
    var h_2 = h/2;

    return function(x, y) {
        var graphics = new PIXI.Graphics();
        // stage.addChild(graphics);
        var self = graphics;
        h2 = Math.floor(h/2 + Math.random() * 3 * h / 4)
        h_2 = h2/2;
        graphics.beginFill(backgroundColor);
        graphics.lineStyle(1, borderColor, 1);
        graphics.moveTo(x, y);
        graphics.lineTo(x + w, y + h_2);
        graphics.lineTo(x, y + h2);
        graphics.lineTo(x - w, y + h_2);
        graphics.lineTo(x , y);
        graphics.endFill();
        graphics.hitArea = new PIXI.Rectangle(x - w, y, w * 2, h2);
        graphics.setInteractive(true)

        graphics.click = function(mousedata)
        {
            self.alpha = 0.5;
            console.log(mousedata)
        }
        var graphicsShadow = new PIXI.Graphics();
        graphicsShadow.beginFill(0x444444);
        graphicsShadow.lineStyle(1, 0x444444, 1);
        var shadowHeight = total_height - 100 + 100 * (y / total_height)
        graphicsShadow.moveTo(x, shadowHeight);
        graphicsShadow.lineTo(x + w, shadowHeight+ h_2/2);
        graphicsShadow.lineTo(x, shadowHeight + h2/2);
        graphicsShadow.lineTo(x - w,shadowHeight + h_2/2);
        graphicsShadow.lineTo(x , shadowHeight);
        graphicsShadow.endFill();
        graphicsShadow.alpha = 0.2;
        graphics.shadow = graphicsShadow;
        graphics.shadow.tick = function() {}

        graphics.tick = function() {
          // this.x += this.speed;

          // this.y += this.fall / 10;
          if(this.x > 2* total_width) {
            this.x = -1 * total_width;

          }
          if(this.y > total_height - 150) {
            this.y = total_height - 150;
          }
          // this.hitArea.x = this.x;
          // this.hitArea.y = this.y;

          this.shadow.x = this.x;
          var shadowHeight = 0 + 100 * (this.y / total_height)

          this.shadow.y = shadowHeight; // + 100; // - h * 2;// + 100 * this.y /(total_height - 50)
        }
        return graphics;
    }
}
var tileWidth = 10;
var tileHeight = 10;

var grass = isoTile(0x80CF5A, 0x339900, tileWidth, tileHeight, 1200, 600);
var dirt = isoTile(0x96712F, 0x403014, tileWidth, tileHeight, 1200, 600);
var water = isoTile(0x85b9bb, 0x476263, tileWidth, tileHeight, 1200, 600);
