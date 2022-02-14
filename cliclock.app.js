require("FontTeletext10x18Ascii").add(Graphics);
Bangle.setLCDTimeout(0);
Bangle.setLCDPower(1);

const rowTopCLIInput = 24;
const rowBottomCLIIput = 155;
const rowTime = 45;
const rowDate = 95;
const rowDay = 125;

const fontSizeCLIInput = 16;

const commandInputTime = 300;

var cursorInterval = null;
var cursorShow = false;

const drawCLIInput = (row) => {
    setFont(fontSizeCLIInput, '#0000FF');
    g.drawString("rs", 3, row);
    setFont(fontSizeCLIInput, "#000000");
    g.drawString("@bangle2", 20, row);
    setFont(fontSizeCLIInput, '#00FF00');
    g.drawString("$", 95, row);
};

const drawCLICommand = (command, row, animated) => {
    if(animated){
        let commands = ['_'];
        for(i = 0; i < command.length; i++){
            commands.push(command.substring(0, i + 1) + "_");
        }
        commands.push(command);

        let cursorTimeout = 0;
        for(i = 0; i < commands.length; i++){
            setTimeout((part) => {
                g.clearRect(110, row, 190, row + fontSizeCLIInput);
                setFont(fontSizeCLIInput, "#000000");
                g.drawString(part, 110, row);
            }, cursorTimeout, commands[i]);
            cursorTimeout = cursorTimeout + commandInputTime;
        }
    }
    else{
        setFont(15, "#000000");
        g.drawString(command, 110, row);
    }
};

const drawTime = () => {
    let date = new Date();
    setFont(50, "#000000");
    g.setFontAlign(0,-1);
    g.drawString(twoDigits(date.getHours()) + ":" + twoDigits(date.getMinutes()), g.getWidth()/2, rowTime);
    g.setFontAlign(-1,-1);
};

const drawDate = () => {
    let date = new Date();
    g.setFontAlign(0,-1);
    setFont(25, "#000000");
    g.drawString(twoDigits(date.getDate()) + "-" + twoDigits((date.getMonth()) + 1) + "-" + date.getFullYear(), g.getWidth()/2, rowDate);
    g.setFontAlign(-1,-1);
};

const drawDay = () => {
    let date = new Date();
    let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    setFont(25, "#000000");
    g.setFontAlign(0,-1);
    g.drawString(days[date.getDay()], g.getWidth()/2, rowDay);
    g.setFontAlign(-1,-1);
};

const setFont = (size, color) => {
    g.setFont("Teletext10x18Ascii");
    g.setColor(color);
    g.setFontVector(size);
};

const twoDigits = (num) => {
    if(num < 10){
        return "0" + String(num);
    }
    return num;
};

blinkingCursor = (row) => {
    if(cursorShow){
        setFont(19, "#000000");
        g.drawString("_", 110, row);
        cursorShow = false;
    }
    else{
        g.clearRect(110, rowBottomCLIIput, 190, 190);
        cursorShow = true;
    }
};

g.clear();

//Loading widgets
Bangle.loadWidgets();
Bangle.drawWidgets();

// Show launcher when middle button pressed
Bangle.setUI("clock");

//Draw clock on start
drawCLIInput(rowTopCLIInput);
drawCLICommand("date", rowTopCLIInput, false);
drawCLIInput(rowBottomCLIIput);
drawTime();
drawDate();
drawDay();
cursorInterval = setInterval(blinkingCursor, 500, rowBottomCLIIput);
setTimeout(() => {
    
    clearInterval(cursorInterval);
    drawCLICommand("clear", rowBottomCLIIput, true);
}, 57900);



Bangle.on('lcdPower', on => {
    if (on){
        drawCLIInput(rowTopCLIInput);
        drawCLICommand("date", rowTopCLIInput, false);
        drawCLIInput(rowBottomCLIIput);
        drawTime();
        drawDate();
        drawDay();
    }
});

setInterval(() => {
    g.clearRect(0, 24, 190, 190);
    drawCLIInput(rowTopCLIInput);
    drawCLICommand("date", rowTopCLIInput, true);
    setTimeout(() => {
        drawCLIInput(rowBottomCLIIput);
        drawTime();
        drawDate();
        drawDay();
        cursorInterval = setInterval(blinkingCursor, 500, rowBottomCLIIput);
    }, 1800);

    setTimeout(() => {
        clearInterval(cursorInterval);
        drawCLICommand("clear", rowBottomCLIIput, true);
    }, 57900);
}, 60000);
