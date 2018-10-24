
// inspired by "Generic Drag" by Mike Hall at http://www.brainjar.com/dhtml/drag/
 
var boxCount=0;
var mode = "digital";

var deleteMode = false;
var lastBox="";

var rectangle="";
var lastAx;
var lastAy;
var lastBx;
var lastBy;

var NO;
var NE;
var SE;
var SO;


var isDrawable=true;
var lastColor="";

var top;
var left;

var boxArray="";
var boxArrayOfContents="";

var panelWidth = 800;
var panelHeight = 600;


var codeToInject="";

var click=0;

 
var boxesIds = new Array() ;
var boxesValues = new Array() ;
var boxesInners = new Array() ;



var d;	
 
function addTextBox(event)
{
    
  var newBox= document.createElement("div");
    
  //newBox.setAttribute("id", "box"+boxCount);
  
  newBox.id = "box"+boxCount;  
  
  setClass("newBox",newBox); 
  
  newBox.setAttribute("name", "box"+boxCount);  
  
  newBox.style.position ="relative";   
  newBox.style.position.left ="100";  
  newBox.style.position.top ="200";  
  newBox.style.border ="1px solid black";      
  
  if (browser.isNS) 
    newBox.setAttribute("onmousedown", "dragStart(event)");
  else 
    newBox.onmousedown=function(){dragStart(event);} // Opera, IE et FFx   
  
  var newText = document.createTextNode("a simple text");  
  newBox.appendChild(newText);  
  
  var x = new getObj('mainBox');  
  x.obj.appendChild(newBox);  
  
  boxCount++;
  document.boxInfo.boxCount.value=boxCount;
  isDrawable = false;
}

 
function getObj(name)
{
  if (document.getElementById)
  {
  	this.obj = document.getElementById(name);
	this.style = document.getElementById(name).style;
  }
  else if (document.all)
  {
	this.obj = document.all[name];
	this.style = document.all[name].style;
  }
  else if (document.layers)
  {
   	this.obj = document.layers[name];
   	this.style = document.layers[name];
  }
} 
 
function setClass(className,parent)
{

var p3 = parent;
p3.appendChild(  document.createTextNode(    "And guess what. It works!"   ));

// if the node's class already exists
// then replace its value
if (p3.getAttributeNode("class")) {
  for (var i = 0; i < p3.attributes.length; i++) {
    var attrName = p3.attributes[i].name.toUpperCase();
    if (attrName == 'CLASS') {
      p3.attributes[i].value = className;
    }
  }
// otherwise create a new attribute
} else {
  p3.setAttribute("class", className);
} 

}
 
document.onmousemove = getMouseXY;

var posX = 0
var posY = 0

function getMouseXY(e) 
{
 
	if(navigator.appName == "Netscape"){
		posX = e.pageX
	 	posY = e.pageY

	} else {
		posX = event.clientX + document.body.scrollLeft
 		posY = event.clientY + document.body.scrollTop
	}

	if (posX <= 0) {posX = 0} 
	//if (posX > document.mainBox.width) {posX = document.mainBox.width} 
	if (posY <= 0) {posY = 0}   
	//if (posY > document.mainBox.height) {posY = document.mainBox.height} 

    
 	return true;
}


function action() {
 
	document.PMouseX.value = posX;
	document.PMouseY.value = posY;

}

// Determine browser and version.

function Browser() {

  var ua, s, i;

  this.isIE    = false;
  this.isNS    = false;
  this.version = null;

  ua = navigator.userAgent;

  s = "MSIE";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isIE = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  s = "Netscape6/";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = parseFloat(ua.substr(i + s.length));
    return;
  }

  // Treat any other "Gecko" browser as NS 6.1.

  s = "Gecko";
  if ((i = ua.indexOf(s)) >= 0) {
    this.isNS = true;
    this.version = 6.1;
    return;
  }
}

var browser = new Browser();

// Global object to hold drag information.

var dragObj = new Object();
dragObj.zIndex = 0;

