$(document).ready(() => {
  getBirthdays();
  callAPICountries();
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

    if (fullName === "" || dateOfBirth === "") {
      setMessage({
        title: "Birthday calendar",
        content: "name or date of birth is not empty",
        bg: "bg-warning",
      });
      $("#informationModal").modal("hide");
      return;
    }
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
    fetch("/user", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        $("#informationModal").modal("hide");
        setMessage({
          title: "Birthday calendar",
          content: "create birthday success",
          bg: "bg-success",
        });
        getBirthdays();
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
});

function setMessage({ title, content, bg }) {
  $(".toast").toast({
    animation: true,
    autohide: true,
    delay: 5000,
  });
  $("#toast_title").html(title);
  $(".toast-body").html(content);
  $(".toast").addClass(bg);
  $(".toast").toast("show");
}

function getBirthdays() {
  fetch("/birthdays/month")
    .then((response) => response.json())
    .then((data) => {
      const birthdays = data.birthdays;
      let now = new Date();
      let currentYear = now.getFullYear();
      let monthText = now.toDateString().split(" ")[1];
      let renderContent = "";
      birthdays.forEach((birthday) => {
        let dateOfBirthday = birthday["dateOfBirth"].split("/");
        let birthdayMonth = dateOfBirthday[1];
        let birthdayDay = dateOfBirthday[0];

        if (birthdayMonth[1] > 0) {
          let charSecond = parseInt(birthdayMonth[1]) - 1;
          birthdayMonth = birthdayMonth[0] + charSecond;
        }
        let targetDate = new Date(currentYear, birthdayMonth, birthdayDay);
        let weekDay = targetDate.toDateString().split(" ")[0];
        let day = targetDate.toDateString().split(" ")[2];
        renderContent += `
      <li>
        <div class="banner-info">
          <h3>${weekDay} Day</h3>
          <p>${monthText} ${day}</p>
          <img style="max-height:96px" src="${birthday.avatar}" alt="${birthday._id}" />        
        </div>
      </li>`;
      });
      let lengthBirthdays = birthdays.length;
      let pos = 0;
      $("#slider4").html(renderContent);
      $("#slider4").responsiveSlides({
        auto: true,
        pager: true,
        nav: false,
        speed: 500,
        namespace: "callbacks",
        before: function () {
          $(".events").append("<li>before event fired.</li>");
          if (pos > lengthBirthdays - 1) {
            pos = 0;
          }
          $("#fbUrl").attr("href", birthdays[pos].facebookUrl);
          ++pos;
        },
        after: function () {
          $(".events").append("<li>after event fired.</li>");
        },
      });
    });
}

function callAPICountries() {
  $.get("https://restcountries.com/v3.1/all").then((result) => {
    const countries = result;
    $.each(countries, (index, country) => {
      $("#formNationality").append(
        $("<option>", {
          value: country["ccn3"],
          text: country["name"]["common"],
        })
      );
    });
    $(".chosen-select").chosen({ width: "100%" });
  });
}
