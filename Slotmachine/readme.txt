SlotObject
1.SlotObject(int type,int score); 新增SlotObject
	type  => 該水果總類
	score => 該水果分數
用法：
SlotObject abc = new SlotObject(int,int);
型態別   變數名稱 =   新增SlotObject

可用函數
1.int SlotObject.getBaseScore(); 回傳水果分數
2.int SlotObject.getType();      回傳水果種類
用法：
1.abc.getBaseScore();
2.abc.geyType();

SlotMachine
可用函數
1.void SlotMachine.SetSlot(int type,int score,int x,int y); 
	設定九宮格內的水果
	type  => 該水果總類
	score => 該水果分數
	x     => 0~3
	y     => 0~3
2.int SlotMachine.count(int type); 回傳欲查詢之水果總類的總數
	type  => 該水果總類
3.void SlotMachine.SetScore(int score);設定分數，為壘加方式
	score =>欲加的分數（可為負值）
4.int SlotMachine.getBaseScoreByType(int type); 回傳欲查詢水果總類的分數
	type  => 該水果總類
5.void SlotMachine.showSlot(); 顯示所有圖像
用法：
SlotMachine abc; //假設它叫abc
1.abc.SetSlot(int,int,int,int);
2.abc.SlotMachine.count(int);
3.abc.SetScore(int);
4.abc.getBaseScoreByType(int);
5.abc.showSlot();