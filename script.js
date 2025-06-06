function updateSummary() {
    const qty = parseInt($('#qty').val()) || 0;
    const price = parseFloat($('#price').val()) || 0;
    $('#total_items').val(qty);
    $('#total_amount').val((qty * price).toFixed(2));
}

$('#qty, #price').on('input', updateSummary);

$('#cancelBtn').on('click', function() {
    $('#stockForm')[0].reset();
    updateSummary();
});
let activeInput = null;

// Track the currently focused input
$('input[type="number"], input[type="text"]').on('focus', function () {
    activeInput = this;
});

// Keypad button click handler
$('.key').on('click', function () {
    if (activeInput) {
        activeInput.value += $(this).text();
        $(activeInput).trigger('input');
    }
});

$('.key-clear').on('click', function () {
    if (activeInput) {
        activeInput.value = '';
        $(activeInput).trigger('input');
    }
});
let productCount = 0; // To keep track of the number of products added
$('#addProductBtn').on('click', function() {
    const productName = $('#product_name').val().trim();
    const qty = parseInt($('#qty').val()) || 0;
    const price = parseFloat($('#price').val()) || 0;
    if (productName && qty > 0 && price > 0) {
        productCount++;
        const totalAmount = (qty * price).toFixed(2);
        // Add product to the list with peso currency
        $('#productList').append(`<li>${productCount}. ${productName} - Qty: ${qty}, Price: ₱${price.toFixed(2)}, Total: ₱${totalAmount}</li>`);
        // Update summary
        updateSummary();
        // Clear input fields
        $('#product_name').val('');
        $('#qty').val('');
        $('#price').val('');
    } else {
        alert("Please enter valid product details.");
    }
});
function updateSummary() {
    const totalItems = $('#productList li').length;
    let totalAmount = 0;
    $('#productList li').each(function() {
        const text = $(this).text();
        const amount = parseFloat(text.match(/Total: ₱(\d+\.\d+)/)[1]);
        totalAmount += amount;
    });
    $('#total_items').val(totalItems);
    $('#total_amount').val(`₱${totalAmount.toFixed(2)}`); // Format total amount with peso currency
}
$('#holdBtn').on('click', function() {
    alert("Order held temporarily.");
});

$('#stockForm').on('submit', function(e) {
    e.preventDefault();
    const productName = $('#product_name').val();
    const qty = $('#qty').val();
    const price = $('#price').val();

    $.ajax({
        url: 'insert_stock.php',
        method: 'POST',
        data: {
            product_name: productName,
            qty: qty,
            price: price
        },
        success: function(response) {
            alert(response);
            $('#stockForm')[0].reset();
            updateSummary();
        },
        error: function() {
            alert('Error while inserting data.');
        }
    });
});