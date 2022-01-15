$(document).ready((e) => {
  setValueForSelect();
  birthdayOptions();
  getBirthdayOfMonthSelect();
  callAPICountries();
});
function setValueForSelect() {
  const today = new Date();
  let year = today.getFullYear();
  let monthNow = today.getMonth();
  if (monthNow < 10) {
    monthNow = `0${monthNow + 1}`;
  }
  for (var i = 0; i < 12; i++) {
    var d = new Date(i + 1 + "/1");
    let valueOfMonth = "";
    let selected = "";
    i < 10 ? (valueOfMonth = `0${i + 1}`) : (valueOfMonth = i + 1);
    monthNow.localeCompare(valueOfMonth) == 0
      ? (selected = "selected")
      : (selected = selected);

    let option = `<option ${selected} value="${valueOfMonth}">${d.toLocaleDateString(
      undefined,
      { month: "long" }
    )}</option>`;

    $(".month-container").children("select").append(
      option
      //   $("<option>", {
      //     value: i < 10 ? `0${i}` : i,
      //     text: ,
      //   })
    );
  }
}

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

function getBirthdayOfMonthSelect() {
  let one = 0;
  if (one == 0) {
    const valueOfMonth = $(".month-container > select option:selected").val();
    listRender(valueOfMonth);
  }
  ++one;
  $("select").on("change", (e) => {
    let month = e.target.value;
    listRender(month);
  });
}
function listRender(month) {
  $.ajax({
    url: "/list",
    method: "POST",
    data: { month: month, status: true },
  })
    .done((result) => {
      const birthdays = result.birthdays;

      let content = "";
      if (birthdays.length > 0) {
        birthdays.forEach((birthday, index) => {
          let nationalityString = birthday.nationality;
          let nationalityArr = [];
          nationalityArr = nationalityString.split("/");
          let nationalityName = nationalityArr[1];
          let nationalityVal = nationalityArr[0];
          content += `<tr>
                <th scope="row">${++index}</th>
                <td data-birthday="${birthday._id}" data-avatar="${
            birthday.avatar
          }" data-facebook="${birthday.facebookUrl}" data-instagram="${
            birthday.instagramUrl
          }" data-twitter="${birthday.twitterUrl}">${birthday.fullName}</td>
                <td>${birthday.dateOfBirth}</td>
                <td>${birthday.gender}</td>
                <td data-ccn3="${nationalityVal}">${nationalityName}</td>
                <td>
              
                <a href="/user/birthday/edit/${
                  birthday._id
                }" type="button" class="btn btn-outline-warning btn_edit">
                  <i class="bi bi-gear"></i>
                </a>
               
                <a href="/user/birthday/delete/${
                  birthday._id
                }" type="button" class="btn btn-outline-danger btn_delete">
                  <i class="bi bi-trash"></i>
                </a>
                </td>
              </tr>`;
        });
      } else {
        content += `<tr>
                <td colspan='6' class="text-center">
                  <span class="text-warning">no birthdays in the month</span>
                </td>
              </tr>`;
      }
      $("#list-birthday_container").html(content);
    })
    .fail(() => {});
}
function birthdayOptions() {
  $(document).on("click", "a.btn_edit", (e) => {
    e.preventDefault();
    let target = e.currentTarget;
    $('input[name="fullName"]').val(
      $(target).parent().prev().prev().prev().prev().text()
    );

    $('input[name="dateOfBirth"]').val(
      $(target).parent().prev().prev().prev().text()
    );
    $('select[name="nationality"]').val($(target).parent().prev().data("ccn3"));
    $('select[name="nationality"]').trigger("chosen:updated");
    $('select[name="gender"]').val($(target).parent().prev().prev().text());
    $('select[name="gender"]').trigger("chosen:updated");
    let oldAvatar = $(target)
      .parent()
      .prev()
      .prev()
      .prev()
      .prev()
      .data("avatar");
    $("#displayAvatar").attr("src", oldAvatar);
    let birthdayID = $(target)
      .parent()
      .prev()
      .prev()
      .prev()
      .prev()
      .data("birthday");

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
      nationalityName = $("#formNationality option:selected").text();
      nationalityVal = $("#formNationality option:selected").val();
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
      formData.append("id", birthdayID);
      formData.append("fullName", fullName);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("gender", gender);
      formData.append("nationality", `${nationalityVal}/${nationalityName}`);
      formData.append("facebookUrl", facebook);
      formData.append("instagramUrl", instagram);
      formData.append("twitterUrl", twitter);
      formData.append("avatarFile", avatar);
      formData.append("oldAvatar", oldAvatar);

      // console.log("clicked submit");
      fetch("/user/birthday/edit", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
          getBirthdayOfMonthSelect();
          $("#informationModal").modal("hide");
          setMessage({
            title: "Birthday calendar",
            content: "edit birthday success",
            bg: "bg-success",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
  $(document.body).on("click", "a.btn_delete", (e) => {
    e.preventDefault();
    let target = e.currentTarget;
    if (!confirm("Do you want delete it")) {
      return 0;
    }
    let oldAvatar = $(target)
      .parent()
      .prev()
      .prev()
      .prev()
      .prev()
      .data("avatar");
    let hrefTarget = e.currentTarget.attributes[0].nodeValue;
    let birthdayID = hrefTarget.split("/")[4];
    console.log(birthdayID);
    fetch("/user/birthday/delete", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        birthdayID: birthdayID,
        oldAvatar: oldAvatar,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        getBirthdayOfMonthSelect();
        setMessage({
          title: "Birthday calendar",
          content: "Delete success",
          bg: "bg-success",
        });
      })
      .catch((err) => {
        console.log(err);
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
