<?php
require __DIR__ . '/db.php';
require __DIR__ . '/Items.php';


$connection = new mysqli($db_config['server'], $db_config['login'], $db_config['password'], $db_config['database']);
if ($connection->connect_error) {
    die("Could not connect to the database");
}
$items = new Items($connection);


function swap_item($items, $pos1){
    $id1 = $items->get_item_id_from_pos($pos1);
    $id2 = $items->get_item_id_from_pos($pos1+1);
    if($id1!==false && $id2!==false){
        $items->update_position_with_id($id1,$pos1+1);
        $items->update_position_with_id($id2,$pos1);
    }
}

function delete_item($items, $pos_to_del,$nbr_rows){
    $items->delete_item($pos_to_del);
    for($i=$pos_to_del;$i<=$nbr_rows;$i++){
        $items->update_position_with_pos($i+1,$i);

    }

}
 /**
  * Safely retrive a value from an array (with default fallback).
  * and prevent html injection
  * @param array $array From which the value is retrieved (e.g., $_GET).
  * @param string $name Array key.
  * @param mixed $default Default value used if the key is not present.
  */
function safeGet(array $array, string $name, $default = null)
{
    if (!array_key_exists($name, $array)) return $default;
    return htmlspecialchars($array[$name]);
}




if($_SERVER['REQUEST_METHOD'] == 'DELETE') {
    parse_str(file_get_contents("php://input"),$post_vars);
    $pos_to_del = safeGet($post_vars,"pos_del");
    $nbr_rows = safeGet($post_vars,"nbr_rows");
    if($pos_to_del !== null ){
        delete_item($items,$pos_to_del,$nbr_rows);
    }
}
if($_SERVER['REQUEST_METHOD'] === 'POST') {
    $pos1 = safeGet($_POST,"pos_swap");
    if($pos1 !== null ){
        swap_item($items,$pos1);
    }
    
    $new_item = safeGet($_POST,"item");
    $amount = (int)safeGet($_POST,"amount");
    if($new_item !== null &&strlen($new_item)>0&&strlen($new_item)<999 && $amount !== null  ){
        $items->insert_item($new_item,$amount);
    }
    $new_quantity = safeGet($_POST,"new_quantity");
    $pos_new_quantity = safeGet($_POST,"pos_new_quantity");
    
    if($new_quantity !== null ){
        $items->update_amount($pos_new_quantity,$new_quantity);
    }
    
}

if($_SERVER['REQUEST_METHOD'] === 'GET') {
    $real_items = $items->get_items();
    $unused_items = $items->get_unused_items();
    require __DIR__ . '/template.php';
}else {
    header('Location: index.php', true, 303);
}