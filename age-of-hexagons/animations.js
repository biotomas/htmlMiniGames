var AnimationType = {
    Move: 0,
    FadeOut: 1,
    FadeIn: 2,
}

var animationLength = 1000;

class Animation {

    constructor(type, from, to, unit, goalUnit) {
        this.type = type;
        this.from = from;
        this.to = to;
        this.unit = unit;
        this.goalUnit = goalUnit;
        d = new Date();
        this.start = d.getTime();
        this.length = animationLength;
    }

    play(cc, now) {
        var progress = (now - this.start) / this.length;
        if (progress >= 1) {
            gameMaster.level.unitMap[this.to.x][this.to.y] = this.goalUnit;
            return true;
        }
        if (this.type == AnimationType.Move) {
            var f = coordsToPixels(this.from.x, this.from.y);
            var t = coordsToPixels(this.to.x, this.to.y);
            var x = this.interpolate(f[0], t[0], progress);
            var y = this.interpolate(f[1], t[1], progress);
            drawImagePixels(cc, theme.unitImg[this.unit], x, y);
        }
        if (this.type == AnimationType.FadeOut) {
            cc.globalAlpha = 1 - progress;
            drawImage(cc, theme.unitImg[this.unit], this.from.x,
                this.from.y);
            cc.globalAlpha = 1;
        }
        if (this.type == AnimationType.FadeIn) {
            cc.globalAlpha = progress;
            drawImage(cc, theme.unitImg[this.unit], this.from.x,
                this.from.y);
            cc.globalAlpha = 1;
        }
        return false;
    }

    interpolate(from, to, progress) {
        return from + progress * (to - from);
    }

}

class AnimationProvider {

    constructor() {
        this.animations = new Set();
    }

    addAnimation(animation) {
        this.animations.add(animation);
    }

    updateAnimations(cc, now) {
        if (this.animations.size == 0) {
            return false;
        }
        var finishedAnimations = new Set();
        for (let anim of this.animations) {
            if (anim.play(cc, now)) {
                finishedAnimations.add(anim);
            }
        }
        for (let del of finishedAnimations) {
            this.animations.delete(del);
        }
        return true;
    }



}