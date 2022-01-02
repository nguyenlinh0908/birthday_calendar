$(document).ready(() => {
  // custome modal
  const optionsMenu = $("#optionsMenu");
  const declarationForm = optionsMenu.children(":first");
  declarationForm.on("click", (e) => {
    e.preventDefault();
    $("#informationModal").modal("show");
    $("#informationModal").on("shown.bs.modal", function (e) {
      let button = $(event.relatedTarget); // Button that triggered the modal
      let recipient = button.data("whatever"); // Extract info from data-* attributes
      // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
      // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
      let modal = $(this);
      let buttonClose = modal.find("button.close");
      let buttonClose2 = modal.find("button.btn-secondary");
      let buttonSave = modal.find("button.btn-primary");
      buttonClose.add(buttonClose2).on("click", (e) => {
        $("#informationModal").modal("hide");
      });
    });
  });
});