function dragStart(event, id) 
{
    if(!deleteMode)
    {        
          
          var el;
          var x, y;
        
          // If an element id was given, find it. Otherwise use the element being
          // clicked on.
        
          if (id)
            dragObj.elNode = document.getElementById(id);
          else {
            if (browser.isIE)
              dragObj.elNode = window.event.srcElement;
            if (browser.isNS)
              dragObj.elNode = event.target;
        
            // If this is a text node, use its parent element.
        
            if (dragObj.elNode.nodeType == 3)
              dragObj.elNode = dragObj.elNode.parentNode;
          }
        
          // Get cursor position with respect to the page.
        
          if (browser.isIE) {
            x = window.event.clientX + document.documentElement.scrollLeft
              + document.body.scrollLeft;
            y = window.event.clientY + document.documentElement.scrollTop
              + document.body.scrollTop;
          }
          if (browser.isNS) {
            x = event.clientX + window.scrollX;
            y = event.clientY + window.scrollY;
          }
        
          // Save starting positions of cursor and element.
        
          dragObj.cursorStartX = x;
          dragObj.cursorStartY = y;
          dragObj.elStartLeft  = parseInt(dragObj.elNode.style.left, 10);
          dragObj.elStartTop   = parseInt(dragObj.elNode.style.top,  10);
          
        
          if (isNaN(dragObj.elStartLeft)) dragObj.elStartLeft = 0;
          if (isNaN(dragObj.elStartTop))  dragObj.elStartTop  = 0;
        
          // Update element's z-index.
        
          dragObj.elNode.style.zIndex = ++dragObj.zIndex;
        
          // Capture mousemove and mouseup events on the page.
        
          if (browser.isIE) {
            document.attachEvent("onmousemove", dragGo);
            document.attachEvent("onmouseup",   dragStop);
            window.event.cancelBubble = true;
            window.event.returnValue = false;
          }
          if (browser.isNS) {
            document.addEventListener("mousemove", dragGo,   true);
            document.addEventListener("mouseup",   dragStop, true);
            event.preventDefault();
          }
          
        }
    else 
    {
      if (id)
            dragObj.elNode = document.getElementById(id);
       else {
            if (browser.isIE)
              dragObj.elNode = window.event.srcElement;
            if (browser.isNS)
              dragObj.elNode = event.target;
            if (dragObj.elNode.nodeType == 3)
              dragObj.elNode = dragObj.elNode.parentNode;
            }
       
       if(document.myform.cursorIsOver.value!="out")
        {
            dragObj.elNode.style.visibility="hidden";
			dragObj.elNode.style.display="none";
			//document.removeChild(id); RAISES EXCEPTION
            boxCount--;
            document.boxInfo.boxCount.value=boxCount;
        }
        
        //alert("Box deleted");
        
       
    
    }
  
}

function dragGo(event) 
{
   isDrawable=false;
  
  if(document.myform.cursorIsOver.value!="out")
  {
  
  var x, y; 

  // Get cursor position with respect to the page.

  if (browser.isIE) {
    x = window.event.clientX + document.documentElement.scrollLeft
      + document.body.scrollLeft;
    y = window.event.clientY + document.documentElement.scrollTop
      + document.body.scrollTop;
  }
  if (browser.isNS) {
    x = event.clientX + window.scrollX;
    y = event.clientY + window.scrollY;
  }

  // Move drag element by the same amount the cursor has moved.
  
  dragObj.elNode.style.left = (dragObj.elStartLeft + x - dragObj.cursorStartX) + "px";
  dragObj.elNode.style.top  = (dragObj.elStartTop  + y - dragObj.cursorStartY) + "px";


  //va bene anche qua la trasparenza, ma sarebbe meglio sul mousedown
  //dragObj.elNode.style.background="url(css/bluer.png)";  
  dragObj.elNode.style.filter="alpha(opacity=30)";
  dragObj.elNode.style.MozOpacity="0.3";
  
  
  //dragObj.elNode.style.filter="alpha(opacity=30)";  
  // -moz-opacity:0.3;
  

  if (browser.isIE) {
    window.event.cancelBubble = true;
    window.event.returnValue = false;
  }
  if (browser.isNS)
    event.preventDefault();
    
    
   if(!deleteMode)
   {       document.myform.systemStatus.value="dragging";   }
    
 }
   
}

function dragStop(event) 
{
  isDrawable=true;
  
  // Stop capturing mousemove and mouseup events.

  if (browser.isIE) {
    document.detachEvent("onmousemove", dragGo);
    document.detachEvent("onmouseup",   dragStop);
  }
  if (browser.isNS) {
    document.removeEventListener("mousemove", dragGo,   true);
    document.removeEventListener("mouseup",   dragStop, true);
  }
  
  dragObj.elNode.style.filter="alpha(opacity=100)";
  dragObj.elNode.style.MozOpacity="1";
  
}




