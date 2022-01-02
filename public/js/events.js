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
  // click choose avatar
  $("#displayAvatar").on("click", (e) => {
    e.preventDefault();
    $("#formAvatar").click();
  });
  //preview avatar image
  $("#formAvatar").change((e) => {
    const file = $("#formAvatar").prop("files")[0];
    if (file) {
      $("#displayAvatar").attr("src", URL.createObjectURL(file));
    }
  });

  // fetch data
  $("#formInformation").submit((e) => {
    e.preventDefault();
    let fullName,
      dateOfBirth,
      gender,
      nationality,
      facebook,
      instagram,
      twitter,
      avatar;
    fullName = $("#formFullName").val();
    dateOfBirth = $("#formDateOfBirth").val();
    gender = $("#formGender").val();
    nationality = $("#formNationality").val();
    facebook = $("#formFacebook").val();
    instagram = $("#formInsta").val();
    twitter = $("#formTwitter").val();
    avatar = $("#formAvatar").prop("files")[0];

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("nationality", nationality);
    formData.append("facebookUrl", facebook);
    formData.append("instagramUrl", instagram);
    formData.append("twitterUrl", twitter);
    formData.append("avatarFile", avatar);
    console.log("clicked submit");
    fetch("http://localhost:8000/user", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        $("#informationModal").modal("hide");
        $(".toast").toast("show");
        // $(".toast").toast({
        //   animation: true,
        //   autohide: true,
        //   delay: 5000,
        // });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});
