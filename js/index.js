async function restart(from=true) {
    endedlevelt = 60*2.5;
    if(from){
        MUS_INTRO.pause();
        MUS_INTRO.currentTime = 0;
        MUS_INTRO.play();
    }
    time.tick=0;
    begun = false;
    pacman.dead = false;
    ghoststate = "scatter";
    ["pacman","ghostmanager.BLINKY","ghostmanager.PINKY","ghostmanager.INKY","ghostmanager.CLYDE"].forEach(i=>eval(i+".reset()"));
    if(!from){begun=true;return;}
}
async function resetpellets(){
    objectmanager.objects = [];
    for(i in TILEMAP)
        for(j in TILEMAP[i])
            if(TILEMAP[i][j] === 0)
                objectmanager.objects.push(new pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE/2)));
            else if(TILEMAP[i][j] === 3)
                objectmanager.objects.push(new medium_pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE)));
            else if(TILEMAP[i][j] === 4)
                objectmanager.objects.push(new power_pellet(j*CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE),i*CELL_SIZE+CELL_SIZE+(CELL_SIZE/2)-(PELLET_SIZE)));
}
addEventListener("keydown",e=>keys.keydown(e));
addEventListener("keyup",e=>keys.keyup(e));

function queuedDo() {
    switch (keys.queued) {
        case "up":
            if(pacman.x !== Math.round(pacman.x / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.ceil(pacman.y/CELL_SIZE)-1][Math.round(pacman.x/CELL_SIZE)]===1){break;}
            pacman.dir = 0;
            keys.queued = "";
            break;
        case "right":
            if(pacman.y !== Math.round(pacman.y / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.floor(pacman.x/CELL_SIZE)+1]===1){break;}
            pacman.dir = 1;
            keys.queued = "";
            break;
        case "down":
            if(pacman.x !== Math.round(pacman.x / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.floor(pacman.y/CELL_SIZE)+1][Math.round(pacman.x/CELL_SIZE)]===1){break;}
            pacman.dir = 2;
            keys.queued = "";
            break;
        case "left":
            if(pacman.y !== Math.round(pacman.y / CELL_SIZE)*CELL_SIZE){break;}
            if(TILEMAP[Math.round(pacman.y/CELL_SIZE)][Math.ceil(pacman.x/CELL_SIZE)-1]===1){break;}
            pacman.dir = 3;
            keys.queued = "";
            break;
        default:
            break;
    }
}
async function render() {
    if(ghostmanager.INKY.isdead()||ghostmanager.PINKY.isdead()||ghostmanager.BLINKY.isdead()||ghostmanager.CLYDE.isdead())
        MUS_GHOST_RETREAT.pla();
    else if(ghostmanager.INKY.scared||ghostmanager.PINKY.scared||ghostmanager.BLINKY.scared||ghostmanager.CLYDE.scared)
        MUS_GHOST_SCARED.pla();
    else
        MUS_GHOST_NORM.pla();
    pacman.update();
    objectmanager.update();
    ghostmanager.update();
}