function init() {

	initMouseEvents();
    if(boxCount>0)
    {
		document.myform.deleteButton.disabled = false;
		document.getElementById("deleteButton").style.filter="alpha(opacity=100)";	
		document.getElementById("deleteButton").style.opacity="1";

		document.getElementById("snapshotButton").style.filter="alpha(opacity=100)";	
		document.getElementById("snapshotButton").style.opacity="1";
		
		
		
	}
    else if(boxCount==0)
    {
        document.myform.deleteButton.disabled = true;    
		
		document.getElementById("deleteButton").style.filter="alpha(opacity=30)";	
		document.getElementById("deleteButton").style.opacity=".30";

		
		document.getElementById("snapshotButton").style.filter="alpha(opacity=30)";	
		document.getElementById("snapshotButton").style.opacity=".30";
		
		
		
		
        deleteMode=false;
        dragObj.elNode = document.getElementById('mainBox');
        dragObj.elNode.style.cursor= "crosshair";
    }
    
    if(!deleteMode)
    {
        document.myform.systemStatus.value="moving";        
    }
    
}

function DynMouseDown(x,y) 
{

    if(document.myform.cursorIsOver.value!="out" && !deleteMode && isDrawable )
    {

    if(x < panelWidth)	    
    	document.myform.downx.value = x;
    else 
    	document.myform.downx.value = panelWidth; 
    
    if(y < panelHeight)	    
    	document.myform.downy.value = y;
    else 		
        document.myform.downy.value = panelHeight;    
    
    document.myform.downx.style.backgroundColor="cyan";
    document.myform.downy.style.backgroundColor="cyan";
    document.myform.upx.style.backgroundColor="white";
    document.myform.upy.style.backgroundColor="white";   
    
    lastAx = x;
    lastAy = y;
    
    //if(!deleteMode)
    document.myform.systemStatus.value="drawing box " + boxCount;
	
	
    
	    if(document.myform.cursorIsOver.value=="mainBox")
	    {   
	        //alert("increasing");
	        if(click==0)click++;        
	        document.boxInfo.mouseClicks.value=click;
			
				
			d = document.createElement("div");
			d.appendChild(document.createTextNode("value"));
			
			d.setAttribute("id","dynamic");			
			d.style.border = "1px solid #000";
			
			//d.style.background = "#eeeeff";
			if (document.boxInfo.colorBox.value !="#FFFFFF")
				d.style.background = document.boxInfo.colorBox.value;
			
			
			d.style.filter="alpha(opacity=30)";
			d.style.MozOpacity="0.3";
			
			d.style.zIndex="999";
			
			
			//d.style.top = "200px";

			d.style.top = y;
			//d.style.left = "200px";			
			d.style.left = x;					
			
			d.style.position= "absolute";			
			//d.style.display= "none";			
			
			d.style.width = "10px";
			d.style.height = "10px";		
			
			document.getElementById("mainBox").appendChild(d);

	    }
	    
		return true;
    
    }
}



function DynMouseMove(x,y) 
{

	//if (document.myform.cursorIsOver.value=="dynamic" )
		if(d = document.getElementById("dynamic"))
		{					
								
				/*	
				if(x<lastAx)	
				{
					d.style.right=d.style.left;
					d.style.left=x;
					d.style.width = Math.abs(x - lastAx) - 5;					
				}	
				else 
					d.style.width = Math.abs(x - lastAx) - 5;				
				
				
				if(y<lastAy)	
				{
					d.style.bottom=d.style.top;
					d.style.top=y;
					d.style.height =  Math.abs(y - lastAy) - 5;	
				}	
				else 
					d.style.height =  Math.abs(y - lastAy) - 5;	
				*/
				
				if(x<lastAx && y<lastAy)	
				{
					d.style.right=d.style.left;
					d.style.left=x+5;
					
					//d.style.right-=5;
					
					d.style.bottom=d.style.top;
					d.style.top=y+5;

					//d.style.bottom-= 5;
					
					d.style.width = eval(lastAx - x);	
					d.style.height =  eval(lastAy - y);	
					
					NO=true;
					NE=false;					
					SE=false;
					SO=false;
								
				}	
				
				if(x<lastAx && y>lastAy)	
				{
					d.style.right=d.style.left;
					d.style.left=x+5;
					
					//d.style.right+=5;
					
					d.style.width = eval(lastAx - x);					
					d.style.height =  eval(y - lastAy) - 5;		
					
				
					SO=true;
					
					NO=false;
					NE=false;
					SE=false;
				}	
				
				if(x>lastAx && y<lastAy)	
				{
					d.style.bottom=d.style.top;
					d.style.top=y+5;
					
					//d.style.bottom -= 5;
					
					d.style.width = eval(x - lastAx) - 5;					
					d.style.height =  eval(lastAy - y);	
					
					NE=true;
					
					SE=false;
					SO=false;
					NO=false;
				}	
				else if(x>lastAx && y>lastAy)	
				{
					d.style.width = (x - lastAx) - 5;
					d.style.height =  (y - lastAy)  - 5;				
					
					SE=true;
					
					SO=false;
					NO=false;					
					NE=false;	
					
				}									
				 
						
				d.innerHTML = d.style.width + " " + d.style.height;
		}
    
    if( document.myform.cursorIsOver.value=="mainBox" )
    {
        isDrawable=true;    
        document.myform.permission.value="OK1";
        
        document.myform.movex.value = x;
		document.myform.movey.value = y;      		 
			   
    }
    
    else if( document.myform.cursorIsOver.value=="out")
    {   
       isDrawable=false;
       document.myform.permission.value="NO1";
       // alert("siam la");
       document.myform.movex.value = x;
       document.myform.movey.value = y;           
       click=0;   
    }
    
    else if(document.myform.cursorIsOver.value!="out")
    {
        document.myform.permission.value="NO2";
        
        if(x < panelWidth)	    
            document.myform.movex.value = x;
        else 
            document.myform.movex.value = panelWidth;

        if(y < panelHeight)	    
            document.myform.movey.value = y;
        else 
            document.myform.movey.value = panelHeight;
    
        document.myform.boxVals.value = rectangle;
    
       
    }
 
}

