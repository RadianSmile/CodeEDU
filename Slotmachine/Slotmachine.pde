//some gobal setting
@pjs preload="data/01.png,data/02.png,data/03.png,data/04.png,data/05.png,data/06.png,";
SlotMachine machine;
int screen_width=640;
int screen_height=480;

void setup(){
  frameRate(15);
  size(screen_width,screen_height);
  noStroke();
  smooth();
  background(0,0,0);
  machine=new SlotMachine(screen_width/2,200);
  machine.setUp(); 
  /*we have to assign random fruits , and show it right after all fruits have been setted (RANK C)*/
  /*RANK A for controling probability*/
  /*your code below*/
//  for(int i=0;i<machine.column;i++){
//    for(int j=0;j<machine.row;j++){
//       int ran=(int)random(1,6);
//       machine.setSlot(ran,machine.score[ran-1],i,j);
//    }
//  }
  machine.probability();//RANK A
  machine.showSlot();
  /*your code above*/
}

void draw(){
  if(!machine.stop && machine.bet){
      /*we need to do something before rolling, think about it (RANK B)*/
      /*your code below*/
      machine.setScore(-50);
      /*your code above*/
      machine.bet=false;
  }
  machine.detectRoll();
  machine.detectStop();
  if(machine.stop && !machine.btn_click){
    /*what will machine behave after we stop rolling (RANK B / RANK C)*/
    /*your code below*/
   // machine.check();
    machine.bonusCheck();
    /*your code above*/   
    machine.bet=false;
    machine.stop=false;
  }
  machine.showScore();
  machine.setDraw();      
}


void mousePressed(){
  if(mouseX > screen_width/2-80 && mouseX < screen_width/2+80 && mouseY > 405 && mouseY < 465){
    machine.btn_click=!machine.btn_click;
    machine.bet=true;
  }
}
