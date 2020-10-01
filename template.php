<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
	<title> Shopping list</title>
	<link rel="stylesheet" href="style.css" type="text/css">
</head>
<body>
<div class=container>
<div id="list">
    <h1>Shopping list</h1>
    <table class="container">
        <thead>
            <tr>
                <th>Item</th>
                <th id="amount_col">Amount</th>
                <th id="tr_hide"></th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            <?php foreach ($real_items as $item): ?>
                <tr>
                    <td><?= $item['name']; ?></td>
                    <td class="item_quantity"><?= $item['amount']; ?></td>
                    <td class="swap"><button class="swap_button normal_mode">&duarr;</button></td>
                    <td class="mod_cell"><button class="normal_mode edit">Edit</button><button class="normal_mode delete">Delete</button>
                        </td>
                </tr>
            <?php endforeach;?>
        </tbody>
    </table>
</div>
<div >
    <h2>Add Item</h2>
    <form action="?" method="POST" class="container" id="add_form">
        <div>
            Item:
            <input type="text"  maxlength="200" id="item_input" name="item" list="unused_items" required>
                <datalist id="unused_items">
                    <?php foreach ($unused_items as $unused_item): ?>
                    <option value="<?= $unused_item['name'];?>">
                    <?php endforeach;?>
                </datalist>
        </div>
        <div >
            Amount:
            <input type="number"  min="1" name="amount" id="amount_input" required>
        </div>
        <button type="submit" >Add</button>
    </form>
</div>
</div>
<script src="Table_modifier.js"></script>

</body>