function DynMouseUp(x,y) 
{
	if(document.getElementById("dynamic"))
	    document.getElementById("mainBox").removeChild(d);  


	if(document.myform.cursorIsOver.value!="out" && !deleteMode && isDrawable && document.myform.permission.value!="NO2")
    {
    
    if(x < panelWidth)	    
    	document.myform.upx.value = x;
    else 
    	document.myform.upx.value = panelWidth;
    
    if(y < panelHeight)	    
    	document.myform.upy.value = y;
    else 		
        document.myform.upy.value = panelHeight;

    
    document.myform.downx.style.backgroundColor="white";
    document.myform.downy.style.backgroundColor="white";
    document.myform.upx.style.backgroundColor="cyan";
    document.myform.upy.style.backgroundColor="cyan";
    
    
    rectangle+= "A(" + lastAx + "," + lastAy +")";
    rectangle+= "B(" + x + "," + y +")\n";
    
    lastBx = x;
    lastBy = y;    
    
    document.myform.boxDimension.value = "W:" + getWidth() + " H:" + getHeight();
    
    setDimension(getWidth(),getHeight());
    isDrawable = true;
    
    if(document.myform.cursorIsOver.value=="mainBox" )
    {
        //alert("decresing");        
        click--;
        document.boxInfo.mouseClicks.value=click;
    }
    
    
		
    addBoxWithKey();
	
	
    document.myform.systemStatus.value="moving";    
	return true;
        
    }
    
   // else click=0;
    
    
}


function addNewBox(top,left,ax,ay,bx,by)
{
    alert("Drawing at :" + top + left);    
}


function setWidth(width)
{
    document.boxInfo.boxWidth.value = width;
}


function setHeight(height)
{
    document.boxInfo.boxHeight.value = height;
}

function getWidth()
{
    if((lastBx*1 - lastAx*1) >0)
       	return (lastBx*1 - lastAx*1);
    else 
        return (lastAx*1 - lastBx*1);
}


function getHeight()
{	
        if((lastBy*1 - lastAy*1) > 0)
            return (lastBy*1 - lastAy*1); 
        else return (lastAy*1 - lastBy*1 ); 
}

function getArea()
{
	return (getWidth()*1)*(getHeight()*1);
}


function setDimension(width,height)
{

   if(height<0)
        alert("h error in setDimension(): " + height);
    document.boxInfo.boxHeight.value = height;
    
   if(width<0)
        alert("w error in setDimension(): " + width);
    document.boxInfo.boxWidth.value = width;
    
    setWidth(width);
    setHeight(height);
}


  


