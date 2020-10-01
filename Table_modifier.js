class Table_modifier{
    constructor(){
        this.update_attributes();
        //adding all the listenners
        for(let i=0; i< this.swap_buttons.length;i++){
            this.attach_swap_listenner(i);
            this.attach_delete_listenner(i);
            this.attach_edit_listenner(i);
        }
    }
    update_attributes(){
        this.delete_buttons = document.getElementsByClassName("delete");
        this.swap_buttons = document.getElementsByClassName("swap_button");
        this.edit_buttons = document.getElementsByClassName("edit");
        this.nbr_rows = this.swap_buttons.length;
    }

    //functions to attach listeners 

    attach_swap_listenner(i){
        this.swap_buttons[i].addEventListener("click", ()=>{
            //start at 1 like the db and nth child
            swap_rows(this,i+1);
        })
    }
    attach_delete_listenner(i){
        this.delete_buttons[i].addEventListener("click", ()=>{
            delete_row(this,i+1);
        })
    }
    attach_edit_listenner(i){
        this.edit_buttons[i].addEventListener("click", ()=>{
            this.dom_edit_mode(i);
        })
    }
    attach_save_listenner(i,save_button,input){
        save_button.addEventListener("click", ()=>{
            update_quantity(this,input.value,i);
        })
    }
    
    //functions to edit dom

    dom_delete_row(i){
        let row = document.querySelector("tbody tr:nth-child("+i+")");
        row.parentNode.removeChild(row);
        this.update_attributes();
        for(let j=i;j<=this.nbr_rows;j++){
            row = document.querySelector("tbody tr:nth-child("+j+")");
            let new_row = row.cloneNode(true);
            row.parentNode.replaceChild(new_row, row);
            this.attach_swap_listenner(j-1);
            this.attach_delete_listenner(j-1);
            this.attach_edit_listenner(j-1);
        }
    }
    dom_swap(i){
        let j = i+1;
        let row1 = document.querySelector("tbody tr:nth-child("+i+")");
        let row2 = document.querySelector("tbody tr:nth-child("+j+")");
    
        row2.parentNode.removeChild(row2);
        row1.parentNode.insertBefore(row2,row1);
    
        //deleting all listenners
        let new_row1 = row1.cloneNode(true);
        row1.parentNode.replaceChild(new_row1, row1);
        let new_row2 = row2.cloneNode(true);
        row2.parentNode.replaceChild(new_row2, row2);
    
        //attach button listenners
        this.attach_swap_listenner(i-1);
        this.attach_swap_listenner(i);
        this.attach_delete_listenner(i-1);
        this.attach_delete_listenner(i);
        this.attach_edit_listenner(i);
        this.attach_edit_listenner(i-1);
    
    }
    dom_update_quantity(quantity,pos){
        let quantities = document.getElementsByClassName("item_quantity");
        
        quantities[pos].textContent = quantity;
    }

    dom_edit_mode(i){
        let normal_mode = document.getElementsByClassName("normal_mode");
        let mod_cells = document.getElementsByClassName("mod_cell");
        let quantities = document.getElementsByClassName("item_quantity");
        let swap = document.getElementsByClassName("swap");
        let th = document.getElementById("tr_hide");
        th.style.display = "none";

        let quantity = quantities[i].textContent;

        let input = this.create_quantity_input(quantity)

        while(quantities[i].firstChild) {
            quantities[i].removeChild(quantities[i].firstChild);
          }


        quantities[i].appendChild(input);
        for(let j=0;j<normal_mode.length;j++){
            normal_mode[j].style.visibility = "hidden";
        }
        for(let j=0;j<swap.length;j++){
            swap[j].style.display = "none";
        }

        let cancel_button = this.create_cancel_button(quantity,i);
        let save_button = this.create_save_button();
        this.attach_save_listenner(i,save_button,input);

        mod_cells[i].appendChild(save_button);
        mod_cells[i].appendChild(cancel_button);
        
    }


    dom_cancel(quantity, pos){
        let normal_mode = document.getElementsByClassName("normal_mode");
        let to_delete = document.getElementsByClassName("to_delete");
        let swap = document.getElementsByClassName("swap");
        let th = document.getElementById("tr_hide");


        for(let i=0;i<normal_mode.length;i++){
            normal_mode[i].style.visibility = "visible";
        }        
        while(to_delete[0]){
            to_delete[0].parentNode.removeChild(to_delete[0]);
        }
        for(let j=0;j<swap.length;j++){
            swap[j].style.display = "table-cell";
        }
        th.style.display = "table-cell";
        this.dom_update_quantity(quantity,pos);

    }

    //Functions to create dom elements

    create_cancel_button(quantity,pos){
        let cancel_button = document.createElement("button");
        let node = document.createTextNode("cancel");
        cancel_button.appendChild(node);
        cancel_button.classList.add("cancel");
        cancel_button.classList.add("to_delete");
        cancel_button.addEventListener("click", ()=>{
            this.dom_cancel(quantity,pos);
        })
        return cancel_button;

    }
    create_save_button(){
        let save_button = document.createElement("button");
        let node = document.createTextNode("save");
        save_button.appendChild(node);
        save_button.classList.add("save");
        save_button.classList.add("to_delete");
        return save_button;
    }

    create_quantity_input(quantity){

        let input =document.createElement("input");
        input.setAttribute("type","number");
        input.setAttribute("name","quantity");
        input.setAttribute("value",quantity);
        input.setAttribute("min","1");
        input.classList.add("to_delete");
        return input;
    }


}
// The xmlhttprequests
function swap_rows(Tm,pos){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            Tm.dom_swap(pos);
        }
    }
    xmlHttp.open("POST", "index.php" , true); // true for asynchronous
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let params = 'pos_swap=' + pos
    xmlHttp.send(params);
}
function delete_row(Tm,pos){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            Tm.dom_delete_row(pos);
        }
    }
    xmlHttp.open("DELETE", "index.php" , true); // true for asynchronous
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let params = 'pos_del=' + pos + '&' + 'nbr_rows=' + Tm.nbr_rows;
    xmlHttp.send(params);
}
function update_quantity(Tm,quantity,pos){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200){
            Tm.dom_cancel(quantity,pos);
            Tm.dom_update_quantity(quantity,pos);
        }
    }
    xmlHttp.open("POST", "index.php" , true); // true for asynchronous
    xmlHttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    let php_pos = pos+1;
    let params = 'new_quantity=' + quantity + '&' + 'pos_new_quantity=' + php_pos;
    xmlHttp.send(params);
}

let tm = new Table_modifier();