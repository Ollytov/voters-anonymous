$(document).ready(function() {
        $(".add-option").on("click", function(){
            $(".options").append('<div class="form-group optiongroup"><label for="option1">Option</label><input type="text" class="form-control" name="option" placeholder="Option" required></div>');
        });
        $(".remove-option").on("click", function(){
            $(".optiongroup").last().remove();
        });
});