function doSomething(e)
{
    //alert(e.type);
    var elem = (e.target) ? e.target : e.srcElement;   
    
    if (elem.nodeType == 3) // defeat Safari bug
		elem = elem.parentNode;
    
    if (e.type == "mouseover")
    {        
    
    lastColor = elem.style.backgroundColor;     
	
	
	if (elem.style.backgroundColor!= "rgb(255,0,0)" )
		elem.style.borderColor="red";
	else 		
		elem.style.borderColor="black";
   	        
        if(elem.getAttribute("id")=="")
        {   if(click!=0)     
                document.myform.cursorIsOn.value="out3";
            else
                document.myform.cursorIsOn.value="out";
        }
        else 
            document.myform.cursorIsOn.value=elem.getAttribute("id") + ":" + elem.getAttribute("name");
        
        isDrawable = false;
    }
    
    else if (e.type == "mouseout")
    {
       
        elem.style.borderColor="black";     
	    elem.style.background=lastColor;
        document.myform.cursorIsOn.value="???";
        
    }
   
    
}



function getMouseOver(e)
{
    //alert(e.type);
    var elem = (e.target) ? e.target : e.srcElement;   
    
    if (elem.nodeType == 3) // defeat Safari bug
		elem = elem.parentNode;
    
    if (e.type == "mouseover")
    {   
        document.myform.cursorIsOver.value=elem.getAttribute("id");
        document.boxInfo.lastColor.value=elem.style.backgroundColor;
        if( document.myform.cursorIsOver.value=="")
        {
            if(click!=0)
                document.myform.cursorIsOver.value = "out2";        
            else
                document.myform.cursorIsOver.value = "out";        
        }
    }

    
   
    
}



function saveValues(e)
{
    
    var elem = (e.target) ? e.target : e.srcElement;
    switch(e.type)
    {
        case "mouseover":elem.style.borderColor="white";document.myform.cursorIsOn.value=elem.getAttribute("name"); break;
        case "mouseout":elem.style.borderColor="black";      break;
        default : break;
        
    }
    
}




function checkDimension()
{
     var message="";

     if(document.boxInfo.boxWidth.value < 0)
     {
         message += "width error: " + document.boxInfo.boxWidth.value + "\n";         
     }
     else if(document.boxInfo.boxHeight.value < 0)
     {
         message += "height error: " + document.boxInfo.boxWidth.value + "\n";
     }
     else if(top<0)
     {
         message += "top error: " + top + "\n";
     }
     else if(left<0)
     {
         message += "left error: " + left + "\n";
     }
     
     if(message!="")
    {
        alert(message);
        return false;
    }
        
        
     return true;
}

function getXspacing()
{
	var spacing= 5;
	
	if(NO) return 0;
	if(NE) return spacing*(-1);
	if(SE) return spacing*(-1);
	if(SO) return 0;

}

function getYspacing()
{
	var spacing= 5;
	
	if(NO) return 0;
	if(NE) return spacing*(-1);
	if(SE) return spacing*(-1);
	if(SO) return 0;

}

