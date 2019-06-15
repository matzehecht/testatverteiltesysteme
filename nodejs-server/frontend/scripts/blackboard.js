function listBlackboards(blackboardlist){

    //function for displaying blackboards on start of page
    var container = document.getElementById("BlackboardContainer");

    //remove old childs
    while(container.firstChild){
        container.firstChild.remove();
    }
    //Aufbau JSON
    /*
    Name
    Message
    Timestamp
    */
    var numberBoards = 0;

    //go through blackboardlist object to get number of current blackboards
    for(var boards in blackboardlist.blackboards){
        if(blackboardlist.blackboards.hasOwnProperty(boards)){
            numberBoards++;
        }
    }

    //loop til max number of boards and create individual div for each board with all information
    for(var i = 0; i < numberBoards; i++){
                    
        //Create Div: Blackboard
        var blackboard = document.createElement("div");
        blackboard.id = "blackboards" + i;
        blackboard.className = "Blackboard";

        //Create Div: Vorschau Nachricht 
        var messageDiv = document.createElement("div");
        messageDiv.className = "blackboardText";
                    
        //enbale change of text of message div
        messageDiv.contentEditable = "true";                

        //get message from blackboard object
        var message = blackboardlist.blackboards[i].message;
        var previewMessage;

        //check if message is longer than 20 characters
        if(message.length > 20){

            //truncat string to shorter preview message
            var index = message.indexOf(' ', message.indexOf(' ') +1);  //look for space to truncat at a suitable place
            var previewString = index >= 0 ? message.substr(0, index) : message.substr(index +1);
            var endDots = '...';
            previewMessage = document.createTextNode(previewString + endDots); //append end dots for preview
        } else{
            previewMessage = document.createTextNode(message);
        }
        messageDiv.appendChild(previewMessage);

        //Create Div: Namen
        var nameDiv = document.createElement("div");
        nameDiv.className = "blackboardHeader";
        nameDiv.id = blackboard.id + "nameDiv";
                    
        //get name of board
        var boardName = blackboardlist.blackboards[i].name;
        var nameNode = document.createTextNode(boardName);
        nameDiv.appendChild(nameNode);
                    
        //Append Divs to parent div container (actual blackboard)
        blackboard.appendChild(nameDiv);
        blackboard.appendChild(messageDiv);

        //define on click for blackbaord which chnages class to bring board to foreground
        blackboard.onclick = function(){
            var board = document.getElementById(this.id);
            board.setAttribute("class", "ForegroundBoard");
            var name = board.firstChild.textContent;
            readBlackboard(name, function(data) {
                // successHandler
                //change style of board in foreground by setting new css class
                //loop childnodes
                for (var i = 0; i < board.childNodes.length; i++) {
                    //change text according to received message
                    if(board.childNodes[i].className == "blackboardText"){
                        board.childNodes[i].textContent = data.message;
                    }
                    //display buttons
                    if (board.childNodes[i].className == "buttonContainer") {
                        board.childNodes[i].style.display = 'inline-flex';
                    }
                    if (board.childNodes[i].className == "blackboardButton") {
                        board.childNodes[i].style.display = 'inline-flex';
                    }        
                }
            }, function() {
                // errorHandler
                // do nothing
            });
        };

        //add buttons for Saving, Closing, Deleting and CLearing
        var buttonContainer = document.createElement("div");
        buttonContainer.className = "buttonContainer";


        var buttonSave = document.createElement("BUTTON");
        var buttonClear = document.createElement("BUTTON");
        var buttonDelete = document.createElement("BUTTON");
        var buttonClose = document.createElement("BUTTON");

        //set text of buttons
        buttonSave.innerText = "Save";
        buttonClear.innerText = "Clear";
        buttonDelete.innerText = "Delete";
        buttonClose.innerText = "Close";

        //set class for buttons
        buttonSave.className = "blackboardButton";
        buttonClear.className = "blackboardButton";
        buttonDelete.className = "blackboardButton";
        buttonClose.className = "blackboardButton";

        //set id for buttons
        buttonSave.id = blackboard.id + "saveButton";
        buttonClear.id = blackboard.id + "clearButton";
        buttonDelete.id = blackboard.id + "deleteButton";
        buttonClose.id = blackboard.id + "closeButton";

        //define on click function for each button//

        //function for saving board new content and calling function which contacts server
        buttonSave.onclick = function(){
            event.stopPropagation(); //-> used to not trigger blackboards on click method
            var thisButton = document.getElementById(this.id);
            var buttoncontainer = thisButton.parentElement;
            var board = buttoncontainer.parentElement;

            var name = board.firstChild.textContent;

            //loop childs in current blackboard to get text from the board
            for (var i = 0; i < board.childNodes.length; i++) {
                if(board.childNodes[i].className == "blackboardText"){
                    message = board.childNodes[i].textContent;
                }
            }
            updateBlackboard(name, message, function() {
                // successHandler
                // do nothing
                //alert("update");
            }, function() {
                // errorHandler
                // do nothing
                //alert("update failed");
            });
        }

        //function for clearing the board text and calling function to contact server
        buttonClear.onclick = function(){
            event.stopPropagation(); //-> used to not trigger blackboards on click method
            var thisButton = document.getElementById(this.id);
            var buttoncontainer = thisButton.parentElement;
            var board = buttoncontainer.parentElement;

            var name = board.firstChild.textContent;

            //loop childs of current board to empty text of current board
            for (var i = 0; i < board.childNodes.length; i++) {
                if(board.childNodes[i].className == "blackboardText"){
                    board.childNodes[i].textContent = "";
                }
            }
            clearBlackboard(name, function() {
                // successHandler
                // do nothing
                //alert("clear");
            }, function() {
                // successHandler
                // do nothing
                //alert("clear failed");
            });
        }

        //function for deleting the board and calling function to contact server
        buttonDelete.onclick = function(){
            event.stopPropagation(); //-> used to not trigger blackboards on click method
            var thisButton = document.getElementById(this.id);
            var buttoncontainer = thisButton.parentElement;
            var board = buttoncontainer.parentElement;
            var name = board.firstChild.textContent;

            deleteBlackboard(name, function() {
                // successHandler
                board.remove();
            }, function() {
                // errorHandler
                // do nothing
            });
        }

        //function for closing the board text and change style/class back to standard
        buttonClose.onclick = function(){
            event.stopPropagation(); //-> used to not trigger blackboards on click method
            var thisButton = document.getElementById(this.id);
            var buttoncontainer = thisButton.parentElement;
            var board = buttoncontainer.parentElement;

            //reset class to standard
            board.setAttribute("class", "Blackboard");
                        
            //loop childs of current board to change change occurence back to standard style
            for (var i = 0; i < board.childNodes.length; i++) {
                //hide buttons
                if (board.childNodes[i].className == "blackboardButton") {
                    board.childNodes[i].style.display = 'none';
                }
                if (board.childNodes[i].className == "buttonContainer") {
                    board.childNodes[i].style.display = 'none';
                }
                if(board.childNodes[i].className == "blackboardText"){
                    message = board.childNodes[i].textContent;

                    //new check if message is longer than 20 characters, if yes needs to be shorten for better displaying
                    if(message.length > 20){
                        //truncat string to shorter preview message
                        var index = message.indexOf(' ', message.indexOf(' ') +1);  //look for space to truncat at a suitable place
                        var previewString = index >= 0 ? message.substr(0, index) : message.substr(index +1);
                        var endDots = '...';
                        board.childNodes[i].textContent = previewString + endDots;  //append end dots to preview
                    } else{
                        board.childNodes[i].textContent = message;
                    }
				}
            }
        }
        //apend buttons to blackboard but deactivate them
        buttonContainer.appendChild(buttonSave);
        buttonContainer.appendChild(buttonClear);
        buttonContainer.appendChild(buttonDelete);
        buttonContainer.appendChild(buttonClose);

        blackboard.appendChild(buttonContainer);
        //Blackboard Div an Container anhängen
        document.getElementById("BlackboardContainer").appendChild(blackboard);
    }
}

/**
* on click function for add icon in lower rigth corner used for adding a new blackboard
*/
function openForm() {
    document.getElementById("myForm").style.display = "block";
}

function closeForm() {
    document.getElementById("myForm").style.display = "none";
}
            
/**
* function for creating new blackboard
*/
function createBlackboards() {
    var blackboardTitle = document.getElementById("title").value;

    //create new board with entered title
    createBlackboard(blackboardTitle, function() {
        // successHandler
        // do nothing
        //alert("Blackboard erstellt");
    }, function() {
        // errorHandler
        // do nothing
        //alert("Blackboard erstellen failed");
    });

    //after creation reload blackboards
    getBlackboards(listBlackboards);

    //block form for adding board to not be displyed
    document.getElementById("myForm").style.display = "none";
    document.getElementById("title").value = "";
}