/**
 * @dateTime:2018/05/21 10:15:59
 * @author:ChenJun
 * @desc: Canvas生成验证码
 */

export default class GetVerify {
    static version = '1.0.0';

    constructor(id, options) {
        this.id = id;
        this.options = Object.assign({}, {
            canvasId: "verifyCanvas", //canvas的ID
            width: 100, //默认canvas宽度
            height: 30, //默认canvas高度
            type: "blend", //图形验证码默认类型blend:数字字母混合类型、number:纯数字、letter:纯字母
            code: ""
        }, options);
        this.options.numArr = "0,1,2,3,4,5,6,7,8,9".split(",");
        this.options.letterArr = this.getAllLetter();
    }

    GVerify() {
        this.init();
        this.refresh();
    }

    init() {
        const con = document.getElementById(this.id);
        const canvas = document.createElement("canvas");
        canvas.id = this.options.canvasId;
        canvas.width = this.options.width;
        canvas.height = this.options.height;
        canvas.style.cursor = "pointer";
        canvas.innerHTML = "您的浏览器版本不支持canvas";
        con.appendChild(canvas);
        canvas.onclick = () => {
            this.refresh();
        }
    }

    refresh() {
        this.options.code = '';
        const canvas = document.getElementById(this.options.canvasId);
        const ctx = canvas.getContext('2d');
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.randomColor(180, 240);
        ctx.fillRect(0, 0, this.options.width, this.options.height);
        let txtArr;
        if (this.options.type === "blend") {
            txtArr = this.options.numArr.concat(this.options.letterArr);
        } else if (this.options.type === "number") {
            txtArr = this.options.numArr;
        } else {
            txtArr = this.options.letterArr;
        }
        // 回执验证码
        for (let i = 1; i <= 4; i++) {
            const txt = txtArr[this.randomNum(0, txtArr.length)];
            this.options.code += txt;
            ctx.font = '20px SimHei';
            ctx.fillStyle = this.randomColor(50, 160);
            ctx.shadowBlur = this.randomNum(-3, 3);
            ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
            const x = this.options.width / 5 * i;
            const y = this.options.height / 2;
            const deg = this.randomNum(-30, 30);
            // 设置旋转角度和坐标原点
            ctx.translate(x, y);
            ctx.rotate(deg * Math.PI / 180);
            ctx.fillText(txt, 0, 0);
            // 恢复旋转角度和坐标原点
            ctx.rotate(-deg * Math.PI / 180);
            ctx.translate(-x, -y);
        }
        // 绘制干扰线
        for (let i = 0; i < 4; i++) {
            ctx.strokeStyle = this.randomColor(40, 180);
            ctx.beginPath();
            ctx.moveTo(this.randomNum(0, this.options.width / 2), this.randomNum(0, this.options.height / 2));
            ctx.lineTo(this.randomNum(0, this.options.width / 2), this.randomNum(0, this.options.height));
            ctx.stroke();
        }
        // 绘制干扰点
        for (let i = 0; i < this.options.width / 4; i++) {
            ctx.fillStyle = this.randomColor(0, 255);
            ctx.beginPath();
            ctx.arc(this.randomNum(0, this.options.width), this.randomNum(0, this.options.height), 1, 0, 2 * Math.PI);
            ctx.fill();
        }
    }

    validate(code) {
        const verifyCode = code.toLowerCase();
        const v_code = this.options.code.toLowerCase();
        return verifyCode === v_code ? true : false;
    }

    getAllLetter() {
        const letterStr = "a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,I,J,K,L,M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z";
        return letterStr.split(",");
    }

    randomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    randomColor(min, max) {
        const r = this.randomNum(min, max);
        const g = this.randomNum(min, max);
        const b = this.randomNum(min, max);
        return "rgb(" + r + "," + g + "," + b + ")";
    }
}