function addBoxWithKey()
{
    
  if(isDrawable && !deleteMode && document.myform.cursorIsOver.value=="mainBox" && checkDimension() && click==0 )
  {
      var newBox= document.createElement("div");  
      
      
      if (document.boxInfo.boxName.value!="0")
      {
			newBoxName = document.boxInfo.boxName.value;
			newBox.id = document.boxInfo.boxName.value;
	  }
      else 
      {
		newBoxName = "box"+boxCount; 
		newBox.id = "box"+boxCount;    
	  }

      boxArray += "#" + newBoxName;
	  boxesIds[boxesIds.length] = newBox.id;
      
      newBox.setAttribute("name", newBoxName);         
      newBox.style.position ="absolute";    
	  
      //newBox.style.width = (document.boxInfo.boxWidth.value) + getXspacing();
      newBox.style.width = (document.boxInfo.boxWidth.value);
	  
      //newBox.style.height = (document.boxInfo.boxHeight.value) + getYspacing();    
      newBox.style.height = (document.boxInfo.boxHeight.value);    
      
      //if (getArea()<60000 && document.boxInfo.showTextInfo.checked)	
	  if(document.boxInfo.showScrolls.checked)      
	      newBox.style.overflow = "scroll";   
      
      if(!deleteMode)newBox.style.cursor = "move"; 
      
  //     setCorrectCoordinates(document.myform.downx.value,document.myform.downy.value,document.myform.upx.value,document.myform.upy.value);
      setCorrectCoordinates(lastAx,lastAy,lastBx,lastBy);
      newBox.style.top = top;
      newBox.style.left = left;
      newBox.style.border ="1px solid black";   
    
	
    /*   colorBox è del colorPicker    */
    //newBox.style.background = document.boxInfo.boxColor.value;
    if(document.boxInfo.colorBox.value)        
        newBox.style.background = document.boxInfo.colorBox.value;
    else 
        newBox.style.background = "red";
        
      
       if (browser.isNS) 
        newBox.setAttribute("onmouseover", "doSomething(event)");
      else 
        newBox.onmouseover=function(){doSomething(event);} // Opera, IE et FFx
        
      if (browser.isNS) 
        newBox.setAttribute("onmouseout", "doSomething(event)");
      else 
        newBox.onmouseout=function(){doSomething(event);} // Opera, IE et FFx
      
      if (browser.isNS) 
        newBox.setAttribute("onmousedown", "dragStart(event)");
      else 
        newBox.onmousedown=function(){dragStart(event);} // Opera, IE et FFx
        
 
      /*optional css info inside box */
      
      boxText = "Name:" + newBox.getAttribute("name") + 
               "\nW:" + newBox.style.width + 
               "\nH:" + newBox.style.height +
               "\nT:" + newBox.style.top + 
               "\nL:" + newBox.style.left +
               "\nColor:" + newBox.style.backgroundColor;
               
      boxArray += "{" + "width:" + newBox.style.width + ";" +
                        "height:" + newBox.style.height + ";" +
                        "top:" + newBox.style.top + ";" +
                        "left:" + newBox.style.left+ ";" +
                        "background-color:" + newBox.style.backgroundColor+ ";" +          
                        "position:" + newBox.style.position+ ";" +
                        "border:" + newBox.style.border+ ";" +
                  "}\n";
	  
	  boxesValues[boxesValues.length] = "width:" + newBox.style.width + ";" +"height:" + newBox.style.height + ";" + "top:" + newBox.style.top + ";" +"left:" + newBox.style.left+ ";" +"position:" + newBox.style.position+ ";" +"background-color:" + newBox.style.backgroundColor+ ";" +"border:" + newBox.style.border+ ";";
               
      document.getElementById("boxArray").innerHTML=boxArray;  	  
      
      var newText = document.createTextNode(boxText);   
	  /*
	  if(document.boxInfo.colorBox.value == "#000000")
			newText.style.color="#ffffff";
	   */
			
	  if(document.boxInfo.showTextInfo.checked)      
		newBox.appendChild(newText);        
		
      //newBox.appendChild(document.createTextNode(injectCode));  
      
      
      ///newBox.appendChild(injectCode());
      ///boxArrayOfContents += newBoxName + "[" + newBoxName.innerHTML + "]\n";
      
      var insideCode = injectCode();
      newBox.appendChild(insideCode);
      //boxArrayOfContents += newBoxName + "[" + childNodes[0].innerHTML + "]\n";
   
      
      boxArrayOfContents += newBoxName + "[" +  insideCode.value + "]\n";
      document.getElementById("boxArrayOfContents").innerHTML=boxArrayOfContents;  
      
      var x = new getObj('mainBox');  
      x.obj.appendChild(newBox);  	  
	  
      setBox();
        
      document.boxInfo.boxName.value = "0";  
      boxCount++;
      document.boxInfo.boxCount.value=boxCount;
      
      document.myform.downx.value=0;
      document.myform.downy.value=0;
      document.myform.upx.value=0;
      document.myform.upy.value=0;    
      
      
      //isDrawable = false;
      
      if(!deleteMode)document.myform.systemStatus.value="added box " +newBox.getAttribute("name");
      
      
      
  }
  else {    
           /* alert("Drawable = " +  isDrawable + " Deletemode = " + deleteMode + 
           " cursor is over =" + document.myform.cursorIsOver.value + 
          " dimension is =" + checkDimension() +
          " clicks = " + click);*/
          //reset
          click=0;
          document.boxInfo.mouseClicks.value=click;
         } 
  
}

function deletingMode()
{
    if(boxCount>0)
    {
         deleteMode=true;          
         dragObj.elNode = document.getElementById('mainBox');
         dragObj.elNode.style.cursor= "not-allowed";
         document.myform.systemStatus.value="deleting";
		 
		 	document.getElementById("deleteButton").style.filter="alpha(opacity=30)";	
		document.getElementById("deleteButton").style.opacity=".30";
		
         //boxCount--;             
     }
     
}


function insertingMode()
{
     deleteMode=false;
     //document.getObj('mainBox').style.cursor= "crosshair";  
     document.getElementById('mainBox').style.cursor= "crosshair";       
}

var attributesNames="";
var attributesValues="";

