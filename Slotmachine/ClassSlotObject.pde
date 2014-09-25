class SlotObject{
  float pos_y; 
  float pos_x;  
  float obj_height;  
  float obj_width;   
  int base_score;
  int type;
  String img_path_name;
  PImage img;
  
  SlotObject(int obj_type,String obj_img_path,int obj_score){
    this.type=obj_type;
    this.img_path_name=obj_img_path; 
    this.img=loadImage(obj_img_path);
    this.base_score=obj_score;
  }
  SlotObject(int obj_type,int obj_score){
    this.type=obj_type;
    this.img_path_name="0"+type+".png";
    this.img=loadImage(img_path_name);
    this.base_score=obj_score;
  }
  void setPos(float obj_x,float obj_y){
    this.pos_x=obj_x;
    this.pos_y=obj_y;
  }
  void setImg(String img_path ,int img_type,int img_point){
        this.img_path_name=img_path;
        this.img=loadImage(img_path_name);
        this.type=img_type;
        this.base_score=img_point;
  }
  void showImg(){
    image(this.img,this.pos_x,this.pos_y,100,100);
  }
  
  float getX(){
    return this.pos_x;
  }
  float getY(){
    return this.pos_y;
  }
  int getBaseScore(){
      return this.base_score;
  }
  int getType(){
      return this.type;
  }
};

