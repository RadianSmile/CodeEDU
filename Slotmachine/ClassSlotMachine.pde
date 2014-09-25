class SlotMachine{
  float pos_x; 
  float pos_y; 
  int column;  
  int row;
  SlotObject[][] field;
  int grade;
  boolean bet;
  boolean btn_click;
  boolean btn_hover;
  boolean stop;
  SlotObject[] object;
  float[] probability;
  int[] score={10,20,100,30,80,40};
  
  SlotMachine(float this_x,float this_y){
    this.column=3;
    this.row=3;
    this.grade=500;
    this.pos_x=this_x;
    this.pos_y=this_y;
    this.field=new SlotObject[this.column][this.row];
    this.bet=false;
    this.btn_click=false;
    this.btn_hover=false;
    this.stop=false;
    this.object=new SlotObject[6];
    this.probability=new float[6];
  }
  void setSlot(int type,int score,int x,int y){
    this.field[x][y]=new SlotObject(type,score);
   // this.field[x][y]=new SlotObject(obj.type,obj.img_path_name,obj.base_score);
    this.field[x][y].setPos((screen_width-100*this.column)/2+100*x,95+100*y);
  }
  void setUp(){
    for(int i=1;i<7;i++){
      this.object[i-1]=new SlotObject(i,"0"+i+".png",this.score[i-1]);
      this.object[i-1].setPos((i<4?20:500),-100+125*(i<4?i:i-3));
      this.probability[i-1]=100;
     }
    rectMode(CORNER);      
    rect((screen_width-100*machine.column)/2,95,100*machine.column,100*machine.row);     

  }
  void setDraw(){
      this.btn_hover=(mouseX > screen_width/2-80 && mouseX < screen_width/2+80 && mouseY > 405 && mouseY < 465?true:false);
      //title text
      textSize(36);
      fill(255,255,255);
      textAlign(CENTER, CENTER);
      text("Slot Machine",screen_width/2,20);
      //background
      for(int i=0;i<6;i++){
          this.object[i].showImg();
          textSize(18);
          fill(255,255,255);
          textAlign(CENTER, CENTER);
          text(this.score[i]+"G",(i<3?70:550),125*(i<3?i+1:i-2));
      }
      //btn background
      rectMode(RADIUS);  
      fill((!this.btn_hover?255:0));
      rect(screen_width/2, 435, 80, 30);
      //btn
      textSize(30);
      textAlign(CENTER, CENTER);
      fill((!this.btn_hover?0:255));
      text((!this.btn_click?"Roll it":"Stop it"),screen_width/2,430);  
  }
  void showScore(){
      textSize(25);
      fill(255,255,255);
      textAlign(CENTER, CENTER);
      text("Score:"+machine.getScore()+"G",screen_width/2,60);
  }
  void detectRoll(){
    if(this.btn_click){
      background(0,random(180),random(200));
      rectMode(CORNER);
      fill(255,255,255);
      rect((screen_width-100*machine.column)/2,95,100*machine.column,100*machine.row);
      this.randomRolling();
      machine.stop=true;
    }
  }
  void detectStop(){
    if(this.stop && !this.btn_click){
     background(0,0,0);
     rectMode(CORNER);
     fill(255,255,255);
     rect((screen_width-100*machine.column)/2,95,100*machine.column,100*machine.row);
     //this.check();
     //this.bonusCheck();
     this.showSlot();
     //this.bet=false;
     //this.stop=false;    
    }
  }
  void showSlot(){
      for(int i=0;i<this.column;i++){
        for(int j=0;j<this.row;j++){
          if(!(this.field[i][j].pos_y>95+100*2)){
          this.field[i][j].showImg();
          }
        }
      }
  }
  void probability(){
    randomSeed(100);
    for(int i=0;i<this.column;i++){
     for(int j=0;j<this.row;j++){
       for(int ran=(int)random(5);;ran=(int)random(5)){
         if(random(100)<=this.probability[ran]){
           this.setSlot(ran+1,this.score[ran],i,j);
           this.probability[ran]*=0.6;
           break;
         }
         else{
           continue;
         }
       }
     }
    }
    for(int i=0;i<6;i++){
      this.probability[i]=100;
    }
  }
  void randomRolling(){
     for(int i=0; i<this.column;i++){
      for(int j=0;j<this.row;j++){
        int value=(int)random(120)%6;
        this.field[i][j].setImg("0"+(value+1)+".png",value+1,this.score[value]);
      }
     }
  this.showSlot();   
  }
  void check(){
    for(int i=0; i<this.column;i++){
      for(int j=0;j<this.row;j++){
        this.grade+=this.field[i][j].base_score;
      }
    }
  }
  void bonusCheck(){
    for(int i=1;i<=6;i++){
      if(count(i)>0){
        this.grade+=count(i)*count(i)*this.score[i-1];
      }
    }
  }
  void setScore(int grade){
    this.grade+=grade;
  }
  int count(int type){
    int count=0;
    for(int i=0;i<this.column;i++){
      for(int j=0;j<this.row;j++){
        if(this.field[i][j].type==type){
          count++;
        }
      }
    }
    return count;
  }
  int getScore(){
    return this.grade;
  }
  int getBaseScoreByType(int type){
    return this.score[type-1];
  }
};