function injectCode()
{
	tagToInject = document.optionForm.codeInjector[document.optionForm.codeInjector.selectedIndex].value
	//alert (codeToInject);
	//alert(tagList.options[tagList.selectedIndex].value);
	var codeNode = document.createElement(tagToInject);
	
    var textAreaContent = "";
    if (document.optionForm.codeToInjectInTag.value == "null")
    {
        alert(document.optionForm.codeToInjectInTag.value);
        textAreaContent = "Questo e' il contenuto del tag ";
    }
    
    else textAreaContent = trim(document.optionForm.codeToInjectInTag.value);    
    
    var imageUrl = "";
    
    if (document.optionForm.imgUrl.value == "")
    {
        //alert(document.optionForm.codeToInjectInTag.value);
        imageUrl = "http://www.google.it/images/logo_sm.gif";
        document.optionForm.imgUrl.value = imageUrl;
    }
    else imageUrl = document.optionForm.imgUrl.value;
    
    
	switch (tagToInject)
	{

		//case "img": setAttributesForTag(codeNode);break;
		case "img": codeNode.setAttribute("src",imageUrl);codeNode.setAttribute("alt",textAreaContent);	break;
		case "button": codeNode.setAttribute("value",textAreaContent);codeNode.appendChild(document.createTextNode(textAreaContent));break;
		//case "label": if(document.getElementByID("forId"))codeNode.setAttribute(document.optionForm.forName.value,"etica");break;
        case "label": codeNode.setAttribute("name",textAreaContent);codeNode.appendChild(document.createTextNode(textAreaContent));break;
        case "input": codeNode.setAttribute("value","input");break;
		case "textarea":codeNode.appendChild(document.createTextNode(textAreaContent));break;
        case "b":codeNode.appendChild(document.createTextNode(textAreaContent));break;
        case "i":codeNode.appendChild(document.createTextNode(textAreaContent));break;        
        case "u":codeNode.appendChild(document.createTextNode(textAreaContent));break;
        
		default:break;
	}

	
	return codeNode;
}

function getAttributesForTag(tag)
{
	/*
	//tolto per il momento 
	//var tag = document.optionForm.codeInjector[document.optionForm.codeInjector.selectedIndex].value

	*/
    //alert("Switched to " + tag);
    
	switch (tag)
	{
		case "img":   attributesNames = new Array("src","alt","title");break;
		case "label":   attributesNames = new Array("for");break;
		case "input":   attributesNames = new Array("type");break;
        case "textarea":   attributesNames = new Array("value");break;
        case "button":   attributesNames = new Array("value");break;
        case "b":   attributesNames = new Array("value");break;
        case "i":   attributesNames = new Array("value");break;
        case "u":   attributesNames = new Array("value");break;
		default:   attributesNames = new Array("ninZo'");break;
	}	
	
	var attributesTable;
	/*
	attributesTable += "<table>"; un += aggiungerebbe un undefined nell'innerHTML
	*/
	attributesTable = "<table name='attributesTable'>";
	for (var i=0; i< attributesNames.length; i++)	
	{	
		attributesTable += "\n<tr>\n";
		attributesTable += "<td>" +  attributesNames[i] +"</td>";
		attributesTable += "<td><input type='text' name='" + attributesNames[i] + tag +"Name' id='" + 				attributesNames[i] + tag + "Id' value=''></td>";
		attributesTable += "\n</tr>\n";
	}
    
	attributesTable += "</table>";
	document.getElementById("tagAttributes").innerHTML = attributesTable;


}

function setAttributesForTag(tagNode)
{	
	alert("tN=" + tagNode.name +", attributes = "+ attributesNames.length);
	alert("Table attr" + document.optionForm.attributesTable.name);
	for (var i=0; i< attributesNames.length; i++)	
		tagNode.setAttribute(attributesNames[i],document.optionForm.attributesTable.attributesNames[i].value);	
}


function showValues()
{
    var vals;
    for (var i=0; i< attributesNames.length; i++)	
	{
        vals += "\n["+ i+ "]" + attributesNames[i];    
    }
        
    alert(vals);    
    return false;
    
}


function setCorrectCoordinates(Ax,Ay,Bx,By)
{    
    //NO->SE    
	if ( Ax < Bx && Ay < By)
	{
        //alert("NO->SE");
		top = Ay; 
		left = Ax;
	}
	//NE->SO
	else if ( Ax > Bx && Ay < By)
	{
        //alert("NE->SO");
		top = Ay; 
		left = Bx;
	}
	//SO->NE
	else if ( Ax < Bx && Ay > By)
	{
        //alert("SO->NE");
		top = By; 
		left = Ax;
	}
	//SE->NO
	else if ( Ax > Bx && Ay > By)
	{
        //alert("SE->NO");
		top = By; 
		left = Bx;
	}

}