//draw loop
function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.save();
    if(keys.konamimode)
        ctx.shadowOffsetX = Math.cos(time.secrettick/48)*2,
        ctx.shadowOffsetY = Math.sin(time.secrettick/48)*2,
        ctx.shadowColor = "#ff0000";
    if(String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""&&endedlevelt<60*2)
        ctx.drawImage(eval("MAP_SPRITE"+(time.secrettick%20>10?"_2":"")),OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    else    
        ctx.drawImage(MAP_SPRITE,OFFSET[1],-80+OFFSET[0],CELL_SIZE*28,CELL_SIZE*36);
    ctx.restore();
    ctx.fillStyle = "#ffffff";
    ctx.fillText(pacman.score,290-(String(pacman.score).length*35),CELL_SIZE*2);
    if(pacman.hp&&time.secrettick%40<20)
        ctx.fillText("1UP",280,CELL_SIZE);
    ctx.fillStyle = "#ffff00";
    ctx.font = "bold 35px pixel-face";
    if(!(begun||pacman.dead||String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))==="")){
        if(MUS_INTRO.currentTime > 3)            
            ctx.fillText("READY!",canvas.width/2-("READY!".length*17.5), canvas.height/2+CELL_SIZE*2.45);
        else
            ctx.fillText(`LEVEL ${level}`,canvas.width/2-(`LEVEL ${level}`.length*17.5),canvas.height/2+CELL_SIZE*2.45)
    }
    for(i in objectmanager.objects)
        objectmanager.objects[i].draw();
    ctx.fillStyle = "#2222bb"
    if(debug_mode){
        for(i in TILEMAP[0])
            for(j in TILEMAP)
                if(TILEMAP[j][i]===1)
                    ctx.fillRect(i*CELL_SIZE+OFFSET[1],j*CELL_SIZE+CELL_SIZE+OFFSET[0],CELL_SIZE,CELL_SIZE);
        ctx.fillStyle = "#ffff00"
    }
    if(keys.pressedsequence.length === keys.konami.length){keys.konamimode =! keys.konamimode; keys.pressedsequence = []}
    if(!pacman.ate)
        if(debug_mode)
            ctx.fillRect(pacman.x+OFFSET[1],pacman.y+CELL_SIZE+OFFSET[0]+pacman.dead*(CELL_SIZE/2),CELL_SIZE,CELL_SIZE-pacman.dead*(CELL_SIZE/2));
        else
            pacman.draw();
    for(let i = 0; i < pacman.max_hp; i++)if(pacman.max_hp-i<=pacman.hp)
        ctx.drawImage(HP_SPRITE,(i*(CELL_SIZE*1.9))+5,CELL_SIZE*33.6,CELL_SIZE*1.8,CELL_SIZE*1.9);
    if(!(pacman.dead||String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""&&endedlevelt<60*2)){
        if(debug_mode){
            ctx.fillStyle = "#bb2222"
            ctx.fillRect(ghostmanager.BLINKY.x+OFFSET[1],ghostmanager.BLINKY.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#ffc0cb"
            ctx.fillRect(ghostmanager.PINKY.x+OFFSET[1],ghostmanager.PINKY.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#add8e6"
            ctx.fillRect(ghostmanager.INKY.x+OFFSET[1],ghostmanager.INKY.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
            ctx.fillStyle = "#ffa500"
            ctx.fillRect(ghostmanager.CLYDE.x+OFFSET[1],ghostmanager.CLYDE.y+OFFSET[0],CELL_SIZE,CELL_SIZE);
        }else{
            ghostmanager.BLINKY.draw();
            ghostmanager.PINKY.draw();
            ghostmanager.INKY.draw();
            ghostmanager.CLYDE.draw();
        }
    }
}
//main loop
async function update() {
    if(pacman.hp<0)
        return;
    time.tick++;
    time.secrettick++;
    time.fps = time.calcfps();
    if(String(objectmanager.objects.filter(a=>{return["pellet","power_pellet"].includes(a.name)}))===""){
        if(endedlevelt){
            begun = false;
            endedlevelt--;
            document.querySelectorAll("audio[loop]").forEach(i=>{i.pause();i.currentTime=0;})
        }else{
            begun = true;
            level++;
            restart();
            resetpellets();
        }
    }
    if(begun && !pacman.dead)render(); else{MUS_GHOST_NORM.pause();MUS_MUNCH_1.pause();MUS_MUNCH_2.pause();if(!pacman.dead)time.tick = 0;}
    if(pacman.dead && ((time.tick%7)===0)){
        if(pacman.anim<14){
            pacman.dir = 1;
            if(pacman.anim<=2){pacman.anim=2;time.tick=(Math.round(time.tick/5)*5);}
            pacman.anim++;
        }
    }
    document.getElementById("fps").innerHTML = `fps: ${time.fps}`;
    draw();
    requestAnimationFrame(update);
}

requestAnimationFrame(()=>
    requestAnimationFrame(()=>{
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "white";
        ctx.fillText("PRESS ENTER TO START",canvas.width/2-("PRESS ENTER TO START".length*15), canvas.height/2);
    })
);
var begun = false;
var munch_b = false;
(async function(){
    await time.waitbool("keys.keyspressed[\"Enter\"]");
    restart();
    resetpellets();
    update();
    MUS_INTRO.addEventListener("ended",()=>{MUS_GHOST_NORM.play();begun=true;});
})();
