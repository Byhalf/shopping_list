<?php

class Items {
    protected $connection;
    function __construct($connection)
    {
        $this->connection = $connection;
    }
    function get_items(){
        $query = "SELECT amount, name, position FROM list JOIN items ON list.item_id=items.id ORDER BY position";
        return mysqli_query($this->connection, $query);
    }

    function get_item_id_from_pos($pos){
        $query ="SELECT item_id FROM list WHERE list.position =$pos";
        if(($res = mysqli_query($this->connection, $query))!==false){
            return $res->fetch_object()->item_id;
        }return $res;
    }
    function update_amount(int $pos,$amount){
        $stmt = $this->connection->prepare("UPDATE list SET amount = (?) WHERE position=(?)");

        $stmt->bind_param('ii', $amount,$pos);
        return $stmt->execute();

    }

    function update_position_with_id($id,$position){
        $query = "UPDATE list SET position = $position WHERE item_id=$id";
        return mysqli_query($this->connection, $query);
    }
    function update_position_with_pos($old_pos,$new_pos){
        $query = "UPDATE list SET position = $new_pos WHERE position=$old_pos";
        return mysqli_query($this->connection, $query);

    }
    function delete_item($pos){
        $stmt = $this->connection->prepare("DELETE FROM list WHERE position =(?)");
        $stmt->bind_param('i', $pos);
        return $stmt->execute();
    }
    function insert_item($name,$quantity){
        $stmt = $this->connection->prepare("SELECT (?) FROM items");
        $bool = $stmt->bind_param('s', $name);
        $stmt = $this->connection->prepare("INSERT INTO items (name) VALUES (?)");
        $stmt->bind_param('s', $name);
        $bool = $stmt->execute() || $bool;
        if($bool){
            
            $name = (string) $name;
            $query = "SELECT id FROM items WHERE items.name ='$name'";
            $id = mysqli_query($this->connection, $query)->fetch_object()->id;
            $nbr_rows = mysqli_query($this->connection, "SELECT * FROM list")->num_rows;
            $stmt2 = $this->connection->prepare("INSERT INTO list (item_id,amount,position) VALUES (?,?,?)"); 
            $quantity = (int) $quantity;
            $nbr_rows++;
            $stmt2->bind_param('iii', $id,$quantity,$nbr_rows);
            return $stmt2->execute();
        }return false;
    }
    function get_unused_items(){
        $query = "SELECT items.name FROM items 
        WHERE items.name
        NOT IN
        (SELECT items.name FROM list,items WHERE items.id=list.item_id);";
        return mysqli_query($this->connection, $query);
    }


    }

    //get_unused_items