function getScreenSize()
{	
	if(window.screen.width<1024)
	{	
		//var panel = new getObj('mainBox');  
		//panel.obj.width="640px";		
		dragObj.elNode = document.getElementById('mainBox');
		//alert(dragObj.elNode.id)
		dragObj.elNode.style.width	= "640px";
		dragObj.elNode.style.height	= "480px";
	}
}

function setBox()
{	
	document.myform.boxIds.value += boxesIds[boxesIds.length-1] + "§";
	document.myform.boxValues.value += boxesValues[boxesValues.length-1] + "§";		
}


function tooDark(color)
{
	var components = color.split("#")[1];
	
	var r = components.substring(0,2);
	var g = components.substring(2,4);
	var b = components.substring(4,6);
	
	//alert (r + g + b + " - " + dec2bin(components) ) ;
	
	
	
	if ((r.substring(0,1) == "0") && (g.substring(0,1) == "0") &&  (b.substring(0,1) == "0"))
	{
		alert (r + g + b + " <-> " + dec2bin(components) ) ;
		
		return false;
	}
	
	return true;
}
 


function dec2bin(nub) 
{
   var strValidChars = "0123456789";
   var strChar;
   var blnResult = true;
   if (nub.length == 0) alert("Input is Blank");
   for (i = 0; i < nub.length && blnResult == true; i++)
      {
      strChar = nub.charAt(i);
      if (strValidChars.indexOf(strChar) == -1)
         {
         blnResult = false;
         }
      }
	if (blnResult != false) 
	{
		var i;
		var j;
		var result="";
		var ib;
		while (nub != 1)
			{
				j = nub % 2;
				i = (nub - j) / 2
				nub = i;
				ib = j.toString();
				result = ib + result;
			}
		result = "1" + result;
		return result;
	}
	return "Numbers Only"
}






/*<!--BINARY TO DECIMAL CONVERTER FUNCTION-->*/


function bin2dec(binaryNum) {
var power = binaryNum.length;
var output = 0;
for (i=0;i<=power;i++)
	{if(binaryNum.charAt(i) == 0)
	 {var preout = 0;}
	else
	 {var xty = power - i - 1;
	  var preout = Math.pow(2, xty);
	 }
	var output = output+preout; 
	}
return output;
}



  function getRandomColor()
  {
	  var r = Math.round(255*Math.random());
  	  var g = Math.round(255*Math.random());
  	  var b = Math.round(255*Math.random());

	  randomColor = "rgb(" + r + "," + g + ","+ b + ")";
	  
	  //alert(randomColor);
	
	  return randomColor;
  }

  
  function getSnaphot()
  {
  
	//alert("prima" + document.getElementById("boxArray").innerHTML);
  
	//var panel = new getObj("mainBox");
	var panel = document.getElementById("mainBox");
//	new getObj("mainBox");
	//var x = new getObj('mainBox'); 
	var ids="";	
	var inners="";
	var styles="";
	
	var infos="";
	
	document.getElementById("boxArray").innerHTML = "";
	document.getElementById("boxArrayOfContents").innerHTML = "";
	
	for (i=0;i<panel.childNodes.length;i++)
	{
		if (panel.childNodes[i].style.display!="none")
		{
			ids	= panel.childNodes[i].id;
			inners	= panel.childNodes[i].innerHTML;
			styles += "width: " + panel.childNodes[i].style.width + ";";
			styles += "height: " + panel.childNodes[i].style.height+ ";";
			styles += "top: " + panel.childNodes[i].style.top+ ";";
			styles += "left: " + panel.childNodes[i].style.left+ ";";
			
			styles += "border: " + "1px solid #000" + ";";
			
			styles += "background-color: " + panel.childNodes[i].style.backgroundColor+ ";";
			styles += "position: " + panel.childNodes[i].style.position+ ";";		
				
			
			infos  = "#" + ids  +  "{ " + styles  + " }";
			values = ids +  "§" + inners;			
					
			
			document.getElementById("boxArray").innerHTML += infos + "\n";		
			
			document.myform.tempArea1.value= infos + "\n";						 
			
			document.myform.boxArrayOfContents.value  += values + "ç";		
											
			document.myform.tempArea2.value += values + "ç";			
			
			
			styles ="";
		}
	}
		  
	
  }

  function trim(str)
{
  return str.replace(/^\s+|\s+$/g, '')
};